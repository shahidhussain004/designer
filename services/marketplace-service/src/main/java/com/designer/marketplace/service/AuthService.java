package com.designer.marketplace.service;

import java.security.SecureRandom;
import java.util.Base64;
import java.util.Optional;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.designer.marketplace.dto.AuthResponse;
import com.designer.marketplace.dto.LoginRequest;
import com.designer.marketplace.dto.OAuthLoginResponse;
import com.designer.marketplace.dto.RegisterRequest;
import com.designer.marketplace.dto.UserDto;
import com.designer.marketplace.entity.Company;
import com.designer.marketplace.entity.CompanyUser;
import com.designer.marketplace.entity.Freelancer;
import com.designer.marketplace.entity.User;
import com.designer.marketplace.entity.UserRole;
import com.designer.marketplace.repository.CompanyRepository;
import com.designer.marketplace.repository.CompanyUserRepository;
import com.designer.marketplace.repository.FreelancerRepository;
import com.designer.marketplace.repository.UserRepository;
import com.designer.marketplace.repository.UserRoleRepository;
import com.designer.marketplace.security.JwtTokenProvider;
import com.designer.marketplace.security.UserPrincipal;

import lombok.RequiredArgsConstructor;

/**
 * Authentication Service
 * Handles user registration, login, and token management
 */
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final FreelancerRepository freelancerRepository;
    private final CompanyRepository companyRepository;
    private final UserRoleRepository userRoleRepository;
    private final CompanyUserRepository companyUserRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final OAuthProviderService oAuthProviderService;

    /**
     * Register a new user
     */
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        // Check if email exists
        if (userRepository.existsByEmailIgnoreCase(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        // Check if username exists
        if (userRepository.existsByUsernameIgnoreCase(request.getUsername())) {
            throw new RuntimeException("Username already taken");
        }

        // Create new user
        User user = new User();
        user.setEmail(request.getEmail());
        user.setUsername(request.getUsername());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setFullName(request.getFullName());
        user.setRole(User.UserRole.valueOf(request.getRole()));
        user.setEmailVerified(false);
        user.setIsActive(true);

        user = userRepository.save(user);

        // Create role-specific profile with back-references (V23 denormalization)
        if ("FREELANCER".equals(request.getRole())) {
            Freelancer freelancer = new Freelancer();
            freelancer.setUser(user);
            freelancer.setExperienceYears(0);
            freelancer = freelancerRepository.save(freelancer);
            
            // ✅ SET BACK-REFERENCE for O(1) lookups
            user.setFreelancerId(freelancer.getId());
            user = userRepository.save(user);
            
        } else if ("COMPANY".equals(request.getRole())) {
            Company company = new Company();
            company.setUser(user);
            company.setCompanyName(user.getUsername() + "'s Company");
            company.setTotalJobsPosted(0);
            company = companyRepository.save(company);
            
            // ✅ SET BACK-REFERENCE for O(1) lookups
            user.setCompanyId(company.getId());
            user = userRepository.save(user);
            
            // ✅ CREATE COMPANY MEMBERSHIP as OWNER (V24 RBAC)
            CompanyUser companyUser = new CompanyUser();
            companyUser.setCompanyId(company.getId());
            companyUser.setUserId(user.getId());
            companyUser.setRole(CompanyUser.CompanyRole.OWNER.name());
            companyUserRepository.save(companyUser);
        }
        
        // ✅ CREATE USER ROLE (V24 RBAC) - supports multi-role users
        UserRole userRole = new UserRole();
        userRole.setUserId(user.getId());
        userRole.setRole(request.getRole());
        userRoleRepository.save(userRole);

        // Generate tokens
        String accessToken = generateAccessToken(user);
        String refreshToken = tokenProvider.generateRefreshToken(user.getId());

        return new AuthResponse(accessToken, refreshToken, mapToUserDto(user));
    }

    /**
     * Login user
     */
    public AuthResponse login(LoginRequest request) {
        // Authenticate user
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmailOrUsername(),
                        request.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);

        // Generate tokens
        String accessToken = tokenProvider.generateToken(authentication);
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        String refreshToken = tokenProvider.generateRefreshToken(userPrincipal.getId());

        // Get user details
        User user = userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        return new AuthResponse(accessToken, refreshToken, mapToUserDto(user));
    }

    /**
     * OAuth / social sign-in and sign-up.
     *
     * If the email is already registered, the user is logged in and an AuthResponse
     * is returned directly.  If the email is new and no role was supplied, the
     * method returns a "requiresRoleSelection" response so the frontend can ask the
     * user to pick FREELANCER vs COMPANY before retrying.
     */
    @Transactional
    public OAuthLoginResponse oauthLogin(String provider, String token, String role) {
        OAuthProviderService.OAuthUserInfo info = oAuthProviderService.verifyToken(provider, token);

        // ── Find existing user by OAuth identity or email ──────────────────────
        Optional<User> byOAuth = userRepository
                .findByOauthProviderAndOauthProviderId(provider, info.providerId());
        Optional<User> byEmail = userRepository.findByEmailIgnoreCase(info.email());

        User user = byOAuth.or(() -> byEmail).orElse(null);

        if (user != null) {
            boolean dirty = false;
            if (user.getOauthProvider() == null) {
                user.setOauthProvider(provider);
                user.setOauthProviderId(info.providerId());
                dirty = true;
            }
            if (user.getProfileImageUrl() == null && info.pictureUrl() != null) {
                user.setProfileImageUrl(info.pictureUrl());
                dirty = true;
            }
            if (dirty) {
                userRepository.save(user);
            }
            return OAuthLoginResponse.complete(buildAuthResponse(user));
        }

        // ── New email – need role before creating the account ──────────────────
        if (role == null || role.isBlank()) {
            return OAuthLoginResponse.requiresRole(info.email(), info.fullName(), info.pictureUrl());
        }

        // ── Create account ─────────────────────────────────────────────────────
        User newUser = new User();
        newUser.setEmail(info.email());
        newUser.setUsername(generateUniqueUsername(info.email()));
        newUser.setPasswordHash(passwordEncoder.encode(generateSecureRandomPassword()));
        newUser.setFullName(info.fullName() != null ? info.fullName() : newUser.getUsername());
        newUser.setRole(User.UserRole.valueOf(role));
        newUser.setOauthProvider(provider);
        newUser.setOauthProviderId(info.providerId());
        newUser.setProfileImageUrl(info.pictureUrl());
        newUser.setEmailVerified(true);   // email was verified by the OAuth provider
        newUser.setIsActive(true);

        userRepository.save(newUser);
        
        // ── Auto-create role-specific profile ──────────────────────────────────
        if ("FREELANCER".equals(role)) {
            Freelancer freelancer = new Freelancer();
            freelancer.setUser(newUser);
            freelancer.setExperienceYears(0);
            freelancerRepository.save(freelancer);
        } else if ("COMPANY".equals(role)) {
            Company company = new Company();
            company.setUser(newUser);
            company.setCompanyName(newUser.getUsername() + "'s Company");
            company.setTotalJobsPosted(0);
            companyRepository.save(company);
        }
        
        return OAuthLoginResponse.complete(buildAuthResponse(newUser));
    }

    // ── Private helpers ────────────────────────────────────────────────────────

    private AuthResponse buildAuthResponse(User user) {
        String accessToken  = generateAccessToken(user);
        String refreshToken = tokenProvider.generateRefreshToken(user.getId());
        return new AuthResponse(accessToken, refreshToken, mapToUserDto(user));
    }

    private String generateUniqueUsername(String email) {
        String base = email.split("@")[0]
                .toLowerCase()
                .replaceAll("[^a-z0-9]", "_")
                .replaceAll("_+", "_")
                .replaceAll("^_|_$", "");

        if (base.length() < 3)  base = "user_" + base;
        if (base.length() > 20) base = base.substring(0, 20);

        if (!userRepository.existsByUsernameIgnoreCase(base)) return base;

        String candidate;
        int attempts = 0;
        do {
            int suffix = 1000 + new SecureRandom().nextInt(9000);
            String trimmed = base.length() > 15 ? base.substring(0, 15) : base;
            candidate = trimmed + "_" + suffix;
        } while (userRepository.existsByUsernameIgnoreCase(candidate) && ++attempts < 20);

        return candidate;
    }

    private static String generateSecureRandomPassword() {
        byte[] bytes = new byte[32];
        new SecureRandom().nextBytes(bytes);
        return Base64.getEncoder().encodeToString(bytes);
    }

    /**
     * Refresh access token
     */
    public AuthResponse refreshToken(String refreshToken) {
        if (!tokenProvider.validateToken(refreshToken)) {
            throw new RuntimeException("Invalid refresh token");
        }

        Long userId = tokenProvider.getUserIdFromToken(refreshToken);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String newAccessToken = generateAccessToken(user);
        String newRefreshToken = tokenProvider.generateRefreshToken(userId);

        return new AuthResponse(newAccessToken, newRefreshToken, mapToUserDto(user));
    }

    /**
     * Helper: Generate access token from User entity
     */
    private String generateAccessToken(User user) {
        UserPrincipal userPrincipal = UserPrincipal.create(user);
        Authentication auth = new UsernamePasswordAuthenticationToken(
                userPrincipal, null, userPrincipal.getAuthorities());
        return tokenProvider.generateToken(auth);
    }

    /**
     * Helper: Map User entity to UserDto
     */
    private UserDto mapToUserDto(User user) {
        return UserDto.builder()
                .id(user.getId())
                .email(user.getEmail())
                .username(user.getUsername())
                .fullName(user.getFullName())
                .role(user.getRole().name())
                .bio(user.getBio())
                .profileImageUrl(user.getProfileImageUrl())
                .location(user.getLocation())
                .emailVerified(user.getEmailVerified())
                .isActive(user.getIsActive())
                .ratingAvg(user.getRatingAvg())
                .ratingCount(user.getRatingCount())
                .identityVerified(user.getIdentityVerified())
                .identityVerifiedAt(user.getIdentityVerifiedAt())
                .verificationStatus(user.getVerificationStatus() != null ? user.getVerificationStatus().name() : null)
                .deletedAt(user.getDeletedAt())
                .build();
    }
}

package com.designer.marketplace.service;

import com.designer.marketplace.dto.*;
import com.designer.marketplace.entity.User;
import com.designer.marketplace.repository.UserRepository;
import com.designer.marketplace.security.JwtTokenProvider;
import com.designer.marketplace.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Authentication Service
 * Handles user registration, login, and token management
 */
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;

    /**
     * Register a new user
     */
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        // Check if email exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        // Check if username exists
        if (userRepository.existsByUsername(request.getUsername())) {
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
        user.setRatingAvg(0.0);
        user.setRatingCount(0);

        user = userRepository.save(user);

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
                .hourlyRate(user.getHourlyRate())
                .skills(user.getSkills())
                .portfolioUrl(user.getPortfolioUrl())
                .emailVerified(user.getEmailVerified())
                .isActive(user.getIsActive())
                .ratingAvg(user.getRatingAvg())
                .ratingCount(user.getRatingCount())
                .build();
    }
}

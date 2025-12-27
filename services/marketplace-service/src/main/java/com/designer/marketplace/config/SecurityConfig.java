package com.designer.marketplace.config;

import java.util.Arrays;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.designer.marketplace.security.CustomUserDetailsService;
import com.designer.marketplace.security.JwtAuthenticationFilter;
import com.designer.marketplace.security.JwtTokenProvider;
import com.designer.marketplace.security.RateLimitFilter;

/**
 * Spring Security Configuration
 * Configured with JWT authentication, CORS support, and rate limiting
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final CustomUserDetailsService customUserDetailsService;
    private final JwtTokenProvider tokenProvider;
    private final RateLimitFilter rateLimitFilter;

    public SecurityConfig(CustomUserDetailsService customUserDetailsService,
            JwtTokenProvider tokenProvider,
            RateLimitFilter rateLimitFilter) {
        this.customUserDetailsService = customUserDetailsService;
        this.tokenProvider = tokenProvider;
        this.rateLimitFilter = rateLimitFilter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(customUserDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public JwtAuthenticationFilter jwtAuthenticationFilter() {
        return new JwtAuthenticationFilter(tokenProvider, customUserDetailsService);
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(cors -> cors.configurationSource(corsConfigurationSource())) // Enable CORS with proper config
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // Public endpoints - must be first
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/api-docs/**", "/swagger-ui/**", "/swagger-ui.html").permitAll()
                        .requestMatchers("/actuator/**").permitAll()
                        // Stripe webhooks must be accessible without authentication
                        .requestMatchers("/api/webhooks/**").permitAll()
                        // GET requests for jobs are public (browsing)
                        .requestMatchers(HttpMethod.GET, "/api/jobs").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/jobs/").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/jobs/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/users/*/profile").permitAll()
                        // LMS public course browsing
                        .requestMatchers(HttpMethod.GET, "/api/lms/courses").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/lms/courses/popular").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/lms/courses/top-rated").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/lms/courses/newest").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/lms/courses/*").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/lms/courses/slug/*").permitAll()
                        // Certificate verification (public)
                        .requestMatchers(HttpMethod.GET, "/api/lms/quizzes/certificates/verify/*").permitAll()
                        // Authenticated endpoints - dashboards require authentication with role check
                        // via @PreAuthorize
                        .requestMatchers("/api/dashboard/**").authenticated()
                        .requestMatchers("/api/notifications").authenticated()
                        // All other endpoints require authentication
                        .anyRequest().authenticated())
                .authenticationProvider(authenticationProvider())
                // Add rate limiting filter before other security filters
                .addFilterBefore(rateLimitFilter, UsernamePasswordAuthenticationFilter.class)
                .addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        // For production: Only allow specific origins
        // For development: Allow localhost origins explicitly (wildcards don't work
        // with credentials)
        configuration.setAllowedOrigins(Arrays.asList(
                "http://localhost:3000",
                "http://localhost:3001",
                "http://localhost:3002",
                "http://localhost:3003",
                "http://localhost:8080",
                "http://127.0.0.1:3000",
                "http://127.0.0.1:3001",
                "http://127.0.0.1:3002",
                "http://127.0.0.1:3003",
                "http://127.0.0.1:8080"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "X-Requested-With", "Accept",
                "Origin", "Access-Control-Request-Method", "Access-Control-Request-Headers"));
        configuration.setExposedHeaders(Arrays.asList("Authorization"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}

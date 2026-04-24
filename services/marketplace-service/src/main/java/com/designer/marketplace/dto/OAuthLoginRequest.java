package com.designer.marketplace.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request DTO for OAuth (social) sign-in / sign-up.
 *
 * Flow:
 * 1. Frontend authenticates the user with the provider and obtains a token.
 * 2. POST /api/auth/oauth-login → this request body.
 * 3. Backend verifies the token with the provider, finds-or-creates the user,
 *    and returns either an AuthResponse or a 202 asking for role selection.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OAuthLoginRequest {

    @NotBlank(message = "Provider is required")
    @Pattern(regexp = "google|microsoft", message = "Provider must be 'google' or 'microsoft'")
    private String provider;

    /** ID token (Google) or access token (Microsoft Graph). */
    @NotBlank(message = "Token is required")
    private String token;

    /**
     * Required only when the email is not yet registered.
     * The frontend re-sends this request with a role after the user picks one.
     */
    @Pattern(regexp = "COMPANY|FREELANCER", message = "Role must be COMPANY or FREELANCER")
    private String role;
}

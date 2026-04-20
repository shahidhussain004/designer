package com.designer.marketplace.dto;

import lombok.Getter;

/**
 * Response from POST /api/auth/oauth-login.
 *
 * One of two possible states:
 *  - requiresRoleSelection = false  →  authResponse contains the full JWT tokens.
 *  - requiresRoleSelection = true   →  the email is new; frontend must ask the user
 *    to pick FREELANCER or COMPANY and re-POST with that role.
 */
@Getter
public class OAuthLoginResponse {

    private final boolean requiresRoleSelection;

    // Present when requiresRoleSelection == false
    private final AuthResponse authResponse;

    // Present when requiresRoleSelection == true
    private final String email;
    private final String fullName;
    private final String pictureUrl;

    private OAuthLoginResponse(AuthResponse authResponse) {
        this.requiresRoleSelection = false;
        this.authResponse = authResponse;
        this.email = null;
        this.fullName = null;
        this.pictureUrl = null;
    }

    private OAuthLoginResponse(String email, String fullName, String pictureUrl) {
        this.requiresRoleSelection = true;
        this.authResponse = null;
        this.email = email;
        this.fullName = fullName;
        this.pictureUrl = pictureUrl;
    }

    public static OAuthLoginResponse complete(AuthResponse authResponse) {
        return new OAuthLoginResponse(authResponse);
    }

    public static OAuthLoginResponse requiresRole(String email, String fullName, String pictureUrl) {
        return new OAuthLoginResponse(email, fullName, pictureUrl);
    }
}

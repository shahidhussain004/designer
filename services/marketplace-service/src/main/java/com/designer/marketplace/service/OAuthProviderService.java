package com.designer.marketplace.service;

import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

/**
 * Verifies OAuth tokens with their respective identity providers and extracts
 * standardised user profile information.
 *
 * Supported providers:
 *   - google    →  verifies Google's ID token via the tokeninfo endpoint
 *   - microsoft →  calls Microsoft Graph /me with the access token
 *
 * No client secret is required for either verification path.
 */
@Service
public class OAuthProviderService {

    private static final Logger log = LoggerFactory.getLogger(OAuthProviderService.class);

    @Value("${app.oauth.google.client-id:}")
    private String googleClientId;

    private final RestTemplate restTemplate;

    public OAuthProviderService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    // -------------------------------------------------------------------------
    // Public API
    // -------------------------------------------------------------------------

    /**
     * Verify the OAuth token and return the provider's user profile.
     *
     * @param provider "google" or "microsoft"
     * @param token    ID token (Google) or access token (Microsoft Graph)
     * @return extracted user info
     * @throws IllegalArgumentException if the token is invalid
     */
    public OAuthUserInfo verifyToken(String provider, String token) {
        return switch (provider.toLowerCase()) {
            case "google"    -> verifyGoogleToken(token);
            case "microsoft" -> verifyMicrosoftToken(token);
            default          -> throw new IllegalArgumentException("Unsupported OAuth provider: " + provider);
        };
    }

    // -------------------------------------------------------------------------
    // Google
    // -------------------------------------------------------------------------

    @SuppressWarnings("unchecked")
    private OAuthUserInfo verifyGoogleToken(String idToken) {
        try {
            Map<String, String> claims = restTemplate.getForObject(
                    "https://oauth2.googleapis.com/tokeninfo?id_token=" + idToken,
                    Map.class);

            if (claims == null) {
                throw new IllegalArgumentException("Empty response from Google token info endpoint");
            }
            if (claims.containsKey("error")) {
                throw new IllegalArgumentException("Google token validation failed: " + claims.get("error_description"));
            }

            // Validate audience matches our registered client ID (prevents token substitution)
            if (!googleClientId.isBlank() && !googleClientId.equals(claims.get("aud"))) {
                throw new IllegalArgumentException("Google token audience does not match the application client ID");
            }

            return new OAuthUserInfo(
                    claims.get("sub"),
                    claims.get("email"),
                    claims.get("name"),
                    claims.get("picture"));

        } catch (RestClientException e) {
            log.warn("Failed to call Google tokeninfo endpoint: {}", e.getMessage());
            throw new IllegalArgumentException("Could not verify Google token: " + e.getMessage());
        }
    }

    // -------------------------------------------------------------------------
    // Microsoft
    // -------------------------------------------------------------------------

    @SuppressWarnings("unchecked")
    private OAuthUserInfo verifyMicrosoftToken(String accessToken) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(accessToken);
            HttpEntity<Void> entity = new HttpEntity<>(headers);

            Map<String, Object> profile = restTemplate.exchange(
                    "https://graph.microsoft.com/v1.0/me?$select=id,displayName,mail,userPrincipalName",
                    HttpMethod.GET, entity, Map.class)
                    .getBody();

            if (profile == null) {
                throw new IllegalArgumentException("Empty response from Microsoft Graph endpoint");
            }

            // Microsoft uses "userPrincipalName" when "mail" is absent (e.g. personal accounts)
            String email = profile.get("mail") != null
                    ? (String) profile.get("mail")
                    : (String) profile.get("userPrincipalName");

            return new OAuthUserInfo(
                    (String) profile.get("id"),
                    email,
                    (String) profile.get("displayName"),
                    null); // Microsoft Graph /me does not return a photo URL by default

        } catch (RestClientException e) {
            log.warn("Failed to call Microsoft Graph endpoint: {}", e.getMessage());
            throw new IllegalArgumentException("Could not verify Microsoft token: " + e.getMessage());
        }
    }

    // -------------------------------------------------------------------------
    // Value object
    // -------------------------------------------------------------------------

    /**
     * Normalised user profile returned by any supported provider.
     */
    public record OAuthUserInfo(
            String providerId,
            String email,
            String fullName,
            String pictureUrl) {
    }
}

# Password Reset Feature - API Documentation

## Overview
This document describes the password reset feature implementation for the Designer Marketplace authentication system.

## Architecture

### Components
1. **UserController** - REST endpoints for password reset requests
2. **UserService** - Business logic for token generation and password validation
3. **EmailService** - Interface for sending password reset emails
4. **EmailServiceImpl** - Implementation using Spring Mail
5. **PasswordResetToken** - JPA entity for storing reset tokens
6. **PasswordResetTokenRepository** - Data access for reset tokens
7. **Request DTOs** - `ForgotPasswordRequest` and `ResetPasswordRequest`

### Database Schema

#### password_reset_tokens table
```sql
CREATE TABLE password_reset_tokens (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    token VARCHAR(500) NOT NULL UNIQUE,
    expiry_time TIMESTAMP(6) NOT NULL,
    used BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT fk_password_reset_tokens_user_id 
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_password_reset_tokens_token ON password_reset_tokens(token);
CREATE INDEX idx_password_reset_tokens_user_id ON password_reset_tokens(user_id);
CREATE INDEX idx_password_reset_tokens_expiry_time ON password_reset_tokens(expiry_time);
CREATE INDEX idx_password_reset_tokens_used ON password_reset_tokens(used);
```

## API Endpoints

### 1. Forgot Password
**Endpoint:** `POST /api/users/forgot-password`

**Public Access:** Yes (no authentication required)

**Request Body:**
```json
{
    "email": "user@example.com"
}
```

**Validation:**
- Email is required (not blank)
- Email format must be valid

**Response:**
```json
{
    "message": "Password reset instructions sent to your email"
}
```

**Status Codes:**
- `200 OK` - Request processed successfully
- `400 Bad Request` - Invalid email format or missing required field
- `500 Internal Server Error` - Email sending failed

**Security Notes:**
- The endpoint returns the same success message whether the email exists or not (to prevent user enumeration attacks)
- No indication if the email is registered or not
- Email is case-insensitive

### 2. Reset Password
**Endpoint:** `POST /api/users/reset-password`

**Public Access:** Yes (no authentication required)

**Request Body:**
```json
{
    "token": "uuid-token-from-email",
    "newPassword": "NewSecurePassword123"
}
```

**Validation:**
- Token is required (not blank)
- New password is required (not blank)
- New password must be at least 8 characters long

**Response:**
```json
{
    "message": "Password reset successfully"
}
```

**Status Codes:**
- `200 OK` - Password reset successful
- `400 Bad Request` - Invalid token, expired token, token already used, or weak password

**Error Responses:**
```json
{
    "timestamp": "2024-01-15T10:30:00",
    "status": 400,
    "error": "Invalid Token",
    "message": "Invalid password reset token"
}
```

**Token Validation Rules:**
- Token must be valid and exist in the database
- Token must not have been already used
- Token must not have expired (default 30 minutes)

## Configuration

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `MAIL_HOST` | `smtp.gmail.com` | SMTP server host |
| `MAIL_PORT` | `587` | SMTP server port (TLS) |
| `MAIL_USERNAME` | `your-email@gmail.com` | Email account username |
| `MAIL_PASSWORD` | `your-app-password` | Email account password/app-specific password |
| `MAIL_FROM` | `noreply@designer-marketplace.com` | Sender email address |
| `PASSWORD_RESET_TOKEN_EXPIRY_MINUTES` | `30` | Token expiration time in minutes |
| `FRONTEND_RESET_PASSWORD_URL` | `http://localhost:3000/reset-password` | Frontend password reset page URL |

### Application Configuration (application.yml)

```yaml
# Email Configuration
spring:
  mail:
    host: ${MAIL_HOST:smtp.gmail.com}
    port: ${MAIL_PORT:587}
    username: ${MAIL_USERNAME}
    password: ${MAIL_PASSWORD}
    properties:
      mail:
        smtp:
          auth: true
          starttls:
            enable: true
            required: true
          connectiontimeout: 5000
          timeout: 5000
          writetimeout: 5000
    from: ${MAIL_FROM}

# Application Configuration
app:
  password-reset:
    token-expiry-minutes: ${PASSWORD_RESET_TOKEN_EXPIRY_MINUTES:30}
  frontend:
    reset-password-url: ${FRONTEND_RESET_PASSWORD_URL}
```

## Email Template

### Password Reset Email

**Subject:** Password Reset Request

**Body Format:**
```
Dear [Full Name],

You have requested to reset your password. Please click the link below to reset your password:

[Reset Link with Token]

This link will expire in 30 minutes.

If you did not request this, please ignore this email.

Best regards,
Designer Marketplace Team
```

## Flow Diagram

```
┌─────────────────┐
│   User          │
└────────┬────────┘
         │ 1. Click "Forgot Password"
         │
         ▼
┌─────────────────────────────────────┐
│   ForgotPasswordRequest              │
│   POST /api/users/forgot-password   │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│   UserService                       │
│   - Find user by email              │
│   - Generate UUID token             │
│   - Save token with expiry time     │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│   EmailService                      │
│   - Send password reset email       │
│   - Include reset link with token   │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────┐
│   Email Sent    │
└─────────────────┘
         │
         │ 2. User clicks link in email
         │ 3. Frontend navigates to reset page
         │
         ▼
┌─────────────────────────────────────┐
│   ResetPasswordRequest              │
│   POST /api/users/reset-password   │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│   UserService                       │
│   - Find token                      │
│   - Validate token (used/expiry)    │
│   - Encode new password             │
│   - Update user password            │
│   - Mark token as used              │
└────────┬────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│   Password Reset Complete            │
│   User can now login with new pwd   │
└──────────────────────────────────────┘
```

## Security Considerations

### 1. Token Generation
- Tokens are generated using UUID.randomUUID()
- Each token is unique and stored with the user
- Tokens are case-sensitive

### 2. Token Expiration
- Tokens expire after 30 minutes (configurable)
- Expired tokens cannot be used for password reset
- One-time use only - tokens cannot be reused

### 3. Password Validation
- Minimum 8 characters required
- Passwords are encoded using Spring Security's PasswordEncoder
- Old password is not required for reset

### 4. Email Security
- Email sending is handled via Spring Mail using SMTP
- TLS/STARTTLS is enabled for secure communication
- Connection timeout and read timeout are configured

### 5. User Privacy
- Forgot password endpoint doesn't reveal whether email exists
- Same message returned for valid and invalid emails
- Prevents user enumeration attacks

## Implementation Notes

### Dependencies Added
- `spring-boot-starter-mail` - For sending emails via SMTP

### New Entities
- `PasswordResetToken` - Stores reset tokens and expiry information

### New Repositories
- `PasswordResetTokenRepository` - Data access for tokens

### Exception Handling
- `InvalidTokenException` - Custom exception for token validation failures
- Global exception handler maps this to 400 Bad Request response

### Best Practices Implemented
1. **Transactional Operations** - All updates use @Transactional
2. **Logging** - Comprehensive logging for debugging and monitoring
3. **Error Handling** - Specific and informative error messages
4. **Configuration** - Environment variables for flexibility
5. **Testing** - Unit and integration tests included

## Testing

### Unit Tests
```bash
mvn test -Dtest=PasswordResetControllerTest
```

### Test Scenarios
1. Forgot password with valid email
2. Forgot password with invalid email format
3. Forgot password with non-existent email
4. Reset password with invalid token
5. Reset password with expired token
6. Reset password with weak password
7. Reset password successfully

## Frontend Integration

### Example Frontend Implementation

```javascript
// Step 1: Send forgot password request
async function requestPasswordReset(email) {
    const response = await fetch('/api/users/forgot-password', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
    });
    
    if (response.ok) {
        console.log('Password reset email sent');
    }
}

// Step 2: Extract token from URL parameters
function getTokenFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('token');
}

// Step 3: Submit new password with token
async function resetPassword(token, newPassword) {
    const response = await fetch('/api/users/reset-password', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
            token: token,
            newPassword: newPassword 
        })
    });
    
    if (response.ok) {
        console.log('Password reset successful');
        // Redirect to login page
    } else {
        const error = await response.json();
        console.error('Password reset failed:', error.message);
    }
}
```

## API Examples

### Forgot Password Request
```bash
curl -X POST http://localhost:8080/api/users/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com"}'
```

### Reset Password Request
```bash
curl -X POST http://localhost:8080/api/users/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "token":"550e8400-e29b-41d4-a716-446655440000",
    "newPassword":"NewPassword123"
  }'
```

## Troubleshooting

### Email Not Sending
1. Check SMTP server settings (host, port, credentials)
2. Verify email account has SMTP access enabled
3. Check firewall/network settings
4. Enable less secure apps (for Gmail: https://myaccount.google.com/lesssecureapps)
5. Review application logs for detailed error messages

### Token Expiration Issues
1. Check server and client time synchronization
2. Verify token expiry configuration
3. Ensure database timezone is set correctly

### Password Reset Fails
1. Verify token hasn't been used
2. Check token hasn't expired
3. Confirm new password meets validation requirements
4. Check database foreign key constraints

## Future Enhancements

- [ ] Rate limiting for forgot password endpoints
- [ ] Email verification with OTP code
- [ ] Support for multiple email templates
- [ ] Password reset analytics and monitoring
- [ ] Webhook notifications for password reset events
- [ ] Two-factor authentication integration
- [ ] Password strength meter feedback
- [ ] Support for multiple languages in email templates

# Password Reset API - Quick Reference for Frontend Developers

## Quick Start

### 1. Forgot Password Button Click Handler
```javascript
async function handleForgotPassword(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    
    try {
        const response = await fetch('/api/users/forgot-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email })
        });
        
        if (response.ok) {
            // Show success message
            alert('Password reset instructions have been sent to your email!');
        } else {
            const error = await response.json();
            console.error('Error:', error.message);
            alert('An error occurred. Please try again.');
        }
    } catch (error) {
        console.error('Request failed:', error);
        alert('Network error. Please try again.');
    }
}
```

### 2. Reset Password Page (Extract Token from URL)
```javascript
import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

export function ResetPasswordPage() {
    const searchParams = useSearchParams();
    const navigate = useNavigate();
    const [token] = searchParams;
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleResetPassword(e) {
        e.preventDefault();
        
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 8) {
            setError('Password must be at least 8 characters long');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await fetch('/api/users/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token: token,
                    newPassword: password
                })
            });

            if (response.ok) {
                alert('Password reset successful! You can now login with your new password.');
                navigate('/login');
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Password reset failed');
            }
        } catch (error) {
            setError('Network error. Please try again.');
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleResetPassword}>
            <h2>Reset Your Password</h2>
            
            <div className="form-group">
                <label htmlFor="password">New Password:</label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter new password (min 8 characters)"
                    required
                />
            </div>

            <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password:</label>
                <input
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    required
                />
            </div>

            {error && (
                <div className="error-message">{error}</div>
            )}

            <button type="submit" disabled={loading}>
                {loading ? 'Resetting...' : 'Reset Password'}
            </button>
        </form>
    );
}
```

### 3. Email Example

When user clicks "Forgot Password", they receive an email like:

```
From: noreply@designer-marketplace.com
Subject: Password Reset Request

---

Dear [User Full Name],

You have requested to reset your password. Please click the link below to reset your password:

https://app.designer-marketplace.com/reset-password?token=550e8400-e29b-41d4-a716-446655440000

This link will expire in 30 minutes.

If you did not request this, please ignore this email.

Best regards,
Designer Marketplace Team
```

## API Endpoints

### Endpoint 1: Request Password Reset
```
POST /api/users/forgot-password
```

**Request:**
```json
{
    "email": "user@example.com"
}
```

**Success Response (200 OK):**
```json
{
    "message": "Password reset instructions sent to your email"
}
```

**Error Response (400 Bad Request):**
```json
{
    "timestamp": "2024-01-15T10:30:00",
    "status": 400,
    "error": "Validation Error",
    "message": "Email should be valid"
}
```

---

### Endpoint 2: Reset Password
```
POST /api/users/reset-password
```

**Request:**
```json
{
    "token": "550e8400-e29b-41d4-a716-446655440000",
    "newPassword": "NewSecurePassword123"
}
```

**Success Response (200 OK):**
```json
{
    "message": "Password reset successfully"
}
```

**Error Response (400 Bad Request):**
```json
{
    "timestamp": "2024-01-15T10:30:00",
    "status": 400,
    "error": "Invalid Token",
    "message": "Password reset token has expired"
}
```

## Validation Rules

### Email Validation (Forgot Password)
- ✅ Must be valid email format (user@domain.com)
- ✅ Required field
- ❌ Empty string rejected
- ❌ Invalid format rejected

### Password Validation (Reset Password)
- ✅ Minimum 8 characters
- ✅ Required field
- ❌ Less than 8 characters rejected
- ❌ Empty string rejected

### Token Validation (Reset Password)
- ✅ Must be valid UUID token
- ✅ Token must not have expired (30 minutes default)
- ✅ Token must not have been used before
- ❌ Invalid token rejected
- ❌ Expired token rejected
- ❌ Already used token rejected

## Common Error Scenarios

### 1. Wrong Email Format
**Status:** 400 Bad Request
```json
{
    "error": "Validation Error",
    "message": "Email should be valid"
}
```
**Fix:** Check email format - must be user@domain.com

### 2. Invalid Token
**Status:** 400 Bad Request
```json
{
    "error": "Invalid Token",
    "message": "Invalid password reset token"
}
```
**Fix:** Request new password reset

### 3. Token Expired (after 30 minutes)
**Status:** 400 Bad Request
```json
{
    "error": "Invalid Token",
    "message": "Password reset token has expired"
}
```
**Fix:** Click "Forgot Password" again to get new token

### 4. Token Already Used
**Status:** 400 Bad Request
```json
{
    "error": "Invalid Token",
    "message": "Password reset token has already been used"
}
```
**Fix:** If you need to reset again, use "Forgot Password" endpoint

### 5. Weak Password
**Status:** 400 Bad Request
```json
{
    "error": "Validation Error",
    "message": "Password must be at least 8 characters long"
}
```
**Fix:** Use a password with at least 8 characters

## UI Flow Recommendations

### Forgot Password Flow
```
1. User clicks "Forgot Password" link
   ↓
2. Show modal/page with email input
   ↓
3. User enters email and clicks "Send Reset Link"
   ↓
4. Show: "Check your email for reset instructions"
   ↓
5. User checks email and clicks link
```

### Reset Password Flow
```
1. User clicks email link with token
   ↓
2. Frontend extracts token from URL
   ↓
3. Show form: New Password + Confirm Password
   ↓
4. User enters passwords and clicks "Reset Password"
   ↓
5. Frontend validates:
   - Passwords match
   - Password >= 8 characters
   ↓
6. Send request to /api/users/reset-password
   ↓
7. Show: "Password reset successful!" + Redirect to login
```

## Testing the API

### Using cURL (for testing/debugging)

**Test Forgot Password:**
```bash
curl -X POST http://localhost:8080/api/users/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

**Test Reset Password:**
```bash
curl -X POST http://localhost:8080/api/users/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "token":"550e8400-e29b-41d4-a716-446655440000",
    "newPassword":"TestPassword123"
  }'
```

### Using Postman

1. **Forgot Password Request:**
   - Method: POST
   - URL: `http://localhost:8080/api/users/forgot-password`
   - Body (raw JSON):
   ```json
   {
       "email": "test@example.com"
   }
   ```

2. **Reset Password Request:**
   - Method: POST
   - URL: `http://localhost:8080/api/users/reset-password`
   - Body (raw JSON):
   ```json
   {
       "token": "550e8400-e29b-41d4-a716-446655440000",
       "newPassword": "NewPassword123"
   }
   ```

## Security Notes for Developers

1. **Never store tokens in localStorage** - Use httpOnly cookies if possible
2. **Never send tokens in URL unless necessary** - HTTPS only for reset links
3. **Always use HTTPS in production** - Never use HTTP for password reset
4. **Validate on both frontend AND backend** - Never trust frontend validation alone
5. **Show generic error messages** - Don't reveal if email exists or token is expired
6. **Implement rate limiting** - Prevent brute force attacks (frontend should warn, backend enforces)
7. **Add CSRF protection** - Use tokens for form submissions

## Debugging Tips

If password reset isn't working:

1. **Check email settings**
   - Is mail server configured correctly?
   - Check backend logs: `tail -f logs/app.log | grep -i email`

2. **Check token generation**
   - Logs should show: "Password reset token created for user: username"

3. **Check token validation**
   - Verify token format (UUID)
   - Verify token hasn't expired (< 30 minutes)
   - Verify token hasn't been used

4. **Check password update**
   - Logs should show: "Password reset successfully for user: username"
   - Try logging in with new password

5. **Backend logs location**
   - Development: `target/logs/marketplace-service.log`
   - Docker: `docker logs <container-id>`

## Backend Configuration

These environment variables must be set in production:

```
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_FROM=noreply@designer-marketplace.com
FRONTEND_RESET_PASSWORD_URL=https://app.yourdomain.com/reset-password
```

## Support

For issues or questions:
1. Check logs: `curl http://localhost:8080/actuator/health` (health check)
2. Review docs: `docs/PASSWORD_RESET_FEATURE.md`
3. Check tests: `src/test/java/.../PasswordResetControllerTest.java`

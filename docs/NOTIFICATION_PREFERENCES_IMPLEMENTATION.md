# Email Notification Preferences - Complete Implementation Guide

## 🎯 Overview

The email notification preferences feature allows users to control which types of email notifications they receive. Users can enable/disable notifications for:

- **Job Alerts** - Receive notifications for new jobs matching your skills
- **Proposal Updates** - Get notified when your proposals are reviewed
- **Messages** - Receive email notifications for new messages
- **Newsletter** - Stay updated with tips, news, and platform updates

---

## 📊 How It Works

### User Journey

1. **User navigates to Settings** → Notification Preferences page
2. **Default preferences are created** (auto-created on first access)
   - Job Alerts: ✅ Enabled (true)
   - Proposal Updates: ✅ Enabled (true)
   - Messages: ✅ Enabled (true)
   - Newsletter: ❌ Disabled (false)
3. **User toggles preferences** (enable/disable each notification type)
4. **User clicks "Save Preferences"**
5. **Frontend sends API request** to `/api/users/me/notifications/preferences`
6. **Backend saves to database** in `user_notification_preferences` table
7. **Success message displayed** to user

### Data Storage

**Database Table:** `user_notification_preferences`

```sql
id                BIGSERIAL PRIMARY KEY
user_id           BIGINT NOT NULL (foreign key to users.id)
job_alerts        BOOLEAN DEFAULT TRUE
proposal_updates  BOOLEAN DEFAULT TRUE
messages          BOOLEAN DEFAULT TRUE
newsletter        BOOLEAN DEFAULT FALSE
created_at        TIMESTAMP(6)
updated_at        TIMESTAMP(6)
```

**Key Features:**
- One record per user (unique constraint on user_id)
- Automatically created on first access with defaults
- Updated whenever preferences change
- Soft timestamps (created_at, updated_at)

---

## 🔌 API Endpoints

### 1. Get Notification Preferences

**Endpoint:**
```
GET /api/users/me/notifications/preferences
```

**Authentication:** Required (Bearer token)

**Request Headers:**
```http
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Response (200 OK):**
```json
{
    "id": 1,
    "jobAlerts": true,
    "proposalUpdates": true,
    "messages": true,
    "newsletter": false
}
```

**Notes:**
- If preferences don't exist, they are created automatically with default values
- Always returns the current user's preferences
- Returns 401 if not authenticated

---

### 2. Update Notification Preferences

**Endpoint:**
```
PUT /api/users/me/notifications/preferences
```

**Authentication:** Required (Bearer token)

**Request Headers:**
```http
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
    "jobAlerts": false,
    "proposalUpdates": true,
    "messages": true,
    "newsletter": true
}
```

**Response (200 OK):**
```json
{
    "id": 1,
    "jobAlerts": false,
    "proposalUpdates": true,
    "messages": true,
    "newsletter": true
}
```

**Request Validation:**
- Fields are optional (null values are ignored)
- Only provided fields are updated
- All boolean values must be true or false

**Error Responses:**

| Status | Error | Description |
|--------|-------|-------------|
| 400 | Invalid JSON | Malformed request body |
| 401 | Unauthorized | Missing or invalid token |
| 500 | Server Error | Database or processing error |

---

## 💻 Frontend Implementation

### React Component Example

```javascript
import React, { useState, useEffect } from 'react';
import axios from 'axios';

export function NotificationPreferencesPage() {
    const [preferences, setPreferences] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    // Fetch current preferences on mount
    useEffect(() => {
        fetchPreferences();
    }, []);

    const fetchPreferences = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(
                '/api/users/me/notifications/preferences',
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            setPreferences(response.data);
            setError(null);
        } catch (err) {
            setError('Failed to load preferences');
            console.error('Error fetching preferences:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleToggle = (field) => {
        setPreferences(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    const handleSave = async () => {
        setSaving(true);
        setError(null);
        setSuccess(false);

        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(
                '/api/users/me/notifications/preferences',
                {
                    jobAlerts: preferences.jobAlerts,
                    proposalUpdates: preferences.proposalUpdates,
                    messages: preferences.messages,
                    newsletter: preferences.newsletter
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            setPreferences(response.data);
            setSuccess(true);
            
            // Show success for 3 seconds
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            setError('Failed to save preferences');
            console.error('Error saving preferences:', err);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div>Loading notification preferences...</div>;
    }

    if (!preferences) {
        return <div>No preferences available</div>;
    }

    return (
        <div className="notification-preferences-container">
            <h2>Email Notification Preferences</h2>
            
            {error && (
                <div className="alert alert-error">{error}</div>
            )}
            
            {success && (
                <div className="alert alert-success">
                    ✓ Preferences saved successfully!
                </div>
            )}

            <div className="preferences-form">
                {/* Job Alerts */}
                <div className="preference-item">
                    <label>
                        <input
                            type="checkbox"
                            checked={preferences.jobAlerts}
                            onChange={() => handleToggle('jobAlerts')}
                            disabled={saving}
                        />
                        <span className="label-text">Job Alerts</span>
                    </label>
                    <p className="description">
                        Receive notifications for new jobs matching your skills
                    </p>
                </div>

                {/* Proposal Updates */}
                <div className="preference-item">
                    <label>
                        <input
                            type="checkbox"
                            checked={preferences.proposalUpdates}
                            onChange={() => handleToggle('proposalUpdates')}
                            disabled={saving}
                        />
                        <span className="label-text">Proposal Updates</span>
                    </label>
                    <p className="description">
                        Get notified when your proposals are reviewed
                    </p>
                </div>

                {/* Messages */}
                <div className="preference-item">
                    <label>
                        <input
                            type="checkbox"
                            checked={preferences.messages}
                            onChange={() => handleToggle('messages')}
                            disabled={saving}
                        />
                        <span className="label-text">Messages</span>
                    </label>
                    <p className="description">
                        Receive email notifications for new messages
                    </p>
                </div>

                {/* Newsletter */}
                <div className="preference-item">
                    <label>
                        <input
                            type="checkbox"
                            checked={preferences.newsletter}
                            onChange={() => handleToggle('newsletter')}
                            disabled={saving}
                        />
                        <span className="label-text">Newsletter</span>
                    </label>
                    <p className="description">
                        Stay updated with tips, news, and platform updates
                    </p>
                </div>

                {/* Save Button */}
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="btn btn-primary"
                >
                    {saving ? 'Saving...' : 'Save Preferences'}
                </button>
            </div>
        </div>
    );
}
```

### Using Fetch API

```javascript
// Get preferences
async function getNotificationPreferences() {
    const token = localStorage.getItem('token');
    const response = await fetch('/api/users/me/notifications/preferences', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
    return await response.json();
}

// Update preferences
async function updateNotificationPreferences(preferences) {
    const token = localStorage.getItem('token');
    const response = await fetch('/api/users/me/notifications/preferences', {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            jobAlerts: preferences.jobAlerts,
            proposalUpdates: preferences.proposalUpdates,
            messages: preferences.messages,
            newsletter: preferences.newsletter
        })
    });
    return await response.json();
}
```

---

## 🔄 How Users Enable/Disable Alerts

### Enable Alert
```
Simply check the checkbox → Click "Save Preferences"
```

### Disable Alert
```
Simply uncheck the checkbox → Click "Save Preferences"
```

### Example: User Flow

**Scenario:** User wants to disable job alerts but keep others

1. User navigates to Settings → Notification Preferences
2. Current state displayed:
   - ☑ Job Alerts (enabled)
   - ☑ Proposal Updates (enabled)
   - ☑ Messages (enabled)
   - ☐ Newsletter (disabled)

3. User uncheck "Job Alerts":
   - ☐ Job Alerts (now disabled)
   - ☑ Proposal Updates (enabled)
   - ☑ Messages (enabled)
   - ☐ Newsletter (disabled)

4. User clicks "Save Preferences"

5. Backend processes:
   - Calls PUT `/api/users/me/notifications/preferences`
   - Sends: `{ jobAlerts: false, proposalUpdates: true, messages: true, newsletter: false }`
   - Updates database
   - Returns confirmation

6. Frontend shows: "✓ Preferences saved successfully!"

---

## 📁 Implementation Files

### Backend Components

| File | Location | Purpose |
|------|----------|---------|
| **UserController.java** | src/main/java/.../controller/ | API endpoints |
| **UserService.java** | src/main/java/.../service/ | Business logic |
| **UserNotificationPreference.java** | src/main/java/.../entity/ | Database entity |
| **UserNotificationPreferenceRepository.java** | src/main/java/.../repository/ | Data access |
| **NotificationPreferenceRequest.java** | src/main/java/.../dto/ | Request DTO |
| **NotificationPreferenceResponse.java** | src/main/java/.../dto/ | Response DTO |
| **V17__create_user_notification_preferences_table.sql** | src/main/resources/db/migration/ | Database migration |

### API Endpoints in Controller

```java
// GET /api/users/me/notifications/preferences
@GetMapping("/me/notifications/preferences")
@PreAuthorize("isAuthenticated()")
public ResponseEntity<NotificationPreferenceResponse> getNotificationPreferences()

// PUT /api/users/me/notifications/preferences
@PutMapping("/me/notifications/preferences")
@PreAuthorize("isAuthenticated()")
public ResponseEntity<NotificationPreferenceResponse> updateNotificationPreferences(
    @Valid @RequestBody NotificationPreferenceRequest request)
```

---

## 🧪 Testing the Feature

### Using cURL

**Get preferences:**
```bash
curl -X GET http://localhost:8080/api/users/me/notifications/preferences \
  -H "Authorization: Bearer <your_jwt_token>" \
  -H "Content-Type: application/json"
```

**Update preferences:**
```bash
curl -X PUT http://localhost:8080/api/users/me/notifications/preferences \
  -H "Authorization: Bearer <your_jwt_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "jobAlerts": false,
    "proposalUpdates": true,
    "messages": true,
    "newsletter": true
  }'
```

### Using Postman

**Get Preferences:**
- Method: GET
- URL: `http://localhost:8080/api/users/me/notifications/preferences`
- Headers:
  - Authorization: Bearer <token>
  - Content-Type: application/json

**Update Preferences:**
- Method: PUT
- URL: `http://localhost:8080/api/users/me/notifications/preferences`
- Headers:
  - Authorization: Bearer <token>
  - Content-Type: application/json
- Body (raw JSON):
```json
{
    "jobAlerts": false,
    "proposalUpdates": true,
    "messages": true,
    "newsletter": true
}
```

---

## 🔒 Security

- ✅ All endpoints require authentication
- ✅ Users can only access/modify their own preferences
- ✅ JWT token required in Authorization header
- ✅ Input validation on all requests
- ✅ Database constraints ensure data integrity

---

## 📝 Default Values

When a user first accesses notification preferences:

| Preference | Default Value |
|-----------|---------------|
| Job Alerts | ✅ Enabled |
| Proposal Updates | ✅ Enabled |
| Messages | ✅ Enabled |
| Newsletter | ❌ Disabled |

---

## 🚀 State Management (Frontend)

### Using React State

```javascript
const [preferences, setPreferences] = useState({
    id: null,
    jobAlerts: true,
    proposalUpdates: true,
    messages: true,
    newsletter: false
});
```

### Using Redux/Context

```javascript
// Store preferences in global state
const preferencesSlice = createSlice({
    name: 'preferences',
    initialState: {
        jobAlerts: true,
        proposalUpdates: true,
        messages: true,
        newsletter: false,
        loading: false,
        error: null
    },
    reducers: {
        toggle: (state, action) => {
            const field = action.payload;
            state[field] = !state[field];
        },
        setPreferences: (state, action) => {
            return { ...state, ...action.payload };
        }
    }
});
```

---

## 🔧 Troubleshooting

### Issue: "Unauthorized" error (401)

**Solution:**
- Ensure JWT token is included in Authorization header
- Check token is valid and not expired
- Format: `Authorization: Bearer <token>`

### Issue: Preferences won't save

**Solution:**
- Check network tab in browser dev tools
- Verify API URL is correct: `/api/users/me/notifications/preferences`
- Ensure request method is PUT (not POST)
- Check request body is valid JSON

### Issue: Changes don't persist

**Solution:**
- Verify database migration ran successfully
- Check `user_notification_preferences` table exists in database
- Verify no database errors in logs
- Check user_id foreign key is correct

### Issue: Default preferences not created

**Solution:**
- Default preferences are created on first GET request
- If not created, manually call endpoint
- Check user exists in `users` table
- Verify UserService.getNotificationPreferences() is being called

---

## 📊 Database Queries

### Check user preferences

```sql
SELECT * FROM user_notification_preferences WHERE user_id = 1;
```

### Disable all emails for a user

```sql
UPDATE user_notification_preferences 
SET job_alerts = false, 
    proposal_updates = false, 
    messages = false, 
    newsletter = false 
WHERE user_id = 1;
```

### Check users who opted out of job alerts

```sql
SELECT u.id, u.email, u.full_name, unp.job_alerts 
FROM users u 
LEFT JOIN user_notification_preferences unp ON u.id = unp.user_id 
WHERE unp.job_alerts = false;
```

---

## 📈 Next Steps

1. **Frontend Integration**
   - Implement settings/preferences page UI
   - Add React component with toggle switches
   - Integrate with API endpoints

2. **Notification Service**
   - Implement logic to check user preferences before sending emails
   - Only send emails if user has not opted out
   - Log notification delivery

3. **Email Templates**
   - Create templates for each notification type
   - Update email service to use templates
   - Add unsubscribe links

4. **Monitoring**
   - Track email delivery rates
   - Monitor API usage
   - Alert on failed preference updates

---

## 📞 Support

For issues or questions about this feature:
1. Check the troubleshooting section above
2. Review backend logs for errors
3. Verify database schema with: `\d user_notification_preferences`
4. Test endpoints with cURL or Postman
5. Check frontend network requests in browser dev tools

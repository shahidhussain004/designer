# Notification Preferences - Quick Start for Frontend

## 🎯 What's Available Now

Backend is **100% ready**. Frontend needs to implement the UI.

---

## 📱 Frontend Tasks

### Task 1: Create Settings/Preferences Page

Location: `frontend/src/pages/Settings.jsx` (or similar)

### Task 2: Add 4 Toggle Switches

```
☑ Job Alerts - Receive notifications for new jobs matching your skills
☑ Proposal Updates - Get notified when your proposals are reviewed  
☑ Messages - Receive email notifications for new messages
☐ Newsletter - Stay updated with tips, news, and platform updates

[Save Preferences Button]
```

### Task 3: Implement API Calls

**Load Preferences:**
```javascript
fetch('/api/users/me/notifications/preferences', {
    headers: { 'Authorization': `Bearer ${token}` }
})
.then(r => r.json())
.then(data => {
    setJobAlerts(data.jobAlerts);
    setProposalUpdates(data.proposalUpdates);
    setMessages(data.messages);
    setNewsletter(data.newsletter);
});
```

**Save Preferences:**
```javascript
fetch('/api/users/me/notifications/preferences', {
    method: 'PUT',
    headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        jobAlerts: jobAlerts,
        proposalUpdates: proposalUpdates,
        messages: messages,
        newsletter: newsletter
    })
})
.then(r => r.json())
.then(data => {
    showSuccessMessage('Preferences saved!');
});
```

### Task 4: Test

1. Load preferences - should show correct toggles
2. Change a toggle
3. Click Save - should see success message
4. Refresh page - toggle should still be changed (persisted)

---

## 🔗 API Endpoints

| Method | URL | Description |
|--------|-----|-------------|
| GET | `/api/users/me/notifications/preferences` | Get user's settings |
| PUT | `/api/users/me/notifications/preferences` | Save user's settings |

**Headers Required:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

---

## 💾 Data Structure

### Response Format (GET):
```json
{
    "id": 1,
    "jobAlerts": true,
    "proposalUpdates": true,
    "messages": true,
    "newsletter": false
}
```

### Request Format (PUT):
```json
{
    "jobAlerts": false,
    "proposalUpdates": true,
    "messages": true,
    "newsletter": true
}
```

---

## ✅ Implementation Checklist

- [ ] Create Settings page component
- [ ] Add 4 toggle switches
- [ ] Load preferences on page load
- [ ] Handle toggle changes
- [ ] Implement Save button
- [ ] Send PUT request with new values
- [ ] Show success/error messages
- [ ] Test all 4 toggles work
- [ ] Test persistence (refresh page)
- [ ] Add loading state while saving
- [ ] Add error handling

---

## 📝 Simple Example

```javascript
import React, { useState, useEffect } from 'react';

export function NotificationsPage() {
    const [job, setJob] = useState(true);
    const [proposal, setProposal] = useState(true);
    const [messages, setMessages] = useState(true);
    const [newsletter, setNewsletter] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        // Load on mount
        const token = localStorage.getItem('token');
        fetch('/api/users/me/notifications/preferences', {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(r => r.json())
        .then(d => {
            setJob(d.jobAlerts);
            setProposal(d.proposalUpdates);
            setMessages(d.messages);
            setNewsletter(d.newsletter);
        });
    }, []);

    const handleSave = async () => {
        setSaving(true);
        const token = localStorage.getItem('token');
        
        try {
            const res = await fetch('/api/users/me/notifications/preferences', {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    jobAlerts: job,
                    proposalUpdates: proposal,
                    messages: messages,
                    newsletter: newsletter
                })
            });

            if (res.ok) {
                alert('Preferences saved!');
            } else {
                alert('Error saving preferences');
            }
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="settings-page">
            <h2>Email Notifications</h2>
            
            <label>
                <input type="checkbox" checked={job} onChange={e => setJob(e.target.checked)} />
                Job Alerts
            </label>
            
            <label>
                <input type="checkbox" checked={proposal} onChange={e => setProposal(e.target.checked)} />
                Proposal Updates
            </label>
            
            <label>
                <input type="checkbox" checked={messages} onChange={e => setMessages(e.target.checked)} />
                Messages
            </label>
            
            <label>
                <input type="checkbox" checked={newsletter} onChange={e => setNewsletter(e.target.checked)} />
                Newsletter
            </label>
            
            <button onClick={handleSave} disabled={saving}>
                {saving ? 'Saving...' : 'Save Preferences'}
            </button>
        </div>
    );
}
```

---

## 🐛 Troubleshooting

**Issue:** Getting 401 error
- Fix: Make sure JWT token is in Authorization header

**Issue:** Preferences not saving
- Fix: Check browser dev tools Network tab to see API response
- Check PUT is being used (not GET or POST)

**Issue:** Getting 404 error
- Fix: Verify API URL is correct: `/api/users/me/notifications/preferences`

**Issue:** Default values not showing
- Fix: Backend creates defaults on first access, just make GET request

---

## 📚 More Details

See: `NOTIFICATION_PREFERENCES_IMPLEMENTATION.md` for:
- Complete API documentation
- React component with full features
- Error handling examples
- State management patterns
- Testing with Postman/cURL
- Database schema
- Troubleshooting guide

---

## ✅ Status

**Backend:** ✅ COMPLETE
- Database migration ready
- API endpoints working
- Service layer implemented
- All business logic done

**Frontend:** ⏳ TODO
- Create settings page
- Add toggle switches
- Implement API calls

**Total Time to Complete:** ~2-4 hours for frontend developer

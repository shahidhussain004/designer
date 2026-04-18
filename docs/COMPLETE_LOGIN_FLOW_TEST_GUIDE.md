# Complete Login Flow Testing Guide

## Issues Fixed

### Issue #1: AuthContext Loading State Never Set to False
**Problem:** The AuthContext initialization was completing but never calling `setLoading(false)`, so the dashboard page remained in "Loading your account..." state forever.

**Fix Applied:** Added `finally` block to AuthContext initialization that always calls `setLoading(false)`:
```tsx
useEffect(() => {
  const initializeAuth = async () => {
    // ... initialization code ...
    await refreshUser();
  } finally {
    // CRITICAL: Always set loading to false when initialization completes
    setLoading(false);
  }
  initializeAuth();
}, [])
```

### Issue #2: Dashboard Page Waits Indefinitely for Loading Flag
**Problem:** Dashboard page uses `if (!loading)` to trigger redirect, but if the context is slow to initialize, the page could get stuck.

**Fix Applied:** Improved dashboard logic to:
1. Redirect immediately if user exists in context
2. Check localStorage directly if context loading is done
3. Add 3-second timeout to prevent infinite loading
```tsx
useEffect(() => {
  // Check immediately if we already have user in context
  if (user) {
    checkAuth()
    return
  }
  
  // If not loading, check (handles both authenticated and unauthenticated)
  if (!loading) {
    checkAuth()
    return
  }
  
  // If still loading, wait a bit then check anyway (prevent infinite loading)
  const timer = setTimeout(() => {
    checkAuth()
  }, 3000)
  
  return () => clearTimeout(timer)
}, [loading, user, router])
```

---

## Complete Login Flow - Expected Behavior

### Step 1: User Opens Login Page
```
URL: http://localhost:3002/auth/login
Expected: Login form appears with email/password fields
```

### Step 2: User Enters Credentials
```
Email: alice.johnson@email.com
Password: password123
```

### Step 3: User Clicks "Log in"
```
Expected Actions:
1. Form submits
2. API call to /auth/login
3. Backend returns user object + tokens
4. Frontend stores in localStorage:
   - access_token
   - refresh_token
   - user (JSON)
5. authService.login() completes
6. refreshUser() called to update AuthContext
7. router.push('/dashboard')
```

### Step 4: Dashboard Page Loads
```
URL: http://localhost:3002/dashboard
Expected: Page should NOT show loading screen
Instead: Page should redirect based on role
```

### Step 5: Role-Based Redirect
```
If user.role === 'FREELANCER':
  Redirect to: http://localhost:3002/dashboard/freelancer
  
If user.role === 'COMPANY':
  Redirect to: http://localhost:3002/dashboard/company
  
If user.role === 'ADMIN':
  Redirect to: http://localhost:3001 (admin app)
```

### Step 6: Dashboard Content Loads
```
Freelancer Dashboard:
  URL: http://localhost:3002/dashboard/freelancer
  Should show:
  - Dashboard stats
  - Available jobs
  - Quick links
  - etc.

Company Dashboard:
  URL: http://localhost:3002/dashboard/company
  Should show:
  - Dashboard stats
  - Posted projects
  - Quick links
  - etc.
```

---

## Manual Testing Checklist

### Test 1: Freelancer Login Flow
- [ ] Open http://localhost:3002/auth/login
- [ ] Enter: alice.johnson@email.com / password123
- [ ] Click "Log in"
- [ ] Verify: Page redirects to http://localhost:3002/dashboard/freelancer (NOT stuck on dashboard page)
- [ ] Verify: Freelancer dashboard content loads (stats, jobs, etc.)
- [ ] Verify: No console errors

### Test 2: Company Login Flow
- [ ] Log out first
- [ ] Open http://localhost:3002/auth/login
- [ ] Find company credentials (check database or test files)
- [ ] Enter company credentials
- [ ] Click "Log in"
- [ ] Verify: Page redirects to http://localhost:3002/dashboard/company (NOT stuck on dashboard page)
- [ ] Verify: Company dashboard content loads
- [ ] Verify: No console errors

### Test 3: Verify Loading State Doesn't Get Stuck
- [ ] After login, open browser DevTools → Console
- [ ] Look for these logs:
  ```
  [AuthContext] Auth initialization complete, setting loading=false
  [Dashboard] checkAuth called
  [Dashboard] Redirecting to /dashboard/freelancer (or /dashboard/company)
  ```
- [ ] Verify: NOT seeing infinite "Loading your account..." state

### Test 4: Session Persistence (Browser Refresh)
- [ ] Stay logged in on freelancer dashboard
- [ ] Press F5 (refresh page)
- [ ] Verify: Freelancer dashboard still shows (no need to login again)
- [ ] Verify: No "Loading..." state

### Test 5: Logout and Relogin
- [ ] Click user dropdown in navbar
- [ ] Click "Logout"
- [ ] Verify: Redirected to home page
- [ ] Navbar shows "Log in" button (no user dropdown)
- [ ] Click "Log in" again
- [ ] Login with freelancer credentials
- [ ] Verify: Redirected directly to /dashboard/freelancer
- [ ] Verify: Dashboard loads content

---

## Console Log Expectations

### When Page Loads (Fresh)
```
[AuthContext] Initializing auth on app startup
[AuthContext] Refresh token found, attempting to refresh access token
[AuthContext] Token refresh successful on startup  (or failed if offline)
[AuthContext] User from localStorage: { ... }
[AuthContext] Setting user state: { ... }
[AuthContext] Auth initialization complete, setting loading=false
```

### When User Logs In
```
[Login] Submitting credentials...
[AUTH] Login successful
[AUTH] Stored tokens: { accessToken: "...", refreshToken: "...", user: { ... } }
[Login] Calling refreshUser...
[AuthContext] refreshUser called
[AuthContext] User from localStorage: { ... }
[AuthContext] Setting user state: { ... }
[Login] refreshUser completed, redirecting to /dashboard
```

### When Dashboard Page Mounts
```
[Dashboard] checkAuth called, user: { ... }, loading: false
[Dashboard] User role: FREELANCER (or COMPANY)
[Dashboard] Redirecting to /dashboard/freelancer (or /dashboard/company)
```

### What You DON'T Want to See
```
❌ Infinite "Loading your account..." state
❌ [Dashboard] checkAuth called, user: null, loading: true (stuck in this state)
❌ ReferenceError errors in console
❌ Redirect to /auth/login when user is logged in
```

---

## Expected User Journeys

### Freelancer Login → Dashboard
```
http://localhost:3002/auth/login
  ↓ [user logs in]
http://localhost:3002/dashboard
  ↓ [redirect based on role]
http://localhost:3002/dashboard/freelancer
  ↓ [content loads]
[Freelancer Dashboard with stats and jobs displayed]
```

### Company Login → Dashboard
```
http://localhost:3002/auth/login
  ↓ [user logs in]
http://localhost:3002/dashboard
  ↓ [redirect based on role]
http://localhost:3002/dashboard/company
  ↓ [content loads]
[Company Dashboard with stats and projects displayed]
```

---

## Known Test Credentials

Check the database seed files or backend logs for valid credentials:

**Freelancer Test Accounts:**
- alice.johnson@email.com / password123 (FREELANCER)
- (Check config/database for more)

**Company Test Accounts:**
- (Check database for company user email)
- (Check database for company user password)

To find credentials, check:
1. `config/init.sql` - database seed
2. Backend logs from last test run
3. Database directly (SELECT * FROM users LIMIT 10)

---

## If Tests Fail

### "Loading your account..." Never Goes Away
**Likely Cause:** AuthContext not calling setLoading(false)
**Fix:** Verify AuthContext has `finally { setLoading(false); }` block

### Redirects to /auth/login Unexpectedly
**Likely Cause:** User not being stored/retrieved from localStorage
**Check:**
1. Login successful? (check [AUTH] Login successful log)
2. Tokens stored? (DevTools → Storage → LocalStorage, check for access_token)
3. User object stored? (check localStorage for 'user' key)

### Dashboard Stays on /dashboard Instead of Redirecting
**Likely Cause:** Role not being detected
**Check:**
1. Is user.role present? (console log in dashboard page)
2. Is role value correct? (should be 'FREELANCER' or 'COMPANY')
3. Is the if statement matching the role?

### Console Errors About Missing Components
**Likely Cause:** Dashboard page trying to render before content is loaded
**Fix:** Check if error happens during redirect or after redirect

---

## Server Status

The development server should show:
```
✓ Ready in XXs
- Local: http://localhost:3002
```

If server doesn't show "Ready", it's still compiling. Wait for compilation to complete.

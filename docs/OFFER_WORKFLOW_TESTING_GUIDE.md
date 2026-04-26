# Offer Workflow Testing Guide

## ✅ Backend Verification Complete

**Migration Status:**
- ✅ V25 migration applied successfully
- ✅ Schema version: v25 "add offer details to job applications"
- ✅ Execution time: 00:00.090s
- ✅ Backend started on port 8080
- ✅ Frontend running on port 3002

**Database Changes (V25):**
Added 12 new columns to `job_applications` table:
1. `offered_salary_cents` - BIGINT
2. `offered_salary_currency` - VARCHAR(3)
3. `offered_salary_period` - VARCHAR(20)
4. `offered_start_date` - TIMESTAMP
5. `offer_expiration_date` - TIMESTAMP (indexed)
6. `contract_type` - VARCHAR(20)
7. `contract_duration_months` - INTEGER
8. `offer_benefits` - TEXT
9. `offer_additional_terms` - TEXT
10. `offer_document_url` - VARCHAR(500)
11. `offer_made_at` - TIMESTAMP
12. `offer_responded_at` - TIMESTAMP

**New API Endpoints:**
- POST `/api/job-applications/{id}/offer` - Company makes formal offer
- POST `/api/job-applications/{id}/respond` - Freelancer accepts/rejects offer

---

## 🧪 End-to-End Testing Checklist

### Test 1: Company Makes Offer

**Prerequisites:**
- Job exists with applications
- At least one application has status: `INTERVIEWING` or `SHORTLISTED`

**Steps:**

1. **Login as Company**
   - Navigate to: http://localhost:3002/login
   - Use company credentials (e.g., company1@example.com)

2. **Access Applications Page**
   - Navigate to: http://localhost:3002/jobs/12/applications
   - Replace `12` with an actual job ID you created

3. **Find Application to Make Offer**
   - Look for applications with status: `INTERVIEWING`
   - Click "Make Offer" button

4. **Fill Offer Modal**
   ```
   Compensation:
   - Salary: 75000 (example)
   - Currency: USD
   - Period: YEARLY
   
   Contract Details:
   - Contract Type: FULL_TIME
   - Duration: [leave empty for permanent positions]
   
   Timeline:
   - Start Date: [select future date, e.g., 1 month from now]
   - Offer Expiration: [select date 7 days from now]
   
   Additional Information:
   - Benefits: "Health insurance, 25 vacation days, 401k matching"
   - Additional Terms: "Remote work allowed, laptop and home office stipend provided"
   - Offer Document URL: [optional - URL to formal offer letter PDF]
   
   Internal Notes (Company Only):
   - "Strong technical skills, good culture fit. Approved by team lead."
   ```

5. **Submit Offer**
   - Click "Send Offer"
   - ✅ **Expected:** Modal closes, status changes to `OFFERED`

6. **Verify Backend Logs**
   - Check backend terminal for:
   ```
   Making formal offer for application ID: [id]
   Creating notification for offer: [job title]
   Notification saved successfully
   ```

7. **Verify Database Changes**
   - Status should be: `OFFERED`
   - All 12 offer columns should have values
   - `offer_made_at` timestamp should be set
   - `offer_responded_at` should be NULL

---

### Test 2: Freelancer Views Offer

**Steps:**

1. **Logout from Company Account**
   - Click profile menu → Logout

2. **Login as Freelancer**
   - Use freelancer credentials (e.g., freelancer29@example.com / password)
   - This should be the applicant who received the offer

3. **Navigate to Job Page**
   - Go to: http://localhost:3002/jobs/12
   - Replace `12` with the job ID

4. **Verify OfferDetailsView Appears**
   - ✅ **Expected Components:**
     - Large offer box with yellow/gold styling
     - "Job Offer Received" heading
     - Countdown timer showing time remaining
     - Formatted salary display (e.g., "$75,000.00 USD / YEARLY")
     - Contract type (e.g., "Full-time position")
     - Start date display
     - Benefits section (if provided)
     - Additional terms section (if provided)
     - Offer document download link (if provided)
     - "Accept Offer" button (green)
     - "Decline Offer" button (red)

5. **Verify Countdown Timer**
   - Timer should show: "Offer expires in X days, X hours"
   - Should update every minute
   - If near expiration, should show warning (yellow)
   - If expired, should show error (red) and disable buttons

---

### Test 3: Freelancer Accepts Offer

**Steps:**

1. **Click "Accept Offer" Button**
   - Form should expand below

2. **Fill Optional Notes**
   ```
   Notes: "Thank you for this opportunity! I'm excited to join the team. 
   I have a few questions about the remote work setup that I'd like to 
   discuss during onboarding."
   ```

3. **Click "Confirm Acceptance"**
   - ✅ **Expected:** 
     - Success message appears
     - Status changes to `ACCEPTED`
     - Page may refresh

4. **Verify Backend Logs**
   - Check terminal for:
   ```
   Offer response recorded: [freelancer name] - Status: ACCEPTED
   Creating notification for offer acceptance
   ```

5. **Verify Database Changes**
   - Status should be: `ACCEPTED`
   - `offer_responded_at` timestamp should be set
   - Freelancer notes should be stored

---

### Test 4: Freelancer Rejects Offer (Alternative Path)

**Steps:**

1. **Click "Decline Offer" Button**
   - Form should expand below

2. **Fill Rejection Reason**
   ```
   Reason: "Thank you for the offer. After careful consideration, I've 
   decided to pursue another opportunity that better aligns with my 
   career goals at this time."
   ```

3. **Click "Confirm Rejection"**
   - ✅ **Expected:**
     - Confirmation dialog appears
     - After confirmation, status changes to `REJECTED`

4. **Verify Backend Logs**
   - Check terminal for:
   ```
   Offer response recorded: [freelancer name] - Status: REJECTED
   Creating notification for offer rejection
   ```

---

### Test 5: Company Views Accepted/Rejected Offer

**Steps:**

1. **Login as Company**
   - Return to http://localhost:3002/jobs/12/applications

2. **Find the Application**
   - Status should now show: `ACCEPTED` or `REJECTED`

3. **View Application Details**
   - Click on application to expand
   - ✅ **Expected to see:**
     - All offer details you submitted
     - Freelancer's response notes
     - Timestamps for offer made and response

4. **Check Notifications**
   - Navigate to notifications page
   - ✅ **Expected:**
     - Notification about offer acceptance/rejection
     - Contains job title and freelancer name

---

### Test 6: Offer Expiration Handling

**Create Expired Offer (For Testing):**

Option A - Manual Database Update:
```sql
UPDATE job_applications 
SET offer_expiration_date = NOW() - INTERVAL '1 day',
    status = 'OFFERED'
WHERE id = [application_id];
```

Option B - Create offer with 1-minute expiration:
- When making offer, set expiration to current time + 1 minute
- Wait 2 minutes
- Refresh page

**Verify Expired Offer Behavior:**
1. Login as freelancer
2. Navigate to job page with expired offer
3. ✅ **Expected:**
   - Countdown shows: "Offer expired X hours ago" (red text)
   - Error message: "This offer has expired"
   - Accept/Decline buttons are disabled
   - Cannot submit response

---

### Test 7: Verify Original Bug Fix - Wrong User Details

**This was the original bug that started this work!**

**Steps:**

1. **Login as Freelancer**
   - Use: freelancer29@example.com (Chris Adams)
   - Or any other freelancer account

2. **Apply for a New Job**
   - Find a job without existing application
   - Fill application form and submit

3. **Check Success Page**
   - ✅ **Expected:**
     - Shows YOUR name (e.g., "Chris Adams")
     - Shows YOUR email (e.g., "freelancer29@example.com")
     - Application ID matches the one created
   
   - ❌ **SHOULD NOT SHOW:**
     - "Shahid Hussain" (this was the hardcoded mock data)
     - "shahid.hussain@seb.se"

---

## 🔍 Error Scenarios to Test

### Invalid Offer Scenarios

Test these by modifying data before submission:

1. **Expired Expiration Date**
   - Set expiration to yesterday
   - ✅ Expected: "Expiration date must be in the future"

2. **Start Date in Past**
   - Set start date to last week
   - ✅ Expected: Validation error

3. **Missing Required Fields**
   - Leave salary empty
   - ✅ Expected: "Offered salary is required"

4. **Invalid Status Transition**
   - Try to make offer for application with status: `PENDING`
   - ✅ Expected: "Application must be SHORTLISTED or INTERVIEWING to make offer"

### Response Scenarios

1. **Non-Applicant Tries to Respond**
   - Login as different freelancer
   - Try POST to `/api/job-applications/{id}/respond`
   - ✅ Expected: 403 Forbidden

2. **Respond to Non-OFFERED Application**
   - Try to respond to application with status: `ACCEPTED`
   - ✅ Expected: "Application status must be OFFERED"

---

## 📊 Expected Backend Log Output

When testing, you should see these log patterns:

**Making Offer:**
```
Making formal offer for application ID: 123
Offer details: $75,000.00 USD/YEARLY - FULL_TIME starting 2026-06-01
Creating notification for offer: Senior Frontend Developer
Notification saved successfully with ID: 456
```

**Accepting Offer:**
```
Offer response recorded: Chris Adams - Status: ACCEPTED
Freelancer notes: Thank you for this opportunity...
Creating notification for offer acceptance: Senior Frontend Developer
Notification saved successfully with ID: 789
```

**Rejecting Offer:**
```
Offer response recorded: Chris Adams - Status: REJECTED
Freelancer notes: Thank you for the offer...
Creating notification for offer rejection: Senior Frontend Developer
```

---

## 🎯 Success Criteria

All tests pass if:

1. ✅ Company can make offer with all 12 fields
2. ✅ Freelancer sees offer with countdown timer
3. ✅ Freelancer can accept offer with notes
4. ✅ Freelancer can reject offer with reason
5. ✅ Expired offers are properly disabled
6. ✅ Company receives notifications about responses
7. ✅ Database timestamps are recorded correctly
8. ✅ Original bug fixed - success page shows correct user
9. ✅ Status transitions follow business rules
10. ✅ Authorization prevents unauthorized actions

---

## 🐛 Known Issues (None Expected)

If you encounter any issues during testing, check:

1. **Backend logs** - Look for Java exceptions or validation errors
2. **Browser console** - Check for JavaScript errors or failed API calls
3. **Network tab** - Verify API requests return 200 OK (or expected error codes)
4. **Database** - Confirm data was written correctly

---

## 📝 Test Results Template

```markdown
### Test Execution Results - [Date]

#### Test 1: Company Makes Offer
- Status: [ ] PASS / [ ] FAIL
- Notes: 

#### Test 2: Freelancer Views Offer
- Status: [ ] PASS / [ ] FAIL
- Countdown Timer: [ ] Working / [ ] Not Working
- Notes:

#### Test 3: Freelancer Accepts Offer
- Status: [ ] PASS / [ ] FAIL
- Backend Logs: [ ] Correct / [ ] Missing
- Notifications: [ ] Created / [ ] Not Created
- Notes:

#### Test 4: Freelancer Rejects Offer
- Status: [ ] PASS / [ ] FAIL
- Notes:

#### Test 5: Company Views Response
- Status: [ ] PASS / [ ] FAIL
- Notes:

#### Test 6: Offer Expiration
- Status: [ ] PASS / [ ] FAIL
- Notes:

#### Test 7: Original Bug Fix
- Status: [ ] PASS / [ ] FAIL
- Shows correct user: [ ] YES / [ ] NO
- Notes:

#### Overall Result
- Total Tests: 7
- Passed: ___
- Failed: ___
- Success Rate: ___%
```

---

## 🚀 Quick Start Commands

**Backend (Already Running):**
```bash
cd C:\playground\designer\services\marketplace-service
& 'C:\Program Files\Java\jdk-21\bin\java.exe' -jar .\target\marketplace-service-1.0.0-SNAPSHOT.jar
```

**Frontend (Already Running):**
```bash
cd C:\playground\designer\frontend\marketplace-web
npm run dev
```

**Access URLs:**
- Frontend: http://localhost:3002
- Backend API: http://localhost:8080/api
- Swagger (if enabled): http://localhost:8080/api/swagger-ui.html

---

## 📧 Test Accounts

**Company Accounts:**
- company1@example.com / password
- company2@example.com / password

**Freelancer Accounts:**
- freelancer29@example.com / password (Chris Adams)
- freelancer1@example.com / password
- freelancer2@example.com / password

---

**Happy Testing! 🎉**

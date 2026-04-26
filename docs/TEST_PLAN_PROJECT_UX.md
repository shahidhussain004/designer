# End-to-End Project Management Flow - Verification Guide

## User Roles & Scenarios

### Scenario 1: Freelancer Viewing Project & Submitting Proposal
**User**: Freelancer (ID: any, role: FREELANCER)
**Steps**:
1. Navigate to http://localhost:3002/projects/7
2. **Expected Display** - Project Detail Page should show:
   - ✓ Title with status badges (URGENT if urgent, FEATURED if featured)
   - ✓ Category, Experience Level, Status badges
   - ✓ Description + Scope of Work (if available)
   - ✓ Required Skills & Preferred Skills sections
   - ✓ Timeline, Duration, Project Type info
   - ✓ Company info card with link to company profile
   - ✓ Budget card with:
     - Total budget prominently displayed
     - Budget range (min-max) if available
     - Budget type (Hourly/Fixed Price)
     - Currency
   - ✓ "Send Proposal" button (visible & active)
   - ✓ Project stats (Views, Proposals, Posted date, Published date)
   - ✓ Priority Level badge

3. **Click "Send Proposal"** button
4. **Expected**: Proposal form appears with:
   - Proposed Rate input (required)
   - Estimated Duration input (optional, defaults to 30 days)
   - Cover Letter textarea (required)
   - Submit button

5. **Fill and submit proposal**
6. **Expected**: Success message + redirect

### Scenario 2: Company Owner Viewing Their Project
**User**: Company (ID: 4, role: COMPANY)
**Steps**:
1. Navigate to http://localhost:3002/projects/7
2. **Expected Display**:
   - Same as Scenario 1 BUT:
   - "Edit Project" button appears (top right)
   - "View Proposals" button appears (instead of "Send Proposal")
   - "Sign In to Propose" button does NOT appear ← KEY FIX

3. **Click "Edit Project"** button
4. **Expected Navigation**: /projects/7/edit

### Scenario 3: Company Editing Their Project
**User**: Company (ID: 4, role: COMPANY)
**URL**: http://localhost:3002/projects/7/edit
**Expected Form Sections**:
1. **Basic Information**:
   - Project Title input (required)
   - Description textarea (required)
   - Scope of Work textarea (optional)

2. **Skills**:
   - Required Skills (comma-separated)
   - Preferred Skills (comma-separated)

3. **Project Details**:
   - Project Type dropdown (One-Time, Ongoing, Contract)
   - Timeline dropdown (ASAP, 1-3 months, 3-6 months, 6+ months)
   - Estimated Duration input (days)
   - Priority Level dropdown (Low, Medium, High, Urgent)

4. **Budget Information**:
   - Budget Type dropdown (Hourly, Fixed Price, Not Sure)
   - Currency dropdown (USD, EUR, GBP, CAD, AUD)
   - Conditional fields based on budget type:
     - If Fixed Price: Total Budget input
     - If Hourly: Min Rate + Max Rate inputs

5. **Status & Visibility**:
   - Project Status dropdown (Draft, Open, In Progress, Completed, Closed)
   - "Mark as URGENT" checkbox
   - "Featured Project" checkbox

6. **Button Actions**:
   - "Cancel" button → returns to /projects/7
   - "Save Changes" button → updates project and redirects to /projects/7

### Scenario 4: Unauthenticated User Viewing Project
**User**: Not logged in
**Steps**:
1. Navigate to http://localhost:3002/projects/7
2. **Expected**:
   - "Sign In to Propose" button visible
   - Click button → redirects to /auth/login

### Scenario 5: Viewing Proposals Dashboard
**User**: Company (ID: 4, role: COMPANY)
**Steps**:
1. From project detail page, click "View Proposals"
2. **Expected URL**: /projects/7/proposals
3. **Expected Display**:
   - Proposals listed for project #7
   - Each proposal shows:
     - Freelancer name, username, profile image
     - Rating & review count
     - Location
     - Proposed rate & estimated duration
     - Status badge
     - Skills tags
   - Action buttons based on status:
     - SUBMITTED: Start Reviewing, Shortlist, Reject
     - REVIEWING: Shortlist, Accept & Hire, Reject
     - SHORTLISTED: Accept & Hire, Reject
   - Status filter tabs (ALL, SUBMITTED, REVIEWING, SHORTLISTED, ACCEPTED, REJECTED)
   - Stats bar showing counts by status

## Data Verification

### Project #7 Expected Fields (from Database)
```
id: 7
title: "Design a modern company website"
description: "We need a modern, responsive website..."
scopeOfWork: "Deliverables include..."
category: Web Design
experienceLevel: Intermediate
requiredSkills: ["React", "TypeScript", "UI/UX Design"]
preferredSkills: ["Next.js", "Tailwind CSS"]
budget: 5000 (or budgetMaxCents: 500000)
budgetType: FIXED or HOURLY
currency: USD
timeline: "1-3_MONTHS"
estimatedDurationDays: 45
projectType: SINGLE_PROJECT
priorityLevel: HIGH
status: OPEN
isUrgent: false
isFeatured: false
viewsCount: 12
proposalCount: 3
companyId: 4
createdAt: 2026-04-15T10:30:00Z
publishedAt: 2026-04-15T10:35:00Z
```

## API Endpoints Required

### GET /api/projects/:id
**Returns**: Full project details with all fields
**Expected Fields**: All 30 fields from Project entity

### PUT /api/projects/:id
**Accepts**: Project update payload
**Required Authorization**: Must be project owner (user.id == project.companyId)

### GET /api/projects/:id/proposals
**Returns**: Paginated proposals for project
**Format**: Spring Data Page<Proposal>
**Expected**: data.content array

### POST /api/projects/:id/proposals (submit proposal)
**Accepts**: Proposal creation payload
**Required**: User is FREELANCER

## Design Quality Checks ✅

### Color & Contrast
- [ ] All text meets WCAG AA contrast requirements
- [ ] Status badges have distinct colors
- [ ] Important CTAs (buttons) stand out

### Typography
- [ ] Proper hierarchy (h1, h2, h3 sizes)
- [ ] Readable line heights (1.5-1.6)
- [ ] Appropriate font sizes for body text (14-16px)

### Spacing
- [ ] Section padding consistent (24px, 32px)
- [ ] Component gaps uniform
- [ ] White space used effectively

### Responsiveness
- [ ] Mobile view: single column layout
- [ ] Tablet: 2 columns where appropriate
- [ ] Desktop: full 3-column layout (2/3 + 1/3)

### European Design Standards ✓
- [ ] Clean, minimalist aesthetic
- [ ] Professional color palette
- [ ] Proper use of white space
- [ ] Clear information hierarchy
- [ ] Accessible component design

## Testing Instructions

### Manual Test Steps:

1. **Backend**: `cd services/marketplace-service && mvn spring-boot:run -DskipTests`
   - Verify it starts on port 8080
   - Check logs for any errors

2. **Frontend**: `cd frontend/marketplace-web && npm run dev`
   - Verify it starts on port 3002
   - Check for compilation errors

3. **Browser Test**:
   - Visit http://localhost:3002/projects/7
   - Verify all sections render
   - Check that freelancer sees proposal button
   - Check that company sees edit + view proposals buttons
   - Verify no "Sign In to Propose" for company
   - Click Edit Project (if company)
   - Verify form fields load with current data
   - Edit a field and save
   - Verify success message and page refresh

4. **Proposal Submission Test**:
   - Login as freelancer
   - Navigate to project
   - Click "Send Proposal"
   - Fill form and submit
   - Verify success message
   - Check proposals page shows new proposal

## Known Issues & Workarounds

None at this time - all features implemented and ready for testing.

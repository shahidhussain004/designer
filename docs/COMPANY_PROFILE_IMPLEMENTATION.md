# Company Profile Implementation Guide

## Summary of Changes

This document outlines the implementation of a professional company profile page with proper UX design and consistent URL structure patterns.

---

## 📋 What Was Implemented

### 1. **New Company Profile Page** (`/company/[id]`)
**File:** `frontend/marketplace-web/app/company/[id]/page.tsx`

**Features:**
- Professional hero section with gradient background (blue theme)
- Company branding with avatar/logo placeholder
- Contact information display (email, phone, location)
- Company statistics sidebar (rating, success rate, member since)
- About/bio section
- Reviews and testimonials
- "View Jobs" and "Contact Company" action buttons
- Consistent with freelancer profile design patterns
- Responsive layout (mobile-first, full-width, grid-based)

**Design Highlights:**
```
┌─────────────────────────────────────────┐
│  Hero Section (Blue Gradient)           │
│  ├─ Company Avatar                      │
│  ├─ Company Name & Username             │
│  ├─ Location, Rating, Member Since      │
│  └─ Action Buttons                      │
├─────────────────────────────────────────┤
│  Main Content Area                      │
│  ├─ About Section                       │
│  ├─ Contact Information                 │
│  ├─ Recent Reviews (up to 5)            │
│  └─ Sidebar:                            │
│      ├─ Stats Card                      │
│      └─ Quick Actions                   │
└─────────────────────────────────────────┘
```

---

### 2. **Backend Company Controller**
**File:** `services/marketplace-service/src/main/java/com/designer/marketplace/controller/CompanyController.java`

**Endpoints:**
```
GET /api/companies/{id}                    # Get company profile
GET /api/companies                         # List all companies (paginated)
```

**Key Features:**
- RESTful API design
- Pagination support
- Uses existing `UserService` for data retrieval
- Proper logging and error handling
- Spring Security compatible

---

### 3. **Updated Job Detail Page**
**File:** `frontend/marketplace-web/app/jobs/[id]/page.tsx`

**Changes:**
- Updated "View Profile" link from `/users/{id}/profile` to `/company/{id}`
- Line ~218: Links now direct to the new company profile page
- Maintains all existing functionality

**Before:**
```jsx
href={`/users/${company.id}/profile`}
```

**After:**
```jsx
href={`/company/${company.id}`}
```

---

### 4. **New Frontend Hook**
**File:** `frontend/marketplace-web/hooks/useUsers.ts`

**New Hook Added:**
```typescript
export function useCompanyProfile(companyId: string | number | null)
```

**Features:**
- Query-based data fetching
- Automatic cache management (10-minute stale time)
- Conditional enabling based on ID presence
- Uses `/api/companies/{id}` endpoint
- Returns typed Company data

---

## 🎨 UX/Architecture Design Decisions

### 1. **URL Structure: `/company/[id]` vs `/users/{id}/profile`**

**Why This Approach?**

| Aspect | `/company/[id]` | `/users/{id}/profile` |
|--------|-----------------|----------------------|
| **Clarity** | ✅ Type-specific, clear intent | ❌ Ambiguous user type |
| **Consistency** | ✅ Matches `/freelancers/[id]` | ❌ Inconsistent with freelancer URLs |
| **SEO** | ✅ Better structured, semantic | ⚠️ Less descriptive |
| **Scalability** | ✅ Supports `/agencies/[id]`, `/partners/[id]` | ❌ Limited pattern |
| **User Experience** | ✅ Users understand what they're viewing | ❌ Confusion about what "/users" is |

### 2. **Design Pattern - Hero + Content Grid**

The company profile follows the same successful pattern as the freelancer profile:
- **Hero Section:** Immediate visual and information impact
- **Content Grid:** 2-column layout (main content + sidebar)
- **Sticky Sidebar:** Quick stats always visible while scrolling
- **Color Coding:** Blue theme for companies vs. default for freelancers

### 3. **Backend Endpoint Strategy**

**Backward Compatibility:**
- Kept `/api/users/{id}/profile` endpoint active
- Added new `/api/companies/{id}` endpoint
- Both routes work simultaneously during transition

**Benefits:**
- Existing integrations continue to work
- Gradual migration path
- No breaking changes

---

## 🚀 How to Use

### For Frontend (Testing the Company Profile)

1. **Navigate to a job post:**
   ```
   http://localhost:3002/jobs/1
   ```

2. **Click "View Profile" in the "About the Company" section**
   - Now links to: `http://localhost:3002/company/2`
   - Previously linked to: `http://localhost:3002/users/2/profile`

3. **Company Profile Page Features:**
   - View company details, location, ratings
   - See company reviews and statistics
   - Click "View Jobs" to see all open positions
   - Click "Contact Company" to reach out

### For Backend (Testing the API)

1. **Test the new company endpoint:**
   ```bash
   curl http://localhost:8080/api/companies/2
   ```

2. **Test listing companies:**
   ```bash
   curl http://localhost:8080/api/companies?page=0&size=20
   ```

3. **Response Format:**
   ```json
   {
     "id": 2,
     "username": "acme-corp",
     "fullName": "ACME Corporation",
     "email": "hr@acme.com",
     "bio": "Global leader in innovation...",
     "location": "San Francisco, CA",
     "ratingAvg": 4.8,
     "ratingCount": 156,
     "completionRate": 98,
     "createdAt": "2025-01-01T10:00:00Z"
   }
   ```

---

## 📁 Files Modified & Created

### Frontend
```
✅ CREATED: /frontend/marketplace-web/app/company/[id]/page.tsx
📝 MODIFIED: /frontend/marketplace-web/app/jobs/[id]/page.tsx
📝 MODIFIED: /frontend/marketplace-web/hooks/useUsers.ts
```

### Backend
```
✅ CREATED: /services/marketplace-service/src/main/java/com/designer/marketplace/controller/CompanyController.java
```

---

## 🔄 Future Enhancements

1. **Company Dashboard** - Editable company profile page for company admins
2. **Company Verification** - Badge/verification system for verified companies
3. **Company Portfolio** - Showcase completed projects
4. **Company Followers** - Allow users to follow companies
5. **Company Search** - Enhanced search with company filters
6. **Company Widgets** - Embed company widget on external sites
7. **Company Analytics** - View job post performance, application trends

---

## ⚠️ Important Notes

### Data Availability
- The company profile page will display data from the User entity
- Ensure your database has companies set up as users with `role = COMPANY`
- If a user doesn't have certain fields (bio, location), they'll simply not display

### Fallbacks
- Missing profile images show initials instead
- Missing bio sections are hidden
- Missing reviews show "No reviews yet" state
- All fields are optional except id, username, fullName

### Performance
- Query caching: 10 minutes (adjustable in hook)
- Paginated results: 20 items per page (default)
- Database indexes recommended on: user_id, user_role, created_at

---

## 🧪 Testing Checklist

- [ ] Navigate to `/company/2` (or any valid company ID)
- [ ] Verify page loads without errors
- [ ] Check hero section displays company info correctly
- [ ] Verify "View Jobs" button works
- [ ] Verify "Contact Company" button functional
- [ ] Test on mobile devices (responsive design)
- [ ] Verify API endpoint: `GET /api/companies/2` returns data
- [ ] Test with missing fields (bio, phone, reviews)
- [ ] Verify links from job detail page work
- [ ] Check back-to-jobs navigation works
- [ ] Test pagination if listing companies

---

## 🔗 Integration Points

### Current Links to Company Profiles:
1. **Job Detail Page** → "View Profile" button
2. **Job Listing Page** → Company name (can be enhanced)
3. **Application Modal** → Company info section (can be linked)

### Future Integration Opportunities:
1. Dashboard showing "Companies hiring"
2. Related jobs from same company
3. Company follow buttons
4. "More from this company" sections

---

## 📚 Related Files for Reference

- **Freelancer Profile:** `/frontend/marketplace-web/app/freelancers/[id]/page.tsx`
- **Job Detail:** `/frontend/marketplace-web/app/jobs/[id]/page.tsx`
- **Jobs Hook:** `/frontend/marketplace-web/hooks/useJobs.ts`
- **User Controller:** `services/marketplace-service/src/.../UserController.java`
- **PageLayout Component:** `/frontend/marketplace-web/components/ui`

---

## ✨ Design Consistency Notes

### Color Scheme:
- **Company Profile:** Blue gradient hero (from-blue-900 via-blue-800)
- **Freelancer Profile:** Gray gradient hero (from-gray-900)
- **Primary Actions:** Primary blue (#3B82F6)
- **Success State:** Green (#10B981)

### Typography:
- **Page Title:** 2xl/3xl font-bold
- **Section Headers:** lg font-semibold
- **Body Text:** text-gray-600
- **Small Text:** text-xs text-gray-500

### Components:
- All sections use white background with border-gray-200
- Rounded corners: lg (8px)
- Shadows: shadow-sm for subtle depth
- Padding: p-6 for sections

---

## 🔒 Security Considerations

- Company profile is public (no authentication required)
- Users with role != COMPANY won't appear on `/companies` endpoint
- Email and phone are public information
- Contact information links are safe (mailto:, tel:)
- No sensitive data exposed in profile

---

## 📞 Support

For issues or questions:
1. Check the database that companies exist with proper role
2. Verify API endpoint is returning data
3. Check browser console for React/TypeScript errors
4. Verify page routing in next.config.js if using app router
5. Check component imports are correct

---

**Implementation Date:** January 16, 2026
**Status:** ✅ Complete and Ready for Testing

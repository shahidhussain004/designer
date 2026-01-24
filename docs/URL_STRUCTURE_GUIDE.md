# URL Structure & Navigation Guide

## Before vs After Comparison

### Previous Implementation
```
Job List Page
    ↓
Job Detail: /jobs/1
    ↓ [View Profile]
User Profile: /users/2/profile ❌ (Not Designed)
```

### New Implementation (Recommended)
```
Job List Page
    ↓
Job Detail: /jobs/1
    ↓ [View Profile]
Company Profile: /company/2 ✅ (New - Professional Design)

Similar Pattern:
Job List: /jobs
    ↓ (Company link)
Company: /company/2 ← NEW

Freelancer List: /freelancers
    ↓
Freelancer Profile: /freelancers/2 ← EXISTING (Similar Pattern)
```

---

## URL Architecture Patterns

### Current Implementation in Codebase

| Feature | URL Pattern | Status | Component |
|---------|-------------|--------|-----------|
| Jobs Listing | `/jobs` | ✅ | `app/jobs/page.tsx` |
| Job Details | `/jobs/[id]` | ✅ | `app/jobs/[id]/page.tsx` |
| **Company Profile** | **`/company/[id]`** | **✅ NEW** | **`app/company/[id]/page.tsx`** |
| Freelancer Listing | `/freelancers` | ✅ | (no page) |
| Freelancer Profile | `/freelancers/[id]` | ✅ | `app/freelancers/[id]/page.tsx` |
| User Dashboard | `/profile` | ✅ | `app/profile/page.tsx` |
| Settings | `/settings` | ✅ | `app/settings/page.tsx` |

---

## Navigation Hierarchy

```
Site Root (/)
├── Jobs (/jobs)
│   ├── Job Detail (/jobs/[id])
│   │   └── → Company Profile (/company/[id]) [NEW]
│   │       └── → View Jobs by Company
│   └── → Company Profile (/company/[id]) [NEW]
│
├── Company Profile (/company/[id]) [NEW]
│   ├── View Jobs Button → /jobs?company=[id]
│   └── Contact Company Button
│
├── Freelancers (/freelancers)
│   └── Freelancer Profile (/freelancers/[id])
│       ├── View Portfolio
│       └── Contact Freelancer
│
├── Dashboard (/dashboard)
├── Profile (/profile)
└── Settings (/settings)
```

---

## Routing Implementation Details

### Frontend Routes

#### Job Detail Page (Updated)
```typescript
// /app/jobs/[id]/page.tsx
// Line ~218
<Link href={`/company/${company.id}`}>
  View Profile →
</Link>
```

#### New Company Profile Page
```typescript
// /app/company/[id]/page.tsx
// Complete new file with:
// - Hero section with company info
// - About section
// - Contact information
// - Reviews and ratings
// - Stats sidebar
// - Action buttons
```

### Backend API Routes

#### New Company Endpoint
```java
// Controller: CompanyController.java
GET /api/companies/{id}          // Get company profile
GET /api/companies               // List all companies (paginated)
```

#### Existing User Endpoints (Still Active)
```java
// Controller: UserController.java
GET /api/users/{id}              // Get user by ID
GET /api/users/{id}/profile      // Get user profile (still works)
GET /api/users/freelancers       // List freelancers
```

---

## Data Flow Diagram

### User Clicks "View Profile" from Job Detail Page

```
┌─────────────────────────────────────────────────────┐
│ Job Detail Page (/jobs/[id])                        │
│ Shows job info + company info                       │
│ "View Profile" button links to /company/[id]        │
└────────────────────┬────────────────────────────────┘
                     │
                     ↓ Next.js Router
              ┌──────────────────┐
              │ /company/[id]    │
              └────────┬─────────┘
                       │
                       ↓ useCompanyProfile(id)
              ┌──────────────────────────────┐
              │ useQuery() calls:             │
              │ GET /api/companies/{id}      │
              └────────┬─────────────────────┘
                       │
                       ↓ API Response
    ┌──────────────────────────────────────────┐
    │ {                                        │
    │   id: 2,                                 │
    │   fullName: "ACME Corp",                 │
    │   location: "San Francisco",             │
    │   ratingAvg: 4.8,                        │
    │   reviews: [...]                         │
    │ }                                        │
    └────────┬─────────────────────────────────┘
             │
             ↓ Component Renders
    ┌──────────────────────────────────────┐
    │ Professional Company Profile Page     │
    │ - Hero section with company info     │
    │ - Contact details                    │
    │ - Reviews section                    │
    │ - Stats sidebar                      │
    │ - Action buttons                     │
    └──────────────────────────────────────┘
```

---

## TypeScript Type Definitions

### Company Profile Type
```typescript
interface CompanyProfile {
  id: number
  username: string
  fullName: string
  email: string
  bio?: string
  profileImageUrl?: string
  location?: string
  phone?: string
  ratingAvg?: number
  ratingCount?: number
  completionRate?: number
  createdAt?: string
  reviews?: Review[]
  website?: string
}

interface Review {
  id: number
  rating: number
  comment: string
  authorName: string
  createdAt: string
}
```

---

## Component Breakdown

### CompanyProfile Page Structure

```
<PageLayout>
  
  {/* Hero Section */}
  <div className="bg-gradient-to-br from-blue-900">
    ├── Back Link
    ├── Company Avatar/Logo
    ├── Company Name & Username
    ├── Location & Rating
    ├── Stats (success rate, member since)
    └── Action Buttons (Contact, View Jobs)
  </div>

  {/* Content Section */}
  <div className="bg-gray-50 py-8">
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Main Column (col-span-2) */}
      ├── About Section (bio)
      ├── Contact Information Card
      │   ├── Email (with mailto link)
      │   ├── Phone (with tel link)
      │   └── Location
      └── Reviews Section
          └── Review Cards (rating stars, comment, date)

      {/* Sidebar Column */}
      ├── Company Stats Card (sticky)
      │   ├── Rating
      │   ├── Success Rate
      │   └── Member Since
      └── Quick Actions Card
          └── View Open Positions Button

  </div>

</PageLayout>
```

---

## Key Points for Development

### ✅ What's Complete

1. **Frontend Page** - Full company profile page with responsive design
2. **Backend Controller** - New CompanyController with necessary endpoints
3. **Frontend Hook** - useCompanyProfile() for data fetching
4. **Job Detail Update** - Links now point to /company/[id]
5. **Design Consistency** - Matches freelancer profile pattern

### ⚠️ Considerations

1. **Database** - Ensure companies exist with role = 'COMPANY'
2. **Testing** - Test with actual company data IDs (2, 3, etc.)
3. **Styling** - Uses Tailwind CSS (should be available in project)
4. **Icons** - Uses lucide-react (should be installed)

### 🚀 Next Steps

1. Compile Java backend (`mvn clean build`)
2. Start backend server (verify CompanyController loads)
3. Test API: `GET http://localhost:8080/api/companies/2`
4. Run frontend dev server
5. Navigate to job detail → click View Profile
6. Verify company profile page loads correctly

---

## Quick Reference: URL Changes

### For Every User/Developer

```
OLD WAY:
- User clicks "View Profile" from job
- Goes to: /users/2/profile (incomplete page)
- Shows: Error or blank page

NEW WAY:
- User clicks "View Profile" from job
- Goes to: /company/2 (professional page)
- Shows: Full company profile with all details
```

---

## Testing Quick Checklist

```
Frontend Testing:
☐ Navigate to /company/1
☐ Navigate to /company/2
☐ Click "View Jobs" button
☐ Click "Contact Company" button
☐ Verify responsive design (mobile, tablet, desktop)
☐ Check error state (invalid company ID)
☐ Verify all sections load (about, contact, reviews, stats)

Backend Testing:
☐ GET /api/companies/1 returns company data
☐ GET /api/companies/2 returns company data
☐ GET /api/companies?page=0&size=20 returns paginated list
☐ Verify error handling (invalid ID returns 404)
☐ Check response format matches expected schema

Integration Testing:
☐ Job detail page link works
☐ "View Jobs" from company page works
☐ Navigation and footer consistent
☐ Back button returns to job detail page
```

---

## File Location Reference

```
Frontend Files:
📄 /app/company/[id]/page.tsx             ← NEW
📄 /app/jobs/[id]/page.tsx                ← MODIFIED (line ~218)
📄 /hooks/useUsers.ts                     ← MODIFIED (added useCompanyProfile)

Backend Files:
📄 /controller/CompanyController.java     ← NEW
📄 /controller/UserController.java        ← No changes

Documentation:
📄 /docs/COMPANY_PROFILE_IMPLEMENTATION.md   ← Complete guide
📄 This file (URL_STRUCTURE_GUIDE.md)        ← Quick reference
```

---

**Version:** 1.0  
**Last Updated:** January 16, 2026  
**Status:** ✅ Ready for Implementation

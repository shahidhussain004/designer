# 📚 Course Development - Current Status & Implementation Plan

**Date:** December 30, 2025  
**Status:** ✅ 70% Backend Complete | ⚠️ 20% Frontend (Only Browse UI Done) | ❌ 0% Instructor Dashboard

---

## 📊 CURRENT STATE ANALYSIS

### ✅ WHAT'S ALREADY BUILT

#### **Backend (Both Java & .NET Services)**
- ✅ **LMS Service (.NET 8 Port 8082)** - Fully functional
  - POST `/api/courses` - Create course
  - GET `/api/courses` - List courses with filters (category, level, search)
  - GET `/api/courses/{id}` - Get course details
  - PUT `/api/courses/{id}` - Update course
  - DELETE `/api/courses/{id}` - Delete course
  - POST `/api/courses/{id}/publish` - Publish course
  - POST `/api/courses/{courseId}/modules` - Add modules
  - POST `/api/courses/{courseId}/lessons` - Add lessons
  - GET `/api/courses/instructor/{instructorId}` - Get instructor's courses

- ✅ **MongoDB Storage** - All courses stored in MongoDB
  - Course documents with modules, lessons, metadata
  - Status tracking (Draft, Published, Archived)
  - Instructor ID association
  - Enrollment counting and rating aggregation

#### **Enroll & Consumption**
- ✅ POST `/api/enrollments` - Enroll in course
- ✅ GET `/api/enrollments/my` - Get my enrollments
- ✅ GET `/api/enrollments/progress/{courseId}` - Track progress
- ✅ POST `/api/enrollments/progress/{courseId}/lessons/{lessonId}/complete` - Mark lesson done

#### **Frontend - Browse Courses**
- ✅ `/courses` page (page.tsx) - Browse & filter courses
  - Lists all published courses
  - Filters: category, skill level, price range, search
  - Sorting: popular, newest, rating
  - Pagination (12 per page)
  - Cards with thumbnail, instructor, price, rating
  
- ✅ `/courses/[id]` page - Course details
  - Full course information (description, modules, lessons)
  - Enrollment button
  - Rating & reviews display
  - Free/Paid course support
  - Payment integration (Stripe)

- ✅ `/courses/[id]/success` - Post-enrollment confirmation

---

### ⚠️ WHAT'S MISSING (Critical Gaps)

#### **1. NO API Functions for Course Creation**
- ❌ Missing `createCourse()` function in `lib/courses.ts`
- ❌ Missing `updateCourse()` function
- ❌ Missing `deleteC ourse()` function
- ❌ Missing module/lesson management functions
- ❌ Missing course publishing function

#### **2. NO INSTRUCTOR DASHBOARD**
- ❌ No `/dashboard/instructor` route (only `/dashboard/freelancer` exists)
- ❌ No UI for:
  - Creating new courses
  - Managing existing courses
  - Adding modules & lessons
  - Publishing courses
  - Viewing course analytics/enrollments
  - Editing course details

#### **3. AUTHENTICATION GAP**
- ❌ User role management incomplete
  - Backend has INSTRUCTOR role but frontend doesn't check it
  - No role-based route protection for instructor pages
- ❌ No role switcher in UI (user with multiple roles)

#### **4. TEST DATA**
- ❌ No sample courses in MongoDB
  - Empty collection → no courses to browse
  - Even `/api/courses?page=1&pageSize=12&sortBy=popular` returns empty array

---

## 🏗️ IMPLEMENTATION PLAN

### **Phase 1: Test Data & Verification (30 minutes)**

**Goal:** Add sample courses to MongoDB to verify endpoints work

**Tasks:**
1. **Add Test Courses via Postman or API Call**
   ```bash
   POST http://localhost:8082/api/courses
   Headers: Authorization: Bearer {instructor-token}
   Body: {
     "title": "React Fundamentals",
     "description": "Learn React basics...",
     "shortDescription": "Master React",
     "category": "WebDevelopment",
     "level": "Beginner",
     "price": 49.99,
     "currency": "USD",
     "thumbnailUrl": "/course-react.jpg",
     "tags": ["react", "javascript", "frontend"],
     "objectives": ["Learn JSX", "Understand state"],
     "requirements": ["Basic JavaScript"]
   }
   ```

2. **Add at least 5 sample courses** covering different categories:
   - React Fundamentals (Web Dev, Beginner, $49.99)
   - Advanced Python (Data Science, Advanced, $79.99)
   - UI/UX Principles (Design, Intermediate, Free)
   - AWS Cloud Essentials (Cloud, Intermediate, $59.99)
   - Machine Learning 101 (ML, Advanced, $99.99)

3. **Publish courses**
   ```bash
   POST http://localhost:8082/api/courses/{courseId}/publish
   ```

4. **Verify** courses appear at: `http://localhost:8082/api/courses?page=1&pageSize=12&sortBy=popular`

---

### **Phase 2: Add Course Management API Functions (1 hour)**

**Goal:** Create TypeScript API client functions for instructor operations

**File:** `frontend/marketplace-web/lib/courses.ts`

**Add these functions:**

```typescript
// Course Creation
export async function createCourse(data: {
  title: string;
  description: string;
  shortDescription: string;
  category: string;
  level: string;
  price: number;
  currency: string;
  thumbnailUrl?: string;
  previewVideoUrl?: string;
  tags?: string[];
  objectives?: string[];
  requirements?: string[];
}): Promise<Course> {
  const token = localStorage.getItem('access_token');
  const response = await fetch(`${LMS_API_URL}/instructor/courses`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to create course');
  return response.json();
}

// Course Update
export async function updateCourse(
  courseId: string,
  data: Partial<Course>
): Promise<Course> {
  const token = localStorage.getItem('access_token');
  const response = await fetch(`${LMS_API_URL}/instructor/courses/${courseId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to update course');
  return response.json();
}

// Course Delete
export async function deleteCourse(courseId: string): Promise<void> {
  const token = localStorage.getItem('access_token');
  const response = await fetch(`${LMS_API_URL}/instructor/courses/${courseId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error('Failed to delete course');
}

// Publish Course
export async function publishCourse(courseId: string): Promise<Course> {
  const token = localStorage.getItem('access_token');
  const response = await fetch(`${LMS_API_URL}/instructor/courses/${courseId}/publish`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error('Failed to publish course');
  return response.json();
}

// Get Instructor's Courses
export async function getInstructorCourses(page = 0, size = 20): Promise<{
  items: Course[];
  totalCount: number;
  page: number;
  pageSize: number;
}> {
  const token = localStorage.getItem('access_token');
  const response = await fetch(
    `${LMS_API_URL}/instructor/courses?page=${page}&pageSize=${size}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  if (!response.ok) throw new Error('Failed to fetch instructor courses');
  return response.json();
}

// Add Module to Course
export async function addModule(
  courseId: string,
  data: { title: string; description?: string; orderIndex?: number }
): Promise<Course> {
  const token = localStorage.getItem('access_token');
  const response = await fetch(`${LMS_API_URL}/courses/${courseId}/modules`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to add module');
  return response.json();
}

// Add Lesson to Module
export async function addLesson(
  courseId: string,
  data: {
    moduleId: string;
    title: string;
    description?: string;
    type: 'Video' | 'Text' | 'Quiz';
    content?: string;
    videoUrl?: string;
    durationMinutes?: number;
    orderIndex?: number;
    isFree?: boolean;
  }
): Promise<Course> {
  const token = localStorage.getItem('access_token');
  const response = await fetch(`${LMS_API_URL}/courses/${courseId}/lessons`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to add lesson');
  return response.json();
}
```

---

### **Phase 3: Create Instructor Dashboard (3-4 hours)**

**Goal:** Build comprehensive UI for instructors to create & manage courses

#### **3.1: Create Instructor Dashboard Layout**

**Route:** `/dashboard/instructor`  
**File:** `frontend/marketplace-web/app/dashboard/instructor/page.tsx`

**Features:**
- Navigation tabs: Courses, Analytics, Students, Settings
- "Create New Course" button
- List of instructor's courses with:
  - Course thumbnail, title, status badge (Draft/Published)
  - Enrollment count, rating
  - Action buttons: Edit, Delete, Publish (if draft), View
  - Quick stats: Total students, Avg rating, Revenue

#### **3.2: Create Course Form Page**

**Route:** `/dashboard/instructor/courses/create`  
**File:** `frontend/marketplace-web/app/dashboard/instructor/courses/create/page.tsx`

**Form Fields:**
```
Section 1: Basic Info
- Title (required)
- Short Description (required)
- Full Description (required, textarea)
- Category dropdown (select)
- Skill Level (Beginner/Intermediate/Advanced)

Section 2: Pricing & Media
- Price (number)
- Currency (USD)
- Thumbnail URL (file upload or text)
- Preview Video URL (text)

Section 3: Metadata
- Tags (multi-select or comma-separated)
- Learning Objectives (list inputs)
- Requirements (list inputs)

Buttons: Save as Draft | Publish Now
```

#### **3.3: Course Editor Page**

**Route:** `/dashboard/instructor/courses/[id]/edit`  
**File:** `frontend/marketplace-web/app/dashboard/instructor/courses/[id]/edit/page.tsx`

**Tabs:**
1. **Course Details** - Same form as create (pre-filled)
2. **Modules & Lessons**
   - List modules with drag-to-reorder
   - "Add Module" button
   - Each module shows lessons
   - "Add Lesson" button per module
   - Lesson cards show title, type (Video/Text/Quiz), duration
   - Edit/Delete buttons for each

3. **Preview** - Show as students would see
4. **Analytics** (if time permits)
   - Enrollments over time
   - Student list with progress

#### **3.4: Module & Lesson Management**

**Add Module Modal/Form:**
```
- Title (required)
- Description
- Order index (auto)
Button: Add Module
```

**Add Lesson Modal/Form:**
```
- Title (required)
- Description
- Type (Video | Text | Quiz) - dropdown
- Content (textarea for text, URL for video)
- Duration (minutes)
- Is Free? (checkbox)
- Order index (auto)
Button: Add Lesson
```

---

### **Phase 4: Role-Based Access Control (1.5 hours)**

#### **4.1: Update User Type**

**File:** `frontend/marketplace-web/types/index.ts`

```typescript
export interface User {
  id: number;
  email: string;
  username: string;
  fullName: string;
  role: 'CLIENT' | 'FREELANCER' | 'INSTRUCTOR' | 'ADMIN';  // Add INSTRUCTOR
  // ... other fields
}
```

#### **4.2: Update Auth Service**

**File:** `frontend/marketplace-web/lib/auth.ts`

```typescript
export function canCreateCourses(): boolean {
  const user = getCurrentUser();
  return user?.role === 'INSTRUCTOR' || user?.role === 'ADMIN';
}

export function isInstructor(): boolean {
  const user = getCurrentUser();
  return user?.role === 'INSTRUCTOR' || user?.role === 'ADMIN';
}
```

#### **4.3: Create Protected Route Component**

**File:** `frontend/marketplace-web/components/ProtectedRoute.tsx`

```typescript
'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { authService } from '@/lib/auth';

export function requireInstructor(Component: React.ComponentType) {
  return function Protected(props: any) {
    const router = useRouter();

    useEffect(() => {
      if (!authService.isAuthenticated()) {
        router.push('/auth/login');
        return;
      }

      const user = authService.getCurrentUser();
      if (user?.role !== 'INSTRUCTOR' && user?.role !== 'ADMIN') {
        router.push('/dashboard');
      }
    }, [router]);

    return <Component {...props} />;
  };
}
```

#### **4.4: Add Instructor Link to Dashboard**

Update `frontend/marketplace-web/app/dashboard/page.tsx` to conditionally show instructor dashboard link for instructors.

---

### **Phase 5: Styling & UI Polish (1-2 hours)**

- Use existing `components/green` design system
- Ensure responsive design (mobile, tablet, desktop)
- Add loading states and error handling
- Add success/error toasts for actions
- Form validation with inline error messages
- Drag-and-drop for module/lesson reordering (optional)

---

## 📋 PRIORITY IMPLEMENTATION ORDER

### **IMMEDIATE (This Week)** - Minimum Viable Product
1. ✅ Phase 1: Add test courses to MongoDB
2. ✅ Phase 2: Add course API functions
3. ⚠️ Phase 3.1: Basic instructor dashboard (courses list only)
4. ⚠️ Phase 3.2: Create course form (simple version)

**Deliverable:** Instructors can create and publish basic courses

### **NEXT WEEK** - Full Feature
5. Phase 3.3: Course editor with modules/lessons
6. Phase 3.4: Module & lesson management
7. Phase 4: Role-based access control
8. Phase 5: UI polish & styling

**Deliverable:** Complete instructor course management system

### **FOLLOWING WEEK** - Advanced
9. Course analytics dashboard
10. Student progress tracking UI
11. Course certificate generation
12. Video streaming optimization

---

## 🔗 RELATED BACKEND ENDPOINTS

### **Java LMS Service (Port 8080)**
- `POST /api/lms/instructor/courses` - Create course
- `PUT /api/lms/instructor/courses/{courseId}` - Update course
- `GET /api/lms/instructor/courses` - Get instructor's courses
- `POST /api/lms/instructor/courses/{courseId}/publish` - Publish
- `POST /api/lms/instructor/courses/{courseId}/archive` - Archive

### **.NET LMS Service (Port 8082)**
- `POST /api/courses` - Create course
- `PUT /api/courses/{id}` - Update course
- `POST /api/courses/{id}/publish` - Publish
- `POST /api/courses/{courseId}/modules` - Add module
- `POST /api/courses/{courseId}/lessons` - Add lesson
- `GET /api/courses/instructor/{instructorId}` - Get my courses

---

## 🧪 TESTING CHECKLIST

### **Test Data Setup**
- [ ] At least 5 sample courses in MongoDB
- [ ] Mix of free and paid courses
- [ ] Different categories represented
- [ ] Different skill levels

### **API Testing** (Postman)
- [ ] POST `/api/courses` creates new course
- [ ] GET `/api/courses?page=1&pageSize=12` returns courses
- [ ] PUT `/api/courses/{id}` updates course
- [ ] POST `/api/courses/{id}/publish` publishes course
- [ ] POST `/api/courses/{id}/modules` adds module
- [ ] GET `/api/courses/instructor/{id}` returns instructor's courses

### **Frontend Testing**
- [ ] `/courses` page loads and displays courses
- [ ] Filter and search work correctly
- [ ] `/dashboard/instructor` loads for instructor users
- [ ] Can create new course via form
- [ ] Can edit existing course
- [ ] Can add modules and lessons
- [ ] Can publish course
- [ ] Newly published course appears in `/courses` browsing

### **Role-Based Testing**
- [ ] Non-instructor cannot access `/dashboard/instructor`
- [ ] Instructor sees "Create Course" button
- [ ] Student sees course enrollment button
- [ ] Admin can access all dashboards

---

## 📞 NEXT STEPS

1. **Decide:** Do you want to implement this yourself or have me do it?
2. **Priority:** Which phase is most critical for your needs?
3. **Test Data:** Should I create the sample courses in MongoDB first?
4. **Design:** Are you happy with the proposed UI layout or need adjustments?

---

## 📚 RELATED DOCUMENTS

- [PROJECT_STATUS.md](PROJECT_STATUS.md) - Overall project status
- [TESTING_GUIDE.md](TESTING_GUIDE.md) - How to test the platform
- [BACKEND_IMPLEMENTATION_GUIDE.md](BACKEND_IMPLEMENTATION_GUIDE.md) - Backend implementation details
- [FRONTEND_IMPLEMENTATION_GUIDE.md](FRONTEND_IMPLEMENTATION_GUIDE.md) - Frontend implementation details
- [TEST_DATA.md](TEST_DATA.md) - Test credentials and data


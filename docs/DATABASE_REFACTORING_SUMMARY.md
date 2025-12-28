# Database Refactoring Summary - Job Categories and Experience Levels

**Date:** December 28, 2024  
**Status:** Implementation Complete - Testing in Progress  
**Author:** GitHub Copilot

## Overview

Refactored the job management system to use proper normalized database tables for categories and experience levels, replacing string-based storage with foreign key relationships following database best practices.

## Changes Summary

### Database Changes

#### New Tables Created

1. **job_categories** - Stores all available job categories
   - `id` (BIGSERIAL PRIMARY KEY)
   - `name` (VARCHAR(100) NOT NULL)
   - `slug` (VARCHAR(100) UNIQUE NOT NULL) - URL-friendly identifier
   - `description` (TEXT)
   - `icon` (VARCHAR(50)) - Icon identifier for UI
   - `is_active` (BOOLEAN DEFAULT TRUE) - Soft delete support
   - `display_order` (INTEGER DEFAULT 0) - For UI ordering
   - `created_at` (TIMESTAMP)
   - `updated_at` (TIMESTAMP)
   - Indexes: `idx_job_categories_slug`, `idx_job_categories_active`

2. **experience_levels** - Stores experience level definitions
   - `id` (BIGSERIAL PRIMARY KEY)
   - `name` (VARCHAR(50) NOT NULL)
   - `code` (VARCHAR(20) UNIQUE NOT NULL) - ENTRY, INTERMEDIATE, EXPERT
   - `description` (TEXT)
   - `years_min` (INTEGER) - Minimum years of experience
   - `years_max` (INTEGER) - Maximum years of experience
   - `is_active` (BOOLEAN DEFAULT TRUE)
   - `display_order` (INTEGER DEFAULT 0)
   - `created_at` (TIMESTAMP)
   - `updated_at` (TIMESTAMP)
   - Indexes: `idx_experience_levels_code`

#### Jobs Table Modifications

**Added columns:**
- `category_id` (BIGINT) - Foreign key to job_categories
- `experience_level_id` (BIGINT) - Foreign key to experience_levels

**Retained columns (for backward compatibility):**
- `category` (VARCHAR(50)) - Old string-based category
- `experience_level` (VARCHAR(20)) - Old enum-based experience level

**Foreign Key Constraints:**
- `fk_jobs_category` - jobs.category_id → job_categories.id
- `fk_jobs_experience_level` - jobs.experience_level_id → experience_levels.id

**New Indexes:**
- `idx_jobs_category_id` - For filtering by category
- `idx_jobs_experience_level_id` - For filtering by experience level

### Migration Scripts

1. **V2__create_job_categories_table.sql**
   - Creates job_categories table with all columns and indexes
   
2. **V3__insert_job_categories_data.sql**
   - Populates 10 initial categories:
     - Web Development, Mobile Apps, Design, Writing & Translation
     - Marketing, Data Science, DevOps & Cloud, Business
     - Legal & Compliance, Other

3. **V4__create_experience_levels_table.sql**
   - Creates experience_levels table
   
4. **V5__insert_experience_levels_data.sql**
   - Populates 3 experience levels:
     - Entry Level (0-2 years)
     - Intermediate (2-5 years)
     - Expert (5+ years)

5. **V6__alter_jobs_table_add_foreign_keys.sql**
   - Adds new FK columns to jobs table
   - Migrates existing data:
     - Maps old category strings to new category IDs
     - Maps old experience level enums to new experience level IDs
   - Adds foreign key constraints
   - Renames old columns to `*_old` for safety
   - Updates indexes

### Backend Changes

#### New Entity Classes

1. **JobCategory.java** (`com.designer.marketplace.entity.JobCategory`)
   ```java
   @Entity
   @Table(name = "job_categories")
   public class JobCategory {
       private Long id;
       private String name;
       private String slug;
       private String description;
       private String icon;
       private Boolean isActive;
       private Integer displayOrder;
       private LocalDateTime createdAt;
       private LocalDateTime updatedAt;
   }
   ```

2. **ExperienceLevel.java** (`com.designer.marketplace.entity.ExperienceLevel`)
   ```java
   @Entity
   @Table(name = "experience_levels")
   public class ExperienceLevel {
       private Long id;
       private String name;
       private String code;
       private String description;
       private Integer yearsMin;
       private Integer yearsMax;
       private Boolean isActive;
       private Integer displayOrder;
       private LocalDateTime createdAt;
       private LocalDateTime updatedAt;
   }
   ```

#### Updated Entity

**Job.java** - Modified to use foreign key relationships:
```java
// NEW: Foreign key relationships
@ManyToOne(fetch = FetchType.LAZY)
@JoinColumn(name = "category_id")
private JobCategory jobCategory;

@ManyToOne(fetch = FetchType.LAZY)
@JoinColumn(name = "experience_level_id")
private ExperienceLevel experienceLevelEntity;

// OLD: Kept for backward compatibility
@Column(length = 50)
private String category;

@Enumerated(EnumType.STRING)
@Column(name = "experience_level", length = 20)
private ExperienceLevelEnum experienceLevel;
```

#### New Repository Interfaces

1. **JobCategoryRepository.java**
   - `findBySlug(String slug)`
   - `findAllActiveCategories()` - Returns only active categories
   - `findByNameContainingIgnoreCase(String name)`

2. **ExperienceLevelRepository.java**
   - `findByCode(String code)`
   - `findAllActiveExperienceLevels()`

#### Updated Repository

**JobRepository.java** - Modified query methods:
```java
// OLD
Page<Job> findByCategory(String category, Pageable pageable);

// NEW
Page<Job> findByJobCategoryId(Long categoryId, Pageable pageable);

// Updated JPQL query to use foreign keys
@Query("SELECT j FROM Job j WHERE j.status = :status AND " +
       "(:categoryId IS NULL OR j.jobCategory.id = :categoryId) AND " +
       "(:experienceLevelId IS NULL OR j.experienceLevelEntity.id = :experienceLevelId)")
Page<Job> findByFilters(...);
```

#### New DTO Classes

1. **JobCategoryResponse.java**
   ```java
   public class JobCategoryResponse {
       private Long id;
       private String name;
       private String slug;
       private String description;
       private String icon;
       private Integer displayOrder;
       
       public static JobCategoryResponse fromEntity(JobCategory category);
   }
   ```

2. **ExperienceLevelResponse.java**
   ```java
   public class ExperienceLevelResponse {
       private Long id;
       private String name;
       private String code;
       private String description;
       private Integer yearsMin;
       private Integer yearsMax;
       private Integer displayOrder;
       
       public static ExperienceLevelResponse fromEntity(ExperienceLevel level);
   }
   ```

#### Updated DTOs

1. **JobResponse.java**
   ```java
   // OLD
   private String category;
   private String experienceLevel;
   
   // NEW
   private JobCategoryResponse category;
   private ExperienceLevelResponse experienceLevel;
   ```

2. **CreateJobRequest.java**
   ```java
   // OLD
   private String category;
   private String experienceLevel;
   
   // NEW
   private Long categoryId;
   private Long experienceLevelId;
   ```

3. **UpdateJobRequest.java**
   ```java
   // OLD
   private String category;
   private String experienceLevel;
   
   // NEW
   private Long categoryId;
   private Long experienceLevelId;
   ```

#### New Service Classes

1. **JobCategoryService.java**
   - `getAllActiveCategories()` - Get all active categories
   - `getCategoryById(Long id)` - Get category by ID
   - `getCategoryEntityById(Long id)` - Get entity for internal use
   - `getCategoryBySlug(String slug)` - Get by URL slug
   - `getAllCategories()` - Get all (including inactive)

2. **ExperienceLevelService.java**
   - `getAllActiveExperienceLevels()` - Get all active levels
   - `getExperienceLevelById(Long id)` - Get by ID
   - `getExperienceLevelEntityById(Long id)` - Get entity for internal use
   - `getExperienceLevelByCode(String code)` - Get by code (ENTRY, etc.)
   - `getAllExperienceLevels()` - Get all (including inactive)

#### Updated Service

**JobService.java** - Modified to use new entities:
```java
// Updated constructor to inject new services
private final JobCategoryService categoryService;
private final ExperienceLevelService experienceLevelService;

// Updated method signatures
public Page<JobResponse> getJobs(
    Long categoryId,  // Changed from String category
    Long experienceLevelId,  // Changed from String experienceLevel
    ...
);

// Updated job creation
if (request.getCategoryId() != null) {
    job.setJobCategory(categoryService.getCategoryEntityById(request.getCategoryId()));
}
if (request.getExperienceLevelId() != null) {
    job.setExperienceLevelEntity(experienceLevelService.getExperienceLevelEntityById(request.getExperienceLevelId()));
}
```

#### New Controller Classes

1. **JobCategoryController.java** - `/api/job-categories`
   - `GET /` - Get all categories
   - `GET /{id}` - Get category by ID
   - `GET /slug/{slug}` - Get category by slug
   - `GET /active` - Get only active categories (for dropdowns)
   - `GET /search?query=...` - Search categories by name

2. **ExperienceLevelController.java** - `/api/experience-levels`
   - `GET /` - Get all experience levels
   - `GET /{id}` - Get experience level by ID
   - `GET /code/{code}` - Get by code (ENTRY, INTERMEDIATE, EXPERT)

#### Updated Controller

**JobController.java** - Modified parameters:
```java
// OLD
@GetMapping
public ResponseEntity<Page<JobResponse>> getJobs(
    @RequestParam(required = false) String category,
    @RequestParam(required = false) String experienceLevel,
    ...
);

// NEW
@GetMapping
public ResponseEntity<Page<JobResponse>> getJobs(
    @RequestParam(required = false) Long categoryId,
    @RequestParam(required = false) Long experienceLevelId,
    ...
);
```

### API Changes

#### New Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/job-categories` | Get all job categories |
| GET | `/api/job-categories/{id}` | Get specific category |
| GET | `/api/job-categories/slug/{slug}` | Get category by slug |
| GET | `/api/job-categories/active` | Get active categories |
| GET | `/api/job-categories/search?query=...` | Search categories |
| GET | `/api/experience-levels` | Get all experience levels |
| GET | `/api/experience-levels/{id}` | Get specific level |
| GET | `/api/experience-levels/code/{code}` | Get level by code |

#### Modified Endpoints

**GET `/api/jobs`** - Updated query parameters:
```
OLD: ?category=web&experienceLevel=intermediate
NEW: ?categoryId=1&experienceLevelId=2
```

**Response format changed:**
```json
// OLD
{
  "category": "Web Development",
  "experienceLevel": "INTERMEDIATE"
}

// NEW
{
  "category": {
    "id": 1,
    "name": "Web Development",
    "slug": "web-development",
    "description": "...",
    "icon": "Code",
    "displayOrder": 1
  },
  "experienceLevel": {
    "id": 2,
    "name": "Intermediate",
    "code": "INTERMEDIATE",
    "description": "...",
    "yearsMin": 2,
    "yearsMax": 5,
    "displayOrder": 2
  }
}
```

**POST `/api/jobs`** - Updated request body:
```json
// OLD
{
  "category": "Web Development",
  "experienceLevel": "INTERMEDIATE"
}

// NEW
{
  "categoryId": 1,
  "experienceLevelId": 2
}
```

## Benefits

1. **Data Integrity**: Foreign key constraints ensure referential integrity
2. **Centralized Management**: Categories and experience levels managed in single location
3. **Rich Metadata**: Support for descriptions, icons, ordering, soft deletes
4. **Scalability**: Easy to add new categories/levels without code changes
5. **Performance**: Indexed foreign keys improve query performance
6. **Maintainability**: Normalized design follows database best practices
7. **Backward Compatibility**: Old columns retained during migration period

## Pending Tasks

### Backend
- [ ] Update test file (JobServiceTest.java) to use new constructor and parameters
- [ ] Update SecurityConfig to allow access to new endpoints
- [ ] Test all job-related endpoints with new structure
- [ ] Verify Flyway migrations applied correctly
- [ ] Test data migration for existing jobs

### Frontend
- [ ] Update API service layer to call new endpoints
- [ ] Update job list page filters to use categoryId
- [ ] Update job creation form to use dropdown with IDs
- [ ] Update job detail page to display nested category/level objects
- [ ] Test end-to-end workflow

### Documentation
- [ ] Update API documentation with new endpoints
- [ ] Create migration rollback procedure
- [ ] Document breaking changes for API consumers

## Migration Path

### Phase 1: Database Migration (COMPLETED)
- ✅ Create new tables
- ✅ Populate initial data
- ✅ Add foreign keys to jobs table
- ✅ Migrate existing data
- ✅ Keep old columns for safety

### Phase 2: Backend Implementation (COMPLETED)
- ✅ Create entity classes
- ✅ Create repositories
- ✅ Create services
- ✅ Create controllers
- ✅ Update DTOs
- ✅ Update existing services
- ⏳ Fix tests
- ⏳ Update security configuration

### Phase 3: Frontend Integration (PENDING)
- ⏳ Update API calls
- ⏳ Update UI components
- ⏳ Test user workflows

### Phase 4: Cleanup (FUTURE)
- ⏳ Remove old `category` and `experience_level` columns
- ⏳ Update indexes to remove old column references
- ⏳ Remove backward compatibility code

## Rollback Procedure

If issues arise, rollback can be performed:

1. Revert application code to previous version
2. Run migration to drop foreign keys
3. Restore old columns from `*_old` columns
4. Drop new tables if desired

SQL for rollback:
```sql
-- Restore old columns
UPDATE jobs SET category = category_old, experience_level = experience_level_old;

-- Drop foreign keys
ALTER TABLE jobs DROP CONSTRAINT fk_jobs_category;
ALTER TABLE jobs DROP CONSTRAINT fk_jobs_experience_level;

-- Drop new columns
ALTER TABLE jobs DROP COLUMN category_id;
ALTER TABLE jobs DROP COLUMN experience_level_id;

-- Optionally drop new tables
DROP TABLE job_categories;
DROP TABLE experience_levels;
```

## Testing Checklist

### Backend Tests
- [ ] Test category CRUD operations
- [ ] Test experience level CRUD operations
- [ ] Test job creation with new IDs
- [ ] Test job filtering by categoryId
- [ ] Test job filtering by experienceLevelId
- [ ] Test job search still works
- [ ] Test job updates with new structure

### Integration Tests
- [ ] Test Flyway migrations on clean database
- [ ] Test data migration with existing jobs
- [ ] Test foreign key constraints
- [ ] Test API responses match expected format

### Frontend Tests
- [ ] Test category dropdown population
- [ ] Test experience level dropdown population
- [ ] Test job creation with selected category/level
- [ ] Test job filtering
- [ ] Test job detail display

## Known Issues

1. **SecurityConfig Update Needed**: New endpoints return 403 Forbidden
   - Solution: Add `/api/job-categories/**` and `/api/experience-levels/**` to permitAll() list

2. **Test Files Need Update**: JobServiceTest.java uses old constructor
   - Solution: Update test to mock new services

3. **Nullable Constraints**: Made FK columns nullable temporarily
   - Solution: After data migration verified, can make non-nullable

## Files Modified

### Migration Scripts (New)
- `db/migration/V2__create_job_categories_table.sql`
- `db/migration/V3__insert_job_categories_data.sql`
- `db/migration/V4__create_experience_levels_table.sql`
- `db/migration/V5__insert_experience_levels_data.sql`
- `db/migration/V6__alter_jobs_table_add_foreign_keys.sql`

### Entity Classes
- `entity/Job.java` (Modified)
- `entity/JobCategory.java` (New)
- `entity/ExperienceLevel.java` (New)

### Repository Classes
- `repository/JobRepository.java` (Modified)
- `repository/JobCategoryRepository.java` (New)
- `repository/ExperienceLevelRepository.java` (New)

### Service Classes
- `service/JobService.java` (Modified)
- `service/JobCategoryService.java` (New)
- `service/ExperienceLevelService.java` (New)

### Controller Classes
- `controller/JobController.java` (Modified)
- `controller/JobCategoryController.java` (New)
- `controller/ExperienceLevelController.java` (New)

### DTO Classes
- `dto/JobResponse.java` (Modified)
- `dto/CreateJobRequest.java` (Modified)
- `dto/UpdateJobRequest.java` (Modified)
- `dto/JobCategoryResponse.java` (New)
- `dto/ExperienceLevelResponse.java` (New)

## Conclusion

This refactoring significantly improves the database design by following normalization best practices. The use of separate lookup tables with foreign keys provides better data integrity, centralized management, and scalability for future enhancements.

The implementation maintains backward compatibility during the migration period, allowing for a smooth transition. Once the frontend is updated and tested, the old columns can be safely removed.

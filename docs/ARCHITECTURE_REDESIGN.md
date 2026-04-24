# Marketplace Architecture: User-Company Relationship Redesign

**Problem Statement**: Current one-to-one User→Company relationship is confusing, requires JOINs for permission checks, and doesn't support users with multiple roles.

---

## Current Architecture (Problematic)

### Schema
```
┌──────────────────────┐          ┌──────────────────────┐
│ users                │          │ companies            │
├──────────────────────┤          ├──────────────────────┤
│ id (PK)              │          │ id (PK)              │
│ email                │◄────────┤│ user_id (FK) UNIQUE  │
│ username             │          │ company_name         │
│ role (ENUM)          │          │ industry             │
│   - FREELANCER       │          └──────────────────────┘
│   - COMPANY          │
│   - ADMIN            │          ┌──────────────────────┐
└──────────────────────┘          │ jobs                 │
                                  ├──────────────────────┤
                                  │ id (PK)              │
                                  │ company_id (FK)      │
                                  │ title                │
                                  └──────────────────────┘
```

### Problems

1. **Slow Permission Checks**
   ```java
   // Every operation requires JOIN
   Company company = companyRepository.findByUserId(userId)
       .orElseThrow(); // What if company not found?
   
   if (!job.getCompany().getId().equals(company.getId())) {
       throw new SecurityException("Forbidden");
   }
   ```

2. **Single Role Limitation**
   - User can't be both freelancer AND company owner
   - Real world: Many freelancers also run companies

3. **Fragile Data Integrity**
   - If company record deleted, user loses permission
   - No way to recover from missing company profile

4. **Confusing Ownership Model**
   - Jobs belong to companies
   - But companies belong to users (one-to-one)
   - What about company teams?

---

## Recommended Architecture (Industry Standard)

### Design Principles

✅ **Separation of Concerns**: Identity vs Business Entity  
✅ **Flexibility**: Multi-role support  
✅ **Performance**: O(1) permission checks  
✅ **Scalability**: Supports teams and organizations  

### Schema

```sql
-- ═══════════════════════════════════════════════════════════
-- IDENTITY LAYER (Authentication)
-- ═══════════════════════════════════════════════════════════

CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    full_name VARCHAR(255),
    profile_image_url TEXT,
    
    -- Denormalized references (for O(1) lookups)
    company_id BIGINT,        -- Primary company this user owns/works for
    freelancer_id BIGINT,     -- Freelancer profile if user is freelancer
    
    is_active BOOLEAN DEFAULT true,
    email_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    CONSTRAINT fk_users_company FOREIGN KEY (company_id) 
        REFERENCES companies(id) ON DELETE SET NULL,
    CONSTRAINT fk_users_freelancer FOREIGN KEY (freelancer_id) 
        REFERENCES freelancers(id) ON DELETE SET NULL
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_company_id ON users(company_id);
CREATE INDEX idx_users_freelancer_id ON users(freelancer_id);


-- ═══════════════════════════════════════════════════════════
-- ROLE-BASED ACCESS CONTROL (RBAC)
-- ═══════════════════════════════════════════════════════════

CREATE TABLE user_roles (
    user_id BIGINT NOT NULL,
    role VARCHAR(50) NOT NULL,  -- 'FREELANCER', 'COMPANY', 'ADMIN'
    granted_at TIMESTAMP DEFAULT NOW(),
    granted_by_user_id BIGINT REFERENCES users(id),
    
    PRIMARY KEY (user_id, role),
    CONSTRAINT fk_user_roles_user FOREIGN KEY (user_id) 
        REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_user_roles_role ON user_roles(role);


-- ═══════════════════════════════════════════════════════════
-- BUSINESS ENTITIES
-- ═══════════════════════════════════════════════════════════

CREATE TABLE companies (
    id BIGSERIAL PRIMARY KEY,
    company_name VARCHAR(255) NOT NULL,
    industry VARCHAR(100),
    company_size VARCHAR(50),
    description TEXT,
    logo_url TEXT,
    website_url TEXT,
    
    -- Creator (not necessarily current owner)
    created_by_user_id BIGINT NOT NULL REFERENCES users(id),
    
    total_jobs_posted INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_companies_created_by ON companies(created_by_user_id);


-- Company team members (supports multiple admins)
CREATE TABLE company_users (
    company_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    role VARCHAR(50) NOT NULL,  -- 'OWNER', 'ADMIN', 'MEMBER', 'HIRING_MANAGER'
    joined_at TIMESTAMP DEFAULT NOW(),
    invited_by_user_id BIGINT REFERENCES users(id),
    
    PRIMARY KEY (company_id, user_id),
    CONSTRAINT fk_company_users_company FOREIGN KEY (company_id) 
        REFERENCES companies(id) ON DELETE CASCADE,
    CONSTRAINT fk_company_users_user FOREIGN KEY (user_id) 
        REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_company_users_user_id ON company_users(user_id);
CREATE INDEX idx_company_users_role ON company_users(company_id, role);


CREATE TABLE freelancers (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255),
    bio TEXT,
    hourly_rate_cents BIGINT,
    experience_years INT,
    skills JSONB,
    portfolio_url TEXT,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_freelancers_user_id ON freelancers(user_id);


-- ═══════════════════════════════════════════════════════════
-- JOBS (Belong to companies)
-- ═══════════════════════════════════════════════════════════

CREATE TABLE jobs (
    id BIGSERIAL PRIMARY KEY,
    company_id BIGINT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'DRAFT',  -- 'DRAFT', 'OPEN', 'CLOSED'
    
    -- Audit fields
    created_by_user_id BIGINT REFERENCES users(id),
    updated_by_user_id BIGINT REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_jobs_company_id ON jobs(company_id);
CREATE INDEX idx_jobs_status ON jobs(status);
CREATE INDEX idx_jobs_created_by ON jobs(created_by_user_id);
```

---

## Permission Check Logic

### Fast Permission Check (O(1) - No Joins)

```java
@Service
public class PermissionService {
    
    /**
     * Check if user can edit a job
     * O(1) complexity - uses denormalized company_id
     */
    public void requireJobEditPermission(Long userId, Job job) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new UnauthorizedException("User not found"));
        
        // ✅ INSTANT CHECK: No database query needed!
        if (user.getCompanyId() == null) {
            throw new ForbiddenException("No company profile associated with your account");
        }
        
        // ✅ DIRECT COMPARISON: No JOIN needed!
        if (!job.getCompanyId().equals(user.getCompanyId())) {
            throw new ForbiddenException("This job belongs to a different company");
        }
        
        // Optional: Check company membership role
        // (only needed if you want role-based permissions within company)
        CompanyUser membership = companyUserRepository
            .findByCompanyIdAndUserId(user.getCompanyId(), userId)
            .orElseThrow(() -> new ForbiddenException("Not a member of this company"));
        
        if (!membership.getRole().equals("OWNER") && 
            !membership.getRole().equals("ADMIN")) {
            throw new ForbiddenException("Insufficient permissions in company");
        }
    }
}
```

### Updated JobService

```java
@Service
public class JobService {
    
    @Autowired
    private PermissionService permissionService;
    
    @Transactional
    public JobResponse updateJob(Long userId, Long jobId, UpdateJobRequest request) {
        Job job = jobRepository.findById(jobId)
            .orElseThrow(() -> new ResourceNotFoundException("Job not found"));
        
        // ✅ Fast permission check
        permissionService.requireJobEditPermission(userId, job);
        
        // Update job fields...
        job.setTitle(request.getTitle());
        job.setDescription(request.getDescription());
        job.setUpdatedByUserId(userId);
        
        return JobResponse.from(jobRepository.save(job));
    }
}
```

---

## Migration Strategy

### Phase 1: Add Denormalized Columns (Non-Breaking)

```sql
-- Add columns without dropping existing structure
ALTER TABLE users ADD COLUMN company_id BIGINT;
ALTER TABLE users ADD COLUMN freelancer_id BIGINT;

-- Backfill existing data
UPDATE users u
SET company_id = c.id
FROM companies c
WHERE c.user_id = u.id;

UPDATE users u
SET freelancer_id = f.id
FROM freelancers f
WHERE f.user_id = u.id;

-- Add constraints
ALTER TABLE users ADD CONSTRAINT fk_users_company 
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE SET NULL;
ALTER TABLE users ADD CONSTRAINT fk_users_freelancer 
    FOREIGN KEY (freelancer_id) REFERENCES freelancers(id) ON DELETE SET NULL;

CREATE INDEX idx_users_company_id ON users(company_id);
CREATE INDEX idx_users_freelancer_id ON users(freelancer_id);
```

### Phase 2: Add RBAC Tables (Additive)

```sql
-- Create user_roles table
CREATE TABLE user_roles (
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL,
    granted_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (user_id, role)
);

-- Migrate existing roles from users.role ENUM
INSERT INTO user_roles (user_id, role)
SELECT id, role::TEXT FROM users;
```

### Phase 3: Update Code (Gradual)

```java
// Update AuthService to set back-references
if ("COMPANY".equals(request.getRole())) {
    Company company = new Company();
    company.setUser(user);
    company.setCreatedByUserId(user.getId());
    company = companyRepository.save(company);
    
    // ✅ Set back-reference
    user.setCompany(company);
    user.setCompanyId(company.getId());
    
    // ✅ Add to RBAC
    userRoleRepository.save(new UserRole(user.getId(), "COMPANY"));
}
```

### Phase 4: Remove Old Structure (Optional)

```sql
-- After all code updated, remove old columns
ALTER TABLE companies DROP COLUMN user_id;
ALTER TABLE users DROP COLUMN role;
```

---

## Benefits Summary

| Aspect | Before (Current) | After (Recommended) |
|--------|-----------------|---------------------|
| Permission Check | O(n) JOIN query | O(1) direct comparison |
| Multi-role Support | ❌ No | ✅ Yes |
| Team Support | ❌ No | ✅ Yes (company_users) |
| Data Integrity | ❌ Fragile | ✅ Robust |
| Query Complexity | ❌ High | ✅ Low |
| 403 Error Risk | ❌ High (missing records) | ✅ Low (denormalized) |

---

## Industry Examples

- **AWS IAM**: Users have roles, roles have permissions
- **GitHub**: Users can belong to multiple organizations
- **Stripe**: Users can manage multiple accounts/businesses
- **Shopify**: Shop owners are users with shop_id reference
- **Slack**: Users can be in multiple workspaces

All use similar patterns: Identity separate from business entity, with denormalized references for fast lookups.

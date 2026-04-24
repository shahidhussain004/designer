# Quick Fix: Add Denormalized Company/Freelancer IDs to User Table

## Problem
Current architecture requires JOIN query for every permission check:
```sql
SELECT c.* FROM companies c WHERE c.user_id = ?
```
If company record is missing, user gets 403 error when trying to edit jobs.

## Solution: Add Back-References

### Step 1: Database Migration

```sql
-- Add denormalized foreign keys
ALTER TABLE users ADD COLUMN company_id BIGINT;
ALTER TABLE users ADD COLUMN freelancer_id BIGINT;

-- Add foreign key constraints
ALTER TABLE users 
    ADD CONSTRAINT fk_users_company 
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE SET NULL;

ALTER TABLE users 
    ADD CONSTRAINT fk_users_freelancer 
    FOREIGN KEY (freelancer_id) REFERENCES freelancers(id) ON DELETE SET NULL;

-- Add indexes for performance
CREATE INDEX idx_users_company_id ON users(company_id);
CREATE INDEX idx_users_freelancer_id ON users(freelancer_id);

-- Backfill existing data
UPDATE users u
SET company_id = c.id
FROM companies c
WHERE c.user_id = u.id;

UPDATE users u
SET freelancer_id = f.id
FROM freelancers f
WHERE f.user_id = u.id;
```

### Step 2: Update User Entity

```java
@Entity
@Table(name = "users")
public class User {
    // ... existing fields ...
    
    @Column(name = "company_id", insertable = false, updatable = false)
    private Long companyId;
    
    @Column(name = "freelancer_id", insertable = false, updatable = false)
    private Long freelancerId;
    
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id")
    private Company company;
    
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "freelancer_id")
    private Freelancer freelancer;
    
    // Getters and setters...
}
```

### Step 3: Update Registration Logic

```java
// In AuthService.register()
if ("COMPANY".equals(request.getRole())) {
    Company company = new Company();
    company.setUser(user);
    company.setCompanyName(user.getUsername() + "'s Company");
    company = companyRepository.save(company);
    
    // ✅ ADD THIS: Set back-reference
    user.setCompany(company);
    user.setCompanyId(company.getId());
    userRepository.save(user);
}
```

### Step 4: Simplify Permission Checks

```java
// BEFORE (slow - requires JOIN)
Company company = companyRepository.findByUserId(userId)
    .orElseThrow(() -> new ResourceNotFoundException("Company not found"));

// AFTER (fast - direct reference)
User user = userRepository.findById(userId).orElseThrow(...);
if (user.getCompanyId() == null) {
    throw new ForbiddenException("No company profile associated with your account");
}
Long companyId = user.getCompanyId();
```

## Benefits
- ✅ Fixes 403 errors by making company lookups reliable
- ✅ O(1) permission checks (no joins)
- ✅ Backward compatible with existing code
- ✅ Can be done incrementally

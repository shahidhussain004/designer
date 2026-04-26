# Portfolio Item API - Root Cause Analysis & Fix

## The Problem

Users experienced a **500 Internal Server Error** when creating portfolio items via `POST /api/portfolio-items`.

**Error Response:**
```json
{
  "status": 500,
  "error": "INTERNAL_ERROR",  
  "message": "An unexpected error occurred",
  "timestamp": 1776884981029
}
```

**Actual Root Cause** (found in backend logs):
```
ERROR: null value in column "images" of relation "portfolio_items" violates not-null constraint
```

## Why It Happened

The database migration (`V14__create_portfolio_time_tracking_tables.sql`) defined four JSONB columns with `NOT NULL` constraints and default `'[]'::jsonb`:

```sql
images JSONB DEFAULT '[]'::jsonb NOT NULL,
technologies JSONB DEFAULT '[]'::jsonb NOT NULL,
tools_used JSONB DEFAULT '[]'::jsonb NOT NULL,
skills_demonstrated JSONB DEFAULT '[]'::jsonb NOT NULL,
```

However:
1. Frontend requests often didn't include these fields (or sent them as null)
2. The service's `applyRequest()` method had conditional logic: `if (req.getTechnologies() != null) { item.setTechnologies(...) }`
3. When optional fields weren't in the request, Hibernate tried to persist them as `NULL`
4. PostgreSQL rejected the NULL values due to NOT NULL constraints

**Example Failing SQL** (from logs):
```sql
update portfolio_items set 
  ...
  images=(NULL),           -- ❌ Violates constraint
  technologies=(NULL),     -- ❌ Violates constraint
  tools_used=(NULL),       -- ❌ Violates constraint
  skills_demonstrated=(NULL) -- ❌ Violates constraint
  ...
```

## The Solution

Modified `PortfolioService.applyRequest()` to ensure JSONB fields are **never NULL**:

```java
// Handle images: if provided, use it; otherwise keep as empty array
if (req.getImages() != null) {
    item.setImages(req.getImages());
} else if (item.getImages() == null) {
    item.setImages(objectMapper.createArrayNode());  // ← Empty array default
}

// Convert List<String> → JsonNode (JSONB in Postgres)
// If not provided, keep as empty array to satisfy NOT NULL constraint
if (req.getTechnologies() != null) {
    item.setTechnologies(objectMapper.valueToTree(req.getTechnologies()));
} else if (item.getTechnologies() == null) {
    item.setTechnologies(objectMapper.createArrayNode());
}

// ... same for toolsUsed and skillsDemonstrated
```

This ensures:
- If field is in request → use it
- If field is missing → use empty array `[]`
- Never sets NULL → database constraints satisfied ✅

## Files Changed

1. **PortfolioService.java** - Updated `applyRequest()` method with null-safe JSONB handling
2. JAR rebuilt with fixes

## Testing

✅ **Test 1: Full request with all fields**
```bash
POST /api/portfolio-items
{
  "title": "Ecommerce website",
  "description": "Website development...",
  "technologies": ["React"],
  "toolsUsed": ["Photoshop", "Figma"],
  "skillsDemonstrated": ["Website design"],
  ...
  "userId": 349
}
```
**Result:** 201 Created ✅ (ID: 157)

✅ **Test 2: Minimal request (no arrays)**
```bash
POST /api/portfolio-items
{
  "title": "E-learning platform",
  "description": "Mobile app for courses",
  "userId": 349
}
```
**Result:** 201 Created ✅ (ID: 158)

Both tests confirm JSONB fields are defaulted to empty arrays when omitted.

## Key Learnings

1. **Assumption #1 (WRONG):** "Compilation check = runtime works" 
   - Code compiled fine, but runtime constraints weren't met
   - **Fix**: Always test actual runtime scenarios

2. **Assumption #2 (WRONG):** "DTOs are correctly bound"
   - Controller signature was updated but payload structure wasn't verified
   - **Fix**: Capture actual HTTP request/response to identify mismatches

3. **Root Cause:** NOT NULL constraints without Hibernate-level defaults
   - Hibernate doesn't automatically use database defaults
   - Must handle nullability in application logic
   - **Fix**: Apply business logic defaults in service layer before persistence

## Summary

**What was assumed to work:** ✗  
**What actually works:** ✓  
**Time to real diagnosis:** User reported issue → agent captured 500 error → looked at logs → found SQL constraint violation

The fix ensures portfolio items can be created with either full metadata (technologies, tools, skills) or minimal data, with empty arrays as sensible defaults for the omitted JSONB fields.

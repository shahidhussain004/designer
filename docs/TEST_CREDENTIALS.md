# Test Credentials

## Admin User (for testing)

**Email**: `admin@designermarket.com`  
**Password**: `Admin123!`  
**Role**: ADMIN

This user will be created automatically when the marketplace service starts (Flyway migration V10).

## Test Clients (from seed data)

All passwords are: `password123` (bcrypt hashed)

1. **client1@example.com** / `password123` - John Client (New York)
2. **client2@example.com** / `password123` - Sarah Johnson (London)
3. **client3@example.com** / `password123` - Mike Chen (Singapore)
4. **client4@example.com** / `password123` - Emma Davis (Sydney)
5. **client5@example.com** / `password123` - Alex Brown (San Francisco)

## Test Freelancers (from seed data)

All passwords are: `password123` (bcrypt hashed)

1. **freelancer1@example.com** / `password123` - Lisa Designer (Berlin) - UI/UX Expert
2. **freelancer2@example.com** / `password123` - James Developer (Toronto) - Full-stack Expert
3. **freelancer3@example.com** / `password123` - Maria Graphics (Barcelona) - Graphic Design Expert
4. **freelancer4@example.com** / `password123` - David Backend (Mumbai) - Backend Engineer
5. **freelancer5@example.com** / `password123` - Sophie Web (Paris) - Web Design Expert

## Test Jobs

10+ sample jobs are automatically seeded with categories:
- Web Design (featured)
- Mobile Design (featured)
- Web Development
- Branding
- Backend Development
- Graphic Design
- WordPress
- Photo Editing
- Email Design
- iOS Development (featured)

## Recommended Testing Flow

1. **Login as Admin**
   - Email: `admin@designermarket.com`
   - Password: `Admin123!`
   - Should see user name in header with dropdown

2. **Browse Jobs**
   - Should see 10+ jobs listed
   - Try all category filters
   - Try search functionality
   - Verify pagination works

3. **Login as Client**
   - Email: `client1@example.com`
   - Password: `password123`
   - Can create new jobs
   - Can view proposals from freelancers

4. **Login as Freelancer**
   - Email: `freelancer1@example.com`
   - Password: `password123`
   - Can submit proposals to jobs
   - Can view accepted contracts

## Notes

- All seed data is automatically created by Flyway migrations
- No manual database setup required
- Passwords are bcrypt hashed in the database
- Users are created with `email_verified = true` for development
- Safe to run migrations multiple times (uses `ON CONFLICT DO NOTHING`)

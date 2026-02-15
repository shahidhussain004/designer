# Admin Dashboard

React-based admin panel for the Designer Marketplace platform.

## Features

- **Dashboard**: Overview of platform statistics and recent activity
- **User Management**: View, suspend, activate, and delete users
- **Job Moderation**: Approve or reject pending job listings
- **Dispute Resolution**: Handle payment disputes between clients and freelancers
- **Analytics**: Charts and insights for platform performance

## Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **TailwindCSS** for styling
- **React Query** for data fetching and caching
- **Zustand** for state management
- **Chart.js** for analytics visualizations
- **React Router** for navigation
- **Axios** for API requests

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Backend services running (marketplace-service on port 8080)

### Installation

```bash
cd frontend/admin-dashboard
npm install
```

### Development

```bash
npm run dev
```

The app will start on http://localhost:3001

### Build for Production

```bash
npm run build
```

## Project Structure

```
src/
├── components/      # Reusable UI components
│   └── Layout.tsx   # Main layout with sidebar
├── lib/
│   └── api.ts       # API client and endpoints
├── pages/           # Page components
│   ├── Login.tsx    # Admin login
│   ├── Dashboard.tsx # Main dashboard
│   ├── Users.tsx    # User management
│   ├── Jobs.tsx     # Job moderation
│   ├── Disputes.tsx # Dispute resolution
│   └── Analytics.tsx # Analytics charts
├── store/
│   └── authStore.ts # Authentication state
├── App.tsx          # Routes and app structure
├── main.tsx         # Entry point
└── index.css        # Global styles
```

## API Endpoints

The dashboard connects to the following backend endpoints:

### Authentication
- `POST /api/auth/login` - Admin login

### Admin
- `GET /api/admin/dashboard/stats` - Dashboard statistics
- `GET /api/admin/activity/recent` - Recent activity

### Users
- `GET /api/admin/users` - List users (paginated)
- `PATCH /api/admin/users/:id/status` - Update user status
- `DELETE /api/admin/users/:id` - Delete user

### Jobs
- `GET /api/admin/jobs` - List jobs (paginated)
- `GET /api/admin/jobs/pending` - Pending moderation queue
- `POST /api/admin/jobs/:id/approve` - Approve job
- `POST /api/admin/jobs/:id/reject` - Reject job
- `DELETE /api/admin/jobs/:id` - Delete job

### Disputes
- `GET /api/admin/disputes` - List disputes (paginated)
- `POST /api/admin/disputes/:id/resolve` - Resolve dispute
- `POST /api/admin/disputes/:id/escalate` - Escalate dispute

### Analytics
- `GET /api/admin/analytics/users` - User growth data
- `GET /api/admin/analytics/revenue` - Revenue data
- `GET /api/admin/analytics/jobs` - Job statistics
- `GET /api/admin/analytics/categories` - Category distribution

## Environment Variables

Create a `.env` file for environment-specific configuration:

```env
VITE_API_URL=http://localhost:8080/api
```

## Demo Credentials

For testing purposes, you can login in two ways:

### Option 1: Auto-Login from Marketplace
1. Go to marketplace (http://localhost:3002)
2. Login with: admin@marketplace.com / password123
3. You'll be automatically redirected to admin dashboard and logged in

### Option 2: Direct Admin Dashboard Login
- Email: admin@marketplace.com
- Password: password123

## License

MIT

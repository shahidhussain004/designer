# Designer Marketplace API Reference

> Complete API documentation for integrating with the Designer Marketplace platform.

## Table of Contents

- [Overview](#overview)
- [Authentication](#authentication)
- [Endpoints](#endpoints)
  - [Auth](#auth-endpoints)
  - [Users](#user-endpoints)
  - [Designers](#designer-endpoints)
  - [Gigs](#gig-endpoints)
  - [Orders](#order-endpoints)
  - [Messages](#message-endpoints)
  - [Reviews](#review-endpoints)
  - [Categories](#category-endpoints)
  - [Admin](#admin-endpoints)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)
- [SDKs & Examples](#sdks--examples)

---

## Overview

### Base URLs

| Environment | URL |
|-------------|-----|
| Development | `http://localhost:8080/api` |
| Staging | `https://api.staging.designermarketplace.com` |
| Production | `https://api.designermarketplace.com` |

### Request Headers

```http
Content-Type: application/json
Accept: application/json
Authorization: Bearer <access_token>
```

### Response Format

All responses follow a consistent JSON structure:

```json
{
  "data": { ... },
  "meta": {
    "timestamp": "2024-01-15T10:30:00Z",
    "requestId": "req_abc123"
  }
}
```

### Pagination

List endpoints return paginated results:

```json
{
  "content": [...],
  "page": 0,
  "size": 20,
  "totalElements": 150,
  "totalPages": 8,
  "first": true,
  "last": false
}
```

Query parameters:
- `page` - Page number (0-indexed, default: 0)
- `size` - Items per page (default: 20, max: 100)

---

## Authentication

The API uses JWT (JSON Web Tokens) for authentication.

### Obtaining Tokens

```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "your-password"
}
```

**Response:**

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "tokenType": "Bearer",
  "expiresIn": 3600,
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

### Using Tokens

Include the access token in all authenticated requests:

```bash
curl -X GET https://api.designermarketplace.com/users/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Token Refresh

Access tokens expire after 1 hour. Use the refresh token to get a new access token:

```bash
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## Endpoints

### Auth Endpoints

#### Register User

```http
POST /api/auth/register
```

Create a new user account.

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `email` | string | Yes | Valid email address |
| `password` | string | Yes | Min 8 characters |
| `firstName` | string | Yes | Max 50 characters |
| `lastName` | string | Yes | Max 50 characters |
| `userType` | string | No | `BUYER` or `SELLER` (default: BUYER) |

**Example:**

```bash
curl -X POST https://api.designermarketplace.com/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123!",
    "firstName": "John",
    "lastName": "Doe",
    "userType": "BUYER"
  }'
```

**Response:** `201 Created`

```json
{
  "accessToken": "eyJ...",
  "refreshToken": "eyJ...",
  "tokenType": "Bearer",
  "expiresIn": 3600,
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

#### Login

```http
POST /api/auth/login
```

Authenticate and receive access tokens.

**Request Body:**

| Field | Type | Required |
|-------|------|----------|
| `email` | string | Yes |
| `password` | string | Yes |

#### Logout

```http
POST /api/auth/logout
```

Invalidate current session.

**Headers:** `Authorization: Bearer <token>` required

**Response:** `204 No Content`

#### Forgot Password

```http
POST /api/auth/forgot-password
```

Request password reset email.

**Request Body:**

| Field | Type | Required |
|-------|------|----------|
| `email` | string | Yes |

---

### User Endpoints

#### Get Current User

```http
GET /api/users/me
```

Get authenticated user's profile.

**Response:**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "john@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "displayName": "JohnD",
  "avatarUrl": "https://cdn.example.com/avatars/user.jpg",
  "userType": "SELLER",
  "isVerified": true,
  "createdAt": "2024-01-01T00:00:00Z"
}
```

#### Update Profile

```http
PUT /api/users/me
```

Update user profile information.

**Request Body:**

| Field | Type | Description |
|-------|------|-------------|
| `firstName` | string | Max 50 chars |
| `lastName` | string | Max 50 chars |
| `displayName` | string | Max 100 chars |
| `bio` | string | Max 500 chars |
| `avatarUrl` | string | Valid URL |

#### Get User by ID

```http
GET /api/users/{userId}
```

Get public profile of a user.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `userId` | UUID | User ID |

---

### Designer Endpoints

#### List Designers

```http
GET /api/designers
```

Get paginated list of designers with filtering.

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `page` | int | Page number (default: 0) |
| `size` | int | Items per page (default: 20) |
| `category` | string | Filter by category ID |
| `skills` | string | Comma-separated skills |
| `minRating` | float | Minimum rating (0-5) |
| `sortBy` | string | `rating`, `orders`, `joined`, `name` |
| `sortOrder` | string | `asc` or `desc` |

**Example:**

```bash
curl "https://api.designermarketplace.com/designers?category=logo-design&minRating=4.5&sortBy=rating"
```

#### Get Designer Profile

```http
GET /api/designers/{designerId}
```

Get detailed designer profile with portfolio and stats.

**Response:**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "displayName": "Jane Designer",
  "bio": "Professional graphic designer with 10+ years experience",
  "avatarUrl": "https://cdn.example.com/avatars/jane.jpg",
  "skills": ["Logo Design", "Brand Identity", "UI/UX"],
  "portfolio": [
    {
      "id": "item1",
      "title": "Brand Redesign",
      "imageUrl": "https://cdn.example.com/portfolio/1.jpg"
    }
  ],
  "stats": {
    "totalGigs": 15,
    "completedOrders": 234,
    "avgRating": 4.9,
    "totalReviews": 189,
    "responseTime": "1 hour"
  },
  "isOnline": true,
  "memberSince": "2022-06-15T00:00:00Z"
}
```

#### Update Designer Profile

```http
PUT /api/designers/me
```

Update own designer profile.

**Request Body:**

| Field | Type | Description |
|-------|------|-------------|
| `bio` | string | Max 1000 chars |
| `skills` | string[] | Max 15 skills |
| `categoryIds` | string[] | Category IDs |

---

### Gig Endpoints

#### Search Gigs

```http
GET /api/gigs
```

Search and filter gigs.

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `q` | string | Search query |
| `category` | string | Category ID |
| `subCategory` | string | Sub-category ID |
| `minPrice` | float | Minimum price |
| `maxPrice` | float | Maximum price |
| `deliveryTime` | int | Max delivery days |
| `designerId` | string | Filter by designer |
| `sortBy` | string | `relevance`, `price`, `rating`, `orders`, `newest` |

**Example:**

```bash
curl "https://api.designermarketplace.com/gigs?q=logo&minPrice=50&maxPrice=500&sortBy=rating"
```

#### Create Gig

```http
POST /api/gigs
```

Create a new gig listing (designers only).

**Request Body:**

```json
{
  "title": "I will design a professional logo for your business",
  "description": "Professional logo design with unlimited revisions...",
  "categoryId": "cat-logo-design",
  "packages": [
    {
      "type": "basic",
      "name": "Basic Logo",
      "description": "1 concept, PNG file",
      "price": 50.00,
      "deliveryDays": 3,
      "revisions": 2,
      "features": ["1 concept", "PNG file", "Source file"]
    },
    {
      "type": "standard",
      "name": "Standard Package",
      "description": "3 concepts, all file formats",
      "price": 100.00,
      "deliveryDays": 5,
      "revisions": 5,
      "features": ["3 concepts", "All file formats", "Brand guide"]
    }
  ],
  "tags": ["logo", "branding", "minimal"]
}
```

#### Get Gig Details

```http
GET /api/gigs/{gigId}
```

Get detailed gig information.

#### Update Gig

```http
PUT /api/gigs/{gigId}
```

Update an existing gig (owner only).

#### Delete Gig

```http
DELETE /api/gigs/{gigId}
```

Delete a gig (owner only).

**Response:** `204 No Content`

---

### Order Endpoints

#### List Orders

```http
GET /api/orders
```

Get orders for authenticated user.

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `role` | string | `buyer` or `seller` |
| `status` | string | Order status filter |

**Order Statuses:**
- `pending` - Awaiting payment
- `active` - In progress
- `delivered` - Awaiting acceptance
- `revision` - Revision requested
- `completed` - Order complete
- `cancelled` - Order cancelled
- `disputed` - Under dispute

#### Create Order

```http
POST /api/orders
```

Place a new order.

**Request Body:**

```json
{
  "gigId": "550e8400-e29b-41d4-a716-446655440000",
  "packageType": "standard",
  "requirements": "I need a logo for my tech startup..."
}
```

#### Deliver Order

```http
POST /api/orders/{orderId}/deliver
```

Submit delivery (seller only).

**Request Body:**

```json
{
  "message": "Here is your completed logo design!",
  "attachmentUrls": [
    "https://cdn.example.com/deliveries/logo.zip"
  ]
}
```

#### Accept Delivery

```http
POST /api/orders/{orderId}/accept
```

Accept delivery and complete order (buyer only).

#### Request Revision

```http
POST /api/orders/{orderId}/revise
```

Request revision on delivery (buyer only).

**Request Body:**

```json
{
  "message": "Could you please make the colors brighter?"
}
```

---

### Message Endpoints

#### List Conversations

```http
GET /api/conversations
```

Get all conversations for authenticated user.

#### Get Conversation

```http
GET /api/conversations/{conversationId}
```

Get conversation with messages.

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `page` | int | Page number |
| `size` | int | Messages per page |

#### Send Message

```http
POST /api/conversations/{conversationId}/messages
```

Send a message in existing conversation.

**Request Body:**

```json
{
  "content": "Hello, I'm interested in your service!",
  "attachmentIds": []
}
```

#### Start New Conversation

```http
POST /api/messages/new
```

Start a new conversation with a user.

**Request Body:**

```json
{
  "recipientId": "550e8400-e29b-41d4-a716-446655440000",
  "message": "Hi, I have a question about your gig..."
}
```

---

### Review Endpoints

#### Create Review

```http
POST /api/reviews
```

Create a review for completed order.

**Request Body:**

```json
{
  "orderId": "550e8400-e29b-41d4-a716-446655440000",
  "rating": 5,
  "comment": "Excellent work! Highly recommended!"
}
```

#### Get Gig Reviews

```http
GET /api/gigs/{gigId}/reviews
```

Get reviews for a specific gig.

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `rating` | int | Filter by star rating (1-5) |

#### Get Designer Reviews

```http
GET /api/designers/{designerId}/reviews
```

Get all reviews for a designer.

---

### Category Endpoints

#### List Categories

```http
GET /api/categories
```

Get all service categories.

**Response:**

```json
[
  {
    "id": "graphic-design",
    "name": "Graphic Design",
    "slug": "graphic-design",
    "icon": "palette",
    "subCategories": [
      {
        "id": "logo-design",
        "name": "Logo Design",
        "slug": "logo-design"
      },
      {
        "id": "brand-identity",
        "name": "Brand Identity",
        "slug": "brand-identity"
      }
    ]
  }
]
```

---

### Admin Endpoints

> ⚠️ All admin endpoints require `ADMIN` role.

#### List All Users

```http
GET /api/admin/users
```

Get paginated list of all users.

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `status` | string | `active`, `suspended`, `pending` |

#### Update User Status

```http
PATCH /api/admin/users/{userId}/status
```

Change user account status.

**Request Body:**

```json
{
  "status": "suspended",
  "reason": "Violation of terms of service"
}
```

#### Dashboard Statistics

```http
GET /api/admin/dashboard/stats
```

Get platform-wide statistics.

**Response:**

```json
{
  "totalUsers": 15000,
  "totalDesigners": 3500,
  "totalGigs": 12000,
  "totalOrders": 45000,
  "revenue": {
    "total": 2500000.00,
    "thisMonth": 125000.00,
    "growth": 15.5
  }
}
```

---

## Error Handling

### Error Response Format

```json
{
  "error": "BadRequest",
  "message": "Invalid request parameters",
  "code": "VALIDATION_ERROR",
  "details": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ],
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### HTTP Status Codes

| Code | Description |
|------|-------------|
| `200` | Success |
| `201` | Created |
| `204` | No Content |
| `400` | Bad Request - Invalid input |
| `401` | Unauthorized - Invalid/missing token |
| `403` | Forbidden - Insufficient permissions |
| `404` | Not Found - Resource doesn't exist |
| `409` | Conflict - Resource already exists |
| `422` | Unprocessable Entity - Validation failed |
| `429` | Too Many Requests - Rate limited |
| `500` | Internal Server Error |

### Error Codes

| Code | Description |
|------|-------------|
| `AUTH_INVALID_CREDENTIALS` | Wrong email or password |
| `AUTH_TOKEN_EXPIRED` | Access token expired |
| `AUTH_TOKEN_INVALID` | Invalid token format |
| `AUTH_ACCOUNT_DISABLED` | Account suspended or banned |
| `VALIDATION_ERROR` | Input validation failed |
| `RESOURCE_NOT_FOUND` | Requested resource not found |
| `PERMISSION_DENIED` | Not authorized for this action |
| `RATE_LIMIT_EXCEEDED` | Too many requests |

---

## Rate Limiting

### Limits

| Tier | Requests/Hour | Requests/Minute |
|------|---------------|-----------------|
| Unauthenticated | 100 | 10 |
| Authenticated | 1000 | 60 |
| Premium | 5000 | 300 |

### Headers

Rate limit information is included in response headers:

```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1705318200
```

### Handling Rate Limits

When rate limited, you'll receive:

```http
HTTP/1.1 429 Too Many Requests
Retry-After: 3600

{
  "error": "TooManyRequests",
  "message": "Rate limit exceeded. Try again in 1 hour.",
  "code": "RATE_LIMIT_EXCEEDED"
}
```

---

## SDKs & Examples

### JavaScript/TypeScript

```typescript
import { DesignerMarketplaceClient } from '@designer-marketplace/sdk';

const client = new DesignerMarketplaceClient({
  baseUrl: 'https://api.designermarketplace.com',
  apiKey: 'your-api-key'
});

// Authentication
const { accessToken } = await client.auth.login({
  email: 'user@example.com',
  password: 'password'
});

// Search gigs
const gigs = await client.gigs.search({
  query: 'logo design',
  minPrice: 50,
  maxPrice: 500
});

// Create order
const order = await client.orders.create({
  gigId: 'gig-uuid',
  packageType: 'standard',
  requirements: 'Need a modern logo...'
});
```

### Python

```python
from designer_marketplace import Client

client = Client(
    base_url='https://api.designermarketplace.com',
    api_key='your-api-key'
)

# Authentication
tokens = client.auth.login(
    email='user@example.com',
    password='password'
)

# Search gigs
gigs = client.gigs.search(
    query='logo design',
    min_price=50,
    max_price=500
)

# Create order
order = client.orders.create(
    gig_id='gig-uuid',
    package_type='standard',
    requirements='Need a modern logo...'
)
```

### cURL Examples

```bash
# Login
curl -X POST https://api.designermarketplace.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}'

# Search gigs
curl "https://api.designermarketplace.com/gigs?q=logo&minPrice=50"

# Create order (authenticated)
curl -X POST https://api.designermarketplace.com/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"gigId":"uuid","packageType":"standard"}'
```

---

## Webhooks

Configure webhooks to receive real-time notifications.

### Events

| Event | Description |
|-------|-------------|
| `order.created` | New order placed |
| `order.delivered` | Order delivered |
| `order.completed` | Order completed |
| `order.cancelled` | Order cancelled |
| `message.received` | New message received |
| `review.created` | New review posted |

### Payload Format

```json
{
  "event": "order.created",
  "timestamp": "2024-01-15T10:30:00Z",
  "data": {
    "orderId": "550e8400-e29b-41d4-a716-446655440000",
    "gigId": "gig-uuid",
    "buyerId": "buyer-uuid",
    "total": 100.00
  }
}
```

### Verifying Signatures

```javascript
const crypto = require('crypto');

function verifyWebhook(payload, signature, secret) {
  const expected = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expected)
  );
}
```

---

## Support

- **Documentation**: https://docs.designermarketplace.com
- **API Status**: https://status.designermarketplace.com
- **Email**: api-support@designermarketplace.com
- **Discord**: https://discord.gg/designermarketplace

---

*Last updated: January 2025*

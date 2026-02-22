# 📡 API DOCUMENTATION
## Asia Night Life Platform - API Reference

**Base URL**: `https://asianightlife.sg/api`  
**Version**: 1.0.0  
**Last Updated**: 28/01/2026

---

## TABLE OF CONTENTS

1. [Authentication](#authentication)
2. [Venues API](#venues-api)
3. [DJs API](#djs-api)
4. [Votes API](#votes-api)
5. [Employees API](#employees-api)
6. [Stats API](#stats-api)
7. [Error Handling](#error-handling)
8. [Rate Limiting](#rate-limiting)

---

## Authentication

Most API endpoints require authentication through Supabase Auth. Authentication is handled via session cookies.

### Authentication Headers

When authenticated, session cookie will be automatically sent with requests. No manual headers needed.

### Authentication Flow

1. User logs in via `/auth/callback`
2. Session cookie is automatically set
3. Middleware verifies session for protected routes
4. API routes check authentication via `supabase.auth.getUser()`

---

## Venues API

### GET /api/venues

Get list of venues with filtering and pagination.

**Authentication**: Not required

**Query Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `search` | string | No | "" | Search by name, address, description |
| `country` | string | No | - | Filter by country |
| `category` | string | No | - | Filter by category (KTV, Club, Live House) |
| `limit` | number | No | 100 | Number of results to return |
| `offset` | number | No | 0 | Offset for pagination |

**Example Request:**

```bash
GET /api/venues?search=ktv&country=Singapore&limit=20&offset=0
```

**Response:**

```json
{
  "venues": [
    {
      "id": 1,
      "name": "Iconic KTV",
      "main_image_url": "https://...",
      "images": [
        "https://...",
        "https://..."
      ],
      "address": "35 Selegie Rd, #03-07, Parklane Shopping Mall",
      "country": "Singapore",
      "phone": "+65 8280 8072",
      "category": "KTV",
      "price": "800-900k",
      "description": "## About Iconic KTV\n...",
      "hours": "4PM - 3AM",
      "rating": 4.5,
      "status": "open"
    }
  ],
  "total": 150,
  "limit": 20,
  "offset": 0
}
```

**Cache**: 3600 seconds (1 hour)

---

### GET /api/venues/[id]

Get detailed information for a venue.

**Authentication**: Not required

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | number | Yes | Venue ID |

**Example Request:**

```bash
GET /api/venues/1
```

**Response:**

```json
{
  "id": 1,
  "name": "Iconic KTV",
  "main_image_url": "https://...",
  "images": [...],
  "address": "35 Selegie Rd, #03-07, Parklane Shopping Mall",
  "country": "Singapore",
  "phone": "+65 8280 8072",
  "category": "KTV",
  "price": "800-900k",
  "description": "## About Iconic KTV\n...",
  "hours": "4PM - 3AM",
  "rating": 4.5,
  "status": "open"
}
```

**Error Responses:**

- `404`: Venue not found

---

### GET /api/venues/categories

Get list of all categories.

**Authentication**: Not required

**Response:**

```json
{
  "categories": [
    "KTV",
    "Club",
    "Live House"
  ]
}
```

---

### GET /api/venues/countries

Get list of all countries.

**Authentication**: Not required

**Response:**

```json
{
  "countries": [
    "Singapore",
    "Vietnam",
    "Thailand",
    "Malaysia"
  ]
}
```

---

## DJs API

### GET /api/djs

Get list of DJs with filtering.

**Authentication**: Not required

**Query Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `search` | string | No | "" | Search by name, bio, country |
| `country` | string | No | - | Filter by country |
| `genre` | string | No | - | Filter by genre |
| `limit` | number | No | 100 | Number of results |
| `offset` | number | No | 0 | Offset for pagination |

**Example Request:**

```bash
GET /api/djs?country=Singapore&genre=House&limit=20
```

**Response:**

```json
{
  "djs": [
    {
      "id": "1",
      "name": "DJ Name",
      "image_url": "https://...",
      "bio": "Professional DJ with 10 years experience...",
      "genres": ["House", "Techno"],
      "country": "Singapore",
      "votes_count": 150,
      "created_at": "2024-01-01T00:00:00Z"
    }
  ],
  "total": 50
}
```

**Notes:**
- Only returns DJs with `is_active = true` and `status = 'active'`
- Votes count is calculated from `votes` table

---

### GET /api/djs/[id]

Get detailed information for a DJ including rank.

**Authentication**: Not required

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | DJ ID |

**Example Request:**

```bash
GET /api/djs/1
```

**Response:**

```json
{
  "id": "1",
  "name": "DJ Name",
  "image_url": "https://...",
  "bio": "Professional DJ...",
  "genres": ["House", "Techno"],
  "country": "Singapore",
  "votes_count": 150,
  "rank": 5,
  "created_at": "2024-01-01T00:00:00Z",
  "user_id": "uuid-here"
}
```

**Rank Calculation:**
- Rank is calculated based on number of votes
- DJs with the same number of votes share the same rank
- Rank = number of DJs with more votes + 1

**Error Responses:**

- `404`: DJ not found

---

### GET /api/djs/me

Get current user's DJ profile.

**Authentication**: Required

**Response:**

```json
{
  "id": "1",
  "name": "DJ Name",
  "image_url": "https://...",
  "bio": "...",
  "genres": ["House"],
  "country": "Singapore",
  "votes_count": 150,
  "created_at": "2024-01-01T00:00:00Z",
  "user_id": "uuid-here"
}
```

**Error Responses:**

- `401`: Unauthorized
- `200` with `dj: null`: No profile yet

---

### POST /api/djs/seed

Seed sample DJs into database (development only).

**Authentication**: Required

**Request Body:**

```json
{
  "count": 10  // Optional, default: 24
}
```

**Response:**

```json
{
  "success": true,
  "inserted": 10,
  "total": 10,
  "djs": [...],
  "errors": []  // If there are errors
}
```

**Error Responses:**

- `401`: Unauthorized
- `500`: Server error

---

## Votes API

### POST /api/votes

Create a vote for a DJ.

**Authentication**: Required

**Request Body:**

```json
{
  "dj_id": "1"
}
```

**Example Request:**

```bash
POST /api/votes
Content-Type: application/json

{
  "dj_id": "1"
}
```

**Response:**

```json
{
  "success": true,
  "vote": {
    "id": "123",
    "user_id": "uuid-here",
    "dj_id": "1",
    "created_at": "2024-01-01T00:00:00Z"
  },
  "votes_count": 151
}
```

**Error Responses:**

- `400`: Invalid DJ ID or already voted
- `401`: Unauthorized
- `404`: DJ not found
- `500`: Server error

**Business Rules:**
- Each user can only vote once per DJ
- Can only vote for active DJs (`is_active = true`, `status = 'active'`)

---

### GET /api/votes

Get list of votes for current user.

**Authentication**: Optional (returns empty array if not logged in)

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `dj_id` | string | No | Filter by DJ ID |

**Example Request:**

```bash
GET /api/votes?dj_id=1
```

**Response:**

```json
{
  "votes": ["1", "2", "3"]  // Array of DJ IDs đã vote
}
```

**Notes:**
- If not logged in, returns `{"votes": []}`
- If `dj_id` is provided, returns `["1"]` if voted, `[]` if not voted

---

## Employees API

### GET /api/employees

Get list of employees.

**Authentication**: Not required (but can filter by user_id if authenticated)

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `search` | string | No | Search by name, email, phone |
| `email` | string | No | Filter by email |
| `referral_code` | string | No | Filter by referral code |
| `limit` | number | No | 100 |
| `offset` | number | No | 0 |

**Example Request:**

```bash
GET /api/employees?search=john&limit=20
```

**Response:**

```json
{
  "employees": [
    {
      "id": 1,
      "user_id": "uuid-here",
      "email": "employee@example.com",
      "full_name": "John Doe",
      "phone": "+65 1234 5678",
      "date_of_birth": "1990-01-01",
      "gender": "male",
      "address": "...",
      "avatar": "https://...",
      "referral_code": "ABC123",
      "position": "Manager",
      "department": "Sales",
      "hire_date": "2024-01-01",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ],
  "total": 50,
  "limit": 20,
  "offset": 0
}
```

---

### POST /api/employees

Create a new employee profile.

**Authentication**: Required

**Request Body:**

```json
{
  "email": "employee@example.com",
  "full_name": "John Doe",
  "phone": "+65 1234 5678",           // Optional
  "date_of_birth": "1990-01-01",      // Optional
  "gender": "male",                    // Optional
  "address": "...",                    // Optional
  "avatar": "https://...",            // Optional
  "referral_code": "ABC123",          // Optional
  "position": "Manager",              // Optional
  "department": "Sales",               // Optional
  "hire_date": "2024-01-01"           // Optional
}
```

**Required Fields:**
- `email`
- `full_name`

**Response:**

```json
{
  "id": 1,
  "user_id": "uuid-here",
  "email": "employee@example.com",
  "full_name": "John Doe",
  ...
}
```

**Status Code**: `201 Created`

**Error Responses:**

- `400`: Missing required fields or email already exists
- `401`: Unauthorized
- `500`: Server error

---

### GET /api/employees/[id]

Get detailed information for an employee.

**Authentication**: Not required

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | number | Yes | Employee ID |

**Response:**

```json
{
  "id": 1,
  "user_id": "uuid-here",
  "email": "employee@example.com",
  "full_name": "John Doe",
  ...
}
```

**Error Responses:**

- `404`: Employee not found

---

### GET /api/employees/me

Get current user's employee profile.

**Authentication**: Required

**Response:**

```json
{
  "id": 1,
  "user_id": "uuid-here",
  "email": "employee@example.com",
  "full_name": "John Doe",
  ...
}
```

**Error Responses:**

- `401`: Unauthorized
- `404`: Profile not found

---

### GET /api/employees/referral/[code]

Get employee by referral code.

**Authentication**: Not required

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `code` | string | Yes | Referral code (case-insensitive) |

**Example Request:**

```bash
GET /api/employees/referral/ABC123
```

**Response:**

```json
{
  "id": 1,
  "user_id": "uuid-here",
  "email": "employee@example.com",
  "full_name": "John Doe",
  "referral_code": "ABC123",
  ...
}
```

**Error Responses:**

- `404`: Employee not found with this referral code

---

## Stats API

### GET /api/stats/djs

Get statistics about DJs.

**Authentication**: Not required

**Response:**

```json
{
  "total_djs": 50,
  "active_djs": 45,
  "total_votes": 1500,
  "top_dj": {
    "id": "1",
    "name": "DJ Name",
    "votes_count": 200
  }
}
```

---

### GET /api/stats/venues

Get statistics about venues.

**Authentication**: Not required

**Response:**

```json
{
  "total_venues": 150,
  "by_country": {
    "Singapore": 50,
    "Vietnam": 60,
    "Thailand": 30,
    "Malaysia": 10
  },
  "by_category": {
    "KTV": 100,
    "Club": 30,
    "Live House": 20
  }
}
```

---

## Error Handling

### Error Response Format

All errors return standard format:

```json
{
  "error": "Error message",
  "details": "Additional error details"  // Optional
}
```

### HTTP Status Codes

| Code | Description |
|------|-------------|
| `200` | Success |
| `201` | Created |
| `400` | Bad Request - Invalid input |
| `401` | Unauthorized - Authentication required |
| `404` | Not Found - Resource does not exist |
| `500` | Internal Server Error |

### Common Error Messages

- `"Unauthorized"`: Not logged in or session expired
- `"DJ not found"`: DJ ID does not exist
- `"You have already voted for this DJ"`: Already voted
- `"Invalid DJ ID"`: Invalid DJ ID format
- `"Email and full name are required"`: Missing required fields
- `"Employee profile with this email already exists"`: Email already exists

---

## Rate Limiting

Currently no rate limiting implemented. Can be added in the future with:
- Vercel Edge Config
- Supabase Rate Limiting
- Custom middleware

**Recommendation**: Implement rate limiting for production:
- 100 requests/minute per IP for public endpoints
- 1000 requests/minute per user for authenticated endpoints

---

## Best Practices

### 1. Pagination

Always use pagination for list endpoints:
- Default `limit`: 100
- Maximum `limit`: 1000
- Use `offset` for pagination

### 2. Caching

- Public endpoints have cache headers
- Client-side caching with Service Worker
- CDN caching for static responses

### 3. Error Handling

- Always check status code
- Handle network errors
- Display user-friendly error messages

### 4. Authentication

- Store session securely
- Handle token refresh
- Logout when session expired

---

## Examples

### JavaScript/TypeScript

```typescript
// Fetch venues
const response = await fetch('/api/venues?country=Singapore&limit=20');
const data = await response.json();

// Vote for DJ
const voteResponse = await fetch('/api/votes', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ dj_id: '1' }),
});
const voteData = await voteResponse.json();

// Get user's votes
const votesResponse = await fetch('/api/votes');
const votesData = await votesResponse.json();
```

### cURL

```bash
# Get venues
curl https://asianightlife.sg/api/venues?country=Singapore

# Vote for DJ (requires authentication)
curl -X POST https://asianightlife.sg/api/votes \
  -H "Content-Type: application/json" \
  -d '{"dj_id": "1"}'
```

---

**Last Updated**: 28/01/2026  
**Version**: 1.0.0

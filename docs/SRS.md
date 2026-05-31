# Software Requirements Specification (SRS)

## 1. Introduction
Telugu NewsAI is a web application: Next.js frontend, Express API, PostgreSQL, Google Gemini.

## 2. Functional Requirements

### 2.1 Authentication
- **FR-A1**: Users register with email, password (≥6), name
- **FR-A2**: Users log in and receive JWT + refresh token
- **FR-A3**: Protected routes require valid Bearer token

### 2.2 Content Generation
- **FR-G1**: Accept `articleText`, `category`, `tone`
- **FR-G2**: Return structured JSON with all platform fields
- **FR-G3**: Persist article, generated post, hashtags, SEO keywords
- **FR-G4**: Log entry in `generation_history`

### 2.3 Dashboard
- **FR-D1**: Show total articles, generations today, avg time, time saved estimate
- **FR-D2**: Show category breakdown (month) and 5 recent items

### 2.4 History
- **FR-H1**: List generations with pagination, search, category filter
- **FR-H2**: View full generation by ID
- **FR-H3**: Delete generation

## 3. Non-Functional Requirements

| ID | Requirement |
|----|-------------|
| NFR-1 | API response for generate &lt; 90s timeout |
| NFR-2 | HTTPS in production |
| NFR-3 | Rate limit on `/generate` |
| NFR-4 | Passwords bcrypt-hashed (cost 12) |
| NFR-5 | CORS restricted to frontend origin |

## 4. Data Requirements
See `backend/prisma/schema.prisma` — Users, Articles, Generated_Posts, Hashtags, SeoKeywords, Generation_History.

## 5. External Interfaces
- Google Gemini 1.5 Flash (`GEMINI_API_KEY`)
- PostgreSQL (`DATABASE_URL`)

## 6. Constraints
- Telugu script output for body text
- Twitter ≤ 280 chars; breaking alert ≤ 80 chars

# API Design — Telugu NewsAI

Base URL: `{API_HOST}/api/v1`

Auth header: `Authorization: Bearer <jwt>`

## Auth

### POST `/auth/login`
```json
{ "email": "editor@demo.com", "password": "demo1234" }
```
Response `data`: `{ token, refreshToken, user }`

### POST `/auth/signup`
```json
{ "email": "...", "password": "...", "name": "...", "orgName": "optional" }
```

### POST `/auth/refresh`
```json
{ "refreshToken": "..." }
```

## Generate (protected)

### POST `/generate`
```json
{
  "articleText": "Telugu article body...",
  "category": "politics",
  "tone": "formal"
}
```

Response `data`:
```json
{
  "id": "uuid",
  "headline": "...",
  "keyFacts": ["...", "...", "..."],
  "captionVariations": ["...", "...", "..."],
  "summary": "...",
  "facebookPost": "...",
  "instagramCaption": "...",
  "twitterPost": "...",
  "whatsappText": "...",
  "youtubeCommunity": "...",
  "breakingAlert": "...",
  "hashtags": ["#..."],
  "seoKeywords": ["..."],
  "sentiment": "neutral",
  "generationMs": 4200,
  "generatedAt": "ISO-8601"
}
```

## Stats (protected)

### GET `/stats`
Returns dashboard metrics + `categories[]` + `recent[]`.

## History (protected)

### GET `/history?page=1&limit=20&search=&category=`
### GET `/history/:id`
### DELETE `/history/:id`

## Health

### GET `/health` (root, not under v1)
`{ "status": "ok", "service": "telugu-newsai-api" }`

## Errors
```json
{ "success": false, "message": "Human-readable error" }
```

HTTP codes: 400 validation, 401 unauthorized, 404 not found, 409 conflict, 500 server error.

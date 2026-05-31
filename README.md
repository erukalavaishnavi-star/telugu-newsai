# Telugu NewsAI — Social Media Post Generator

> AI-powered content automation for Telugu news publishers.  
> Convert any article into platform-ready posts in **under 10 seconds**.

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org)
[![Node.js](https://img.shields.io/badge/Node.js-20-green)](https://nodejs.org)
[![Gemini AI](https://img.shields.io/badge/Gemini-1.5%20Flash-blue)](https://ai.google.dev)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue)](https://postgresql.org)
[![License](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)

---

## Features

- **AI-powered** — Google Gemini 1.5 Flash (server-side only)
- **10+ outputs** — Summary, Facebook, Instagram, X/Twitter, WhatsApp, YouTube, breaking alert, hashtags, SEO, sentiment
- **Headline & key facts** — Extracted from the article
- **3 caption variations** — Alternative Telugu captions per generation
- **Export** — Copy all posts or download JSON
- **Dashboard** — Live stats, categories, recent generations
- **History** — Search, filter, view detail, delete
- **Auth** — JWT login, signup, refresh tokens

---

## Tech Stack

| Layer    | Technology                          |
|----------|-------------------------------------|
| Frontend | Next.js 14, React 18, Tailwind CSS  |
| Backend  | Node.js 20, Express.js              |
| AI       | Google Gemini 1.5 Flash             |
| Database | PostgreSQL 15 + Prisma ORM          |
| Deploy   | Vercel (FE) + Render (API) + Neon (DB) |

---

## Documentation

| Document | Path |
|----------|------|
| PRD | [docs/PRD.md](docs/PRD.md) |
| SRS | [docs/SRS.md](docs/SRS.md) |
| API Design | [docs/API.md](docs/API.md) |
| UI/UX | [docs/UI-UX.md](docs/UI-UX.md) |
| Deployment | [DEPLOYMENT.md](DEPLOYMENT.md) |
| Screenshots guide | [docs/SCREENSHOTS.md](docs/SCREENSHOTS.md) |
| Resume blurb | [docs/RESUME.md](docs/RESUME.md) |

---

## Quick Start

### Prerequisites
- Node.js 20+
- PostgreSQL 15+
- [Gemini API key](https://aistudio.google.com/app/apikey)

### 1. Install

```bash
cd telugu-newsai/backend && npm install
cd ../frontend && npm install
```

### 2. Environment

**Backend** — `backend/.env` (copy from `.env.example`):
```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/telugu_newsai
GEMINI_API_KEY=your_gemini_api_key
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters_long
JWT_EXPIRES_IN=7d
PORT=3001
CORS_ORIGIN=http://localhost:3000
```

**Frontend** — `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 3. Database

```bash
cd backend
npx prisma migrate deploy
npx prisma db seed
```

### 4. Run

```bash
# Terminal 1
cd backend && npm run dev

# Terminal 2
cd frontend && npm run dev
```

Open http://localhost:3000 → login with **editor@demo.com** / **demo1234**

---

## Project Structure

```
telugu-newsai/
├── docs/                 # PRD, SRS, API, UI-UX, RESUME, SCREENSHOTS
├── frontend/src/
│   ├── app/              # dashboard, generator, history, auth, docs
│   ├── components/       # generator, dashboard, history, shared
│   └── lib/              # api.ts, auth.ts, export.ts
├── backend/src/
│   ├── controllers/
│   ├── routes/
│   ├── services/gemini.service.ts
│   └── prompts/telugu-news.prompt.ts
├── backend/prisma/
├── DEPLOYMENT.md
└── docker-compose.yml
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/login` | Login |
| POST | `/api/v1/auth/signup` | Register |
| POST | `/api/v1/generate` | Generate posts (auth) |
| GET | `/api/v1/stats` | Dashboard stats (auth) |
| GET | `/api/v1/history` | List history (auth) |
| GET | `/api/v1/history/:id` | Get generation (auth) |
| DELETE | `/api/v1/history/:id` | Delete (auth) |

See [docs/API.md](docs/API.md) for payloads.

---

## Deployment (production)

**Recommended:** [Neon](https://neon.tech) (PostgreSQL) + [Render](https://render.com) (API) + [Vercel](https://vercel.com) (frontend).

See **[DEPLOYMENT.md](DEPLOYMENT.md)** for step-by-step setup (`render.yaml` included).

---

## License

MIT — see [LICENSE](LICENSE).

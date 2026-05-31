# Deployment Guide — Neon + Render + Vercel

Recommended production stack (all have free tiers):

| Layer    | Service | Role                    |
|----------|---------|-------------------------|
| Database | **Neon**  | Serverless PostgreSQL |
| API      | **Render** | Express backend      |
| Frontend | **Vercel** | Next.js app          |

```
┌─────────────┐     HTTPS      ┌──────────────┐     HTTPS      ┌─────────────┐
│   Vercel    │ ─────────────► │    Render    │ ─────────────► │    Neon     │
│  Next.js    │   API calls    │  Express API │   Prisma     │ PostgreSQL  │
└─────────────┘                └──────────────┘                └─────────────┘
```

---

## Prerequisites

- GitHub repo with this project
- [Neon](https://neon.tech) account
- [Render](https://render.com) account
- [Vercel](https://vercel.com) account
- [Gemini API key](https://aistudio.google.com/app/apikey)

---

## Step 1 — Database (Neon)

1. Go to [console.neon.tech](https://console.neon.tech) → **New Project** (e.g. `telugu-newsai`).
2. Copy **two** connection strings from the dashboard:
   - **Pooled** (host contains `-pooler`) → `DATABASE_URL` (used by the API at runtime)
   - **Direct** (no pooler) → `DIRECT_URL` (used by Prisma migrations)
3. Append `?sslmode=require` if not already present.

Example:

```env
DATABASE_URL=postgresql://user:pass@ep-xxx-pooler.region.aws.neon.tech/neondb?sslmode=require
DIRECT_URL=postgresql://user:pass@ep-xxx.region.aws.neon.tech/neondb?sslmode=require
```

### Run migrations & seed (once, from your PC)

```powershell
cd telugu-newsai\backend

# Paste Neon URLs into .env temporarily, or set inline:
$env:DATABASE_URL="postgresql://...-pooler...?sslmode=require"
$env:DIRECT_URL="postgresql://...direct...?sslmode=require"

npx prisma migrate deploy
npx prisma db seed
```

Demo login after seed: **editor@demo.com** / **demo1234**

---

## Step 2 — Backend (Render)

### Option A — Blueprint (`render.yaml` in repo root)

1. Render Dashboard → **New** → **Blueprint**.
2. Connect GitHub repo; Render reads `render.yaml`.
3. Set secret env vars when prompted (or in the service **Environment** tab):

| Variable       | Value |
|----------------|--------|
| `DATABASE_URL` | Neon **pooled** URL |
| `DIRECT_URL`   | Neon **direct** URL |
| `GEMINI_API_KEY` | Your Gemini key |
| `JWT_SECRET`   | Random 64+ char string |
| `CORS_ORIGIN`  | Your Vercel URL (Step 3), e.g. `https://telugu-newsai.vercel.app` |

4. Deploy. Render runs `npm run build` then `npm run start:prod` (migrate + server).

### Option B — Manual Web Service

1. **New** → **Web Service** → connect repo.
2. **Root Directory:** `backend`
3. **Build Command:** `npm install && npm run build`
4. **Start Command:** `npm run start:prod`
5. **Health Check Path:** `/health`
6. Add the same environment variables as above.

### Get your API URL

After deploy: `https://telugu-newsai-api.onrender.com` (or your custom name).  
Test: `https://YOUR-SERVICE.onrender.com/health` → `{ "status": "ok" }`

**Note:** Render free tier sleeps after inactivity; first request may take ~30s.

---

## Step 3 — Frontend (Vercel)

1. [vercel.com](https://vercel.com) → **Add New Project** → import GitHub repo.
2. **Root Directory:** `frontend`
3. **Framework:** Next.js (auto-detected)
4. **Environment variables:**

| Name | Value |
|------|--------|
| `NEXT_PUBLIC_API_URL` | `https://YOUR-SERVICE.onrender.com` (no trailing slash) |
| `NEXT_PUBLIC_APP_NAME` | `Telugu NewsAI` |

5. **Deploy**.

6. Copy the Vercel URL (e.g. `https://telugu-newsai.vercel.app`).

### Update Render CORS

In Render → your API service → **Environment**:

```env
CORS_ORIGIN=https://telugu-newsai.vercel.app
```

For preview deployments, use comma-separated origins:

```env
CORS_ORIGIN=https://telugu-newsai.vercel.app,https://telugu-newsai-*.vercel.app
```

(Vercel preview URLs vary; add your main production URL at minimum.)

Redeploy the Render service after changing `CORS_ORIGIN`.

---

## Step 4 — Verify end-to-end

1. Open Vercel URL → **Login** with `editor@demo.com` / `demo1234`
2. **Generator** → paste a Telugu article → **Generate**
3. Check **History** and **Dashboard** for saved data

---

## Environment checklist

### Neon (console only)
- `DATABASE_URL` (pooled) → Render
- `DIRECT_URL` (direct) → Render

### Render
```env
DATABASE_URL=...
DIRECT_URL=...
GEMINI_API_KEY=...
JWT_SECRET=...
JWT_EXPIRES_IN=7d
NODE_ENV=production
CORS_ORIGIN=https://your-app.vercel.app
```

### Vercel
```env
NEXT_PUBLIC_API_URL=https://your-api.onrender.com
NEXT_PUBLIC_APP_NAME=Telugu NewsAI
```

**Do not** put `GEMINI_API_KEY` on Vercel — it stays on Render only.

---

## Estimated monthly cost (hobby)

| Service | Plan   | Cost   |
|---------|--------|--------|
| Neon    | Free   | $0     |
| Render  | Free   | $0*    |
| Vercel  | Hobby  | $0     |
| Gemini  | Usage  | ~$0–10 |

\*Render free: service sleeps when idle; upgrade for always-on.

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| `P1012` / missing `DATABASE_URL` | Set env vars on Render; redeploy |
| `P1001` can't reach DB | Use Neon URLs with `?sslmode=require`; check IP allow (Neon allows all by default) |
| CORS error in browser | `CORS_ORIGIN` must exactly match Vercel URL (https, no trailing slash) |
| 401 on generate | Log in again; token stored in `localStorage` |
| Render 502 on first hit | Free tier waking up — wait and retry |
| Prisma migrate fails on Neon | Use `DIRECT_URL` (non-pooler) for migrations |

---

## Alternative: Railway + Vercel

See git history or use Railway PostgreSQL + API instead of Neon + Render — same env var pattern, single `DATABASE_URL` without pooler split if using Railway Postgres.

---

## Health check

`GET https://YOUR-API.onrender.com/health`

```json
{ "status": "ok", "service": "telugu-newsai-api", "timestamp": "..." }
```

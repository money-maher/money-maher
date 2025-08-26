    # moneymaher — Full deployment package

This repo contains a Next.js frontend and Express backend with BSE StAR MF integration and AMFI NAV proxy.

## Quick start (local)

1. Backend
```bash
cd backend
npm ci
cp .env.example .env
# edit .env with your credentials
npm start
```

2. Frontend
```bash
cd frontend
npm ci
NEXT_PUBLIC_API_BASE=http://localhost:8080 npm run dev
```

## Deploy
- Frontend: Vercel target `frontend/` (set NEXT_PUBLIC_API_BASE to https://api.moneymaher.in)
- Backend: Render service `backend/` (set env vars from .env.example)

## DNS (GoDaddy)
- Apex: moneymaher.in -> A -> 76.76.21.21
- www -> CNAME -> cname.vercel-dns.com
- api.moneymaher.in -> CNAME -> <render-hostname>

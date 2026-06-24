# TrustStore — Store Rating Platform

This repository is a full-stack prototype for a store rating platform built with NestJS (backend) and React + Vite (frontend).

## Quick start

Prerequisites:
- Node.js 18+ (Node 24 tested here)
- npm
- MySQL or configured database matching backend `ormconfig` / TypeORM settings

Install dependencies:

```bash
# from repository root
cd backend
npm install

cd ../frontend
npm install
```

Run backend (development):

```bash
cd backend
npm run start:dev    # Nest watch-mode
# or for stable production run:
npm run build
npm run start:prod
```

Run frontend (development):

```bash
cd frontend
npm run dev
# open http://localhost:5173
```

## Environment

The backend expects a `.env` file in `backend/` with at least:

```
PORT=5000
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_USER=root
DATABASE_PASSWORD=yourpassword
DATABASE_NAME=store_rating_db
JWT_SECRET=supersecretjwtkey123!@#
```

Adjust DB credentials to your environment. The project uses TypeORM for database connection and a seeder to create example users.

## Test accounts (seeded)

The seeder creates sample users with password `Password123!`:

- admin@example.com — System Administrator
- owner1@example.com — Store Owner
- user1@example.com — Normal User

Use these to sign in on the frontend or via API.

## API Endpoints (examples)

- POST /auth/signup — body: `{ name, email, password, address }`
- POST /auth/login — body: `{ email, password }` → returns `{ accessToken }`
- GET /auth/me — protected, requires header `Authorization: Bearer <token>`
- Other routes: `/users`, `/stores`, `/ratings` (see backend/src for full routes)

## How JWT is configured

The backend uses `@nestjs/jwt` with `ConfigModule`/`ConfigService` to centralize the `JWT_SECRET`. Ensure `JWT_SECRET` in `.env` is the single source of truth for signing and verification.

## Troubleshooting

- EADDRINUSE on port 5000: make sure no other Node process is listening on 5000. On Windows:

```powershell
netstat -ano | findstr :5000
taskkill /PID <pid> /F
```

- If TypeORM cannot connect, confirm database credentials and that the database server is running.

- If tokens are failing with 401, ensure the `JWT_SECRET` value used when starting the server matches the one used to sign tokens.

## End-to-end verification (example)

1. Start backend and frontend.
2. POST to `/auth/login` with seeded credentials to receive `accessToken`.
3. Call protected endpoint `/auth/me` with header `Authorization: Bearer <token>` and verify user object.

## Development notes

- Backend: NestJS, TypeORM (MySQL), structured into modules: `auth`, `users`, `stores`, `ratings`.
- Frontend: React + Vite, pages for login, signup, dashboards for roles.



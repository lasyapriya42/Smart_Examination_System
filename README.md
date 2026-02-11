# Smart Examination Management System (MERN)

## What you get
- Role-based dashboards (Admin, HOD, Student).
- Express API routes mapped to core features.
- Vite dev server proxying `/api` to the backend.

## API routes (placeholders)
- `/api/health`
- `/api/auth/login`
- `/api/admin/dashboard`
- `/api/hod/dashboard`
- `/api/student/dashboard`
- `/api/exams`
- `/api/departments`
- `/api/results`
- `/api/analytics`

## Setup
1. Install dependencies:
   - In the project root: `npm install`
   - In the server folder: `npm install`
   - In the client folder: `npm install`
2. Copy `server/.env.example` to `server/.env` and set `MONGODB_URI`.
3. Set `JWT_SECRET` in `server/.env` for auth tokens.

## Run (dev)
- From the project root: `npm run dev`

## Run (prod)
- Build client: `npm run build`
- Start server: `npm run start`

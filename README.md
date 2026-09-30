# LearnHub — MERN Stack Learning Management System

A full-stack Learning Management System built with **MongoDB, Express, React and Node.js**.
Students browse and enroll in courses; instructors create and manage courses and lessons;
admins get a platform-wide analytics dashboard and user management. Covers both project
questions: Q1 (core MERN CRUD app) and Q2 (JWT auth, bcrypt, role-based access, enrollment,
deployment readiness).

## Tech Stack

**Frontend:** React 18 (Vite), React Router v6, Tailwind CSS, Framer Motion, Recharts,
Axios, React Hot Toast, Lucide Icons

**Backend:** Node.js, Express, MongoDB + Mongoose, JWT (jsonwebtoken), Bcrypt.js, CORS, Morgan

## Project Structure

```
LearnHub/
├── backend/
│   ├── config/          # MongoDB connection
│   ├── models/          # User, Course (with embedded lessons), Enrollment
│   ├── controllers/     # auth, course, enrollment, user (admin)
│   ├── routes/          # REST endpoints
│   ├── middleware/      # JWT auth (protect) + role-based access (authorize), error handler
│   ├── utils/           # JWT token generator, database seeder
│   ├── .env.example
│   └── server.js
└── frontend/
    ├── src/
    │   ├── api/          # Axios instance with JWT interceptor
    │   ├── context/      # AuthContext (login/register/logout, persisted in localStorage)
    │   ├── components/   # Navbar, Footer, CourseCard, ProtectedRoute, CourseFormModal, etc.
    │   ├── pages/         # Home, CourseListing, CourseDetail, Login, Register, Profile
    │   │   └── dashboard/ # Student / Instructor / Admin dashboards (role-protected)
    │   ├── App.jsx
    │   └── main.jsx
    └── .env.example
```

## Features

### Core (Question 1)
- React pages: Home, Course Listing (search/filter/pagination), Course Detail, Login, Register
- React Router navigation, hooks (useState/useEffect), conditional rendering, list mapping
- Axios-connected Express REST API: `GET/POST/PUT/DELETE /api/courses`, `POST /api/auth/register`, `POST /api/auth/login`
- MongoDB + Mongoose models for `User` and `Course`
- Clean, responsive Tailwind UI with animations (Framer Motion)

### Extension (Question 2)
- **JWT authentication** + **Bcrypt** password hashing, secrets in `.env`
- **Role-based access control** — Admin, Instructor, Student — enforced both in Express middleware (`protect` + `authorize`) and in the React router (`<ProtectedRoute roles={[...]}>`)
- **Enrollment system** — `Enrollment` model, `POST /api/enrollments`, `GET /api/enrollments/my-courses`, per-lesson progress tracking with a progress bar
- **Instructor tools** — create/edit/delete courses and lessons via modal form, view enrolled students per course
- **Admin tools** — platform analytics (pie/bar charts via Recharts), manage user roles, delete users
- Centralized error handling middleware with clear JSON error responses
- Production-ready `server.js` that serves the React build when `NODE_ENV=production`

## Getting Started

### 1. Prerequisites
- Node.js 18+
- MongoDB running locally (`mongod`) **or** a free MongoDB Atlas cluster

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env: set MONGO_URI and a strong JWT_SECRET
npm run seed     # optional: creates demo admin/instructor/student + sample courses
npm run dev      # starts on http://localhost:5000
```

### 3. Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
# VITE_API_URL=http://localhost:5000/api  (already the default)
npm run dev      # starts on http://localhost:5173
```

Open **http://localhost:5173** in your browser.

### 4. Demo Accounts (after running `npm run seed`)
| Role       | Email                     | Password    |
|------------|----------------------------|-------------|
| Admin      | admin@learnhub.com         | password123 |
| Instructor | instructor@learnhub.com    | password123 |
| Student    | student@learnhub.com       | password123 |

## API Reference

| Method | Endpoint                          | Access              | Description                    |
|--------|-------------------------------------|----------------------|---------------------------------|
| POST   | /api/auth/register                | Public               | Register (student/instructor)  |
| POST   | /api/auth/login                   | Public               | Login, returns JWT              |
| GET    | /api/auth/me                      | Private              | Current user                    |
| PUT    | /api/auth/me                      | Private              | Update profile                  |
| GET    | /api/courses                      | Public               | List courses (search/filter/page) |
| GET    | /api/courses/:id                  | Public               | Course details                  |
| POST   | /api/courses                      | Instructor/Admin     | Create course                   |
| PUT    | /api/courses/:id                  | Owner/Admin          | Update course                   |
| DELETE | /api/courses/:id                  | Owner/Admin          | Delete course                   |
| GET    | /api/courses/instructor/mine      | Instructor/Admin     | My taught courses               |
| POST   | /api/enrollments                  | Student              | Enroll in a course              |
| GET    | /api/enrollments/my-courses       | Student               | My enrollments                  |
| PUT    | /api/enrollments/:id/progress     | Student (owner)       | Mark lesson complete             |
| GET    | /api/enrollments/course/:courseId | Instructor/Admin     | Roster for a course              |
| GET    | /api/users                        | Admin                 | List all users                  |
| PUT    | /api/users/:id/role               | Admin                 | Change a user's role            |
| DELETE | /api/users/:id                    | Admin                 | Delete a user                    |
| GET    | /api/users/analytics              | Admin                 | Platform analytics               |

## Deployment Notes
- Set `NODE_ENV=production` and build the frontend: `cd frontend && npm run build`
- `server.js` will automatically serve `frontend/dist` as static files when `NODE_ENV=production`
- Use a process manager like PM2, or deploy backend to Render/Railway and frontend to Vercel/Netlify (point `VITE_API_URL` at your deployed API)
- Never commit `.env` — only `.env.example` is included

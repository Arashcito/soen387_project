# SOEN 387 — Course Enrollment System
### Concordia University — Web Services & Applications

This repository contains both assignments for SOEN 387.

---

## Repository Structure

```
SOEN387_Assignment/
│
├── assignment1/                   ← Assignment 1 (HTML/CSS/JS + JSP/Servlet)
│   ├── index.html                    Course listing page
│   ├── enrollment-summary.html       Enrollment cart page
│   ├── enrollment-confirmation.html  Confirmation page
│   ├── styles.css                    Shared stylesheet
│   ├── jsp-version/                  JSP/Servlet implementation
│   └── servlet-version/              Pure Servlet implementation
│
├── backend/                       ← Assignment 2 — Express REST API
│   ├── config/db.js                  Singleton DB pool (Design Pattern #1)
│   ├── controllers/                  MVC controllers
│   ├── models/                       SQL query functions
│   ├── routes/                       Express routers
│   ├── middlewares/errorHandler.js   Global error handler
│   ├── .env                          Environment variables
│   └── server.js                     Entry point
│
├── frontend/                      ← Assignment 2 — React App
│   └── src/
│       ├── context/EnrollmentContext.jsx  Observer pattern (Design Pattern #2)
│       ├── services/api.js               Axios API layer
│       ├── components/                   Navbar, CourseCard
│       └── pages/                        CourseList, EnrollmentPage, ConfirmationPage
│
├── database/
│   └── schema.sql                 ← MySQL schema + sample data
│
└── README.md                      ← This file
```

---

## Assignment 1 — Static / JSP / Servlet

A course enrollment system built with:
- Plain **HTML + CSS + JavaScript** (static version)
- **JSP / Servlets** (Java web app version)

### Run the static version
Open `assignment1/index.html` directly in any browser — no server needed.

### Run the JSP/Servlet version
```bash
cd assignment1/jsp-version
mvn tomcat7:run
# then open http://localhost:8080
```

---

## Assignment 2 — Full-Stack (React + Node.js + MySQL)

### Design Patterns Used

| Pattern | Category | Where |
|---------|----------|-------|
| **Singleton** | Creational | `backend/config/db.js` — one shared MySQL pool |
| **Observer** | Behavioral | `frontend/src/context/EnrollmentContext.jsx` — components auto-update on state change |

### Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router, Axios |
| Backend | Node.js, Express.js |
| Database | MySQL |
| Tooling | Vite, nodemon, dotenv |

---

## Assignment 2 — Setup & Run

### Step 1 — Database

```bash
# Import schema and sample data
mysql -u root -p < database/schema.sql
```

Then open `backend/.env` and set your MySQL password:
```
DB_PASSWORD=your_mysql_password
```

### Step 2 — Backend (Terminal 1)

```bash
cd backend
npm install
npm run dev
# Running at http://localhost:5000
```

### Step 3 — Frontend (Terminal 2)

```bash
cd frontend
npm install
npm run dev
# Open http://localhost:5173
```

---

## REST API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/courses` | Get all courses |
| GET | `/api/enrollments` | Get all enrollments |
| POST | `/api/enrollments` | Enroll in a course |
| PUT | `/api/enrollments/:id` | Update credit hours |
| DELETE | `/api/enrollments/:id` | Remove enrollment |
| POST | `/api/enrollments/confirm` | Confirm and clear enrollments |
| GET | `/api/health` | Server health check |

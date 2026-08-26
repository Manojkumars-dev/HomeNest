# 🏠 HomeNest — Rental Home Finder

A full-stack rental property platform built with **React + Vite** (frontend) and **Spring Boot + MySQL** (backend).

Tenants can search, save, and apply for rental homes. Owners can list and manage properties. Admins can oversee the entire platform.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite, React Router, Axios, Lucide Icons |
| Backend | Java 25, Spring Boot 3.2.5, Spring Security, JWT |
| Database | MySQL 8 |
| Auth | BCrypt + JWT (stateless) |

---

## Quick Start

### Prerequisites

- **Java 25** (or 17+)
- **Maven 3.9+**
- **Node.js 18+**
- **MySQL 8** running on port 3306

### 1. Database Setup

```sql
CREATE DATABASE homenest_db;
```

> Tables are auto-created by Hibernate on first run.

### 2. Backend Configuration

Update `backend/src/main/resources/application.properties` if your MySQL credentials differ:

```properties
spring.datasource.username=root
spring.datasource.password=root
```

### 3. Run the App

From the project root:

```bash
# Terminal 1 — Start backend (port 8080)
npm run backend

# Terminal 2 — Start frontend (port 5173)
npm run dev
```

Open **http://localhost:5173** in your browser.

---

## Project Structure

```
HomeNest/
├── package.json                 # Root scripts (npm run dev / backend)
├── frontend/
│   └── src/
│       ├── api/                 # Axios API clients
│       ├── components/          # Navbar, Footer, Sidebar, Logo
│       ├── context/             # AuthContext (JWT auth state)
│       ├── layouts/             # Public, Tenant, Owner, Admin layouts
│       ├── pages/               # 22 page components
│       └── routes/              # AppRoutes with role-based protection
└── backend/
    └── src/main/java/com/homenest/
        ├── config/              # SecurityConfig, GlobalExceptionHandler
        ├── controller/          # 6 REST controllers (~30 endpoints)
        ├── dto/                 # Request/Response DTOs
        ├── model/               # 6 JPA entities
        ├── repository/          # 6 JPA repositories
        ├── security/            # JWT filter + utility
        └── service/             # Auth + Property services
```

---

## Pages (22 Total)

### Public
| Page | Route |
|------|-------|
| Landing | `/` |
| Search | `/search` |
| Property Detail | `/property/:id` |
| Login | `/login` |
| Register | `/register` |
| Forgot Password | `/forgot-password` |

### Tenant (requires TENANT role)
| Page | Route |
|------|-------|
| Dashboard | `/tenant/dashboard` |
| Saved Properties | `/tenant/saved` |
| My Visits | `/tenant/visits` |
| Applications | `/tenant/applications` |
| Messages | `/tenant/messages` |

### Owner (requires OWNER role)
| Page | Route |
|------|-------|
| Dashboard | `/owner/dashboard` |
| My Properties | `/owner/properties` |
| Add Property | `/owner/add-property` |
| Edit Property | `/owner/edit-property/:id` |
| Visit Requests | `/owner/visits` |
| Messages | `/owner/messages` |

### Admin (requires ADMIN role)
| Page | Route |
|------|-------|
| Dashboard | `/admin/dashboard` |
| Manage Users | `/admin/users` |
| Manage Properties | `/admin/properties` |
| Reports | `/admin/reports` |
| System Health | `/admin/health` |

---

## API Endpoints

### Auth (`/api/auth`)
- `POST /register` — Create account
- `POST /login` — Get JWT token
- `GET /health` — Health check

### Properties (`/api/properties`)
- `GET /search` — Search with filters (city, bhk, type, price range)
- `GET /{id}` — Property details
- `GET /` — All active verified properties

### Tenant (`/api/tenant`)
- `GET/POST/DELETE /saved` — Save/unsave properties
- `GET/POST /visits` — Schedule/view visits
- `GET/POST /applications` — Apply for properties

### Owner (`/api/owner`)
- `GET/POST/PUT/DELETE /properties` — Manage listings
- `GET /visits` — View visit requests
- `PUT /visits/{id}/confirm` — Confirm visits
- `GET /applications` — View applications
- `PUT /applications/{id}/approve` — Approve/reject

### Messages (`/api/messages`)
- `GET /conversations` — List conversations
- `GET /{userId}` — Get messages with user
- `POST /` — Send message

### Admin (`/api/admin`)
- `GET /stats` — Platform statistics
- `GET /users` — All users
- `PUT /users/{id}/toggle-active` — Ban/unban user
- `PUT /users/{id}/toggle-verified` — Verify user
- `GET /properties` — All properties
- `PUT /properties/{id}/verify` — Verify property
- `DELETE /properties/{id}` — Delete property

---

## Design System

| Token | Value |
|-------|-------|
| Primary | `#ba0036` (Rausch Red) |
| Background | `#f9f9f9` |
| Surface | `#ffffff` |
| Text | `#1a1c1c` |
| Muted | `#6a6a6a` |
| Border | `#ebebeb` |
| Headline Font | DM Sans |
| Body Font | Inter |

---

## Test Accounts

| Role | Email | Password |
|------|-------|----------|
| Tenant | amit@test.com | Test@1234 |
| Owner | priya@test.com | Test@1234 |
| Admin | admin@homenest.com | Admin@1234 |

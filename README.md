# AI Bridge – Opportunity Sniper

An intelligent system that finds opportunities (hackathons, internships, grants, fellowships) and helps users act on them through AI-powered application generation and tracking.

## What It Does

- Aggregates opportunities from various sources into one ranked feed
- Uses a scoring engine to rank opportunities based on your skills and interests
- Generates personalized cover letters and email drafts automatically
- Tracks every application with status updates
- Runs background jobs for deadline monitoring and data cleanup

## Architecture

```
┌─────────────┐     ┌──────────────────────────────────────────┐
│   Frontend   │────▶│              Backend API                 │
│  React/Vite  │◀────│          Express + Node.js               │
└─────────────┘     │                                          │
                    │  Controllers → Services → Repositories   │
                    │                                          │
                    │  ┌─────────────┐  ┌──────────────────┐   │
                    │  │  AI Service  │  │  Notification    │   │
                    │  │  - Ranking   │  │  Service         │   │
                    │  │  - Generator │  │  - Reminders     │   │
                    │  └─────────────┘  └──────────────────┘   │
                    │                                          │
                    │  ┌──────────────────────────────────┐    │
                    │  │  Background Workers (node-cron)   │    │
                    │  │  - Expired cleanup (6hr)          │    │
                    │  │  - Deadline alerts (daily)        │    │
                    │  └──────────────────────────────────┘    │
                    └──────────────┬───────────────────────────┘
                                   │
                            ┌──────▼──────┐
                            │   MongoDB    │
                            │   Mongoose   │
                            └─────────────┘
```

## Design Patterns Used

| Pattern | Implementation | Purpose |
|---------|---------------|---------|
| Singleton | `database.js` | Single database connection across the app |
| Factory | `AIService.createGenerator()` | Creates cover letter, email, or application generators dynamically |
| Strategy | `OpportunityService.setRankingStrategy()` | Swap between AI ranking and simple deadline sort |
| Repository | All `*Repository` classes | Encapsulate database queries away from business logic |
| Layered Architecture | Controller → Service → Repository | Separation of concerns across request handling, logic, and data |

## Tech Stack

| Component | Technology |
|-----------|-----------|
| Backend | Node.js, Express |
| Database | MongoDB, Mongoose ODM |
| Auth | JWT (jsonwebtoken + bcryptjs) |
| AI Engine | Custom scoring + template generation |
| Background Jobs | node-cron |
| Frontend | React 18, Vite |
| HTTP Client | Axios |
| Routing | React Router v6 |

## Project Structure

```
ai-bridge/
├── backend/
│   ├── src/
│   │   ├── controllers/        # Request handlers
│   │   ├── services/           # Business logic
│   │   ├── repositories/       # Database operations
│   │   ├── models/             # Mongoose schemas
│   │   ├── routes/             # API route definitions
│   │   ├── middleware/         # Auth + validation
│   │   ├── workers/            # Cron jobs
│   │   ├── utils/              # Database, logger
│   │   └── app.js              # Entry point
│   └── seed.js                 # Mock data seeder
├── frontend/
│   └── src/
│       ├── pages/              # Login, Dashboard, etc.
│       ├── components/         # Reusable UI pieces
│       └── services/           # API client
├── idea.md
├── useCaseDiagram.md
├── sequenceDiagram.md
├── classDiagram.md
├── ErDiagram.md
└── README.md
```

## Setup

### Prerequisites
- Node.js 18+
- MongoDB running locally (or a cloud URI)

### Backend

```bash
cd backend
cp .env.example .env        # edit MONGO_URI if needed
npm install
npm run seed                # load mock opportunities
npm run dev                 # starts on port 5000
```

### Frontend

```bash
cd frontend
npm install
npm run dev                 # starts on port 5173
```

## API Endpoints

### Auth
- `POST /api/auth/register` — Create account with skills/interests
- `POST /api/auth/login` — Get JWT token
- `GET /api/auth/profile` — View profile (protected)
- `PUT /api/auth/profile` — Update profile (protected)

### Opportunities
- `GET /api/opportunities` — Ranked opportunity feed (protected)
- `GET /api/opportunities/:id` — Single opportunity details
- `GET /api/opportunities/stats` — Active count + deadline stats

### Applications
- `POST /api/applications` — Apply (auto-generates cover letter + email)
- `GET /api/applications` — List all user applications
- `GET /api/applications/dashboard` — Stats + notifications
- `PATCH /api/applications/:id/status` — Update application status
- `POST /api/applications/:id/regenerate` — Regenerate cover letter or email

## Features

- JWT-based authentication with password hashing
- AI ranking engine scores opportunities by skill overlap, deadline proximity, and type preference
- Factory pattern generates cover letters, emails, and application responses
- Background cron workers clean expired listings and check upcoming deadlines
- Request validation middleware with custom schema definitions
- Structured JSON logging with daily log rotation
- Protected routes on frontend with automatic token refresh

## End-to-End Flow

1. User registers with name, email, skills, and interests
2. System returns a JWT token
3. User views opportunities ranked by their profile
4. User clicks Apply on a relevant opportunity
5. AI service generates a personalized cover letter and email draft
6. Application is saved with generated content
7. User tracks status across all submitted applications
8. Background workers send deadline reminders for unapplied opportunities

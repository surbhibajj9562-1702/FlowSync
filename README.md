# FlowSync — AI-Driven Workflow Automation Platform

A **learning-focused** workflow automation project. FlowSync helps you reduce repetitive tasks using simple AI assistance: workflow summaries and basic execution insights. It is built for students and beginners, not for production use.

## What This Project Is

- **Basic workflow automation** for learning purposes
- **Simple AI (LLM)** used only for: workflow summaries and supportive execution insights
- **React dashboard** to view, trigger, and monitor workflows
- **Node.js REST API** for creating workflows, listing them, running them, and fetching execution logs
- **PostgreSQL** with minimal schema: `workflows` and `executions` tables
- **Docker** for a consistent local setup only

## Project Structure

```
flowsync/
├── backend/          # Node.js REST API (Express)
├── frontend/         # React dashboard (Vite)
├── docker-compose.yml
└── README.md
```

## Quick Start (Docker)

1. **Prerequisites:** Docker and Docker Compose installed.

2. **Start services:**

   ```bash
   docker compose up -d
   ```

3. **Database schema** is applied automatically by the `migrate` service on first start. If you need to run it manually: copy `backend/drizzle/0000_init.sql` into your PostgreSQL client and run it against the `flowsync` database.

4. **Open the dashboard:** [http://localhost:3000](http://localhost:3000)  
   **API:** [http://localhost:4000](http://localhost:4000)

## Quick Start (Local, without Docker)

1. **PostgreSQL:** Create a database named `flowsync` and run `backend/drizzle/0000_init.sql`.

2. **Backend:**

   ```bash
   cd backend
   cp .env.example .env
   # Edit .env and set DATABASE_URL
   npm install
   npm run db:push   # or run the SQL file manually
   npm run dev
   ```

3. **Frontend:**

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000). The frontend proxies `/api` to the backend (port 4000).

## REST API (Learning)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/workflows` | List all workflows |
| POST | `/api/workflows` | Create a workflow (body: `name`, optional `description`, `definition`) |
| GET | `/api/workflows/:id` | Get one workflow (includes simple AI summary if configured) |
| POST | `/api/workflows/:id/run` | Run a workflow (creates an execution) |
| GET | `/api/executions` | List executions (optional query: `?workflowId=...`) |
| GET | `/api/executions/:id` | Get one execution and its logs (optional AI insight) |

## Environment Variables

**Backend (`backend/.env`):**

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string (required) |
| `PORT` | API port (default: 4000) |
| `OPENAI_API_KEY` | Optional. If set, enables LLM workflow summaries and execution insights |
| `OPENAI_MODEL` | Optional. Model name (default: gpt-4o-mini) |

## Tech Stack (Simple & Educational)

- **Frontend:** React 18, Vite
- **Backend:** Node.js, Express
- **Database:** PostgreSQL, Drizzle ORM
- **AI:** Optional OpenAI API for summaries and insights only
- **Containers:** Docker and Docker Compose for local setup

## Learning Goals

- Understand REST APIs (create, list, run, logs)
- Use a React dashboard to trigger and monitor workflows
- Store workflow definitions and execution state in PostgreSQL
- Use a simple LLM for summaries and insights (no complex agent pipelines)

This project is for **education only**. It is not intended for enterprise or production use.

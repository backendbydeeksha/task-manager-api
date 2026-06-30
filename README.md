# Task Manager REST API

A production-style RESTful API for managing tasks, built with **Node.js**, **Express**, and **MongoDB**. Demonstrates clean MVC architecture, centralized error handling, and field-level input validation — the patterns you see in real-world backend codebases.

## Features

- Full CRUD for Tasks (Create, Read, Update, Delete)
- Filter tasks by `status` and `priority`
- Pagination and sorting on the list endpoint
- Input validation with clear field-level error messages
- Centralized error handling — no repeated `try/catch` in controllers
- Custom `AppError` class for consistent error response shapes
- Mongoose ODM with schema-level validation
- HTTP request logging via Morgan (dev mode)
- Health check endpoint for uptime monitoring
- Graceful startup failure if MongoDB is unreachable

## Tech Stack

| Tool | Purpose |
|---|---|
| Node.js | JavaScript runtime |
| Express | Web framework |
| MongoDB | NoSQL database |
| Mongoose | MongoDB ODM |
| express-validator | Request body validation |
| Morgan | HTTP request logger |
| dotenv | Environment variable config |
| nodemon | Dev auto-reload |

## Endpoints

| Method | Path | Body (JSON) | Description |
|---|---|---|---|
| `GET` | `/api/health` | — | Health check |
| `POST` | `/api/tasks` | `{ title, description?, status?, priority?, dueDate? }` | Create a task |
| `GET` | `/api/tasks` | — | List tasks (filter, paginate, sort) |
| `GET` | `/api/tasks/:id` | — | Get a single task |
| `PUT` | `/api/tasks/:id` | `{ title?, description?, status?, priority?, dueDate? }` | Update a task |
| `DELETE` | `/api/tasks/:id` | — | Delete a task |

### Query Parameters for `GET /api/tasks`

| Parameter | Type | Default | Description |
|---|---|---|---|
| `status` | string | — | Filter: `todo` \| `in-progress` \| `done` |
| `priority` | string | — | Filter: `low` \| `medium` \| `high` |
| `page` | number | `1` | Page number |
| `limit` | number | `10` | Items per page (max 100) |
| `sortBy` | string | `createdAt` | Field to sort by |
| `order` | string | `desc` | `asc` or `desc` |

### Task Schema

| Field | Type | Required | Notes |
|---|---|---|---|
| `title` | String | Yes | Max 100 characters |
| `description` | String | No | Max 500 characters |
| `status` | String | No | `todo` / `in-progress` / `done` — default: `todo` |
| `priority` | String | No | `low` / `medium` / `high` — default: `medium` |
| `dueDate` | ISO 8601 Date | No | e.g. `2024-12-31` |
| `createdAt` | Date | Auto | Set by Mongoose `timestamps` |
| `updatedAt` | Date | Auto | Updated by Mongoose on every save |

## Setup Instructions

### Prerequisites

- **Node.js v18+** — [download](https://nodejs.org)
- **MongoDB** — local install **or** a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/task-manager-api.git
cd task-manager-api
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

```bash
cp .env.example .env
```

Open `.env` and fill in your values:

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/taskmanager
NODE_ENV=development
```

> For Atlas, replace `MONGO_URI` with your connection string, e.g.:
> `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/taskmanager`

### 4. Start the server

**Development** (auto-restarts on save):

```bash
npm run dev
```

**Production**:

```bash
npm start
```

The server starts at `http://localhost:3000`.

## Testing the API

### Health check

```bash
curl http://localhost:3000/api/health
```

### Create a task

```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Build portfolio project",
    "description": "A REST API with Node.js and MongoDB",
    "priority": "high",
    "status": "in-progress",
    "dueDate": "2024-12-31"
  }'
```

### List tasks (filter + paginate)

```bash
curl "http://localhost:3000/api/tasks?status=in-progress&priority=high&page=1&limit=5&sortBy=dueDate&order=asc"
```

### Get one task

```bash
curl http://localhost:3000/api/tasks/TASK_ID_HERE
```

### Update a task

```bash
curl -X PUT http://localhost:3000/api/tasks/TASK_ID_HERE \
  -H "Content-Type: application/json" \
  -d '{ "status": "done" }'
```

### Delete a task

```bash
curl -X DELETE http://localhost:3000/api/tasks/TASK_ID_HERE
```

### Trigger a validation error (missing title)

```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{ "status": "invalid-status" }'
```

## Project Structure

```
task-manager-api/
├── server.js                   # Entry point: connects DB then starts Express
├── src/
│   ├── app.js                  # Express app: middleware, routes, error handler
│   ├── config/
│   │   └── db.js               # MongoDB connection logic
│   ├── models/
│   │   └── task.model.js       # Mongoose schema + model
│   ├── controllers/
│   │   └── task.controller.js  # Route handler functions (business logic)
│   ├── routes/
│   │   └── task.routes.js      # Maps URLs to controllers
│   ├── middleware/
│   │   ├── validateTask.js     # express-validator rules for create + update
│   │   └── errorHandler.js     # Global error handler middleware
│   └── utils/
│       ├── AppError.js         # Custom error class
│       └── asyncHandler.js     # Wraps async handlers to auto-forward errors
├── .env.example                # Template for required environment variables
├── .gitignore
└── package.json
```

## Future Improvements

- **Swagger / OpenAPI docs** — auto-generated interactive API documentation at `/api/docs`
- **Soft delete** — archive tasks instead of permanently deleting them, with a `DELETE /api/tasks/:id/restore` endpoint
- **Authentication** — JWT-based auth so each user manages their own task list
- **Rate limiting** — prevent API abuse with `express-rate-limit`
- **Unit & integration tests** — Jest test suite with MongoDB Memory Server for fast, isolated tests
- **Search** — full-text search on title and description using MongoDB text indexes

---

Built with Node.js · Express · MongoDB

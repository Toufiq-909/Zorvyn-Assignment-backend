# Zorvyn Backend

A simple REST API for managing financial records with role-based access control.

## What it does

- Users log in and get a JWT token
- That token is used to call protected routes
- What you can do depends on your role: **viewer**, **analyst**, or **admin**

## Roles at a glance

| Role     | Can do |
|----------|--------|
| viewer   | View summary, recent activity, and trends |
| analyst  | Everything viewer can + browse all records |
| admin    | Full access including creating/deleting records and managing users |

## Quick Start

**Base URL:** `http://localhost:3000`

1. Call `POST /auth/login` with your username and password
2. Copy the `token` from the response
3. Pass it as a `token` header on every other request

```
token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Main Endpoints

| Method | Route | Who can use it |
|--------|-------|----------------|
| POST | `/auth/login` | Everyone |
| POST | `/auth/change` | Everyone |
| GET | `/record/summary` | viewer, analyst, admin |
| GET | `/record/recent` | viewer, analyst, admin |
| GET | `/record/trends` | viewer, analyst, admin |
| GET | `/record/` | analyst, admin |
| POST | `/record/create` | admin only |
| POST | `/record/delete` | admin only |
| PUT | `/record/update` | admin only |
| PUT | `/record/recover` | admin only |
| POST | `/user/create` | admin only |
| PUT | `/user/delete` | admin only |
| PUT | `/user/recover` | admin only |
| GET | `/user/` | admin only |

## Rate Limits

All routes (except `/auth/*`) are rate limited per user per minute:

- admin: 3 requests/min
- analyst: 2 requests/min
- viewer: 1 request/min

Exceeding the limit returns `429 Too Many Requests`.

## First-time Login

New users receive a system-generated password via email. On first login, the API will return an error prompting a password change. Use `POST /auth/change` to set a new password before proceeding.


# CareQueue — Hospital Queue Management System

CareQueue is a React + Vite frontend prototype for hospital digital token and queue management. The repository is organized into separate frontend, backend, and database areas.

## Repository structure

- `frontend/` — existing React + Vite UI and current demo token flow.
- `backend/` — Express API starter with a health-check endpoint. Patient authentication and persistent token APIs are not implemented yet.
- `database/` — reserved for database schema, migrations, and seed data. No database is configured yet.

## Requirements

- Node.js 20.19+ (or a compatible version supported by the installed Vite release)
- npm

## Install dependencies

Run from the repository root:

```bash
npm install
```

## Run the frontend

```bash
npm run dev
```

## Run the backend API

Open another terminal at the repository root:

```bash
npm run dev:backend
```

The backend health endpoint is available at `http://localhost:5000/api/health` by default. Set backend environment variables using `backend/.env` (copy `backend/.env.example` first). Never commit real secrets.

## Build and lint the frontend

```bash
npm run build
npm run lint
```

## Current implementation status

The existing UI uses in-memory demo data. Tokens are not persisted to a database, and the patient login is not production-grade authentication. These features must be implemented and tested separately before production use.
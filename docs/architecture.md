# Architecture

## Overview

This is a **Next.js Web Application** built with Next.js 13+ (App Router).

## Architecture Pattern

### Component-Based Architecture

The application follows a component-based architecture typical of Next.js applications:

```
Frontend (Next.js App Router)
├── Pages (Route Handlers)
├── Layouts (Nested UI)
├── Components (Reusable UI Elements)
├── API Routes (Backend Endpoints)
└── Shared Utilities (lib/)
```

## Technology Stack

{
  "language": "TypeScript",
  "framework": "Next.js 13+ (App Router)",
  "styling": "Tailwind CSS",
  "package_manager": "npm",
  "build_system": "Next.js",
  "testing": "TBD",
  "database": "TBD",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "key_dependencies": [
    "@types/node",
    "@types/react",
    "@types/react-dom",
    "autoprefixer",
    "eslint",
    "eslint-config-next",
    "next",
    "postcss",
    "react",
    "react-dom"
  ]
}

## Directory Structure

### `/app/`
Contains Next.js App Router pages, layouts, and route handlers.

### `/lib/`
Shared utilities, helpers, and business logic.

### `/public/`
Static assets served directly.

### `/components/`
Reusable UI components.

### `/_bmad/`
BMAD project configuration and orchestration files.

## Data Flow

1. **User Interaction** → Next.js Components
2. **Client Events** → API Routes or Client-side Processing
3. **Data Persistence** → Backend API/Database
4. **State Management** → React Context or Similar

## Deployment Pattern

- **Build:** Next.js builds static and server-side components
- **Runtime:** Node.js server running Next.js application
- **Hosting:** Suitable for Node.js hosting platforms (Vercel, Railway, etc.)

---

Generated: 2026-03-28 16:04:39

# Development Guide

## Prerequisites

- Node.js 18+
- npm or yarn
- Git

## Installation

```bash
# Install dependencies
npm install

# Install BMAD dependencies
pip install pyyaml
```

## Environment Setup

Create `.env.local` in project root with required variables:

```
# Add your environment variables here
```

## Development Commands

### Start Development Server

```bash
npm run dev
```

Server runs on `http://localhost:3000`

### Build for Production

```bash
npm run build
```

### Start Production Server

```bash
npm start
```

### Run Tests

```bash
npm test
```

### Linting & Code Quality

```bash
npm run lint
```

## Project Structure for Development

- **Components:** `/app/` - Add new pages or layouts here
- **API Routes:** `/app/api/` - Add backend endpoints here
- **Utilities:** `/lib/` - Add shared functions and helpers here
- **Styles:** Global styles in `app/globals.css`, component-level in Tailwind

## Key Technologies

- **Next.js 13+** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **React** - UI library

## Common Development Tasks

### Adding a New Page

1. Create file in `app/yourpage/page.tsx`
2. Add routes automatically available

### Adding an API Endpoint

1. Create file in `app/api/yourroute/route.ts`
2. Implement GET, POST, PUT, DELETE handlers

### Using Shared Utilities

```typescript
import { utilityFunction } from "@/lib/utilities";
```

## Debugging

- Use Next.js built-in debug tools
- Browser DevTools (F12)
- VS Code Debugger integration

## Performance Optimization

- Next.js handles code splitting automatically
- Use dynamic imports for heavy components
- Optimize images with Next.js Image component

---

Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

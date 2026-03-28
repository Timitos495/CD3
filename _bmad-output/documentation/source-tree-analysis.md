# Source Tree Analysis

## Project Structure Overview

```
CD3 - Coffee Dashboard/
│
├── app/                          # Next.js App Router (13+)
│   ├── api/                      # API Routes
│   │   ├── index/               # Index data endpoints
│   │   ├── shot/                # Shot management endpoints
│   │   └── shots/               # Shots collection endpoints
│   ├── error.tsx                # Error boundary component
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   ├── loading.tsx              # Loading UI
│   ├── page.tsx                 # Home page
│   └── ShotDashboard.tsx        # Dashboard component
│
├── lib/                          # Shared utilities
│   └── visualizer.ts            # Visualization utilities
│
├── public/                       # Static assets
│   └── [static files]
│
├── _bmad/                        # BMAD ecosystem
│   ├── core/                    # Core BMAD modules
│   ├── bmb/                     # BMAD Builder
│   ├── bmm/                     # BMAD Method
│   └── _config/                 # Configuration
│
├── _bmad-output/                 # Generated outputs
│   ├── implementation-artifacts/
│   └── planning-artifacts/
│
├── docs/                         # Project documentation (generated)
│
├── .github/                      # GitHub configuration
│
├── Configuration Files
│   ├── next.config.js           # Next.js configuration
│   ├── tsconfig.json            # TypeScript configuration
│   ├── tailwind.config.ts       # Tailwind CSS configuration
│   ├── postcss.config.js        # PostCSS configuration
│   ├── package.json             # Dependencies
│   └── .env.local               # Environment variables (local)
│
└── Other Files
    ├── README.md
    ├── .gitignore
    └── next-env.d.ts            # Next.js type definitions

```

## Critical Directories

### API Routes (`app/api/`)
Handles backend functionality:
- `index/` - Index/search endpoints
- `shot/` - Individual shot operations
- `shots/` - Shot collection operations

### Page Components (`app/`)
Defines routes and UI:
- `page.tsx` - Home/dashboard page
- `layout.tsx` - Root layout wrapper
- `ShotDashboard.tsx` - Dashboard UI component

### Utilities (`lib/`)
- `visualizer.ts` - Data visualization utilities

## Entry Points

- **Web Application:** `app/page.tsx` (Next.js initial page)
- **API Handlers:** `app/api/` (Route handlers)
- **Build:** Next.js bundler (configured in `next.config.js`)

---

Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

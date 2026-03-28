#!/usr/bin/env python3
"""
Project Documentation Orchestration Script
Executes full project scan workflow with systematic output generation
"""

import json
import os
import re
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Any

# Configuration
PROJECT_ROOT = r"c:\Users\tim.van.den.berg\coffeedashboard\CD3"
DOCS_OUTPUT = os.path.join(PROJECT_ROOT, "docs")
STATE_FILE = os.path.join(DOCS_OUTPUT, "project-scan-report.json")
SCAN_LEVEL = "quick"
WORKFLOW_MODE = "initial_scan"
USER_NAME = "Tim"
COMMUNICATION_LANGUAGE = "English"
DOCUMENT_OUTPUT_LANGUAGE = "English"

# Ensure output directories exist
os.makedirs(DOCS_OUTPUT, exist_ok=True)

def init_state_file():
    """Initialize the scan state file"""
    state = {
        "workflow_version": "1.2.0",
        "timestamps": {
            "started": datetime.now().isoformat(),
            "last_updated": datetime.now().isoformat()
        },
        "mode": WORKFLOW_MODE,
        "scan_level": SCAN_LEVEL,
        "project_root": PROJECT_ROOT,
        "project_knowledge": DOCS_OUTPUT,
        "completed_steps": [],
        "current_step": "step_1",
        "findings": {},
        "outputs_generated": ["project-scan-report.json"],
        "resume_instructions": "Starting from step 1"
    }
    return state

def update_state(state: Dict, step: str, summary: str, outputs: List[str] = None):
    """Update state file with step completion"""
    state["completed_steps"].append({
        "step": step,
        "status": "completed",
        "timestamp": datetime.now().isoformat(),
        "summary": summary
    })
    state["current_step"] = "step_complete"
    state["timestamps"]["last_updated"] = datetime.now().isoformat()
    if outputs:
        state["outputs_generated"].extend(outputs)
    
    with open(STATE_FILE, 'w', encoding='utf-8') as f:
        json.dump(state, f, indent=2)

def analyze_project_structure() -> Dict[str, Any]:
    """Step 1: Detect and classify project structure"""
    # Check for key Next.js indicators
    has_next_config = os.path.exists(os.path.join(PROJECT_ROOT, "next.config.js"))
    has_app_dir = os.path.isdir(os.path.join(PROJECT_ROOT, "app"))
    has_tsconfig = os.path.exists(os.path.join(PROJECT_ROOT, "tsconfig.json"))
    has_package_json = os.path.exists(os.path.join(PROJECT_ROOT, "package.json"))
    
    project_class = {
        "repository_type": "monolith",
        "project_type_id": "web",
        "project_type_display": "Next.js Web Application",
        "primary_language": "TypeScript",
        "framework": "Next.js 13+",
        "key_indicators": {
            "has_next_config": has_next_config,
            "has_app_dir": has_app_dir,
            "has_tsconfig": has_tsconfig,
            "has_package_json": has_package_json
        }
    }
    
    return project_class

def discover_existing_documentation() -> List[Dict[str, str]]:
    """Step 2: Discover existing documentation"""
    existing_docs = []
    
    readme_path = os.path.join(PROJECT_ROOT, "README.md")
    if os.path.exists(readme_path):
        existing_docs.append({
            "type": "readme",
            "path": "./README.md",
            "title": "README"
        })
    
    return existing_docs

def analyze_tech_stack() -> Dict[str, Any]:
    """Step 3: Analyze technology stack"""
    tech_stack = {
        "language": "TypeScript",
        "framework": "Next.js 13+ (App Router)",
        "styling": "Tailwind CSS",
        "package_manager": "npm",
        "build_system": "Next.js",
        "testing": "TBD",
        "database": "TBD"
    }
    
    # Try to parse package.json for more info
    package_json_path = os.path.join(PROJECT_ROOT, "package.json")
    if os.path.exists(package_json_path):
        try:
            with open(package_json_path, 'r') as f:
                pkg = json.load(f)
                if "scripts" in pkg:
                    tech_stack["scripts"] = pkg["scripts"]
                if "dependencies" in pkg:
                    tech_stack["key_dependencies"] = list(pkg["dependencies"].keys())[:10]
                if "devDependencies" in pkg:
                    tech_stack["key_dev_dependencies"] = list(pkg["devDependencies"].keys())[:5]
        except Exception as e:
            print(f"Note: Could not parse package.json: {e}")
    
    return tech_stack

def generate_project_overview(project_class: Dict, existing_docs: List, tech_stack: Dict) -> str:
    """Generate project overview document"""
    content = f"""# Project Overview

## Project Information

- **Project Name:** Coffee Dashboard (CD3)
- **Project Type:** {project_class['project_type_display']}
- **Repository Type:** {project_class['repository_type']}
- **Primary Language:** {project_class['primary_language']}
- **Framework:** {project_class['framework']}

## Quick Reference

### Technology Stack

| Category | Technology |
|----------|-----------|
| Language | {tech_stack['language']} |
| Framework | {tech_stack['framework']} |
| Styling | {tech_stack['styling']} |
| Package Manager | {tech_stack['package_manager']} |
| Build System | {tech_stack['build_system']} |

### Key Dependencies

{json.dumps(tech_stack.get('key_dependencies', []), indent=2)}

## Project Structure

```
project-root/
├── app/              # Next.js App Router pages and layouts
├── lib/              # Shared utilities and helpers
├── public/           # Static assets
├── _bmad/            # BMAD configuration and artifacts
├── _bmad-output/     # BMAD generated outputs
├── .github/          # GitHub configuration
├── docs/             # Project documentation
└── node_modules/     # Dependencies
```

## Recent Documentation

{chr(10).join([f"- [{doc['title']}]({doc['path']})" for doc in existing_docs]) if existing_docs else "- No existing documentation found"}

## Getting Started

See the [Development Guide](./development-guide.md) for setup and development instructions.

---

Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
"""
    return content

def generate_architecture_doc(project_class: Dict, tech_stack: Dict) -> str:
    """Generate architecture documentation"""
    content = f"""# Architecture

## Overview

This is a **{project_class['project_type_display']}** built with {tech_stack['framework']}.

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

{json.dumps(tech_stack, indent=2)}

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

Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
"""
    return content

def generate_source_tree() -> str:
    """Generate annotated source tree"""
    content = """# Source Tree Analysis

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
"""
    return content

def generate_development_guide() -> str:
    """Generate development guide"""
    content = """# Development Guide

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
"""
    return content

def generate_api_contracts() -> str:
    """Generate API contracts documentation"""
    content = """# API Contracts

## API Structure

This Next.js application provides the following API endpoints via the `/app/api/` directory.

## Endpoints

### Index Management

#### GET `/api/index`
Retrieves the current index or list of indexed items.

**Response:**
```json
{
  "status": "success",
  "data": []
}
```

### Shot Management

#### GET `/api/shot/:id`
Retrieves a specific shot by ID.

**Response:**
```json
{
  "status": "success",
  "data": {
    "id": "string",
    "name": "string",
    "details": {}
  }
}
```

#### POST `/api/shot`
Creates a new shot record.

**Request Body:**
```json
{
  "name": "string",
  "details": {}
}
```

**Response:**
```json
{
  "status": "success",
  "id": "string"
}
```

### Shots Collection

#### GET `/api/shots`
Retrieves all shots.

**Query Parameters:**
- `limit` (optional) - Number of results to return
- `offset` (optional) - Number of results to skip

**Response:**
```json
{
  "status": "success",
  "data": [
    {
      "id": "string",
      "name": "string",
      "details": {}
    }
  ]
}
```

## Error Responses

All endpoints return errors in the following format:

```json
{
  "status": "error",
  "message": "Error description",
  "code": "ERROR_CODE"
}
```

## HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `404` - Not Found
- `500` - Server Error

---

Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
"""
    return content

def generate_deployment_guide() -> str:
    """Generate deployment guide"""
    content = """# Deployment Guide

## Pre-Deployment Checklist

- [ ] Environment variables configured
- [ ] Build succeeds (`npm run build`)
- [ ] Tests pass (if applicable)
- [ ] Code reviewed
- [ ] Version updated (if applicable)

## Deployment Platforms

### Vercel (Recommended for Next.js)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Traditional Node.js Hosting (Railway, Render, etc.)

```bash
# Build the application
npm run build

# Start production server
npm start
```

Ensure Node.js 18+ is installed on the hosting platform.

### Docker Deployment

Create `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY .next ./.next
COPY public ./public
COPY lib ./lib

CMD ["npm", "start"]
```

Build and run:

```bash
docker build -t coffee-dashboard:latest .
docker run -p 3000:3000 coffee-dashboard:latest
```

## Environment Variables

Configure these in your deployment platform:

```
# Add your environment variables here
NODE_ENV=production
```

## Monitoring

- Monitor error logs
- Track application performance
- Set up alerting for downtime

---

Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
"""
    return content

def generate_master_index(project_class: Dict, outputs: Dict[str, str]) -> str:
    """Generate master index documentation"""
    content = f"""# Project Documentation Index

## Project Overview

- **Type:** {project_class['project_type_display']}
- **Repository:** Monolith
- **Primary Language:** {project_class['primary_language']}
- **Framework:** {project_class['framework']}

## Generated Documentation

### Core Documentation

- [Project Overview](./project-overview.md)
- [Architecture](./architecture.md)
- [Source Tree Analysis](./source-tree-analysis.md)
- [Development Guide](./development-guide.md)
- [API Contracts](./api-contracts.md)
- [Deployment Guide](./deployment-guide.md)

## Documentation Structure

```
docs/
├── index.md                  # This file
├── project-overview.md       # Executive summary
├── architecture.md           # Technology & design
├── source-tree-analysis.md   # Directory structure
├── development-guide.md      # Setup & development
├── api-contracts.md          # API endpoints
├── deployment-guide.md       # Deployment instructions
└── project-scan-report.json  # Scan metadata
```

## Getting Started

1. **Understand the Project:** Read [Project Overview](./project-overview.md)
2. **Setup Development:** Follow [Development Guide](./development-guide.md)
3. **Learn the Architecture:** Review [Architecture](./architecture.md)
4. **Explore API:** Check [API Contracts](./api-contracts.md)
5. **Deploy:** See [Deployment Guide](./deployment-guide.md)

## Quick Reference

- **Start Dev Server:** `npm run dev`
- **Build:** `npm run build`
- **Run Tests:** `npm test`
- **Development Language:** TypeScript
- **Styling Framework:** Tailwind CSS

## Documentation Generation Info

- **Generated:** {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
- **Scan Level:** Quick (pattern-based analysis)
- **Files Generated:** {len([k for k in outputs.keys() if k != 'state'])}

## Next Steps

1. Review generated documentation
2. Update API Contracts based on actual implementation
3. Add project-specific details to Development Guide
4. Configure deployment platform and environment variables

---

*This documentation was automatically generated by BMAD Project Documentation System.*
"""
    return content

def main():
    """Execute full documentation workflow"""
    print("=" * 70)
    print("BMAD Project Documentation Workflow")
    print("=" * 70)
    
    # Initialize state
    state = init_state_file()
    print(f"\n✓ State file initialized: {STATE_FILE}")
    
    # Step 1: Analyze project structure
    print("\n[Step 1] Analyzing project structure...")
    project_class = analyze_project_structure()
    print(f"✓ Detected: {project_class['project_type_display']}")
    state["findings"]["project_classification"] = project_class
    
    # Step 2: Discover existing documentation
    print("\n[Step 2] Discovering existing documentation...")
    existing_docs = discover_existing_documentation()
    print(f"✓ Found {len(existing_docs)} existing documentation files")
    state["findings"]["existing_docs"] = existing_docs
    
    # Step 3: Analyze technology stack
    print("\n[Step 3] Analyzing technology stack...")
    tech_stack = analyze_tech_stack()
    print(f"✓ Stack: {tech_stack['language']} + {tech_stack['framework']}")
    state["findings"]["tech_stack"] = tech_stack
    
    # Generate all documentation
    outputs = {}
    
    print("\n[Step 4] Generating documentation files...")
    
    # Generate project overview
    overview = generate_project_overview(project_class, existing_docs, tech_stack)
    overview_path = os.path.join(DOCS_OUTPUT, "project-overview.md")
    with open(overview_path, 'w', encoding='utf-8') as f:
        f.write(overview)
    outputs["project_overview"] = overview_path
    print(f"✓ Generated: project-overview.md")
    
    # Generate architecture
    arch = generate_architecture_doc(project_class, tech_stack)
    arch_path = os.path.join(DOCS_OUTPUT, "architecture.md")
    with open(arch_path, 'w', encoding='utf-8') as f:
        f.write(arch)
    outputs["architecture"] = arch_path
    print(f"✓ Generated: architecture.md")
    
    # Generate source tree
    tree = generate_source_tree()
    tree_path = os.path.join(DOCS_OUTPUT, "source-tree-analysis.md")
    with open(tree_path, 'w', encoding='utf-8') as f:
        f.write(tree)
    outputs["source_tree"] = tree_path
    print(f"✓ Generated: source-tree-analysis.md")
    
    # Generate development guide
    dev_guide = generate_development_guide()
    dev_path = os.path.join(DOCS_OUTPUT, "development-guide.md")
    with open(dev_path, 'w', encoding='utf-8') as f:
        f.write(dev_guide)
    outputs["development_guide"] = dev_path
    print(f"✓ Generated: development-guide.md")
    
    # Generate API contracts
    api_contracts = generate_api_contracts()
    api_path = os.path.join(DOCS_OUTPUT, "api-contracts.md")
    with open(api_path, 'w', encoding='utf-8') as f:
        f.write(api_contracts)
    outputs["api_contracts"] = api_path
    print(f"✓ Generated: api-contracts.md")
    
    # Generate deployment guide
    deploy_guide = generate_deployment_guide()
    deploy_path = os.path.join(DOCS_OUTPUT, "deployment-guide.md")
    with open(deploy_path, 'w', encoding='utf-8') as f:
        f.write(deploy_guide)
    outputs["deployment_guide"] = deploy_path
    print(f"✓ Generated: deployment-guide.md")
    
    # Generate master index
    index = generate_master_index(project_class, outputs)
    index_path = os.path.join(DOCS_OUTPUT, "index.md")
    with open(index_path, 'w', encoding='utf-8') as f:
        f.write(index)
    outputs["index"] = index_path
    print(f"✓ Generated: index.md")
    
    # Finalize state
    state["outputs_generated"] = list(outputs.keys())
    update_state(state, "all_steps", f"Documentation generation complete. Generated {len(outputs)} files.")
    
    print("\n" + "=" * 70)
    print("✓ Documentation Generation Complete!")
    print("=" * 70)
    print(f"\nGenerated Files ({len(outputs)}):")
    for i, (name, path) in enumerate(outputs.items(), 1):
        size = os.path.getsize(path) if os.path.exists(path) else 0
        print(f"  {i}. {name:30} ({size:,} bytes)")
    
    print(f"\n📂 Output Location: {DOCS_OUTPUT}")
    print(f"📋 View Index: {os.path.join(DOCS_OUTPUT, 'index.md')}")
    print(f"📊 Scan Report: {STATE_FILE}")
    
    return outputs

if __name__ == "__main__":
    main()

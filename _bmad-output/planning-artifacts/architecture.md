---
project: CD3
workflow: architecture
status: COMPLETE
stepsCompleted: [1, 2, 3, 4, 5]
date: 2026-03-28
completedDate: 2026-03-28
communicationLanguage: English
documentOutputLanguage: English
inputDocuments:
  - docs/project-overview.md
  - docs/api-contracts.md
  - docs/development-guide.md
  - docs/architecture.md
workflowPath: ./.github/skills/bmad-create-architecture
readyForImplementation: true
---

# CD3 Architecture Decisions

## Project Context Analysis

### Project Overview
CD3 (Coffee Dashboard) is a Next.js web application for visualizing and analyzing espresso shot data. 
It connects to an external Visualizer API to fetch shot metadata and detailed metrics.

### Core Functionality
- Display indexed list of espresso shots with filtering (bean type, roaster, date range)
- Show detailed shot data with visualizations (pressure, flow, weight graphs)
- Mini sparklines for quick visual scanning
- Filter and paginate through shot history

### Critical Constraint: Visualizer API Rate Limits
- **50 calls per minute** (1 request every 1.2 seconds at max)
- **200 calls per 10 minutes** (stricter rolling limit)
- **Problem**: Current polling strategy exceeds limits and fails

### Architectural Requirements (Derived from Constraint)

**Non-Functional Requirements:**
1. Request throttling - must respect rate limits
2. Caching layer - avoid redundant fetches
3. Request deduplication - consolidate duplicate requests
4. Graceful degradation - handle rate limit errors
5. Exponential backoff - retry strategy for failures
6. Request queuing - buffer burst requests

**Technical Constraints:**
- API calls are the bottleneck, not compute
- Frontend state management must prevent cascade fetches
- Component re-renders could trigger unintended requests
- Filtering operations shouldn't re-fetch unnecessarily

### Project Complexity Assessment
- **Scope**: Single-purpose visualization dashboard
- **Technical Complexity**: Medium (driven by rate-limit management)
- **Integration Complexity**: High (strict external API constraints)
- **Data Complexity**: Low to medium (tabular + graph data)

### Cross-Cutting Architectural Concerns
1. **Request Management Layer** - affects index fetch, shot detail fetch, pagination
2. **Caching Strategy** - must span multiple components
3. **Error Handling** - rate limit errors require special handling (vs transient errors)
4. **State Synchronization** - ensure all components respect cached state

---

## Architectural Decisions

### Decision 1: Request Management Layer
**Choice:** React Query v5.95.2

**Rationale:**
- Solves rate-limiting problem at architectural level (handles dedup + caching automatically)
- Battle-tested, industry standard for React data fetching
- Zero dependencies, minimal bundle impact
- Handles cascading refetch scenarios that custom solutions miss
- Built for exactly this constraint problem

**Version:** @tanstack/react-query@5.95.2 (verified 2026-03-28, published 5 days ago)

---

### Decision 2: React Query Configuration

**Query Stale Times:**
- Dashboard queries (`/api/index`, `/api/shot?id=X`): **10 minutes**
- Insights queries (`/api/shots` shared for analytics): **10 minutes**

**Rationale for 10min:**
- At most 6 requests per shot per hour = well under 50/min limit
- Users work interactively; data freshness beyond 10min acceptable
- Reduces cognitive load of managing stale windows

**Custom Retry Strategy on Rate-Limit Errors:**
- Enabled: YES
- Detect 429 (Too Many Requests) responses
- Never retry 429 with default exponential backoff
- Route initial 429 to global error handler (See Decision 3)

**Rationale:**
- Prevents API hammering when rate-limit is hit
- Delegates to global queue strategy rather than local retry

---

### Decision 3: Error Handling & Rate-Limit Response Strategy

**Strategy: A+B+C Comprehensive Approach**

**A) Aggressive Backoff on 429:**
- When 429 detected: Wait 60 seconds minimum before retrying
- Then use exponential backoff for subsequent retries
- Never retry immediately

**B) Global Query Pause:**
- On first 429 error: Pause ALL React Query queries globally
- Stop all new requests from firing
- Maintain cached data visibility during pause
- Resume after cooldown period

**C) User Notification:**
- Display toast/banner: "API rate limit reached. Retrying in X seconds..."
- Show countdown timer
- Allow manual retry button
- Maintain all existing UI state during pause

**Rationale:**
- Prevents cascading failures when limit hit
- User transparency reduces confusion
- Graceful degradation instead of silent failures

---

### Decision 4: Asymmetric Refetch Strategy

**Dashboard Tab Queries:**
- `refetchOnWindowFocus: true` 
- Users expect fresh shot list when switching tabs
- Real-time data is critical for dashboard usability

**Insights Tab Queries:**
- `refetchOnWindowFocus: false`
- Analytics are historical (this week's patterns), not real-time
- Prevents unnecessary API hits when user switches tabs frequently
- Reduces query volume without impacting UX

**Rationale:**
- Separates concerns: live data vs historical analytics
- Prevents tab-switching cascade from hitting rate limits
- Users don't expect insights to update on tab switch (acceptable UX)

---

### Decision 5: Query Key Strategy

**Dashboard Queries:**
```
queryKey: ['index'] → /api/index
queryKey: ['shot', shotId] → /api/shot?id={shotId}
```

**Insights Queries:**
```
queryKey: ['shots'] → /api/shots (shared across all 3 analytics components)
```

**Rationale:**
- Single `/api/shots` call deduped across Roaster Mix, Profile Mix, Caffeine components
- React Query automatic dedup prevents 3 parallel requests
- Dashboard queries isolated from insights to allow selective refetch

---

### Decision 6: Caching & Garbage Collection

**React Query Defaults:**
- Unused queries garbage collected after 5 minutes
- Cache persists during active session
- No session storage/localStorage persistence (for now)

**Why Defaults:**
- Sufficient for single-session dashboard use
- Avoids stale data across sessions
- Can be enhanced later if needed

---

## Implementation Prerequisites

Before implementation can proceed:

1. ✅ React Query v5.95.2 must be installed
2. ✅ Create React Query Provider wrapper in layout
3. ✅ Implement 429 error handler (global interceptor)
4. ✅ Create rate-limit notification UI component
5. ✅ Configure query-specific stale times and refetch behaviors
6. ⏳ Add Recharts dependency for Insights Tab

## Cross-Tab Request Volume Analysis

**Dashboard-only scenario:**
- Page load: 1 request (`/api/index`)
- User clicks 5 shots: 5 requests (cached)
- **Total: 6 requests** ✓ Safe

**Dashboard + Insights scenario:**
- Page load (Dashboard): 1 request
- Click 5 shots: 5 requests (cached)
- Switch to Insights: 1 request (`/api/shots`, shared)
- Switch back (no refetch): 0 requests (cached)
- **Total: 7 requests** ✓ Safe

**Dashboard + Insights with aggressive tab switching:**
- Dashboard: 1 request
- Insights: 1 request
- Dashboard (refetch): 1 request (Dashboard queries refetch on focus)
- Insights: 0 (insights don't refetch on focus)
- **Total: 3 requests in quick sequence** ✓ Within limits

**At-limit scenario (burst)**
- Rapid 50 clicks across both tabs
- React Query queues dedup → ~8-10 unique queries maximum
- Spread over ~60 seconds with caching
- **Rate: ~10/min average** ✓ Safely under 50/min

---

## Implementation Patterns & Consistency Rules

All AI agents working on CD3 must follow these patterns to ensure coherent, conflict-free code.

### Pattern 1: React Query Key Naming (Hierarchical + Simple)

**Query Key Format:**

```typescript
// Dashboard queries
queryKey: ['api', 'index']                    // GET /api/index
queryKey: ['api', 'shot', shotId]            // GET /api/shot?id={shotId}

// Insights queries
queryKey: ['api', 'shots', 'analytics']      // GET /api/shots (shared for analytics)
```

**Rationale:**
- Hierarchical keys enable scoping and debugging
- Simple for single-endpoint queries
- Scales for future multi-endpoint queries
- Mnemonic: `['api', 'resource', 'variant?']`

---

### Pattern 2: Error Handling (QueryClient defaultOptions + Per-Query Override)

**QueryClient Setup (`lib/api/queryClient.ts`):**

```typescript
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10 * 60 * 1000,           // 10 minutes
      gcTime: 1000 * 60 * 5,               // 5 minutes (garbage collection)
      retry: (failureCount, error: any) => {
        // Never retry rate-limit errors
        if (error.status === 429) {
          return false; // Let error handler catch it
        }
        // Retry transient errors up to 3 times
        return failureCount < 3 && isTransientError(error);
      },
      refetchOnWindowFocus: true,           // Dashboard: refresh on tab switch
    },
  },
});
```

**Per-Query Override (Insights queries):**

```typescript
const { data } = useQuery({
  queryKey: ['api', 'shots', 'analytics'],
  queryFn: fetchShots,
  refetchOnWindowFocus: false,  // ⚠️ Override: Don't refetch on tab switch
});
```

---

### Pattern 3: Loading States (React Query Direct, No Wrapper)

**Usage Pattern:**

```typescript
const { data: index, isPending: indexLoading } = useQuery({
  queryKey: ['api', 'index'],
  queryFn: fetchIndex,
});

if (indexLoading) {
  return <Spinner />;
}
```

**Why Direct (No Wrapper Hook):**
- React Query states are explicit and clear
- Standard patterns users expect
- Less indirection = fewer bugs

---

### Pattern 4: Configuration Organization (QueryClient + .env.local)

**Directory Structure:**

```
lib/
  api/
    queryClient.ts          ← React Query config
    errorHandler.ts         ← 429 & error handling logic

.env.local (in project root)
  NEXT_PUBLIC_RATE_LIMIT_THRESHOLD=50      # requests/min
  NEXT_PUBLIC_RATE_LIMIT_WINDOW=60000      # milliseconds
```

**Rationale:**
- Single source of truth for React Query config
- Environment variables override for deployment-specific settings
- Clear separation between config (file-based) and logic (code)

---

### Pattern 5: Hook Organization (Domain-Based, Co-Located)

**Directory Structure:**

```
app/
  shots/
    components/
      ShotDashboard.tsx
    hooks/
      useIndex.ts          ← Fetches /api/index
      useShot.ts           ← Fetches /api/shot?id=X
    
  insights/
    components/
      InsightsTab.tsx
    hooks/
      useAnalytics.ts      ← Fetches /api/shots (used by all 3 charts)
```

**Naming Pattern:** `use[Noun]` — makes it clear what data is fetched
- `useIndex()` → fetches index
- `useShot(id)` → fetches shot
- `useAnalytics()` → fetches analytics

---

### Pattern 6: API Error Response Format

**All API Endpoints Return:**

```json
{
  "status": 200,
  "message": "Success message or null",
  "data": { /* actual response data */ }
}
```

**Error Responses:**

```json
{
  "status": 429,
  "message": "Rate limit exceeded",
  "data": { "retryAfter": 60 }
}
```

**Implementation (Route Handler):**

```typescript
// app/api/shot/route.ts
export async function GET(request: Request) {
  try {
    const shotId = new URL(request.url).searchParams.get('id');
    if (!shotId) {
      return Response.json(
        { status: 400, message: 'Missing ID', data: null },
        { status: 400 }
      );
    }
    
    const shot = await fetchVisualizerShot(shotId);
    return Response.json({
      status: 200,
      message: null,
      data: shot,
    });
  } catch (error: any) {
    if (error.status === 429) {
      return Response.json(
        { status: 429, message: 'Rate limited', data: { retryAfter: 60 } },
        { status: 429 }
      );
    }
    return Response.json(
      { status: 500, message: 'Internal error', data: null },
      { status: 500 }
    );
  }
}
```

---

## Pattern Enforcement

**All AI Agents MUST:**

1. ✅ Use hierarchical React Query keys (`['api', 'resource', 'variant?']`)
2. ✅ Handle errors in `QueryClient.defaultOptions`, override only when needed
3. ✅ Use React Query hooks directly (no wrapper layers)
4. ✅ Keep React Query config in `lib/api/queryClient.ts`
5. ✅ Organize hooks by domain, co-located with components
6. ✅ Return `{ status, message, data }` from all API endpoints

---

## Summary

The six implementation patterns above establish the architectural consistency rules for all code written on CD3. They prevent conflicts between AI agents, lock down decisions made above, and provide clear implementation templates for developers and AI systems alike.

---
stepsCompleted: [1]
inputDocuments: 
  - docs/index.md
  - README.md
  - Conversational sketch from UX discovery session (2026-03-28)
projectName: Coffee Dashboard (CD3)
featureArea: Insights Tab - Analytics & Analytics Discovery
author: Sally (UX Designer) & Tim (Product Stakeholder)
date: 2026-03-28
communicationLanguage: English
documentLanguage: English
---

# UX Design Specification: Insights Tab

**Coffee Dashboard (CD3)** — Analytics & Curiosity-Driven Discovery

---

## 1. Feature Overview

### The Vision

Transform the Coffee Dashboard from a **data logger** into an **insights companion**. The new **Insights Tab** surfaces patterns in your coffee ritual through three interconnected analytics views, answering questions through pure data without prescriptive nudges.

### Core Questions Answered

1. **Roaster Mix:** "Which roasters am I actually using? Am I exploring the full potential of my collection?"
2. **Profile Mix:** "How am I using my Decent DE1PRO? Which machine profiles am I exploiting?"
3. **Caffeine Rhythm:** "What's my actual coffee consumption pattern this week? When do I drink the most?"

### Design Philosophy

- **Pure Data, No Judgment** — Present facts, let users draw their own conclusions
- **Curiosity-Driven Discovery** — Interactions invite exploration without prescribing behavior
- **Precision Coffee Culture** — Respect the craft; data reflects intentional experimentation
- **One-Week Timeframe** — Short enough for weekly reflection, long enough to show patterns

---

## 2. User Journey & Interaction Flows

### 2.1 Landing in Insights (First-Time Experience)

```
User: Clicks "Insights" Tab
  ↓
Page transitions smoothly (slight fade/slide)
  ↓
Three analytics cards appear in view:
  - Roaster Mix (left, 1/3 width)
  - Profile Mix (right, 1/3 width)
  - Caffeine This Week (full width below)
  ↓
User scans and notices patterns
```

### 2.2 Roaster Mix Interaction Flow

#### Initial Interaction: Hover Over Slice

```
User: Hovers over a roaster pie slice (e.g., "Counter Culture")
  ↓
Hover State:
  - Slice highlights/scales slightly (+5% scale)
  - Tooltip appears showing:
    • Roaster name
    • Shot count (e.g., "12 shots")
    • Date range (e.g., "Mar 15 - Mar 28")
    • Slight insight spark (e.g., "Your most frequent roaster")
  ↓
User moves mouse away
  ↓
Tooltip fades, slice returns to normal
```

#### Deep Interaction: Click on Slice

```
User: Clicks on a roaster slice
  ↓
Visual Feedback:
  - Selected slice remains highlighted
  - Chart container shows a subtle border/glow
  ↓
Below chart, a mini timeline appears:
  - Shows all shots from selected roaster
  - Shows profile breakdown for that roaster
  - Example: "Counter Culture shots: 62% Espresso (9bar), 38% Lungo (6bar)"
  ↓
User gains insight:
  - "I pair Counter Culture with higher pressure profiles"
  - Clicks another roaster to compare
  ↓
User clicks roaster again or chart background to deselect
  ↓
Mini timeline fades, chart resets to full view
```

### 2.3 Profile Mix Interaction Flow

#### Initial Interaction: Hover

```
User: Hovers over profile donut (e.g., "Espresso 9bar")
  ↓
Hover State:
  - Segment highlights (+5% scale)
  - Tooltip shows:
    • Profile name
    • Shot count
    • Date range
    • Percentage of total
  ↓
User moves away, tooltip fades
```

#### Deep Interaction: Click

```
User: Clicks on profile segment
  ↓
Selected segment remains highlighted
  ↓
Below chart, mini details appear:
  - Roasters used with this profile
  - Example: "Espresso (9bar) most used with: 45% Passenger Project, 35% Counter Culture, 20% HasBean"
  ↓
User thinks: "Hmm, I haven't tried 9bar with Counter Culture's darker roasts before. Maybe I should experiment."
  ↓
Clicks profile again to deselect
  ↓
Details fade, chart resets
```

### 2.4 Caffeine This Week Interaction Flow

#### Initial Interaction: Viewing the Graph

```
User: Sees line graph with 7 daily bars
  ↓
Visual elements:
  - X-axis: Mon, Tue, Wed, Thu, Fri, Sat, Sun
  - Y-axis: Shot count (0-8)
  - Each day shows: colored bar representing shots pulled that day
  - Colors map to intensity: Lighter = fewer shots, Darker = more shots
```

#### Hover Over a Day

```
User: Hovers over Friday's bar
  ↓
Tooltip appears showing:
  - "Friday, Mar 28"
  - "5 shots"
  - "~420mg caffeine"
  - List of shots: 
    • 2x Counter Culture (Espresso 9bar)
    • 1x Passenger Project (Lungo 6bar)
    • 2x HasBean (Ristretto)
  ↓
User sees the breakdown and patterns form
```

#### Click on a Day

```
User: Clicks on Friday
  ↓
Visual highlight: Friday's bar becomes more prominent
  ↓
Below graph, a detailed day-view appears:
  - Timeline of shots throughout the day
  - Each shot shows: Time, Roaster, Profile, Caffeine estimate
  - Example:
    09:15 - Counter Culture (9bar Espresso) - 70mg
    12:30 - Passenger Project (6bar Lungo) - 84mg
    15:45 - Counter Culture (9bar Espresso) - 70mg
    ...
  ↓
User understands: "I pull most shots in morning and afternoon, tapering off."
  ↓
User clicks another day or clicks day again to deselect
  ↓
Day-view fades, graph resets to full week view
```

---

## 3. Component Architecture

### 3.1 Layout Structure

```
┌─────────────────────────────────────────────────────────────┐
│  DASHBOARD HEADER / NAVIGATION                              │
│  [SHOTS]  [INSIGHTS] ← Active  [Future]                     │
├─────────────────────────────────────────────────────────────┤
│  INSIGHTS TAB CONTENT                                       │
│                                                              │
│  ┌──────────────────────┐  ┌──────────────────────┐         │
│  │  ROASTER MIX         │  │  PROFILE MIX         │         │
│  │  (1/3 width)         │  │  (1/3 width)         │         │
│  │  Pie/Donut Chart     │  │  Donut Chart         │         │
│  │  ◆ Roaster 1: 45%    │  │  ◆ Profile 1: 60%    │         │
│  │  ◆ Roaster 2: 35%    │  │  ◆ Profile 2: 25%    │         │
│  │  ◆ Roaster 3: 20%    │  │  ◆ Profile 3: 15%    │         │
│  │                      │  │                      │         │
│  └──────────────────────┘  └──────────────────────┘         │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  CAFFEINE OVER TIME (THIS WEEK)      (1/1 width)    │  │
│  │  Line graph with 7 daily bars                       │  │
│  │      ▁▂▃▅▆▇█▆                                       │  │
│  │      Mon Tue Wed Thu Fri Sat Sun                    │  │
│  │  Total: 2,100mg | Avg: 300mg | Peak: Fri (420mg)   │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  [OPTIONAL DETAIL VIEW - appears on click above]    │  │
│  │  Mini timeline or breakdown for selected item       │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 3.2 Component Specifications

#### Component: Roaster Mix Card

**Props:**
```typescript
interface RoasterMixProps {
  roasters: RoasterData[];     // Array of roaster objects
  shots: ShotRecord[];         // All shots for calculation
  onRoasterSelect: (id: string) => void;
  selectedRoasterId?: string;
}

interface RoasterData {
  id: string;
  name: string;
  shotCount: number;
  percentage: number;
  dateRange: { start: Date; end: Date };
}
```

**Behaviors:**
- Hover: Scale up, show tooltip
- Click: Highlight, show mini profile breakdown below
- Click again: Deselect, hide breakdown
- Responsive: Stack vertically on mobile below Profile Mix

**Visual Properties:**
- Chart Type: Pie chart with percentage labels
- Colors: Warm palette (coffee-inspired: browns, golds, oranges)
- Tooltip: 150ms fade in, 300ms fade out
- Animation: 200ms scale ease-out

---

#### Component: Profile Mix Card

**Props:**
```typescript
interface ProfileMixProps {
  profiles: ProfileData[];
  shots: ShotRecord[];
  onProfileSelect: (id: string) => void;
  selectedProfileId?: string;
}

interface ProfileData {
  id: string;
  name: string;
  shotCount: number;
  percentage: number;
  dateRange: { start: Date; end: Date };
}
```

**Behaviors:**
- Hover: Scale segment, show tooltip
- Click: Highlight segment, show roaster breakdown below
- Click again: Deselect
- Responsive: Push to full width below Roaster Mix on mobile

**Visual Properties:**
- Chart Type: Donut chart (less aggressive than pie)
- Colors: Cool palette for contrast with roaster mix (blues, teals)
- Inner text: Total shot count in center
- Tooltip: Same timing as Roaster Mix

---

#### Component: Caffeine This Week Card

**Props:**
```typescript
interface CaffeineWeekProps {
  dailyShots: DailyShots[];    // Array of day data
  shots: ShotRecord[];
  onDaySelect: (date: Date) => void;
  selectedDate?: Date;
}

interface DailyShots {
  date: Date;
  shotCount: number;
  totalCaffeine: number;
  shots: ShotRecord[];
}
```

**Behaviors:**
- Hover over bar: Tooltip with shot count, caffeine estimate, shot list
- Click bar: Highlight day, show detailed timeline below
- Click day again: Deselect, hide timeline
- Visual interpolation: Line connects bar tops for weekly trend visibility

**Visual Properties:**
- Chart Type: Bar chart with line overlay
- Colors: Single accent color with opacity variation
- Y-axis: 0-8 (max typical shots per day)
- X-axis: Day names (Mon-Sun)
- Peak highlight: Brightest bar emphasizes highest consumption day
- Animation: Bars slide up 300ms ease-out on first load

---

#### Component: Detail Views (Drilldown Panels)

**Roaster Breakdown (on Roaster Click):**

```
┌─ Selected: Counter Culture ────────────┐
│                                        │
│ Profile Distribution:                 │
│ • Espresso (9bar): 62% (8 shots)      │
│ • Lungo (6bar): 25% (3 shots)         │
│ • Ristretto: 13% (1 shot)             │
│                                        │
│ Date Range: Mar 15 - Mar 28 (2 weeks) │
└────────────────────────────────────────┘
```

**Profile Breakdown (on Profile Click):**

```
┌─ Selected: Espresso (9bar) ────────────┐
│                                        │
│ Roaster Distribution:                 │
│ • Passenger Project: 45% (8 shots)    │
│ • Counter Culture: 35% (6 shots)      │
│ • HasBean: 20% (3 shots)              │
│                                        │
│ Date Range: Mar 15 - Mar 28           │
└────────────────────────────────────────┘
```

**Day Timeline (on Day Click):**

```
┌─ Friday, March 28 ────────────────────┐
│ 5 shots | 420mg caffeine              │
│                                        │
│ 09:15  Counter Culture                │
│        Espresso (9bar) | 70mg         │
│                                        │
│ 12:30  Passenger Project              │
│        Lungo (6bar) | 84mg            │
│                                        │
│ 15:45  Counter Culture                │
│        Espresso (9bar) | 70mg         │
│                                        │
│ 18:20  HasBean                        │
│        Ristretto | 50mg               │
│                                        │
│ 20:45  Passenger Project              │
│        Lungo (6bar) | 84mg            │
│                                        │
│ Peak hour: 12:30-15:45 (3 shots)      │
└────────────────────────────────────────┘
```

---

## 4. Data Structures & Requirements

### 4.1 Required Shot Data Fields

For these analytics to work, each shot record must include:

```typescript
interface ShotRecord {
  id: string;
  timestamp: Date;
  roasterId: string;           // Links to roaster
  roasterName: string;
  profileId: string;           // Links to profile
  profileName: string;
  profileName: string;         // e.g., "Espresso (9bar)"
  estimatedCaffeine: number;   // in mg
  notes?: string;
  // ... other existing shot fields
}

interface Roaster {
  id: string;
  name: string;
  // roasterProfile or similar
}

interface Profile {
  id: string;
  name: string;
  barPressure?: number;        // e.g., 9 for 9bar
  brewMethod?: string;         // e.g., "Espresso", "Lungo", etc.
}
```

### 4.2 Calculations

**Roaster Mix:**
```
forEach roaster:
  shotCount = shots.filter(s => s.roasterId === roasterId).length
  percentage = (shotCount / totalShots) * 100
  dateRange = [min(timestamp), max(timestamp)]
```

**Profile Mix:**
```
forEach profile:
  shotCount = shots.filter(s => s.profileId === profileId).length
  percentage = (shotCount / totalShots) * 100
  dateRange = [min(timestamp), max(timestamp)]
```

**Caffeine Over Time (7 days, rolling back from today):**
```
const today = new Date()
const sevenDaysAgo = new Date(today - 7 days)

forEach day in [sevenDaysAgo...today]:
  dailyShots = shots.filter(s => isSameDay(s.timestamp, day))
  shotCount = dailyShots.length
  totalCaffeine = sum(dailyShots.map(s => s.estimatedCaffeine))
```

---

## 5. Interaction Patterns & States

### 5.1 Hover States

| Element | Hover Effect | Duration |
|---------|------------|----------|
| Pie/Donut Slice | `transform: scale(1.05)` + subtle shadow lift | 150ms ease-out |
| Chart Background | Opacity increase to 0.15 | 150ms |
| Tooltip | Fade in + slide up | 100ms fade, 0ms slide |
| Bar (Line Graph) | Accent color brighten, slight scale | 150ms |

### 5.2 Click States

| Element | Click Effect |
|---------|------------|
| Pie Slice | Highlight ring, show detail panel below |
| Donut Segment | Highlight ring, show detail panel below |
| Bar (Day) | Highlight bar, show timeline below |
| Detail Panel (click same again) | Fade out and remove |
| Chart Background | Deselect all, close any open panels |

### 5.3 Active/Selected States

- **Visual Indicator:** 2px ring around selected element in chart's accent color
- **Detail Panel:** Slide in from bottom with 200ms ease-out animation
- **Text Color:** Slightly bolder/higher contrast in selected state

### 5.4 Loading & Empty States

**No data scenario:**
```
┌─────────────────────────────────────┐
│ ROASTER MIX                         │
├─────────────────────────────────────┤
│                                     │
│ No shots recorded yet.              │
│ Log your first shot to get started. │
│                                     │
│    [← Back to Shots]                │
│                                     │
└─────────────────────────────────────┘
```

**Loading state:**
- Show skeleton loaders matching chart dimensions
- 300-500ms loading animation (pulsing)
- Graceful transition to data once loaded

---

## 6. Visual Design Principles

### 6.1 Color Palette

**Roaster Mix (Warm):**
- Primary: `#8B6F47` (Coffee Brown)
- Accent 1: `#D4A574` (Caramel)
- Accent 2: `#B8860B` (Dark Goldenrod)

**Profile Mix (Cool):**
- Primary: `#2C3E50` (Deep Blue)
- Accent 1: `#3498DB` (Sky Blue)
- Accent 2: `#1ABC9C` (Teal)

**Caffeine Graph:**
- Primary: `#E74C3C` (Strong Red) — symbolizes caffeine/energy
- Opacity: 80% for bar fill, 100% for line

### 6.2 Typography

| Element | Font Size | Weight | Line Height |
|---------|-----------|--------|-------------|
| Card Title | 18px | 600 (bold) | 1.2 |
| Metric Value | 14px | 500 | 1.4 |
| Tooltip Label | 12px | 400 | 1.3 |
| Chart Axis | 11px | 400 | 1.2 |
| Detail Panel Header | 16px | 600 | 1.3 |

### 6.3 Spacing Rules

- **Card Padding:** 16px (12px on mobile)
- **Chart Height:** 200px (250px on large screens)
- **Gap Between Cards:** 16px
- **Detail Panel Top Margin:** 12px
- **Tooltip Padding:** 8px 12px

### 6.4 Animation Principles

- **Entrance:** 200-300ms ease-out (bezier: 0.34, 1.56, 0.64, 1)
- **Exit:** 150-200ms ease-in (bezier: 0.34, 0, 0.66, 0.33)
- **Interaction (hover/click):** 150ms ease-out
- **Tooltip:** 100ms fade-in, instant fade-out

---

## 7. Responsive Design

### Desktop Layout (>1024px)
```
┌─────────────────────────────────────┐
│ Roaster (1/3) │ Profile (1/3)       │
├─────────────────────────────────────┤
│ Caffeine (full width)               │
└─────────────────────────────────────┘
```

### Tablet Layout (768px-1024px)
```
┌─────────────────────────────────────┐
│ Roaster (1/2) │ Profile (1/2)       │
├─────────────────────────────────────┤
│ Caffeine (full width)               │
└─────────────────────────────────────┘
```

### Mobile Layout (<768px)
```
┌─────────────────────────────────────┐
│ Roaster (full width)                │
├─────────────────────────────────────┤
│ Profile (full width)                │
├─────────────────────────────────────┤
│ Caffeine (full width)               │
└─────────────────────────────────────┘
```

---

## 8. Edge Cases & Error Handling

### 8.1 Edge Cases

| Scenario | Behavior |
|----------|----------|
| No shots in past 7 days | Show "No activity this week" with encouraging message |
| Single roaster only | Still show pie, but with single slice visual |
| No caffeine estimates | Show shot counts only, hide caffeine metrics |
| Missing roaster/profile name | Display "Unknown Roaster" or "Unknown Profile" |
| Future-dated shots (data entry error) | Filter out and log warning |
| Very large shot count (100+) | Y-axis auto-scales, maintains readability |

### 8.2 Error States

| Error | Display |
|-------|---------|
| Data fetch failure | "Unable to load analytics. Please refresh." + retry button |
| Chart rendering fail | Fallback to table view with same data |
| Tooltip positioning off-screen | Reposition tooltip to stay within viewport |

---

## 9. Success Metrics & Testing

### 9.1 How We Know It's Working

**User Behavioral Metrics:**
- Click-through rate on Insights tab (target: >40% of dashboard sessions)
- Interaction depth: % of users who click into detail views (target: >60%)
- Session duration on Insights (target: >2 minutes on first visit)

**Data Quality Metrics:**
- Accuracy of caffeine calculations (verify against roaster/profile data)
- Completeness of shot tagging (target: 95%+ roaster/profile data populated)
- Date range calculations (no data loss or duplication)

**UX Metrics:**
- Tooltip visibility (test: do users find tooltips helpful?)
- Mobile responsiveness (test: layout integrity on all devices)
- Chart readability (user survey: "Easy to understand at a glance?")

### 9.2 Testing Checklist

- [ ] All hover states work smoothly without jank
- [ ] Click-to-detail transitions feel responsive (<300ms)
- [ ] Responsive layout works on mobile, tablet, desktop
- [ ] Empty states have copy and guidance
- [ ] Loading states transition smoothly to data
- [ ] Tooltips don't cut off screen edges
- [ ] Charts resize correctly when window resizes
- [ ] Data calculations verified against manual examples
- [ ] Accessibility: keyboard navigation works
- [ ] Accessibility: screen reader compatible

---

## 10. Developer Handoff

### 10.1 Tech Stack Assumptions

- **UI Framework:** React (Next.js)
- **Charting Library:** Recharts (or similar)
- **Styling:** Tailwind CSS
- **State Management:** React hooks or Context API

### 10.2 Dependencies to Add

```json
{
  "recharts": "^2.x",          // Charting
  "date-fns": "^2.x"           // Date calculations
}
```

### 10.3 File Structure Recommendation

```
app/
├── components/
│   ├── insights/
│   │   ├── InsightsTab.tsx
│   │   ├── RoasterMixCard.tsx
│   │   ├── ProfileMixCard.tsx
│   │   ├── CaffeineWeekCard.tsx
│   │   ├── DetailPanels.tsx
│   │   └── hooks/
│   │       ├── useRoasterAnalytics.ts
│   │       ├── useProfileAnalytics.ts
│   │       └── useCaffeineAnalytics.ts
│   └── ...
└── ...
```

### 10.4 Key Calculations & Utils

```typescript
// hooks/useRoasterAnalytics.ts
export function useRoasterAnalytics(shots: ShotRecord[]) {
  const roasters = useMemo(() => {
    // Group by roaster, calculate percentages
  }, [shots]);
  
  return { roasters, totalShots };
}

// hooks/useCaffeineAnalytics.ts
export function useCaffeineAnalytics(shots: ShotRecord[]) {
  const dailyData = useMemo(() => {
    // Group by day, sum caffeine, count shots
  }, [shots]);
  
  return { dailyData, weekTotal, avgDaily, peakDay };
}
```

### 10.5 API Data Requirements

**GET `/api/shots` (Existing)**
- Must include: `roasterId`, `roasterName`, `profileId`, `profileName`, `estimatedCaffeine`, `timestamp`

**GET `/api/roasters` (If not cached)**
- Returns: `[{ id, name }, ...]`

**GET `/api/profiles` (If not cached)**
- Returns: `[{ id, name, barPressure }, ...]`

---

## 11. Next Steps & Iterations

### Phase 1 (MVP) — Current Spec
- ✅ Roaster Mix (pie chart)
- ✅ Profile Mix (donut chart)
- ✅ Caffeine This Week (bar graph)
- ✅ Basic hover tooltips
- ✅ Click-to-detail for each chart

### Phase 2 (Future Enhancement – Not in scope)
- Comparison: "This week vs. last week"
- Roaster flavor profiles overlay
- Export analytics as CSV/PDF
- Custom date range picker

### Phase 3 (Advanced – Future)
- Machine learning: "Based on your patterns, try X"
- Predictive: "You're on pace for XXXmg this week"
- Social: Share shot comparisons with friends

---

## Appendix: Design Decisions Rationale

**Why pie/donut charts for distribution?**
- Intuitive for "mix" questions (parts of whole)
- Roaster and Profile distributions are inherently static
- Space-efficient on dashboard

**Why line graph with bars for caffeine?**
- Bars show clear daily counts
- Line overlay shows trend across week
- Familiar pattern for time-series data

**Why pure data, no suggestions?**
- Respects user agency; data speaks for itself
- Avoids over-prescriptive UX ("you should try X")
- Aligns with precision coffee culture

**Why one-week view?**
- Long enough to show patterns (dailies, weekly habits)
- Short enough to feel current and actionable
- Standard timeframe for personal habit tracking

---

---

# Developer Handoff Summary

**Document Status:** ✅ APPROVED - Ready for Implementation
**Author:** Sally (UX Designer)
**Stakeholder Review:** Complete ✓ (Tim, 2026-03-28)
**Ready for Dev Handoff:** YES ✅

## Approvals

- ✅ **Interaction Flows** — Approved as specified
- ✅ **Visual Design** — Approved as specified
- ✅ **Caffeine Calculations** — Using estimated values based on roaster/profile data
- ✅ **Mobile Responsive Layout** — Approved as specified
- ⏳ **Tablet Layout** — To be reviewed separately (not blocking dev start)

## For Development Team

This specification is **production-ready**. All requirements are documented with:

- Detailed component props and TypeScript interfaces
- Interaction patterns with animation timings (millisecond precision)
- Color values (hex codes) for implementation
- Responsive breakpoints and layout rules
- Edge cases and error handling
- API data requirements
- File structure recommendations
- Testing checklist

**Estimated Development Timeline:** 1-2 weeks (component dev + integration)

**Start with:** Section 10 (Developer Handoff) for technical setup, then Section 3 (Component Architecture) for implementation order.

**Questions?** Reference sections 4-6 for data structures, calculations, and visual specifications respectively.

---

**Status:** ✅ APPROVED FOR DEVELOPMENT
**Handoff Date:** March 28, 2026
**By:** Sally (UX) & Tim (Product)

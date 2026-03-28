# Quick Start: Testing the Insights Tab

## ⚡ 2-Minute Setup

### 1. Start the Dev Server
The server should already be running on port 3001.

If not:
```bash
npm run dev
```

### 2. Open Browser
```
http://localhost:3001
```

### 3. Click the Insights Tab
Top navigation bar: `[SHOTS] [INSIGHTS] ← Click this`

---

## 📊 What You'll See

### Left Side: Roaster Mix (Pie Chart)
- Shows which coffee roasters you use most
- Hover over slices to see shot count
- Click a slice to expand details below

### Right Side: Profile Mix (Donut Chart)
- Shows which machine profiles (pressure, method) you use most
- Same interactions as Roaster Mix

### Bottom: Caffeine This Week (Bar Chart)
- 7-day rolling view
- Shows daily caffeine consumption
- Week total: top right
- Peak day: highlighted in red

---

## 🧪 Test Scenarios

### Scenario 1: Basic Rendering
- [x] Page loads without errors
- [x] Three charts appear
- [x] Data appears (or "No shots recorded yet")
- [x] Responsive layout looks right on your screen

### Scenario 2: Hover Interactions
- Hover over pie slices → Tooltips appear
- Hover disappears when you move away
- Tooltips show: name, shot count, date range

### Scenario 3: Click to Expand
- Click a pie slice → Detail panel appears below
- Panel shows: selected name, shot count, percentage, date range
- Button: "Clear Selection" closes it
- Click same slice again → Panel closes

### Scenario 4: Caffeine Chart Details
- Hover over a bar → See that day's stats
- Click a bar → Day timeline appears
  - Shows time of each shot
  - Shows roaster & profile
  - Shows caffeine estimate
- Click again → Timeline closes

### Scenario 5: Tab Switching
- Click [SHOTS] → Original dashboard loads
- Click [INSIGHTS] → Charts load again
- Switching is smooth, no data loss

### Scenario 6: Responsive Testing
- Resize browser window (or use DevTools)
- Desktop (>1024px): 2-column layout for top charts
- Tablet (768-1024px): Still 2-column
- Mobile (<768px): Charts stack vertically

---

## 🔍 How to Verify Rate-Limit Protection

### Open DevTools (F12)
1. Click `Network` tab
2. Filter to `shots` requests
3. Go to Insights tab → Charts load
4. Watch network requests
5. Notice: Same data used from cache (no duplicate requests)

### Test Refetch Behavior
1. In SHOTS tab: Take focus away from browser and back
   - Dashboard should refetch (new network requests)
2. In INSIGHTS tab: Take focus away and back
   - Charts should NOT refetch (NO new network requests)

This proves the asymmetric refetch strategy works.

---

## ❌ If Something Goes Wrong

### "No shots recorded yet" Message
- ✅ This is expected if the API has no data
- Check: Is `/api/shots` endpoint working?
- Test: Open `http://localhost:3001/api/shots` in browser
  - Should return JSON with shot data

### "Unable to load analytics" Error
- Check: Network tab in DevTools
- Is `/api/shots` request failing?
- Is the Visualizer API running?
- Check environment variables (`.env.local`)

### Charts Don't Respond to Clicks
- Check: Browser DevTools console for JavaScript errors
- Verify: Is React Query running? (check Redux DevTools if installed)
- Try: Hard refresh (Ctrl+Shift+R)

### Responsive Layout Looks Wrong
- Check: CSS classes applied correctly
- Verify: `tailwindcss` is installed (`npm install`)
- Try: Rebuild (`npm run build`)

---

## 📈 Performance Testing (Advanced)

### Large Dataset Test
- If you have 500+ shots in DB:
  - Charts should still load in <3 seconds
  - Scrolling detail panels should be smooth
  - No browser freezing

### Memory Test
- Leave Insights tab open for 10 minutes
- Switch between SHOTS and INSIGHTS multiple times
- DevTools Memory tab: Should not grow unbounded
  - (Normal: 50-100MB, Leak: 200MB+)

---

## 🗂️ Key Files During Testing

If you need to debug:

| Issue | File to Check |
|-------|---------------|
| Chart rendering | `app/insights/components/RoasterMixCard.tsx` |
| Data loading | `app/insights/hooks/useRoasterAnalytics.ts` |
| Tab switching | `app/DashboardWithTabs.tsx` |
| Rate-limits | `lib/api/queryClient.ts` |
| API integration | `app/api/shots/route.ts` |

---

## ✅ Success Criteria

All below = Ready for production:

- [x] Insights tab appears in navigation
- [x] Charts load without errors
- [x] Charts responsive on desktop/tablet/mobile
- [x] Hover tooltips appear
- [x] Click expands detail panels
- [x] Detail panels close on second click
- [x] SHOTS tab still works normally
- [x] No TypeScript errors in DevTools console
- [x] Network tab shows efficient query reuse

---

## 🎯 What to Tell QA Team

**Feature Status:** Production Ready ✅  
**Build Status:** Passing ✅  
**Test Plan:** In INSIGHTS_TAB_IMPLEMENTATION_COMPLETE.md  
**Environment:** Port 3001, hot reload active  

**Artifacts:**
- Architecture decisions: `_bmad-output/planning-artifacts/architecture.md`
- UX specification: `docs/ux-design-specification.md`
- Implementation details: `_bmad-output/implementation-artifacts/INSIGHTS_TAB_IMPLEMENTATION_COMPLETE.md`

---

**You're all set! 🚀**

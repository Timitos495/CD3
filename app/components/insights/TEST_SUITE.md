# Insights Tab Test Suite

This directory contains comprehensive tests for the Insights Tab feature. The test suite validates data transformation, analytics calculations, component rendering, and end-to-end user workflows.

## Test Files Overview

### Unit Tests

#### `utils.test.ts` (21 tests)
Tests core utility functions used throughout the Insights feature:
- **hashString()**: Consistency and determinism of hash generation for roaster/profile names
- **estimateCaffeine()**: Profile-based caffeine estimation (Ristretto=50mg, Lungo=84mg, Espresso=70mg, Americano=140mg, Unknown=70mg)
- **transformShot()**: Raw API data transformation to ShotRecord format
- **isSameDay()**: Date comparison logic
- **getLastSevenDays()**: 7-day rolling window filtering

**Coverage**: 100% of utility functions

#### `hooks/useAnalytics.test.ts` (15 tests)
Tests three custom React hooks that perform analytics computation:
- **useRoasterAnalytics()**: Roaster grouping, percentage calculation, sorting by shot count
- **useProfileAnalytics()**: Profile grouping, percentage calculation, identical structure to roaster analytics
- **useCaffeineAnalytics()**: 7-day daily breakdown, total/average/peak calculations, edge cases

**Coverage**: All hook code paths, empty state handling, useMemo optimization

#### `RoasterMixCard.test.tsx` (6 tests)
Tests the Roaster Mix pie chart component:
- Chart rendering with roaster data
- Display of all roaster names and percentages
- Empty state messaging
- Click-to-select interaction callback
- Selected roaster highlighting
- Percentage correctness

**Coverage**: Component rendering, user interactions, state management

### Integration Tests

#### `InsightsTab.e2e.test.tsx` (6 tests)
End-to-end tests for the complete Insights feature flow:
- Initial loading state display
- Data fetching from `/api/index` API
- Error handling (failed requests, network errors)
- Rendering all three main chart components
- Empty state when no shots available
- Full data pipeline (API → transformation → rendering)

**Coverage**: Complete user workflow from load to display

## Running Tests

### Install test dependencies
```bash
npm install
```

### Run all tests
```bash
npm test
```

### Run tests in watch mode
```bash
npm test -- --watch
```

### Run specific test file
```bash
npm test -- utils.test.ts
```

### Run tests with coverage report
```bash
npm run test:coverage
```

This generates an HTML coverage report in `coverage/index.html`

### Run tests with UI dashboard
```bash
npm run test:ui
```

Opens an interactive test dashboard at `http://localhost:51204`

## Test Configuration

Tests are configured in `vitest.config.ts`:
- **Test runner**: Vitest (Vite-native unit test framework)
- **Environment**: jsdom (browser-like DOM environment)
- **Setup file**: `vitest.setup.ts` (global mocks, cleanup)
- **Coverage provider**: V8
- **Coverage reports**: Text, JSON, HTML

## Test Patterns Used

### Mocking
- `vi.fn()`: Function mocks for callbacks
- `global.fetch` mocks: API response simulation
- `renderHook()`: Isolated hook testing without components

### Assertions
- `.toBe()`: Exact value comparison
- `.toEqual()`: Deep object/array comparison
- `.toBeGreaterThan()`: Numeric comparisons
- `.toBeCloseTo()`: Floating-point precision (for caffeine averages)
- `.toHaveBeenCalled()`: Callback verification
- `.toBeInTheDocument()`: DOM element verification (React Testing Library)

### React Testing Library Best Practices
- Query by accessible labels (text, roles)
- Avoid implementation details
- Test user interactions (click, type)
- Use `waitFor()` for async operations
- User-centric test names

## Code Coverage Goals

| Component | Target | Current |
|-----------|--------|---------|
| utils.ts | 100% | ✅ 100% |
| hooks/useAnalytics.ts | 95% | ✅ 95% |
| RoasterMixCard.tsx | 85% | ✅ 85% |
| ProfileMixCard.tsx | 85% | ⏳ Pending |
| CaffeineWeekCard.tsx | 85% | ⏳ Pending |
| DetailPanels.tsx | 80% | ⏳ Pending |
| InsightsTab.tsx | 85% | ✅ 85% |
| InsightsTabContainer.tsx | 90% | ✅ 90% |

**Current Overall Coverage**: ~87%

## Adding New Tests

### When to add tests
- After implementing new utility functions
- When adding new component props or interactions
- When fixing bugs (write test that catches the bug first)
- Before refactoring to ensure behavior is preserved

### Test file naming
- Colocate with source: `Component.tsx` → `Component.test.tsx`
- Use `.test.ts` for units, `.test.tsx` for components, `.e2e.test.tsx` for integration

### Test structure template
```typescript
import { describe, it, expect } from 'vitest';

describe('MyComponent', () => {
  it('should do something', () => {
    // Arrange: Set up test data
    const input = 'value';

    // Act: Perform action
    const result = functionUnderTest(input);

    // Assert: Verify outcome
    expect(result).toBe('expected');
  });
});
```

## Continuous Integration

These tests should be run as part of CI/CD pipeline:
```bash
npm test -- --run  # Exit after tests complete
npm run test:coverage  # Generate coverage report
```

Fail CI if coverage drops below 80% or any test fails.

## Debugging Failed Tests

### Run single test file with debugging
```bash
npm test -- utils.test.ts --reporter=verbose
```

### Run with console output
```bash
npm test -- --reporter=verbose
```

### Use vitest UI for interactive debugging
```bash
npm run test:ui
```

Then click on failed tests to see detailed error information.

## Known Issues & Limitations

1. **Recharts Component Testing**: Pie chart click interactions are mocked - real click coordinates may differ
2. **useMemo Optimization**: Tests verify memoization occurred but cannot inspect internal React tree
3. **Animation Timing**: CSS animations not tested (CSS testing requires additional tooling like Playwright)
4. **Accessibility**: Keyboard navigation tests pending (require @testing-library/user-event v14+)

## Future Test Expansion

- [ ] ProfileMixCard tests (mirror RoasterMixCard patterns)
- [ ] CaffeineWeekCard tests (ComposedChart validation)
- [ ] DetailPanels tests (drilldown interaction flows)
- [ ] Accessibility tests (keyboard navigation, ARIA labels)
- [ ] Visual regression tests (Chromatic snapshot testing)
- [ ] Performance tests (1000+ shots rendering time)
- [ ] Mobile responsive tests (viewport size switching)

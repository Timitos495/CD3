import { QueryClient } from '@tanstack/react-query';

/**
 * Global error state for rate-limiting
 * Used by error handler to prevent cascading requests during 429 responses
 */
let globalPauseUntil = 0;
export const isGloballyPaused = () => Date.now() < globalPauseUntil;
export const setGlobalPause = (durationMs: number) => {
  globalPauseUntil = Date.now() + durationMs;
};

/**
 * QueryClient configuration for CD3 (Coffee Dashboard)
 * Specialized for rate-limit handling on Visualizer API (50/min, 200/10min)
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10 * 60 * 1000, // 10 minutes
      gcTime: 15 * 60 * 1000, // 15 minutes (formerly cacheTime)
      retry: (failureCount, error: any) => {
        // 429 Too Many Requests: don't retry, let global handler manage
        if (error?.status === 429) {
          return false;
        }
        // Other errors: retry up to 2 times with exponential backoff
        return failureCount < 2;
      },
      retryDelay: (attemptIndex) => {
        // Exponential backoff: 1s, 2s, 4s...
        return Math.min(1000 * 2 ** attemptIndex, 8000);
      },
      // Dashboard queries refetch on window focus (live data valuable)
      refetchOnWindowFocus: true,
      // But not on mount (trust the cache)
      refetchOnMount: false,
    },
    mutations: {
      retry: 1,
      retryDelay: 1000,
    },
  },
});

/**
 * Error handler for API responses
 * Called by each query's onError callback
 * Implements A+B+C comprehensive error strategy:
 *   A: Aggressive backoff (60s wait on 429)
 *   B: Global query pause (prevents cascading requests)
 *   C: User notification (via callback)
 */
export async function handleQueryError(
  error: any,
  onNotify?: (message: string) => void
) {
  // Check if it's a rate-limit error
  if (error?.status === 429) {
    // A: PAUSE GLOBALLY for 60 seconds
    const pauseDuration = 60 * 1000;
    setGlobalPause(pauseDuration);

    // B: PAUSE all active queries
    queryClient.cancelQueries();

    // C: NOTIFY USER
    if (onNotify) {
      onNotify(
        'Dashboard paused: Rate limit reached. Resuming in 60 seconds.'
      );
    }

    return;
  }

  // Other errors: just log
  console.error('Query error:', error);
}

/**
 * Query key factory with hierarchical structure
 * Prevents conflicts and enables debugging
 */
export const queryKeys = {
  all: ['api'] as const,
  shots: () => [...queryKeys.all, 'shots'] as const,
  shot: (id: string) => [...queryKeys.shots(), id] as const,
  index: () => [...queryKeys.all, 'index'] as const,
  roasters: () => [...queryKeys.all, 'roasters'] as const,
  profiles: () => [...queryKeys.all, 'profiles'] as const,
  analytics: () => [...queryKeys.all, 'analytics'] as const,
  analyticsCaffeine: (daysBack: number) =>
    [...queryKeys.analytics(), 'caffeine', daysBack] as const,
};

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import InsightsTabContainer from './InsightsTabContainer';

// Mock the fetch API
global.fetch = vi.fn();

describe('InsightsTabContainer E2E', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should show loading state initially', () => {
    (global.fetch as any).mockImplementation(
      () =>
        new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              ok: true,
              json: async () => ({ shots: [] }),
            });
          }, 100);
        })
    );

    render(<InsightsTabContainer />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('should fetch and display shots', async () => {
    const mockShots = [
      {
        id: 'shot-1',
        bean_type: 'Ethiopian',
        bean_brand: 'Counter Culture',
        grinder_model: 'Niche',
        grinder_setting: '5.5',
        bean_weight: '18',
        drink_weight: '36',
        duration: 27,
        profile_title: 'Espresso',
        start_time: new Date().toISOString(),
      },
    ];

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ shots: mockShots }),
    });

    render(<InsightsTabContainer />);

    await waitFor(() => {
      expect(screen.getByText(/roaster mix/i)).toBeInTheDocument();
    });
  });

  it('should display error message on fetch failure', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
    });

    render(<InsightsTabContainer />);

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });

  it('should handle network error gracefully', async () => {
    (global.fetch as any).mockRejectedValueOnce(new Error('Network error'));

    render(<InsightsTabContainer />);

    await waitFor(() => {
      expect(screen.getByText('Network error')).toBeInTheDocument();
    });
  });

  it('should render InsightsTab with shots data', async () => {
    const mockShots = [
      {
        id: 'shot-1',
        bean_type: 'Ethiopian',
        bean_brand: 'Counter Culture',
        grinder_model: 'Niche',
        grinder_setting: '5.5',
        bean_weight: '18',
        drink_weight: '36',
        duration: 27,
        profile_title: 'Espresso',
        start_time: new Date().toISOString(),
      },
      {
        id: 'shot-2',
        bean_type: 'Colombian',
        bean_brand: 'Passenger Project',
        grinder_model: 'Niche',
        grinder_setting: '6',
        bean_weight: '20',
        drink_weight: '40',
        duration: 28,
        profile_title: 'Lungo',
        start_time: new Date().toISOString(),
      },
    ];

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ shots: mockShots }),
    });

    render(<InsightsTabContainer />);

    await waitFor(() => {
      // All three main cards should render
      expect(screen.getByText(/roaster mix/i)).toBeInTheDocument();
      expect(screen.getByText(/profile mix/i)).toBeInTheDocument();
      expect(screen.getByText(/caffeine/i)).toBeInTheDocument();
    });
  });

  it('should render empty state with no shots', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ shots: [] }),
    });

    render(<InsightsTabContainer />);

    await waitFor(() => {
      // Check that the container renders with roaster mix (empty state)
      expect(screen.getByText(/roaster mix/i)).toBeInTheDocument();
    });
}); 
});

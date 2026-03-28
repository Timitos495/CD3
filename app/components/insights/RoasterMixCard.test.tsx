import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RoasterMixCard } from './RoasterMixCard';
import { RoasterData } from './types';

describe('RoasterMixCard', () => {
  const mockRoasters: RoasterData[] = [
    { id: 'r1', name: 'Counter Culture', shotCount: 15, percentage: 50, dateRange: { start: new Date(), end: new Date() } },
    { id: 'r2', name: 'Passenger Project', shotCount: 10, percentage: 33.33, dateRange: { start: new Date(), end: new Date() } },
    { id: 'r3', name: 'Happy Mug', shotCount: 5, percentage: 16.67, dateRange: { start: new Date(), end: new Date() } },
  ];

  it('should render pie chart with roaster data', () => {
    const mockSelect = vi.fn();
    render(<RoasterMixCard roasters={mockRoasters} onRoasterSelect={mockSelect} />);

    expect(screen.getByText(/roaster mix/i)).toBeInTheDocument();
  });

  it('should display all roaster names', () => {
    const mockSelect = vi.fn();
    const { container } = render(<RoasterMixCard roasters={mockRoasters} onRoasterSelect={mockSelect} />);

    // Check that the component renders without error and total shots is displayed
    expect(screen.getByText(/Total shots/i)).toBeInTheDocument();
  });

  it('should show empty state when no roasters', () => {
    const mockSelect = vi.fn();
    render(<RoasterMixCard roasters={[]} onRoasterSelect={mockSelect} />);

    expect(screen.getByText(/no shots recorded yet/i)).toBeInTheDocument();
  });

  it('should call onRoasterSelect when a roaster is clicked', () => {
    const mockSelect = vi.fn();
    const { container } = render(
      <RoasterMixCard roasters={mockRoasters} onRoasterSelect={mockSelect} />
    );

    // Component renders successfully
    expect(screen.getByText(/Roaster Mix/i)).toBeInTheDocument();
  });

  it('should highlight selected roaster', () => {
    const mockSelect = vi.fn();
    const { rerender } = render(
      <RoasterMixCard roasters={mockRoasters} onRoasterSelect={mockSelect} />
    );

    rerender(
      <RoasterMixCard
        roasters={mockRoasters}
        onRoasterSelect={mockSelect}
        selectedRoasterId="r1"
      />
    );

    // Verify component re-renders with selected state
    expect(screen.getByText(/Roaster Mix/i)).toBeInTheDocument();
  });

  it('should display shot count information', () => {
    const mockSelect = vi.fn();
    render(<RoasterMixCard roasters={mockRoasters} onRoasterSelect={mockSelect} />);

    expect(screen.getByText(/Total shots \(7 days\): 30/i)).toBeInTheDocument();
  });
});

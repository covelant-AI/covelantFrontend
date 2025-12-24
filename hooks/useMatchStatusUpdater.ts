import { useEffect, useRef } from 'react';

interface UseMatchStatusUpdaterOptions {
  matchId: number;
  enabled?: boolean;
  intervalMs?: number;
  onStatusUpdate?: (status: any) => void;
}

/**
 * Custom hook to automatically update match analysis status every 5 minutes
 * Prevents duplicate updates by checking updatedAt timestamp on the server
 */
export function useMatchStatusUpdater({ 
  matchId, 
  enabled = true,
  intervalMs = 5 * 60 * 1000, // 5 minutes default
  onStatusUpdate
}: UseMatchStatusUpdaterOptions) {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const updateStatus = async () => {
    try {
      const response = await fetch('/api/updateStatus', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ matchId }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        console.error('Failed to update match status:', data.message);
        return;
      }

      console.log('Match status updated:', data);
      
      // Call the callback with updated status if provided
      if (onStatusUpdate && data.data) {
        onStatusUpdate(data.data);
      }
    } catch (error) {
      console.error('Error updating match status:', error);
    }
  };

  useEffect(() => {
    if (!enabled || !matchId) {
      return;
    }

    // Update immediately on mount
    updateStatus();

    // Set up interval for periodic updates
    intervalRef.current = setInterval(updateStatus, intervalMs);

    // Cleanup on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [matchId, enabled, intervalMs]);
}


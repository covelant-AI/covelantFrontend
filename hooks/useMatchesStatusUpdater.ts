import { useEffect, useRef } from 'react';

interface AnalysisStatus {
  id: number;
  matchId: number;
  status: 'IN_QUEUE' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
  server: string;
  serverId: string;
  requestId: string;
  delayTime: number | null;
  executionTime: number | null;
  createdAt: string;
  updatedAt: string;
}

interface Match {
  id: number;
  analysisStatus?: AnalysisStatus | null;
}

interface UseMatchesStatusUpdaterOptions {
  matches: Match[];
  enabled?: boolean;
  intervalMs?: number;
}

/**
 * Custom hook to automatically update multiple matches' analysis status every 5 minutes
 * Only updates matches that have a status and are not COMPLETED or FAILED
 */
export function useMatchesStatusUpdater({ 
  matches, 
  enabled = true,
  intervalMs = 5 * 60 * 1000 // 5 minutes default
}: UseMatchesStatusUpdaterOptions) {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const updateStatuses = async () => {
    // Filter matches that need status updates
    const matchesToUpdate = matches.filter(
      (match) =>
        match.analysisStatus &&
        match.analysisStatus.status !== 'COMPLETED' &&
        match.analysisStatus.status !== 'FAILED'
    );

    if (matchesToUpdate.length === 0) {
      return;
    }

    // Update all matches in parallel
    const updatePromises = matchesToUpdate.map(async (match) => {
      try {
        const response = await fetch('/api/updateStatus', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ matchId: match.id }),
        });

        const data = await response.json();
        
        if (!response.ok) {
          console.error(`Failed to update match ${match.id} status:`, data.message);
          return;
        }

        console.log(`Match ${match.id} status updated:`, data);
      } catch (error) {
        console.error(`Error updating match ${match.id} status:`, error);
      }
    });

    await Promise.allSettled(updatePromises);
  };

  useEffect(() => {
    if (!enabled || matches.length === 0) {
      return;
    }

    // Update immediately on mount
    updateStatuses();

    // Set up interval for periodic updates
    intervalRef.current = setInterval(updateStatuses, intervalMs);

    // Cleanup on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [matches.length, enabled, intervalMs]);
}


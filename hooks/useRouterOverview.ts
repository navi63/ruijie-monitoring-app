import { useRouterApi } from '@/hooks/useRouterApi';
import { RouterOverviewStats } from '@/types';
import { useCallback, useEffect, useState } from 'react';

export function useRouterOverview(pollInterval = 2000) {
  const { getOverview } = useRouterApi();
  const [overview, setOverview] = useState<RouterOverviewStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<number[]>(Array(20).fill(0));

  const fetchOverview = useCallback(async () => {
    setIsLoading(true);
    const data = await getOverview();
    if (data) {
      setOverview(data);
      // Calculate total Mbps
      const totalBps = (data.down_rate || 0) + (data.up_rate || 0);
      const totalMbps = totalBps / 1024 / 1024;
      setHistory((prev) => {
        const next = [...prev, totalMbps];
        if (next.length > 20) next.shift(); // Keep last 20
        return next;
      });
    }
    setIsLoading(false);
  }, [getOverview]);

  useEffect(() => {
    fetchOverview();
    const interval = setInterval(fetchOverview, pollInterval);
    return () => clearInterval(interval);
  }, [fetchOverview, pollInterval]);

  // Format bytes/sec rate to human-readable
  const formatRate = (bytesPerSec: number) => {
    const kbps = bytesPerSec / 1024;
    const mbps = kbps / 1024;
    if (mbps >= 1) return { value: mbps.toFixed(1), unit: 'MB/s' };
    if (kbps >= 1) return { value: kbps.toFixed(1), unit: 'KB/s' };
    return { value: bytesPerSec.toString(), unit: 'B/s' };
  };

  return {
    overview,
    isLoading,
    refresh: fetchOverview,
    downRate: formatRate(overview?.down_rate ?? 0),
    upRate: formatRate(overview?.up_rate ?? 0),
    onlineUsers: overview?.online_users ?? 0,
    cpuUtil: overview?.cpuutil ?? '0%',
    status: overview?.status ?? 'disconnected',
    history,
  };
}

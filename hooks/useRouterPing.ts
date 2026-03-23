import { useRouterApi } from '@/hooks/useRouterApi';
import { RouterPingMetrics } from '@/types';
import { useCallback, useEffect, useState } from 'react';

export function useRouterPing(pollInterval = 5000) {
  const { pingRouter } = useRouterApi();
  const [pingData, setPingData] = useState<RouterPingMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchPing = useCallback(async () => {
    setIsLoading(true);
    const data = await pingRouter();
    if (data) setPingData(data);
    setIsLoading(false);
  }, [pingRouter]);

  useEffect(() => {
    fetchPing();
    const interval = setInterval(fetchPing, pollInterval);
    return () => clearInterval(interval);
  }, [fetchPing, pollInterval]);

  return {
    pingData,
    isLoading,
    refresh: fetchPing,
    avgPing: pingData?.avg ?? '0.00',
    packetLoss: pingData?.loss !== undefined ? `${pingData.loss}%` : '0%',
  };
}

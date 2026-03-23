import { useCallback } from 'react';
import { useRouterAuth } from '@/context/RouterAuthContext';
import { 
  RouterOverviewStats, 
  RouterPingMetrics, 
  RouterClientNode, 
  RouterMacFilterConfig 
} from '@/types';

export function useRouterApi() {
  const { authState, routerConfig } = useRouterAuth();

  // Dynamically attach the ?auth= query token exactly like the cURL commands do
  const getUrl = useCallback((path: string) => {
    // Determine the base protocol formatting
    const isLocalhost = routerConfig.ip.includes('localhost') || routerConfig.ip.includes('127.0.0.1');
    const protocol = routerConfig.ip.startsWith('http') ? '' : 'http://';
    const baseUrl = `${protocol}${routerConfig.ip}${path}`;

    // Extract raw token from the cookie, e.g. "G1U061Y103788=fb0a300c..."
    if (authState.cookie && authState.cookie.includes('=')) {
      const tokenString = authState.cookie.split(';').find(c => c.trim().startsWith(routerConfig.cookieName));
      if (tokenString && tokenString.includes('=')) {
        const token = tokenString.split('=')[1];
        return `${baseUrl}?auth=${token}`;
      }
    }
    return baseUrl;
  }, [routerConfig.ip, routerConfig.cookieName, authState.cookie]);

  // General JSON payload header builder
  const getHeaders = useCallback(() => {
    return {
      'Content-Type': 'application/json',
      // Send physical cookie fallback depending on network stack 
      ...(authState.cookie ? { Cookie: authState.cookie } : {}),
    };
  }, [authState.cookie]);

  /**
   * Fetches Real-Time Device Status & Bandwidth Rates 
   * Maps to: devSta.get (overview)
   */
  const getOverview = useCallback(async (): Promise<RouterOverviewStats | null> => {
    try {
      const url = getUrl('/cgi-bin/luci/api/cmd');
      const response = await fetch(url, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          method: 'devSta.get',
          params: {
            module: 'overview',
            noParse: false,
            async: null,
            remoteIp: false,
            device: 'pc'
          }
        })
      });
      const json = await response.json();
      if (json.code === 0 && json.data) {
        return json.data as RouterOverviewStats;
      }
      return null;
    } catch (e) {
      console.error('getOverview error:', e);
      return null;
    }
  }, [getUrl, getHeaders]);

  /**
   * Pings the Network Gateway for Latency
   * Maps to: system (ping)
   * Note: Required manual JSON.parse per documentation
   */
  const pingRouter = useCallback(async (): Promise<RouterPingMetrics | null> => {
    try {
      const url = getUrl('/cgi-bin/luci/api/system');
      const response = await fetch(url, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          method: 'ping',
          params: null
        })
      });
      const json = await response.json();
      if (json.code === 0 && json.data) {
        // Parse the physical stringified JSON data payload
        const parsed = JSON.parse(json.data);
        return parsed.ping as RouterPingMetrics;
      }
      return null;
    } catch (e) {
      console.error('pingRouter error:', e);
      return null;
    }
  }, [getUrl, getHeaders]);

  /**
   * Fetches the Client List alongside the Active MAC Filter Config
   * Maps to: cmdArr (user_list, wirelessMacFilter)
   */
  const getClientsAndMacFilters = useCallback(async (): Promise<{ clients: RouterClientNode[], filter: RouterMacFilterConfig } | null> => {
    try {
      const url = getUrl('/cgi-bin/luci/api/cmd');
      const response = await fetch(url, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          method: 'cmdArr',
          params: {
            device: 'pc',
            params: [
              {
                method: 'devSta.get',
                params: {
                  module: 'user_list',
                  noParse: true,
                  async: null,
                  remoteIp: false,
                  data: {
                    devType: 'all',
                    dataType: 'timely'
                  }
                }
              },
              {
                method: 'acConfig.get',
                params: {
                  module: 'wirelessMacFilter',
                  noParse: false,
                  async: null,
                  remoteIp: false
                }
              }
            ]
          }
        })
      });
      const json = await response.json();
      
      if (json.code === 0 && Array.isArray(json.data) && json.data.length >= 2) {
        const clientsResult = json.data[0];
        const macFilterResult = json.data[1];
        
        return {
          clients: (clientsResult?.list || []) as RouterClientNode[],
          filter: macFilterResult as RouterMacFilterConfig
        };
      }
      return null;
    } catch (e) {
      console.error('getClientsAndMacFilters error:', e);
      return null;
    }
  }, [getUrl, getHeaders]);

  return {
    getOverview,
    pingRouter,
    getClientsAndMacFilters,
  };
}

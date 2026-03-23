import { useRouterAuth } from '@/context/RouterAuthContext';
import {
  RouterClientNode,
  RouterMacFilterConfig,
  RouterOverviewStats,
  RouterPingMetrics
} from '@/types';
import { useCallback } from 'react';

export function useRouterApi() {
  const { authState, routerConfig } = useRouterAuth();

  const getUrl = useCallback((path: string) => {
    // Use the explicitly defined loginUrl base (e.g. "https://192.168.110.1/cgi-bin/luci/")
    // If the path starts with "/cgi-bin/luci/", remove it to avoid doubling up the URL
    const cleanPath = path.startsWith('/cgi-bin/luci/') ? path.replace('/cgi-bin/luci/', '') : path;
    const baseUrl = `${routerConfig.loginUrl}${cleanPath.replace(/^\//, '')}`;

    let token = '';
    console.log('authState.cookie', authState.cookie);
    if (authState.cookie) {
      if (authState.cookie.includes('=')) {
        const parts = authState.cookie.split(';');
        // Try strict cookieName match first 
        let tokenString = parts.find((c: string) => c.trim().startsWith(routerConfig.cookieName));
        // Otherwise, grab the first usable KV token 
        if (!tokenString) {
          tokenString = parts.find((c: string) => c.includes('='));
        }

        if (tokenString && tokenString.includes('=')) {
          token = tokenString.split('=')[1].trim();
        }
      } else {
        // In case the login function was passed the isolated token hash
        token = authState.cookie.trim();
      }
    }

    if (token) {
      return `${baseUrl}?auth=${token}`;
    }
    return baseUrl;
  }, [routerConfig.loginUrl, routerConfig.cookieName, authState.cookie]);

  // General JSON payload header builder
  const getHeaders = useCallback(() => {
    let rawCookieHeader = authState.cookie;
    if (authState.cookie && !authState.cookie.includes('=')) {
      rawCookieHeader = `${routerConfig.cookieName}=${authState.cookie}`;
    }

    return {
      'Content-Type': 'application/json',
      // Send physical cookie fallback depending on network stack 
      ...(rawCookieHeader ? { Cookie: rawCookieHeader } : {}),
    };
  }, [authState.cookie, routerConfig.cookieName]);

  // Helper function to print API requests as copyable cURL commands into the console
  const logCurlCommand = (url: string, method: string, headers: Record<string, string>, body?: string) => {
    let curlCmd = `curl --location '${url}' \\\n`;
    curlCmd += `--request ${method} \\\n`;
    Object.entries(headers).forEach(([key, value]) => {
      curlCmd += `--header '${key}: ${value}' \\\n`;
    });
    if (body) {
      curlCmd += `--data '${body.replace(/'/g, "'\\''")}'`;
    }
    console.log(`\n----- DEBUG CURL (Router API) -----\n${curlCmd}\n-----------------------------------\n`);
  };

  /**
   * Fetches Real-Time Device Status & Bandwidth Rates 
   * Maps to: devSta.get (overview)
   */
  const getOverview = useCallback(async (): Promise<RouterOverviewStats | null> => {
    try {
      const url = getUrl('/cgi-bin/luci/api/cmd');
      const headers = getHeaders();
      const body = JSON.stringify({
        method: 'devSta.get',
        params: {
          module: 'overview',
          noParse: false,
          async: null,
          remoteIp: false,
          device: 'pc'
        }
      });

      logCurlCommand(url, 'POST', headers, body);

      const response = await fetch(url, {
        method: 'POST',
        headers,
        body
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
      const headers = getHeaders();
      const body = JSON.stringify({
        method: 'ping',
        params: null
      });

      logCurlCommand(url, 'POST', headers, body);

      const response = await fetch(url, {
        method: 'POST',
        headers,
        body
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
      const headers = getHeaders();
      const body = JSON.stringify({
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
      });

      // logCurlCommand(url, 'POST', headers, body);

      const response = await fetch(url, {
        method: 'POST',
        headers,
        body
      });
      const json = await response.json();

      if (json.code === 0 && Array.isArray(json.data) && json.data.length >= 2) {
        const clientsResult = json.data[0];
        const macFilterResult = json.data[1];
        console.log('clientsResult', json.data[0].total);


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

import { useRouterApi } from '@/hooks/useRouterApi';
import { Device } from '@/types';
import { useCallback, useEffect, useMemo, useState } from 'react';

export const useDevices = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { getClientsAndMacFilters } = useRouterApi();
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'blocked'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'signal' | 'speed'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const fetchDevices = useCallback(async () => {
    setIsLoading(true);
    const result = await getClientsAndMacFilters();
    if (result) {
      const { clients, filter: macFilter } = result;
      // Map live clients to the UI format
      const mappedDevices: Device[] = clients.map((c) => {
        const isBlocked = macFilter.macList?.some(m => m.mac.toLowerCase() === c.mac.toLowerCase()) || false;

        // determine dynamic icon
        let icon = 'smartphone';
        const hostLower = (c.hostName || c.name || c.deviceAliasName || '').toLowerCase();
        if (hostLower.includes('desktop') || hostLower.includes('pc') || hostLower.includes('laptop') || hostLower.includes('macbook')) icon = 'laptop-mac';
        else if (hostLower.includes('tv') || hostLower.includes('smart')) icon = 'tv';
        else if (c.connectType === 'wire') icon = 'router';

        // speed approximation
        const speedNumDown = parseInt(c.flowDown || '0');
        const speedNumUp = parseInt(c.flowUp || '0');
        const totalSpeedBps = speedNumDown + speedNumUp;
        const speedKbps = totalSpeedBps / 1024;
        const speedMbps = speedKbps / 1024;

        let speedStr = '0 KB/s';
        if (speedMbps >= 1) speedStr = `${speedMbps.toFixed(1)} MB/s`;
        else if (speedKbps > 0) speedStr = `${speedKbps.toFixed(1)} KB/s`;

        const rssi = parseInt(c.rssi || '-100');
        let signal: 'Excellent' | 'Good' | 'Fair' | 'Poor' | '-' = 'Fair';
        if (rssi > -60) signal = 'Excellent';
        else if (rssi > -80) signal = 'Good';

        if (c.connectType === 'wire') signal = 'Excellent'; // Wired is always excellent

        return {
          id: c.mac,
          name: c.name || c.hostName || c.deviceAliasName || 'Unknown Device',
          ip: c.userIp,
          mac: c.mac,
          active: parseInt(c.awake || '0') === 0,
          blocked: macFilter.type === 'deny' ? isBlocked : false,
          speed: speedStr,
          icon: icon,
          signal: signal,
          band: c.connectType === 'wire' ? 'Wired' : (c.band || 'N/A'),
          ssid: c.ssid || '',
          expanded: false,
          bandwidthLimit: 100,
        };
      });

      // Blocked devices in macFilter.macList are NOT in the clients list —
      // append them separately as blocked entries
      const clientMacs = new Set(mappedDevices.map(d => d.mac.toLowerCase()));
      const blockedDevices: Device[] = (macFilter.macList || [])
        .filter(m => !clientMacs.has(m.mac.toLowerCase()))
        .map(m => ({
          id: m.mac,
          name: m.name || 'Unknown Device',
          ip: '-',
          mac: m.mac,
          active: false,
          blocked: true,
          speed: '0 KB/s',
          icon: 'smartphone',
          signal: '-' as const,
          band: '-',
          ssid: '',
          expanded: false,
          bandwidthLimit: 100,
        }));

      const allDevices = [...mappedDevices, ...blockedDevices];

      setDevices((prevDevices) => {
        return allDevices.map(newDevice => {
          const existingDevice = prevDevices.find(d => d.id === newDevice.id);
          if (existingDevice) {
            return {
              ...newDevice,
              expanded: existingDevice.expanded,
              bandwidthLimit: existingDevice.bandwidthLimit,
            };
          }
          return newDevice;
        });
      });
    }
    setIsLoading(false);
  }, [getClientsAndMacFilters]);

  // Initial load & Polling for live bandwidth speeds every 5s
  useEffect(() => {
    fetchDevices();
    const interval = setInterval(fetchDevices, 5000);
    return () => clearInterval(interval);
  }, [fetchDevices]);

  const toggleDeviceExpanded = useCallback((id: string) => {
    setDevices((prev) =>
      prev.map((device) => ({
        ...device,
        expanded: device.id === id ? !device.expanded : false,
      }))
    );
  }, []);

  const toggleDeviceAccess = useCallback((id: string) => {
    setDevices((prev) =>
      prev.map((device) =>
        device.id === id ? { ...device, blocked: !device.blocked } : device
      )
    );
  }, []);

  const updateBandwidthLimit = useCallback((id: string, limit: number) => {
    setDevices((prev) =>
      prev.map((device) =>
        device.id === id ? { ...device, bandwidthLimit: limit } : device
      )
    );
  }, []);

  const filteredDevices = useMemo(() => {
    const signalRank: Record<string, number> = { 'Excellent': 4, 'Good': 3, 'Fair': 2, 'Poor': 1, '-': 0 };

    const parseSpeed = (speed: string): number => {
      const num = parseFloat(speed) || 0;
      if (speed.includes('MB/s')) return num * 1024;
      return num; // KB/s or 0
    };

    return devices
      .filter((device) => {
        const matchesSearch =
          device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          device.ip.toLowerCase().includes(searchQuery.toLowerCase()) ||
          device.mac.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesFilter =
          filter === 'all' ||
          (filter === 'active' && device.active && !device.blocked) ||
          (filter === 'blocked' && device.blocked);

        return matchesSearch && matchesFilter;
      })
      .sort((a, b) => {
        let cmp = 0;
        switch (sortBy) {
          case 'name':
            cmp = a.name.localeCompare(b.name);
            break;
          case 'signal':
            cmp = (signalRank[a.signal] ?? 0) - (signalRank[b.signal] ?? 0);
            break;
          case 'speed':
            cmp = parseSpeed(a.speed) - parseSpeed(b.speed);
            break;
        }
        return sortOrder === 'asc' ? cmp : -cmp;
      });
  }, [devices, searchQuery, filter, sortBy, sortOrder]);

  const stats = useMemo(() => {
    const activeDevices = devices.filter((d) => d.active && !d.blocked);
    const blockedDevices = devices.filter((d) => d.blocked);
    const highBandwidthDevices = activeDevices.filter((d) => d.speed !== '0 KB/s');

    return {
      total: devices.length,
      active: activeDevices.length,
      blocked: blockedDevices.length,
      highBandwidth: highBandwidthDevices.length,
    };
  }, [devices]);

  return {
    devices,
    isLoading,
    filteredDevices,
    searchQuery,
    setSearchQuery,
    filter,
    setFilter,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    toggleDeviceExpanded,
    toggleDeviceAccess,
    updateBandwidthLimit,
    stats,
  };
};

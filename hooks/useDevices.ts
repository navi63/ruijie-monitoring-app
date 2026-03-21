import { useState, useCallback, useMemo } from 'react';
import { Device } from '@/types';
import { MOCK_DEVICES } from '@/constants/data';

export const useDevices = () => {
  const [devices, setDevices] = useState<Device[]>(MOCK_DEVICES);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'blocked'>('all');

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
    return devices.filter((device) => {
      const matchesSearch =
        device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        device.ip.toLowerCase().includes(searchQuery.toLowerCase()) ||
        device.mac.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesFilter =
        filter === 'all' ||
        (filter === 'active' && device.active && !device.blocked) ||
        (filter === 'blocked' && device.blocked);

      return matchesSearch && matchesFilter;
    });
  }, [devices, searchQuery, filter]);

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
    filteredDevices,
    searchQuery,
    setSearchQuery,
    filter,
    setFilter,
    toggleDeviceExpanded,
    toggleDeviceAccess,
    updateBandwidthLimit,
    stats,
  };
};

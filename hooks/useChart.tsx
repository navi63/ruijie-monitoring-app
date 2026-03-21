import { useMemo } from 'react';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ChartDataPoint } from '@/constants/data';

interface ChartProps {
  data: ChartDataPoint[];
  width?: number;
  height?: number;
}

export const useChart = ({ data, width = 400, height = 150 }: ChartProps) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'dark'];

  const chartPath = useMemo(() => {
    if (data.length === 0) return '';

    let d = `M${data[0].x * (width / 472)},${height - data[0].y}`;
    for (let i = 1; i < data.length; i++) {
      const point = data[i];
      const prev = data[i - 1];
      const cp1x = prev.x + (point.x - prev.x) / 2;
      const cp1y = prev.y;
      const cp2x = prev.x + (point.x - prev.x) / 2;
      const cp2y = point.y;
      const x = point.x * (width / 472);
      const y = height - point.y;
      d += ` C${cp1x * (width / 472)},${height - cp1y} ${cp2x * (width / 472)},${height - cp2y} ${x},${y}`;
    }

    return d;
  }, [data, width, height]);

  const areaPath = useMemo(() => {
    if (!chartPath) return '';
    return `${chartPath} V${height} H0 Z`;
  }, [chartPath, height]);

  return {
    chartPath,
    areaPath,
    colors,
    width,
    height,
  };
};

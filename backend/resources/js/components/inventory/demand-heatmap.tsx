import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface HeatmapData {
  day: string;
  hours: number[];
}

interface DemandHeatmapProps {
  data: HeatmapData[];
  title?: string;
  description?: string;
}

export function DemandHeatmap({
  data,
  title = 'Demand Patterns',
  description = 'Hourly demand distribution throughout the week',
}: DemandHeatmapProps) {
  const maxValue = Math.max(...data.flatMap((d) => d.hours));
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const getIntensityColor = (value: number) => {
    const intensity = value / maxValue;
    if (intensity === 0) return 'bg-gray-100 dark:bg-gray-800';
    if (intensity < 0.2) return 'bg-blue-100 dark:bg-blue-950';
    if (intensity < 0.4) return 'bg-blue-200 dark:bg-blue-900';
    if (intensity < 0.6) return 'bg-blue-400 dark:bg-blue-700';
    if (intensity < 0.8) return 'bg-blue-600 dark:bg-blue-600';
    return 'bg-blue-800 dark:bg-blue-500';
  };

  const getPeakHours = () => {
    const hourlyTotals = hours.map((hour) =>
      data.reduce((sum, day) => sum + day.hours[hour], 0)
    );
    const maxHourlyTotal = Math.max(...hourlyTotals);
    return hourlyTotals
      .map((total, hour) => (total === maxHourlyTotal ? hour : null))
      .filter((h) => h !== null);
  };

  const peakHours = getPeakHours();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <Badge variant="secondary">
            Peak: {peakHours.map((h) => `${h}:00`).join(', ')}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {/* Hour labels */}
          <div className="flex items-center gap-1 pl-16">
            {hours.filter((h) => h % 3 === 0).map((hour) => (
              <div key={hour} className="flex-1 text-center text-xs text-muted-foreground">
                {hour}:00
              </div>
            ))}
          </div>

          {/* Heatmap grid */}
          {data.map((dayData, dayIndex) => (
            <div key={dayIndex} className="flex items-center gap-1">
              <div className="w-14 text-sm font-medium text-right">{dayData.day}</div>
              <div className="flex-1 flex gap-1">
                {dayData.hours.map((value, hourIndex) => (
                  <div
                    key={hourIndex}
                    className={cn(
                      'flex-1 h-8 rounded transition-all hover:ring-2 hover:ring-blue-500 cursor-pointer',
                      getIntensityColor(value)
                    )}
                    title={`${dayData.day} ${hourIndex}:00 - ${value} requests`}
                  />
                ))}
              </div>
            </div>
          ))}

          {/* Legend */}
          <div className="flex items-center justify-center gap-4 pt-4 text-xs text-muted-foreground">
            <span>Low</span>
            <div className="flex gap-1">
              <div className="w-4 h-4 rounded bg-blue-100 dark:bg-blue-950" />
              <div className="w-4 h-4 rounded bg-blue-200 dark:bg-blue-900" />
              <div className="w-4 h-4 rounded bg-blue-400 dark:bg-blue-700" />
              <div className="w-4 h-4 rounded bg-blue-600 dark:bg-blue-600" />
              <div className="w-4 h-4 rounded bg-blue-800 dark:bg-blue-500" />
            </div>
            <span>High</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

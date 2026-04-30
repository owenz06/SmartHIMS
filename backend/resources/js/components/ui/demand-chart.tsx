import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface DataPoint {
  date: string;
  actual?: number;
  predicted: number;
  confidence?: number;
}

interface DemandChartProps {
  title: string;
  data: DataPoint[];
  unit?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export function DemandChart({ title, data, unit = 'units', trend }: DemandChartProps) {
  const maxValue = Math.max(...data.map((d) => Math.max(d.actual || 0, d.predicted)));
  const chartHeight = 200;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>Historical and predicted demand</CardDescription>
          </div>
          {trend && (
            <Badge variant={trend.isPositive ? 'default' : 'secondary'}>
              {trend.isPositive ? (
                <TrendingUp className="h-3 w-3 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 mr-1" />
              )}
              {trend.value}%
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Simple bar chart visualization */}
          <div className="relative" style={{ height: chartHeight }}>
            <div className="absolute inset-0 flex items-end justify-between gap-1">
              {data.map((point, index) => {
                const actualHeight = point.actual
                  ? (point.actual / maxValue) * chartHeight
                  : 0;
                const predictedHeight = (point.predicted / maxValue) * chartHeight;

                return (
                  <div key={index} className="flex-1 flex flex-col items-center gap-1">
                    {point.actual !== undefined && (
                      <div
                        className="w-full bg-blue-500 rounded-t transition-all hover:bg-blue-600"
                        style={{ height: actualHeight }}
                        title={`Actual: ${point.actual} ${unit}`}
                      />
                    )}
                    <div
                      className={`w-full rounded-t transition-all ${
                        point.actual === undefined
                          ? 'bg-purple-400 hover:bg-purple-500'
                          : 'bg-purple-300 hover:bg-purple-400 opacity-70'
                      }`}
                      style={{
                        height: point.actual === undefined ? predictedHeight : predictedHeight * 0.5,
                      }}
                      title={`Predicted: ${point.predicted} ${unit}`}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded" />
              <span className="text-muted-foreground">Actual</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-400 rounded" />
              <span className="text-muted-foreground">Predicted</span>
            </div>
          </div>

          {/* Date labels */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            {data.map((point, index) => {
              if (index % Math.ceil(data.length / 5) === 0 || index === data.length - 1) {
                return (
                  <span key={index} className="text-center">
                    {point.date}
                  </span>
                );
              }
              return null;
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

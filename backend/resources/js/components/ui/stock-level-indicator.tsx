import { cn } from '@/lib/utils';
import { AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface StockLevelIndicatorProps {
  current: number;
  reorderPoint: number;
  maximum: number;
  unit?: string;
  showLabel?: boolean;
  className?: string;
}

export function StockLevelIndicator({
  current,
  reorderPoint,
  maximum,
  unit = 'units',
  showLabel = true,
  className,
}: StockLevelIndicatorProps) {
  const percentage = (current / maximum) * 100;
  const isLow = current <= reorderPoint;
  const isCritical = current <= reorderPoint * 0.5;

  const getStatus = () => {
    if (isCritical) return { label: 'Critical', color: 'text-red-600', icon: AlertCircle };
    if (isLow) return { label: 'Low Stock', color: 'text-yellow-600', icon: AlertTriangle };
    return { label: 'Healthy', color: 'text-green-600', icon: CheckCircle };
  };

  const status = getStatus();
  const StatusIcon = status.icon;

  const getProgressColor = () => {
    if (isCritical) return 'bg-red-500';
    if (isLow) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <StatusIcon className={cn('h-4 w-4', status.color)} />
          {showLabel && (
            <span className={cn('text-sm font-medium', status.color)}>{status.label}</span>
          )}
        </div>
        <span className="text-sm font-medium">
          {current} / {maximum} {unit}
        </span>
      </div>
      <div className="relative">
        <Progress value={percentage} className="h-2" indicatorClassName={getProgressColor()} />
        {/* Reorder point indicator */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-orange-500"
          style={{ left: `${(reorderPoint / maximum) * 100}%` }}
          title={`Reorder Point: ${reorderPoint}`}
        />
      </div>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>0</span>
        <span className="text-orange-600">Reorder: {reorderPoint}</span>
        <span>{maximum}</span>
      </div>
    </div>
  );
}

import { cn } from '@/lib/utils';
import { AlertCircle, AlertTriangle, TrendingDown, Clock } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface PredictiveAlertProps {
  itemName: string;
  currentStock: number;
  predictedStockout: string;
  daysUntilStockout: number;
  severity: 'critical' | 'warning' | 'info';
  recommendedAction?: string;
  onAction?: () => void;
  className?: string;
}

export function PredictiveAlert({
  itemName,
  currentStock,
  predictedStockout,
  daysUntilStockout,
  severity,
  recommendedAction,
  onAction,
  className,
}: PredictiveAlertProps) {
  const severityConfig = {
    critical: {
      icon: AlertCircle,
      color: 'destructive',
      bgColor: 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900',
      badgeColor: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    },
    warning: {
      icon: AlertTriangle,
      color: 'default',
      bgColor: 'bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-900',
      badgeColor: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    },
    info: {
      icon: TrendingDown,
      color: 'default',
      bgColor: 'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900',
      badgeColor: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    },
  };

  const config = severityConfig[severity];
  const Icon = config.icon;

  return (
    <Alert className={cn(config.bgColor, className)}>
      <Icon className="h-4 w-4" />
      <AlertTitle className="flex items-center justify-between">
        <span className="font-semibold">{itemName}</span>
        <Badge className={config.badgeColor} variant="secondary">
          <Clock className="h-3 w-3 mr-1" />
          {daysUntilStockout} days
        </Badge>
      </AlertTitle>
      <AlertDescription className="mt-2 space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Current Stock:</span>
          <span className="font-medium">{currentStock} units</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Predicted Stockout:</span>
          <span className="font-medium">{predictedStockout}</span>
        </div>
        {recommendedAction && (
          <div className="pt-2 border-t">
            <p className="text-sm font-medium mb-2">Recommended Action:</p>
            <p className="text-sm text-muted-foreground">{recommendedAction}</p>
          </div>
        )}
        {onAction && (
          <Button
            size="sm"
            variant={severity === 'critical' ? 'destructive' : 'default'}
            className="w-full mt-2"
            onClick={onAction}
          >
            Create Purchase Order
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
}

import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  description?: string;
  variant?: 'default' | 'warning' | 'danger' | 'success';
  className?: string;
}

export function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  description,
  variant = 'default',
  className,
}: StatCardProps) {
  const variantStyles = {
    default: 'border-border',
    warning: 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20',
    danger: 'border-red-500 bg-red-50 dark:bg-red-950/20',
    success: 'border-green-500 bg-green-50 dark:bg-green-950/20',
  };

  const iconStyles = {
    default: 'text-muted-foreground',
    warning: 'text-yellow-600 dark:text-yellow-400',
    danger: 'text-red-600 dark:text-red-400',
    success: 'text-green-600 dark:text-green-400',
  };

  return (
    <Card className={cn(variantStyles[variant], className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={cn('h-4 w-4', iconStyles[variant])} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend && (
          <p className="text-xs text-muted-foreground mt-1">
            <span
              className={cn(
                'font-medium',
                trend.isPositive ? 'text-green-600' : 'text-red-600'
              )}
            >
              {trend.isPositive ? '+' : ''}
              {trend.value}%
            </span>{' '}
            from last month
          </p>
        )}
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}

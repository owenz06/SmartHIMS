import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ResponsiveTableProps {
  children: ReactNode;
  className?: string;
}

export function ResponsiveTable({ children, className }: ResponsiveTableProps) {
  return (
    <div className={cn("w-full overflow-x-auto", className)}>
      <div className="min-w-full inline-block align-middle">
        <div className="overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
}

interface MobileCardProps {
  children: ReactNode;
  className?: string;
}

export function MobileCard({ children, className }: MobileCardProps) {
  return (
    <div className={cn(
      "md:hidden p-4 border border-sidebar-border rounded-lg mb-3 space-y-2",
      className
    )}>
      {children}
    </div>
  );
}

interface MobileCardRowProps {
  label: string;
  value: ReactNode;
  className?: string;
}

export function MobileCardRow({ label, value, className }: MobileCardRowProps) {
  return (
    <div className={cn("flex justify-between items-start gap-2", className)}>
      <span className="text-sm font-medium text-muted-foreground min-w-[100px]">{label}:</span>
      <span className="text-sm text-right flex-1">{value}</span>
    </div>
  );
}

interface DesktopTableProps {
  children: ReactNode;
  className?: string;
}

export function DesktopTable({ children, className }: DesktopTableProps) {
  return (
    <div className={cn("hidden md:block overflow-x-auto", className)}>
      {children}
    </div>
  );
}

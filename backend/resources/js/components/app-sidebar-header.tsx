import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { BreadcrumbItem as BreadcrumbItemType } from '@/types';
import { Bell } from 'lucide-react';
import { Link, usePage } from '@inertiajs/react';
import { useMessageCount } from '@/hooks/use-message-count';

export function AppSidebarHeader({
    breadcrumbs = [],
}: {
    breadcrumbs?: BreadcrumbItemType[];
}) {
    const { auth } = usePage().props as any;
    const { count } = useMessageCount();

    return (
        <header className="flex h-16 shrink-0 items-center justify-between gap-4 border-b border-sidebar-border/50 px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4">
            <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1" />
                <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>

            {/* Right side: Bell icon, User name */}
            <div className="flex items-center gap-4">
                {/* Bell Icon with Badge */}
                <Link href="/messages">
                    <Button variant="ghost" size="sm" className="relative">
                        <Bell className="h-5 w-5" />
                        {count > 0 && (
                            <Badge 
                                variant="destructive" 
                                className="absolute -top-1 -right-1 h-5 min-w-5 flex items-center justify-center p-0 text-xs"
                            >
                                {count > 99 ? '99+' : count}
                            </Badge>
                        )}
                    </Button>
                </Link>

                {/* User Name */}
                <div className="hidden sm:flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">{auth?.user?.name || 'User'}</span>
                </div>
            </div>
        </header>
    );
}

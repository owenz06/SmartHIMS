import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/use-toast';
import { usePage } from '@inertiajs/react';
import type { AppLayoutProps } from '@/types';
import { useEffect } from 'react';

export default function AppSidebarLayout({
    children,
    breadcrumbs = [],
}: AppLayoutProps) {
    const { toast } = useToast();
    const { flash } = usePage().props as any;

    useEffect(() => {
        if (flash?.error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: flash.error,
            });
        }
        if (flash?.success) {
            toast({
                title: "Success",
                description: flash.success,
            });
        }
        if (flash?.warning) {
            toast({
                title: "Warning",
                description: flash.warning,
            });
        }
        if (flash?.info) {
            toast({
                title: "Info",
                description: flash.info,
            });
        }
    }, [flash, toast]);

    return (
        <AppShell variant="sidebar">
            <AppSidebar />
            <AppContent variant="sidebar" className="overflow-x-hidden">
                <AppSidebarHeader breadcrumbs={breadcrumbs} />
                {children}
            </AppContent>
            <Toaster />
        </AppShell>
    );
}

import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Audit Logs', href: '/admin/audit-logs' },
];

interface AuditLog {
    id: number;
    action: string;
    user?: {
        name: string;
    };
    created_at: string;
}

interface Props {
    logs: {
        data: AuditLog[];
    };
}

export default function AuditLogs({ logs }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Audit Logs" />
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-sidebar-border px-4 sm:px-6 py-4 gap-3">
                <div>
                    <h1 className="text-xl sm:text-2xl font-semibold">Audit Logs</h1>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                        View system activity and user actions
                    </p>
                </div>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6">
                {/* Mobile Card View */}
                <div className="md:hidden space-y-3">
                    {logs?.data && logs.data.length > 0 ? (
                        logs.data.map((log) => (
                            <div
                                key={log.id}
                                className="border border-sidebar-border rounded-lg p-4 space-y-3 bg-card shadow-sm"
                            >
                                <div className="flex justify-between items-start gap-2">
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-sm break-words">{log.action}</h3>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            ID: {log.id}
                                        </p>
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                    <div>
                                        <span className="text-muted-foreground">User:</span>
                                        <p className="font-medium mt-0.5">{log.user?.name || 'System'}</p>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">Date & Time:</span>
                                        <p className="font-medium mt-0.5">
                                            {new Date(log.created_at).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="py-8 text-center text-muted-foreground text-sm">
                            No audit logs found
                        </div>
                    )}
                </div>

                {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-sidebar-border text-left text-sm text-muted-foreground">
                                <th className="pb-3 font-medium">ID</th>
                                <th className="pb-3 font-medium">ACTION</th>
                                <th className="pb-3 font-medium">USER</th>
                                <th className="pb-3 font-medium">DATE & TIME</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs?.data && logs.data.length > 0 ? (
                                logs.data.map((log) => (
                                    <tr
                                        key={log.id}
                                        className="border-b border-sidebar-border/50 hover:bg-sidebar-accent/50 transition-colors"
                                    >
                                        <td className="py-4">{log.id}</td>
                                        <td className="py-4">{log.action}</td>
                                        <td className="py-4 text-muted-foreground">
                                            {log.user?.name || 'System'}
                                        </td>
                                        <td className="py-4 text-muted-foreground">
                                            {new Date(log.created_at).toLocaleString()}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="py-8 text-center text-muted-foreground">
                                        No audit logs found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}

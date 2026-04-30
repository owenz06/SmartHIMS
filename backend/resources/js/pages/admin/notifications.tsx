import { Head, router } from '@inertiajs/react';
import { useEffect } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Badge } from '@/components/ui/badge';
import { Bell, Check } from 'lucide-react';

interface Notification {
    id: number;
    title: string;
    message: string;
    is_read: boolean;
    created_at: string;
}

interface Props {
    notifications: {
        data: Notification[];
    };
}

export default function Notifications({ notifications }: Props) {
    // Trigger a custom event when notifications are viewed
    useEffect(() => {
        window.dispatchEvent(new CustomEvent('notifications-viewed'));
    }, []);

    const handleMarkAsRead = (id: number) => {
        router.post(`/notifications/${id}/read`, {}, {
            preserveScroll: true,
            onSuccess: () => {
                // Trigger event to refetch notification count
                window.dispatchEvent(new CustomEvent('notification-read'));
            },
        });
    };

    return (
        <>
            <Head title="Notifications" />
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-sidebar-border px-6 py-4">
                <div>
                    <h1 className="text-2xl font-semibold">Notifications</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        View and manage system notifications
                    </p>
                </div>
            </div>

            {/* Content */}
            <div className="p-6">
                <div className="space-y-3">
                    {notifications.data.length === 0 ? (
                        <div className="py-12 text-center text-muted-foreground">
                            <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>No notifications found</p>
                        </div>
                    ) : (
                        notifications.data.map((notification) => (
                            <div
                                key={notification.id}
                                className={`p-4 rounded-lg border transition-colors ${
                                    notification.is_read
                                        ? 'bg-sidebar-accent/30 border-sidebar-border'
                                        : 'bg-blue-500/10 border-blue-500/20'
                                }`}
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-semibold">{notification.title}</h3>
                                            {!notification.is_read && (
                                                <Badge className="bg-blue-500 text-white text-xs">New</Badge>
                                            )}
                                        </div>
                                        <p className="text-sm text-muted-foreground mb-2">
                                            {notification.message}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {new Date(notification.created_at).toLocaleString()}
                                        </p>
                                    </div>
                                    {!notification.is_read && (
                                        <button
                                            onClick={() => handleMarkAsRead(notification.id)}
                                            className="p-2 rounded-md hover:bg-sidebar-accent transition-colors"
                                            title="Mark as read"
                                        >
                                            <Check className="h-4 w-4" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </>
    );
}

Notifications.layout = (page: React.ReactNode) => <AppLayout children={page} />;

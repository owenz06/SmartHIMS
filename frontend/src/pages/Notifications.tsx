import React, { useEffect, useState } from 'react';
import { NotificationAPI } from '../lib/api';
import {
  Bell,
  Check,
  CheckCheck,
  Trash2,
  AlertCircle,
  Package,
  ShoppingCart,
  ClipboardList,
  TrendingDown,
  Filter,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import DashboardLayout from '../components/DashboardLayout';

interface Notification {
  id: number;
  title: string;
  message: string;
  target_role: string | null;
  user_id: number | null;
  is_read: boolean;
  created_at: string;
  updated_at: string;
}

const notificationIcons: Record<string, any> = {
  'Low Stock Alert': TrendingDown,
  'Purchase Order': ShoppingCart,
  'Requisition': ClipboardList,
  'Stock': Package,
  'default': Bell,
};

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [unreadCount, setUnreadCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      const params: any = {
        page: currentPage,
        per_page: 25,
      };

      if (filter === 'unread') {
        params.is_read = false;
      }

      const response = await NotificationAPI.getNotifications(params);
      if (response.data.success) {
        setNotifications(response.data.data);
        setUnreadCount(response.data.unread_count);
        setTotalPages(response.data.last_page);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [currentPage, filter]);

  const handleMarkAsRead = async (notificationId: number) => {
    try {
      const response = await NotificationAPI.markAsRead(notificationId);
      if (response.data.success) {
        setNotifications(prev =>
          prev.map(notif =>
            notif.id === notificationId ? { ...notif, is_read: true } : notif
          )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const response = await NotificationAPI.markAllAsRead();
      if (response.data.success) {
        setNotifications(prev =>
          prev.map(notif => ({ ...notif, is_read: true }))
        );
        setUnreadCount(0);
      }
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const handleDelete = async (notificationId: number) => {
    if (!confirm('Are you sure you want to delete this notification?')) return;

    try {
      const response = await NotificationAPI.deleteNotification(notificationId);
      if (response.data.success) {
        setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
      }
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  const handleDeleteAllRead = async () => {
    if (!confirm('Are you sure you want to delete all read notifications?')) return;

    try {
      const response = await NotificationAPI.deleteAllRead();
      if (response.data.success) {
        setNotifications(prev => prev.filter(notif => !notif.is_read));
      }
    } catch (error) {
      console.error('Failed to delete read notifications:', error);
    }
  };

  const getNotificationIcon = (title: string) => {
    for (const [key, Icon] of Object.entries(notificationIcons)) {
      if (title.includes(key)) {
        return Icon;
      }
    }
    return notificationIcons.default;
  };

  const getNotificationColor = (title: string) => {
    if (title.includes('Low Stock')) return 'text-orange-600 bg-orange-100';
    if (title.includes('Purchase Order')) return 'text-blue-600 bg-blue-100';
    if (title.includes('Requisition')) return 'text-purple-600 bg-purple-100';
    if (title.includes('Approved')) return 'text-green-600 bg-green-100';
    return 'text-primary bg-primary/10';
  };

  if (isLoading && notifications.length === 0) {
    return (
      <DashboardLayout 
        title="Notifications"
        subtitle="Loading notifications..."
        showSearch={false}
      >
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading notifications...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Notifications"
      subtitle={`${unreadCount} unread notifications`}
      showSearch={false}
    >
      <div className="space-y-6">
        {/* Header Actions */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-primary" />
                <CardTitle>All Notifications</CardTitle>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 border rounded-md p-1">
                  <Button
                    variant={filter === 'all' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => {
                      setFilter('all');
                      setCurrentPage(1);
                    }}
                  >
                    All
                  </Button>
                  <Button
                    variant={filter === 'unread' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => {
                      setFilter('unread');
                      setCurrentPage(1);
                    }}
                  >
                    Unread ({unreadCount})
                  </Button>
                </div>
                {unreadCount > 0 && (
                  <Button variant="outline" size="sm" onClick={handleMarkAllAsRead}>
                    <CheckCheck className="h-4 w-4 mr-2" />
                    Mark All Read
                  </Button>
                )}
                <Button variant="outline" size="sm" onClick={handleDeleteAllRead}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear Read
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Notifications List */}
        {notifications.length === 0 ? (
          <Card>
            <CardContent className="py-12">
              <div className="text-center">
                <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {filter === 'unread' ? 'No unread notifications' : 'No notifications'}
                </h3>
                <p className="text-muted-foreground">
                  {filter === 'unread'
                    ? "You're all caught up!"
                    : 'Notifications will appear here when you have updates'}
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => {
              const Icon = getNotificationIcon(notification.title);
              const colorClass = getNotificationColor(notification.title);

              return (
                <Card
                  key={notification.id}
                  className={`transition-all hover:shadow-md ${
                    !notification.is_read ? 'border-l-4 border-l-primary bg-primary/5' : ''
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div className={`flex h-10 w-10 items-center justify-center rounded-full flex-shrink-0 ${colorClass}`}>
                        <Icon className="h-5 w-5" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-1">
                          <h4 className="font-semibold text-foreground">{notification.title}</h4>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            {!notification.is_read && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleMarkAsRead(notification.id)}
                                title="Mark as read"
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(notification.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-sm text-foreground mb-2">{notification.message}</p>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span>{new Date(notification.created_at).toLocaleString()}</span>
                          {!notification.is_read && (
                            <span className="flex items-center gap-1 text-primary font-medium">
                              <div className="h-2 w-2 rounded-full bg-primary"></div>
                              Unread
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <Card>
            <CardContent className="py-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Notifications;

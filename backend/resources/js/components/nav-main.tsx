import { Link } from '@inertiajs/react';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { useNotificationCount } from '@/hooks/use-notification-count';
import { useMessageCount } from '@/hooks/use-message-count';
import type { NavItem } from '@/types';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const { isCurrentUrl } = useCurrentUrl();
    const { count: notificationCount } = useNotificationCount();
    const { count: messageCount } = useMessageCount();

    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => {
                    const isNotificationItem = item.href === '/notifications';
                    const isMessageItem = item.href === '/messages';
                    const hasUnreadNotifications = isNotificationItem && notificationCount > 0;
                    const hasUnreadMessages = isMessageItem && messageCount > 0;
                    const hasUnread = hasUnreadNotifications || hasUnreadMessages;
                    const unreadCount = isNotificationItem ? notificationCount : messageCount;

                    return (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                                asChild
                                isActive={isCurrentUrl(item.href)}
                                tooltip={{ children: item.title }}
                            >
                                <Link href={item.href} prefetch>
                                    <div className="relative">
                                        {item.icon && <item.icon />}
                                        {hasUnread && (
                                            <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-500" />
                                        )}
                                    </div>
                                    <span>{item.title}</span>
                                    {hasUnread && (
                                        <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
                                            {unreadCount > 9 ? '9+' : unreadCount}
                                        </span>
                                    )}
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}

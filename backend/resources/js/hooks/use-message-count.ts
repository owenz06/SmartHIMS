import { useEffect, useState } from 'react';
import { router } from '@inertiajs/react';
import { useRealTimeNotifications } from './use-real-time-notifications';

export function useMessageCount() {
    const { unreadMessages, isConnected, refreshCounts } = useRealTimeNotifications();

    useEffect(() => {
        // Listen for Inertia navigation events to refresh count
        const removeListener = router.on('navigate', () => {
            refreshCounts();
        });

        return () => {
            removeListener();
        };
    }, [refreshCounts]);

    return { 
        count: unreadMessages, 
        refresh: refreshCounts,
        isConnected 
    };
}

import { useState, useEffect } from 'react';
import axios from 'axios';

export function useNotificationCount() {
    const [count, setCount] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);

    const fetchCount = async () => {
        try {
            const response = await axios.get('/notifications/count');
            setCount(response.data.count);
        } catch (error) {
            console.error('Failed to fetch notification count:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCount();

        // Poll for updates every 30 seconds
        const interval = setInterval(fetchCount, 30000);

        // Listen for notification events
        const handleNotificationRead = () => fetchCount();
        const handleNotificationsViewed = () => fetchCount();

        window.addEventListener('notification-read', handleNotificationRead);
        window.addEventListener('notifications-viewed', handleNotificationsViewed);

        return () => {
            clearInterval(interval);
            window.removeEventListener('notification-read', handleNotificationRead);
            window.removeEventListener('notifications-viewed', handleNotificationsViewed);
        };
    }, []);

    return { count, loading, refetch: fetchCount };
}

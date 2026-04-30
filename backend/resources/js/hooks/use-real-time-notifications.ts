import { useState, useEffect, useRef } from 'react';

interface NotificationCounts {
  unread_messages: number;
  notifications: number;
  timestamp: string;
}

export function useRealTimeNotifications() {
  const [counts, setCounts] = useState<NotificationCounts>({
    unread_messages: 0,
    notifications: 0,
    timestamp: new Date().toISOString()
  });
  const [isConnected, setIsConnected] = useState(false);
  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  const fetchCounts = async () => {
    try {
      const response = await fetch('/api/notifications/counts', {
        headers: {
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        credentials: 'same-origin'
      });
      
      if (response.ok) {
        const data = await response.json();
        setCounts(data);
        return true;
      }
    } catch (error) {
      console.error('Failed to fetch notification counts:', error);
    }
    return false;
  };

  const connectEventSource = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    try {
      const eventSource = new EventSource('/api/notifications/stream');
      eventSourceRef.current = eventSource;

      eventSource.onopen = () => {
        setIsConnected(true);
        reconnectAttempts.current = 0;
        console.log('Real-time notifications connected');
      };

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          setCounts(data);
        } catch (error) {
          console.error('Failed to parse notification data:', error);
        }
      };

      eventSource.onerror = () => {
        setIsConnected(false);
        eventSource.close();
        
        // Attempt to reconnect with exponential backoff
        if (reconnectAttempts.current < maxReconnectAttempts) {
          const delay = Math.pow(2, reconnectAttempts.current) * 1000; // 1s, 2s, 4s, 8s, 16s
          reconnectAttempts.current++;
          
          reconnectTimeoutRef.current = setTimeout(() => {
            console.log(`Attempting to reconnect (${reconnectAttempts.current}/${maxReconnectAttempts})...`);
            connectEventSource();
          }, delay);
        } else {
          console.log('Max reconnection attempts reached. Falling back to polling.');
          startPolling();
        }
      };
    } catch (error) {
      console.error('Failed to create EventSource:', error);
      startPolling();
    }
  };

  const startPolling = () => {
    // Fallback to polling every 30 seconds
    const pollInterval = setInterval(fetchCounts, 30000);
    
    return () => {
      clearInterval(pollInterval);
    };
  };

  useEffect(() => {
    // Initial fetch
    fetchCounts();

    // Try to connect with Server-Sent Events
    if (typeof EventSource !== 'undefined') {
      connectEventSource();
    } else {
      // Fallback to polling for browsers that don't support SSE
      const cleanup = startPolling();
      return cleanup;
    }

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, []);

  const markNotificationsAsRead = async () => {
    try {
      const response = await fetch('/api/notifications/mark-read', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        credentials: 'same-origin'
      });

      if (response.ok) {
        setCounts(prev => ({ ...prev, notifications: 0 }));
      }
    } catch (error) {
      console.error('Failed to mark notifications as read:', error);
    }
  };

  return {
    unreadMessages: counts.unread_messages,
    notifications: counts.notifications,
    isConnected,
    markNotificationsAsRead,
    refreshCounts: fetchCounts
  };
}
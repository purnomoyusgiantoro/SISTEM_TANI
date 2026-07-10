// ──────────────────────────────────────────
// Notification Context — Global notification state
// ──────────────────────────────────────────

import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import notifikasiApi from '../api/notifikasi';
import { NOTIFICATION_POLL_INTERVAL } from '../utils/constants';
import { useAuth } from './AuthContext';

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const intervalRef = useRef(null);

  // Fetch unread count
  const fetchUnreadCount = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const result = await notifikasiApi.getUnreadCount();
      setUnreadCount(result.data?.count ?? result.data ?? 0);
    } catch {
      // Silently fail for polling
    }
  }, [isAuthenticated]);

  // Fetch all notifications
  const fetchNotifications = useCallback(
    async (params = {}) => {
      if (!isAuthenticated) return;
      setLoading(true);
      try {
        const result = await notifikasiApi.getAll(params);
        setNotifications(result.data || []);
        return result;
      } catch {
        // Silently fail
      } finally {
        setLoading(false);
      }
    },
    [isAuthenticated]
  );

  // Mark as read
  const markAsRead = useCallback(
    async (id) => {
      try {
        await notifikasiApi.markAsRead(id);
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      } catch {
        // Silently fail
      }
    },
    []
  );

  // Mark all as read
  const markAllAsRead = useCallback(async () => {
    try {
      await notifikasiApi.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch {
      // Silently fail
    }
  }, []);

  // Poll unread count when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchUnreadCount();
      intervalRef.current = setInterval(fetchUnreadCount, NOTIFICATION_POLL_INTERVAL);
    } else {
      setNotifications([]);
      setUnreadCount(0);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isAuthenticated, fetchUnreadCount]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        fetchNotifications,
        fetchUnreadCount,
        markAsRead,
        markAllAsRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return context;
}

export default NotificationContext;

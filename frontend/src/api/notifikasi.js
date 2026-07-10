// ──────────────────────────────────────────
// Notifikasi API
// ──────────────────────────────────────────

import api from './client';

export const notifikasiApi = {
  /**
   * Get list of notifications
   * @param {object} params - { page, per_page }
   */
  getAll: (params = {}) =>
    api.get('/notifikasi', params),

  /**
   * Get unread notification count
   * @returns {Promise<{ data: { count: number } }>}
   */
  getUnreadCount: () =>
    api.get('/notifikasi/unread-count'),

  /**
   * Mark single notification as read
   * @param {number} id
   */
  markAsRead: (id) =>
    api.put(`/notifikasi/${id}/read`),

  /**
   * Mark all notifications as read
   */
  markAllAsRead: () =>
    api.put('/notifikasi/read-all'),
};

export default notifikasiApi;

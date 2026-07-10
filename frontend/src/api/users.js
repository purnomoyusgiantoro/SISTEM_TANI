// ──────────────────────────────────────────
// Users API (Admin)
// ──────────────────────────────────────────

import api from './client';

export const usersApi = {
  /**
   * Get list of users
   * @param {object} params - { page, per_page, search, role, status }
   */
  getAll: (params = {}) =>
    api.get('/users', params),

  /**
   * Create new user
   * @param {object} data - { nama, email, password, password_confirmation, role }
   */
  create: (data) =>
    api.post('/users', data),

  /**
   * Update user
   * @param {number} id
   * @param {object} data - { nama, email, role }
   */
  update: (id, data) =>
    api.put(`/users/${id}`, data),

  /**
   * Toggle user status (aktif/nonaktif)
   * @param {number} id
   */
  toggleStatus: (id) =>
    api.put(`/users/${id}/toggle-status`),

  /**
   * Delete user
   * @param {number} id
   */
  delete: (id) =>
    api.delete(`/users/${id}`),
};

export default usersApi;

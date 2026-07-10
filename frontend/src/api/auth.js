// ──────────────────────────────────────────
// Auth API
// ──────────────────────────────────────────

import api from './client';

export const authApi = {
  /**
   * Login with email and password
   * @param {string} email
   * @param {string} password
   * @returns {Promise<{ data: { user, token, token_type } }>}
   */
  login: (email, password) =>
    api.post('/auth/login', { email, password }),

  /**
   * Logout (invalidate token)
   */
  logout: () =>
    api.post('/auth/logout'),

  /**
   * Get current authenticated user
   * @returns {Promise<{ data: User }>}
   */
  me: () =>
    api.get('/auth/me'),

  /**
   * Update profile
   * @param {object} data - { nama, email, avatar }
   */
  updateProfile: (data) =>
    api.put('/auth/profile', data),

  /**
   * Update password
   * @param {object} data - { current_password, password, password_confirmation }
   */
  updatePassword: (data) =>
    api.put('/auth/password', data),
};

export default authApi;

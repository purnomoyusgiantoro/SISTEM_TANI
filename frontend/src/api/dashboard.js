// ──────────────────────────────────────────
// Dashboard API
// ──────────────────────────────────────────

import api from './client';

export const dashboardApi = {
  /**
   * Get dashboard statistics (role-based)
   * @returns {Promise<{ data: object }>}
   */
  getStats: () =>
    api.get('/dashboard/stats'),
};

export default dashboardApi;

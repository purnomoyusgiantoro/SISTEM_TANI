// ──────────────────────────────────────────
// Log Aktivitas API (Admin)
// ──────────────────────────────────────────

import api from './client';

export const logApi = {
  /**
   * Get list of activity logs
   * @param {object} params - { page, per_page, level, search, tanggal_dari, tanggal_sampai }
   */
  getAll: (params = {}) =>
    api.get('/log-aktivitas', params),

  /**
   * Export logs as CSV
   * @param {object} params - same filter params
   * @returns {Promise<{ data }>}
   */
  export: (params = {}) =>
    api.get('/log-aktivitas/export', params),
};

export default logApi;

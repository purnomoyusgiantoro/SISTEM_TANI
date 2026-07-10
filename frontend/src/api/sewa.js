// ──────────────────────────────────────────
// Sewa API
// ──────────────────────────────────────────

import api from './client';

export const sewaApi = {
  /**
   * Get list of sewa
   * @param {object} params - { page, per_page, status, validasi }
   */
  getAll: (params = {}) =>
    api.get('/sewa', params),

  /**
   * Get single sewa by ID
   * @param {number} id
   */
  getById: (id) =>
    api.get(`/sewa/${id}`),

  /**
   * Create sewa (petani only)
   * @param {object} data - { peralatan_id, tanggal_mulai, tanggal_selesai, catatan }
   */
  create: (data) =>
    api.post('/sewa', data),

  /**
   * Approve sewa (pengurus only)
   * @param {number} id
   */
  setujui: (id) =>
    api.put(`/sewa/${id}/setujui`),

  /**
   * Reject sewa (pengurus only)
   * @param {number} id
   * @param {object} data - { alasan }
   */
  tolak: (id, data = {}) =>
    api.put(`/sewa/${id}/tolak`, data),
};

export default sewaApi;

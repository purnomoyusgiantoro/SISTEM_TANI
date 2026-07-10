// ──────────────────────────────────────────
// Lahan API
// ──────────────────────────────────────────

import api from './client';

export const lahanApi = {
  /**
   * Get list of lahan with filters and pagination
   * @param {object} params - { page, per_page, search, jenis_lahan, status, wilayah_id }
   */
  getAll: (params = {}) =>
    api.get('/lahan', params),

  /**
   * Get single lahan by ID
   * @param {number} id
   */
  getById: (id) =>
    api.get(`/lahan/${id}`),

  /**
   * Create new lahan
   * @param {object} data - { lokasi, luas, jenis_lahan, koordinat, catatan }
   */
  create: (data) =>
    api.post('/lahan', data),

  /**
   * Update existing lahan
   * @param {number} id
   * @param {object} data
   */
  update: (id, data) =>
    api.put(`/lahan/${id}`, data),

  /**
   * Delete lahan (pengurus only)
   * @param {number} id
   */
  delete: (id) =>
    api.delete(`/lahan/${id}`),
};

export default lahanApi;

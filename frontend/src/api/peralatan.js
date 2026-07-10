// ──────────────────────────────────────────
// Peralatan API
// ──────────────────────────────────────────

import api from './client';

export const peralatanApi = {
  /**
   * Get list of peralatan (katalog)
   * @param {object} params - { page, per_page, search, kategori, kondisi }
   */
  getAll: (params = {}) =>
    api.get('/peralatan', params),

  /**
   * Get single peralatan by ID
   * @param {number} id
   */
  getById: (id) =>
    api.get(`/peralatan/${id}`),

  /**
   * Create peralatan (pengurus only)
   * @param {FormData} formData - includes gambar file
   */
  create: (formData) =>
    api.upload('/peralatan', formData),

  /**
   * Update peralatan (pengurus only)
   * @param {number} id
   * @param {FormData} formData
   */
  update: (id, formData) =>
    api.uploadPut(`/peralatan/${id}`, formData),

  /**
   * Delete peralatan (pengurus only)
   * @param {number} id
   */
  delete: (id) =>
    api.delete(`/peralatan/${id}`),
};

export default peralatanApi;

// ──────────────────────────────────────────
// Organisasi API
// ──────────────────────────────────────────

import api from './client';

export const organisasiApi = {
  /**
   * Get organisasi tree
   */
  getAll: () =>
    api.get('/organisasi'),

  /**
   * Create organisasi member (pengurus only)
   * @param {object} data - { nama, jabatan, parent_id }
   */
  create: (data) =>
    api.post('/organisasi', data),

  /**
   * Update organisasi member (pengurus only)
   * @param {number} id
   * @param {object} data
   */
  update: (id, data) =>
    api.put(`/organisasi/${id}`, data),

  /**
   * Delete organisasi member (pengurus only)
   * @param {number} id
   */
  delete: (id) =>
    api.delete(`/organisasi/${id}`),
};

export default organisasiApi;

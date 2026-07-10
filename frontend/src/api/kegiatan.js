// ──────────────────────────────────────────
// Kegiatan API
// ──────────────────────────────────────────

import api from './client';

export const kegiatanApi = {
  /**
   * Get list of kegiatan
   * @param {object} params - { page, per_page, jenis_kegiatan, lahan_id, tanggal_dari, tanggal_sampai }
   */
  getAll: (params = {}) =>
    api.get('/kegiatan', params),

  /**
   * Get single kegiatan by ID
   * @param {number} id
   */
  getById: (id) =>
    api.get(`/kegiatan/${id}`),

  /**
   * Create kegiatan (petani only, with optional photo)
   * @param {FormData} formData - { lahan_id, jenis_kegiatan, tanggal, deskripsi, foto }
   */
  create: (formData) =>
    api.upload('/kegiatan', formData),

  /**
   * Update kegiatan (petani only, own kegiatan)
   * @param {number} id
   * @param {FormData} formData
   */
  update: (id, formData) =>
    api.uploadPut(`/kegiatan/${id}`, formData),

  /**
   * Delete kegiatan (petani only, own kegiatan)
   * @param {number} id
   */
  delete: (id) =>
    api.delete(`/kegiatan/${id}`),
};

export default kegiatanApi;

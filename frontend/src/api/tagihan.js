// ──────────────────────────────────────────
// Tagihan API
// ──────────────────────────────────────────

import api from './client';

export const tagihanApi = {
  /**
   * Get list of tagihan
   * @param {object} params - { page, per_page, status }
   */
  getAll: (params = {}) =>
    api.get('/tagihan', params),

  /**
   * Get single tagihan by ID
   * @param {number} id
   */
  getById: (id) =>
    api.get(`/tagihan/${id}`),

  /**
   * Upload payment proof (petani only)
   * @param {number} id
   * @param {FormData} formData - { bukti_file, jumlah_dibayar, tanggal_bayar, catatan }
   */
  uploadBukti: (id, formData) =>
    api.upload(`/tagihan/${id}/upload-bukti`, formData),

  /**
   * Verify payment (pengurus only)
   * @param {number} id
   * @param {object} data - { aksi: 'setujui' | 'tolak' }
   */
  verifikasi: (id, data) =>
    api.put(`/tagihan/${id}/verifikasi`, data),
};

export default tagihanApi;

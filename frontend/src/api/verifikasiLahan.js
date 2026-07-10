// ──────────────────────────────────────────
// Verifikasi Lahan API (implicit — included with lahan)
// ──────────────────────────────────────────

import api from './client';

export const verifikasiLahanApi = {
  /**
   * Get list of pending lahan for verification (BPP only)
   * @param {object} params - { page, per_page, status }
   */
  getAll: (params = {}) =>
    api.get('/verifikasi-lahan', params),

  /**
   * Accept/verify lahan (BPP only)
   * @param {number} id
   */
  terima: (id) =>
    api.put(`/verifikasi-lahan/${id}/terima`),

  /**
   * Reject lahan (BPP only)
   * @param {number} id
   * @param {object} data - { alasan }
   */
  tolak: (id, data) =>
    api.put(`/verifikasi-lahan/${id}/tolak`, data),
};

export default verifikasiLahanApi;

// ──────────────────────────────────────────
// Berita API
// ──────────────────────────────────────────

import api from './client';

export const beritaApi = {
  /**
   * Get list of berita
   * @param {object} params - { page, per_page, kategori, search }
   */
  getAll: (params = {}) =>
    api.get('/berita', params),

  /**
   * Get single berita by ID
   * @param {number} id
   */
  getById: (id) =>
    api.get(`/berita/${id}`),

  /**
   * Create berita (BPP only)
   * @param {FormData} formData - { judul, kategori, isi, gambar, status }
   */
  create: (formData) =>
    api.upload('/berita', formData),

  /**
   * Update berita (BPP only)
   * @param {number} id
   * @param {FormData} formData
   */
  update: (id, formData) =>
    api.uploadPut(`/berita/${id}`, formData),

  /**
   * Delete berita (BPP only)
   * @param {number} id
   */
  delete: (id) =>
    api.delete(`/berita/${id}`),

  /**
   * Toggle publish/draft status (BPP only)
   * @param {number} id
   */
  togglePublish: (id) =>
    api.put(`/berita/${id}/publish`),
};

export default beritaApi;

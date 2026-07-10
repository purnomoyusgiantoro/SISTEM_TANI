// ──────────────────────────────────────────
// Master Data API
// ──────────────────────────────────────────

import api from './client';

export const masterApi = {
  /**
   * Get list of wilayah (kecamatan)
   */
  getWilayah: () =>
    api.get('/master/wilayah'),

  /**
   * Get jenis lahan enum
   */
  getJenisLahan: () =>
    api.get('/master/jenis-lahan'),

  /**
   * Get kategori peralatan enum
   */
  getKategoriPeralatan: () =>
    api.get('/master/kategori-peralatan'),

  /**
   * Get jenis kegiatan enum
   */
  getJenisKegiatan: () =>
    api.get('/master/jenis-kegiatan'),
};

export default masterApi;

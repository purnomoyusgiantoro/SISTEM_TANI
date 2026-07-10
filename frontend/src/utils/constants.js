// ──────────────────────────────────────────
// RuangTani Constants
// ──────────────────────────────────────────

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';
export const APP_NAME = import.meta.env.VITE_APP_NAME || 'RuangTani';

// Local storage keys
export const STORAGE_KEYS = {
  TOKEN: 'ruangtani_token',
  USER: 'ruangtani_user',
};

// User roles
export const ROLES = {
  PETANI: 'petani',
  PENGURUS: 'pengurus',
  BPP: 'bpp',
  ADMIN: 'admin',
};

export const ROLE_LABELS = {
  [ROLES.PETANI]: 'Petani',
  [ROLES.PENGURUS]: 'Pengurus',
  [ROLES.BPP]: 'BPP',
  [ROLES.ADMIN]: 'Admin',
};

export const ROLE_COLORS = {
  [ROLES.PETANI]: '#16a34a',
  [ROLES.PENGURUS]: '#0ea5e9',
  [ROLES.BPP]: '#8b5cf6',
  [ROLES.ADMIN]: '#ef4444',
};

// Lahan status
export const LAHAN_STATUS = {
  PENDING: 'pending',
  TERVERIFIKASI: 'terverifikasi',
  DITOLAK: 'ditolak',
};

export const LAHAN_STATUS_LABELS = {
  [LAHAN_STATUS.PENDING]: 'Pending',
  [LAHAN_STATUS.TERVERIFIKASI]: 'Terverifikasi',
  [LAHAN_STATUS.DITOLAK]: 'Ditolak',
};

// Sewa status
export const SEWA_STATUS = {
  MENUNGGU: 'menunggu',
  AKTIF: 'aktif',
  SELESAI: 'selesai',
  DIBATALKAN: 'dibatalkan',
};

export const SEWA_STATUS_LABELS = {
  [SEWA_STATUS.MENUNGGU]: 'Menunggu',
  [SEWA_STATUS.AKTIF]: 'Aktif',
  [SEWA_STATUS.SELESAI]: 'Selesai',
  [SEWA_STATUS.DIBATALKAN]: 'Dibatalkan',
};

// Sewa validasi
export const SEWA_VALIDASI = {
  PENDING: 'pending',
  DISETUJUI: 'disetujui',
  DITOLAK: 'ditolak',
};

export const SEWA_VALIDASI_LABELS = {
  [SEWA_VALIDASI.PENDING]: 'Pending',
  [SEWA_VALIDASI.DISETUJUI]: 'Disetujui',
  [SEWA_VALIDASI.DITOLAK]: 'Ditolak',
};

// Tagihan/Pembayaran status
export const TAGIHAN_STATUS = {
  BELUM_BAYAR: 'belum_bayar',
  MENUNGGU_VERIFIKASI: 'menunggu_verifikasi',
  LUNAS: 'lunas',
};

export const TAGIHAN_STATUS_LABELS = {
  [TAGIHAN_STATUS.BELUM_BAYAR]: 'Belum Bayar',
  [TAGIHAN_STATUS.MENUNGGU_VERIFIKASI]: 'Menunggu Verifikasi',
  [TAGIHAN_STATUS.LUNAS]: 'Lunas',
};

// Berita status
export const BERITA_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
};

export const BERITA_STATUS_LABELS = {
  [BERITA_STATUS.DRAFT]: 'Draft',
  [BERITA_STATUS.PUBLISHED]: 'Published',
};

// Log levels
export const LOG_LEVELS = {
  INFO: 'info',
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error',
};

export const LOG_LEVEL_LABELS = {
  [LOG_LEVELS.INFO]: 'Info',
  [LOG_LEVELS.SUCCESS]: 'Sukses',
  [LOG_LEVELS.WARNING]: 'Peringatan',
  [LOG_LEVELS.ERROR]: 'Error',
};

// User status
export const USER_STATUS = {
  AKTIF: 'aktif',
  NONAKTIF: 'nonaktif',
};

// Peralatan kondisi
export const KONDISI_PERALATAN = {
  BAIK: 'baik',
  CUKUP: 'cukup',
  RUSAK: 'rusak',
};

// Pagination defaults
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PER_PAGE: 10,
  PER_PAGE_OPTIONS: [10, 25, 50],
};

// File upload limits
export const FILE_LIMITS = {
  MAX_SIZE_MB: 5,
  MAX_SIZE_BYTES: 5 * 1024 * 1024,
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/jpg'],
  ALLOWED_DOCUMENT_TYPES: ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'],
};

// Notification polling interval (ms)
export const NOTIFICATION_POLL_INTERVAL = 60000; // 60 seconds

// Search debounce delay (ms)
export const SEARCH_DEBOUNCE_MS = 300;

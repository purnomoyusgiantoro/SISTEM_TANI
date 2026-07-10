// ──────────────────────────────────────────
// RuangTani Formatters
// ──────────────────────────────────────────

/**
 * Format number as Indonesian Rupiah currency
 * @param {number} amount
 * @returns {string} e.g. "Rp 1.500.000"
 */
export function formatRupiah(amount) {
  if (amount == null || isNaN(amount)) return 'Rp 0';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format date to Indonesian locale
 * @param {string|Date} date
 * @param {object} options - Intl.DateTimeFormat options
 * @returns {string} e.g. "10 Juli 2026"
 */
export function formatTanggal(date, options = {}) {
  if (!date) return '-';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '-';
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    ...options,
  }).format(d);
}

/**
 * Format date with time
 * @param {string|Date} date
 * @returns {string} e.g. "10 Juli 2026, 14:30"
 */
export function formatTanggalWaktu(date) {
  if (!date) return '-';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '-';
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}

/**
 * Format date as relative time (e.g. "2 hari lalu")
 * @param {string|Date} date
 * @returns {string}
 */
export function formatRelatif(date) {
  if (!date) return '-';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '-';

  const now = new Date();
  const diffMs = now - d;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  const diffMonth = Math.floor(diffDay / 30);

  if (diffSec < 60) return 'Baru saja';
  if (diffMin < 60) return `${diffMin} menit lalu`;
  if (diffHour < 24) return `${diffHour} jam lalu`;
  if (diffDay < 30) return `${diffDay} hari lalu`;
  if (diffMonth < 12) return `${diffMonth} bulan lalu`;
  return formatTanggal(d);
}

/**
 * Format date as short date (DD/MM/YYYY)
 * @param {string|Date} date
 * @returns {string} e.g. "10/07/2026"
 */
export function formatTanggalPendek(date) {
  if (!date) return '-';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '-';
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(d);
}

/**
 * Format file size in human readable format
 * @param {number} bytes
 * @returns {string} e.g. "2.5 MB"
 */
export function formatFileSize(bytes) {
  if (!bytes || bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  let i = 0;
  let size = bytes;
  while (size >= 1024 && i < units.length - 1) {
    size /= 1024;
    i++;
  }
  return `${size.toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

/**
 * Format number with Indonesian locale (dots as thousands separator)
 * @param {number} num
 * @returns {string} e.g. "1.500.000"
 */
export function formatAngka(num) {
  if (num == null || isNaN(num)) return '0';
  return new Intl.NumberFormat('id-ID').format(num);
}

/**
 * Format hectares
 * @param {number} luas
 * @returns {string} e.g. "2,5 Ha"
 */
export function formatLuas(luas) {
  if (luas == null || isNaN(luas)) return '0 Ha';
  return `${new Intl.NumberFormat('id-ID', { maximumFractionDigits: 2 }).format(luas)} Ha`;
}

/**
 * Capitalize first letter of a string
 * @param {string} str
 * @returns {string}
 */
export function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Truncate text to a given length with ellipsis
 * @param {string} text
 * @param {number} maxLength
 * @returns {string}
 */
export function truncateText(text, maxLength = 100) {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + '...';
}

/**
 * Format phone number
 * @param {string} phone
 * @returns {string} e.g. "0812-3456-7890"
 */
export function formatTelepon(phone) {
  if (!phone) return '-';
  const clean = phone.replace(/\D/g, '');
  if (clean.length < 10) return phone;
  return clean.replace(/(\d{4})(\d{4})(\d+)/, '$1-$2-$3');
}

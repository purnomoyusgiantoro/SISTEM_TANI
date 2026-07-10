// ──────────────────────────────────────────
// RuangTani Validators
// ──────────────────────────────────────────

import { FILE_LIMITS } from './constants';

/**
 * Validate email format
 * @param {string} email
 * @returns {string|null} Error message or null
 */
export function validateEmail(email) {
  if (!email || !email.trim()) return 'Email wajib diisi';
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regex.test(email)) return 'Format email tidak valid';
  return null;
}

/**
 * Validate password
 * @param {string} password
 * @param {number} minLength
 * @returns {string|null}
 */
export function validatePassword(password, minLength = 6) {
  if (!password) return 'Password wajib diisi';
  if (password.length < minLength) return `Password minimal ${minLength} karakter`;
  return null;
}

/**
 * Validate required field
 * @param {*} value
 * @param {string} fieldName
 * @returns {string|null}
 */
export function validateRequired(value, fieldName = 'Field') {
  if (value == null || (typeof value === 'string' && !value.trim())) {
    return `${fieldName} wajib diisi`;
  }
  return null;
}

/**
 * Validate number (positive)
 * @param {*} value
 * @param {string} fieldName
 * @param {object} options - { min, max }
 * @returns {string|null}
 */
export function validateNumber(value, fieldName = 'Angka', options = {}) {
  if (value == null || value === '') return `${fieldName} wajib diisi`;
  const num = Number(value);
  if (isNaN(num)) return `${fieldName} harus berupa angka`;
  if (options.min != null && num < options.min) return `${fieldName} minimal ${options.min}`;
  if (options.max != null && num > options.max) return `${fieldName} maksimal ${options.max}`;
  return null;
}

/**
 * Validate file upload
 * @param {File} file
 * @param {object} options
 * @param {string[]} options.allowedTypes
 * @param {number} options.maxSizeBytes
 * @returns {string|null}
 */
export function validateFile(file, options = {}) {
  if (!file) return 'File wajib dipilih';

  const {
    allowedTypes = FILE_LIMITS.ALLOWED_DOCUMENT_TYPES,
    maxSizeBytes = FILE_LIMITS.MAX_SIZE_BYTES,
  } = options;

  if (!allowedTypes.includes(file.type)) {
    const extensions = allowedTypes.map((t) => {
      const ext = t.split('/')[1];
      return `.${ext}`;
    });
    return `Format file harus ${extensions.join(', ')}`;
  }

  if (file.size > maxSizeBytes) {
    const maxMB = maxSizeBytes / (1024 * 1024);
    return `Ukuran file maksimal ${maxMB} MB`;
  }

  return null;
}

/**
 * Validate date (must be valid date string)
 * @param {string} dateStr
 * @param {string} fieldName
 * @returns {string|null}
 */
export function validateDate(dateStr, fieldName = 'Tanggal') {
  if (!dateStr) return `${fieldName} wajib diisi`;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return `${fieldName} tidak valid`;
  return null;
}

/**
 * Validate date range (start < end)
 * @param {string} startDate
 * @param {string} endDate
 * @returns {string|null}
 */
export function validateDateRange(startDate, endDate) {
  if (!startDate || !endDate) return null;
  const start = new Date(startDate);
  const end = new Date(endDate);
  if (start >= end) return 'Tanggal mulai harus sebelum tanggal selesai';
  return null;
}

/**
 * Validate a form object with rules
 * @param {object} data - Form data
 * @param {object} rules - { fieldName: validatorFn }
 * @returns {{ isValid: boolean, errors: object }}
 *
 * @example
 * const { isValid, errors } = validateForm(
 *   { email: '', password: '123' },
 *   {
 *     email: (v) => validateEmail(v),
 *     password: (v) => validatePassword(v),
 *   }
 * );
 */
export function validateForm(data, rules) {
  const errors = {};
  let isValid = true;

  for (const [field, validator] of Object.entries(rules)) {
    const error = validator(data[field]);
    if (error) {
      errors[field] = error;
      isValid = false;
    }
  }

  return { isValid, errors };
}

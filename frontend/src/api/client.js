// ──────────────────────────────────────────
// RuangTani API Client
// ──────────────────────────────────────────
// Central fetch wrapper with auth token injection,
// error handling, and response envelope unwrapping.

import { API_BASE_URL, STORAGE_KEYS } from '../utils/constants';

/**
 * Get stored auth token
 */
function getToken() {
  return localStorage.getItem(STORAGE_KEYS.TOKEN);
}

/**
 * Build headers for a request
 */
function buildHeaders(isFormData = false) {
  const headers = {
    Accept: 'application/json',
  };

  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }

  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
}

/**
 * Custom API error class
 */
export class ApiError extends Error {
  constructor(status, message, errors = null, data = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errors = errors; // validation errors (422)
    this.data = data;
  }
}

/**
 * Handle API response and unwrap envelope
 * Expected envelope: { status: 'success'|'error', data: ..., meta: ..., message: ... }
 */
async function handleResponse(response) {
  // Handle 204 No Content
  if (response.status === 204) {
    return { data: null, meta: null };
  }

  let body;
  try {
    body = await response.json();
  } catch {
    if (!response.ok) {
      throw new ApiError(response.status, `Server error (${response.status})`);
    }
    return { data: null, meta: null };
  }

  if (!response.ok) {
    // 401 Unauthorized → trigger logout
    if (response.status === 401) {
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
      // Dispatch custom event for AuthContext to catch
      window.dispatchEvent(new CustomEvent('auth:unauthorized'));
      throw new ApiError(401, body.message || 'Sesi Anda telah berakhir. Silakan login kembali.');
    }

    // 403 Forbidden
    if (response.status === 403) {
      throw new ApiError(403, body.message || 'Anda tidak memiliki akses untuk melakukan aksi ini.');
    }

    // 422 Validation
    if (response.status === 422) {
      throw new ApiError(422, body.message || 'Data tidak valid', body.errors);
    }

    // 404 Not Found
    if (response.status === 404) {
      throw new ApiError(404, body.message || 'Data tidak ditemukan');
    }

    // Other errors
    throw new ApiError(
      response.status,
      body.message || `Terjadi kesalahan server (${response.status})`,
      body.errors,
      body
    );
  }

  // Unwrap the envelope
  return {
    data: body.data ?? body,
    meta: body.meta ?? null,
    message: body.message ?? null,
  };
}

/**
 * Core request function
 */
async function request(method, endpoint, options = {}) {
  const { body, params, isFormData = false } = options;

  // Build URL with query params
  let url = `${API_BASE_URL}${endpoint}`;
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value != null && value !== '') {
        searchParams.append(key, value);
      }
    });
    const qs = searchParams.toString();
    if (qs) url += `?${qs}`;
  }

  const fetchOptions = {
    method,
    headers: buildHeaders(isFormData),
  };

  if (body) {
    fetchOptions.body = isFormData ? body : JSON.stringify(body);
  }

  // Log in development
  if (import.meta.env.DEV) {
    console.log(`[API] ${method} ${url}`, body || '');
  }

  try {
    const response = await fetch(url, fetchOptions);
    const result = await handleResponse(response);

    if (import.meta.env.DEV) {
      console.log(`[API] Response:`, result);
    }

    return result;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    // Network error
    throw new ApiError(0, 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.');
  }
}

// ── Public API Methods ──

export const api = {
  get: (endpoint, params) => request('GET', endpoint, { params }),
  post: (endpoint, body) => request('POST', endpoint, { body }),
  put: (endpoint, body) => request('PUT', endpoint, { body }),
  delete: (endpoint) => request('DELETE', endpoint),

  /**
   * POST with FormData (for file uploads)
   * @param {string} endpoint
   * @param {FormData} formData
   */
  upload: (endpoint, formData) =>
    request('POST', endpoint, { body: formData, isFormData: true }),

  /**
   * PUT with FormData (for file uploads on update)
   * Some Laravel PUT with files needs POST + _method=PUT
   * @param {string} endpoint
   * @param {FormData} formData
   */
  uploadPut: (endpoint, formData) => {
    formData.append('_method', 'PUT');
    return request('POST', endpoint, { body: formData, isFormData: true });
  },
};

export default api;

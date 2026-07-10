// ──────────────────────────────────────────
// Backup API (Admin)
// ──────────────────────────────────────────

import api from './client';

export const backupApi = {
  /**
   * Get list of backups
   */
  getAll: () =>
    api.get('/backups'),

  /**
   * Create a new backup
   */
  create: () =>
    api.post('/backups'),

  /**
   * Restore from a backup
   * @param {number} id
   */
  restore: (id) =>
    api.post(`/backups/${id}/restore`),

  /**
   * Delete a backup
   * @param {number} id
   */
  delete: (id) =>
    api.delete(`/backups/${id}`),

  /**
   * Get backup schedule
   */
  getSchedule: () =>
    api.get('/backups/schedule'),

  /**
   * Update backup schedule
   * @param {object} data - { enabled, frequency, time }
   */
  updateSchedule: (data) =>
    api.put('/backups/schedule', data),
};

export default backupApi;

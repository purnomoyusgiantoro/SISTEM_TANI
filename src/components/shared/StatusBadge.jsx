import React from 'react';

const statusColors = {
  aktif: { bg: '#ecfdf5', color: '#059669', border: '#a7f3d0' },
  selesai: { bg: '#ecfdf5', color: '#059669', border: '#a7f3d0' },
  lunas: { bg: '#ecfdf5', color: '#059669', border: '#a7f3d0' },
  published: { bg: '#ecfdf5', color: '#059669', border: '#a7f3d0' },
  terverifikasi: { bg: '#ecfdf5', color: '#059669', border: '#a7f3d0' },
  disetujui: { bg: '#ecfdf5', color: '#059669', border: '#a7f3d0' },
  pending: { bg: '#fffbeb', color: '#d97706', border: '#fde68a' },
  menunggu: { bg: '#fffbeb', color: '#d97706', border: '#fde68a' },
  menunggu_verifikasi: { bg: '#fffbeb', color: '#d97706', border: '#fde68a' },
  draft: { bg: '#f0f4f8', color: '#4a5568', border: '#e2e8f0' },
  ditolak: { bg: '#fef2f2', color: '#dc2626', border: '#fecaca' },
  belum_bayar: { bg: '#fef2f2', color: '#dc2626', border: '#fecaca' },
  nonaktif: { bg: '#f0f4f8', color: '#a0aec0', border: '#e2e8f0' },
  error: { bg: '#fef2f2', color: '#dc2626', border: '#fecaca' },
  info: { bg: '#eff6ff', color: '#2563eb', border: '#bfdbfe' },
  success: { bg: '#ecfdf5', color: '#059669', border: '#a7f3d0' },
  warning: { bg: '#fffbeb', color: '#d97706', border: '#fde68a' },
};

const statusLabels = {
  aktif: 'Aktif',
  selesai: 'Selesai',
  lunas: 'Lunas',
  published: 'Dipublikasi',
  terverifikasi: 'Terverifikasi',
  disetujui: 'Disetujui',
  pending: 'Pending',
  menunggu: 'Menunggu',
  menunggu_verifikasi: 'Menunggu Verifikasi',
  draft: 'Draft',
  ditolak: 'Ditolak',
  belum_bayar: 'Belum Bayar',
  nonaktif: 'Nonaktif',
  error: 'Error',
  info: 'Info',
  success: 'Sukses',
  warning: 'Peringatan',
};

export default function StatusBadge({ status, label, size = 'default' }) {
  const colors = statusColors[status] || statusColors.info;
  const displayLabel = label || statusLabels[status] || status;

  const fontSize = size === 'small' ? '11px' : '12px';
  const padding = size === 'small' ? '2px 8px' : '4px 12px';

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        fontSize,
        fontWeight: 600,
        padding,
        borderRadius: '20px',
        backgroundColor: colors.bg,
        color: colors.color,
        border: `1px solid ${colors.border}`,
        whiteSpace: 'nowrap',
        lineHeight: 1.4,
      }}
    >
      <span style={{
        width: '6px',
        height: '6px',
        borderRadius: '50%',
        backgroundColor: colors.color,
        flexShrink: 0,
      }} />
      {displayLabel}
    </span>
  );
}

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import lahanApi from '../api/lahan';
import masterApi from '../api/master';
import { useApi, useMutation } from '../hooks/useApi';
import { formatTanggal } from '../utils/formatters';
import StatusBadge from '../components/shared/StatusBadge';
import Modal from '../components/shared/Modal';
import {
  Plus,
  Download,
  Search,
  RotateCcw,
  Eye,
  Pencil,
  MapPin,
  Ruler,
  Leaf,
  User,
  Calendar,
  FileText,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  Home,
  ChevronDown,
} from 'lucide-react';

const PAGE_SIZE = 5;

const statusVerifikasiOptions = [
  { value: '', label: 'Semua Status' },
  { value: 'terverifikasi', label: 'Terverifikasi' },
  { value: 'pending', label: 'Pending' },
  { value: 'ditolak', label: 'Ditolak' },
];

function getStatusVariant(status) {
  switch (status) {
    case 'terverifikasi': return 'success';
    case 'pending': return 'warning';
    case 'ditolak': return 'danger';
    default: return 'neutral';
  }
}

function getStatusLabel(status) {
  switch (status) {
    case 'terverifikasi': return 'Terverifikasi';
    case 'pending': return 'Pending';
    case 'ditolak': return 'Ditolak';
    default: return status;
  }
}

const emptyForm = {
  pemilik: '',
  lokasi: '',
  luas: '',
  jenisLahan: '',
  koordinat: '',
  catatan: '',
};

export default function DataLahan() {
  const { currentUser, hasPermission } = useAuth();
  const toast = useToast();

  // API data
  const { data: lahanData, loading: lahanLoading, execute: fetchLahan } = useApi(lahanApi.getAll);
  const { data: wilayahData, execute: fetchWilayah } = useApi(masterApi.getWilayah);
  const { data: jenisLahanData, execute: fetchJenisLahan } = useApi(masterApi.getJenisLahan);
  const { mutate: createLahan, loading: creating } = useMutation(lahanApi.create);
  const { mutate: updateLahan, loading: updating } = useMutation(lahanApi.update);
  const { mutate: deleteLahan } = useMutation(lahanApi.delete);

  // Filters
  const [filterWilayah, setFilterWilayah] = useState('');
  const [filterJenis, setFilterJenis] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Modals
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [editingLahan, setEditingLahan] = useState(null);
  const [detailLahan, setDetailLahan] = useState(null);
  const [formData, setFormData] = useState({ ...emptyForm });

  // Fetch data on mount
  useEffect(() => {
    fetchLahan();
    fetchWilayah();
    fetchJenisLahan();
  }, [fetchLahan, fetchWilayah, fetchJenisLahan]);

  // Master data options
  const daftarWilayah = wilayahData || [];
  const jenisLahanOptions = jenisLahanData || [];

  // Data array
  const dataLahan = Array.isArray(lahanData) ? lahanData : [];

  // Role-based data
  const baseData = useMemo(() => {
    if (currentUser?.role === 'petani') {
      return dataLahan.filter((l) => l.pemilikId === currentUser.id || l.pemilik_id === currentUser.id);
    }
    return dataLahan;
  }, [currentUser, dataLahan]);

  // Filtered data
  const filteredData = useMemo(() => {
    let result = [...baseData];

    if (filterWilayah) {
      result = result.filter((l) => l.lokasi.includes(filterWilayah));
    }
    if (filterJenis) {
      result = result.filter((l) => l.jenisLahan === filterJenis);
    }
    if (filterStatus) {
      result = result.filter((l) => l.statusVerifikasi === filterStatus);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((l) => l.pemilik.toLowerCase().includes(q));
    }

    return result;
  }, [baseData, filterWilayah, filterJenis, filterStatus, searchQuery]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredData.length / PAGE_SIZE));
  const paginatedData = filteredData.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const resetFilters = () => {
    setFilterWilayah('');
    setFilterJenis('');
    setFilterStatus('');
    setSearchQuery('');
    setCurrentPage(1);
  };

  // Form handlers
  const openAddModal = () => {
    setEditingLahan(null);
    setFormData({ ...emptyForm });
    setShowFormModal(true);
  };

  const openEditModal = (lahan) => {
    setEditingLahan(lahan);
    setFormData({
      pemilik: lahan.pemilik,
      lokasi: lahan.lokasi,
      luas: lahan.luas,
      jenisLahan: lahan.jenisLahan,
      koordinat: lahan.koordinat,
      catatan: lahan.catatan || '',
    });
    setShowFormModal(true);
  };

  const openDetailModal = (lahan) => {
    setDetailLahan(lahan);
    setShowDetailModal(true);
  };

  const handleFormChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Mock save — in a real app this would call an API
    alert(editingLahan ? 'Data lahan berhasil diperbarui!' : 'Lahan baru berhasil ditambahkan!');
    setShowFormModal(false);
  };

  const canAdd = hasPermission('add_lahan');
  const canEdit = hasPermission('edit_lahan') || hasPermission('edit_own_lahan');

  const verificationHistory = [
    { tanggal: '2026-01-16', aksi: 'Pengajuan diterima oleh sistem', user: 'Sistem' },
    { tanggal: '2026-01-18', aksi: 'Dijadwalkan untuk verifikasi lapangan', user: 'Ahmad Hidayat' },
    { tanggal: '2026-01-22', aksi: 'Verifikasi lapangan selesai', user: 'Ir. Hendra Wijaya' },
    { tanggal: '2026-01-23', aksi: 'Lahan diverifikasi dan disetujui', user: 'Ir. Hendra Wijaya' },
  ];

  return (
    <>
      <style>{lahanStyles}</style>
      <div className="lahan-page">
        <div className="admin-card">
          
          {/* Header Row Inside Card */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid #dee2e6' }}>
            <div>
              <h1 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#333', margin: 0 }}>Data Lahan Pertanian</h1>
            </div>
            <nav className="lahan-breadcrumb" style={{ marginBottom: 0, fontSize: '0.85rem' }}>
              <Home size={14} style={{ color: 'var(--color-primary)' }} />
              <span style={{ margin: '0 8px' }}>/</span>
              <span className="lahan-breadcrumb-active" style={{ color: 'var(--color-primary)' }}>datalahan</span>
            </nav>
          </div>

          <div style={{ padding: '20px' }}>
            {/* Horizontal Filter Bar */}
            <div className="filter-row">
              <div style={{ fontWeight: '700', fontSize: '0.9rem', color: '#333' }}>Filter</div>
              
              <div className="lahan-select-wrapper" style={{ width: '200px' }}>
                <select
                  className="filter-select"
                  value={filterWilayah}
                  onChange={(e) => { setFilterWilayah(e.target.value); setCurrentPage(1); }}
                  style={{ width: '100%' }}
                >
                  <option value="">Pilih Wilayah...</option>
                  {daftarWilayah.map((w) => (
                    <option key={w} value={w}>{w}</option>
                  ))}
                </select>
              </div>

              <div className="lahan-search-wrapper" style={{ flex: 1, position: 'relative' }}>
                <input
                  type="text"
                  className="filter-input"
                  placeholder="Keyword search"
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                  style={{ width: '100%' }}
                />
              </div>

              <button 
                className="filter-btn" 
                onClick={resetFilters}
              >
                <Search size={16} />
              </button>

              {canAdd && (
                <button 
                  onClick={openAddModal}
                  className="filter-btn filter-btn-primary"
                >
                  <Plus size={16} />
                  Tambah Data Lahan
                </button>
              )}
            </div>

        {/* Export removed per reference image */}

        {/* Table */}
        <div className="lahan-table-wrapper" style={{ overflowX: 'auto', border: 'none', boxShadow: 'none' }}>
          <table className="lahan-table" style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #dee2e6', tableLayout: 'fixed' }}>
            <thead>
              <tr style={{ background: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
                <th style={{ width: 50, padding: '12px', fontWeight: 'bold', color: '#333' }}>No</th>
                <th style={{ padding: '12px', fontWeight: 'bold', color: '#333' }}>Pemilik</th>
                <th style={{ padding: '12px', fontWeight: 'bold', color: '#333' }}>Lokasi</th>
                <th style={{ width: 90, padding: '12px', fontWeight: 'bold', color: '#333' }}>Luas (Ha)</th>
                <th style={{ width: 120, padding: '12px', fontWeight: 'bold', color: '#333' }}>Jenis Lahan</th>
                <th style={{ width: 160, padding: '12px', fontWeight: 'bold', color: '#333' }}>Verifikasi:Status</th>
                <th style={{ width: 120, padding: '12px', fontWeight: 'bold', color: '#333' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={7} className="lahan-empty-row">
                    <div className="lahan-empty">
                      <Leaf size={40} strokeWidth={1.2} />
                      <p>Tidak ada data lahan ditemukan</p>
                      <span>Coba ubah filter pencarian Anda</span>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedData.map((lahan, idx) => (
                  <tr key={lahan.id}>
                    <td className="lahan-td-center">
                      {(currentPage - 1) * PAGE_SIZE + idx + 1}
                    </td>
                    <td>
                      <div className="lahan-cell-pemilik">
                        <span>{lahan.pemilik?.nama || lahan.pemilik || '-'}</span>
                      </div>
                    </td>
                    <td>
                      <div className="lahan-cell-lokasi">
                        <MapPin size={13} />
                        <span>{lahan.lokasi}</span>
                      </div>
                    </td>
                    <td className="lahan-td-center">
                      <strong>{lahan.luas}</strong>
                    </td>
                    <td>
                      <span className="lahan-jenis-badge">{lahan.jenis_lahan || lahan.jenisLahan}</span>
                    </td>
                    <td>
                      <StatusBadge status={lahan.status_verifikasi || lahan.statusVerifikasi} />
                    </td>
                    <td>
                      <div className="lahan-actions">
                        <button
                          className="lahan-action-btn lahan-action-view"
                          title="Lihat Detail"
                          onClick={() => openDetailModal(lahan)}
                        >
                          <Eye size={15} />
                        </button>
                        {canEdit && (
                          <button
                            className="lahan-action-btn lahan-action-edit"
                            title="Edit"
                            onClick={() => openEditModal(lahan)}
                          >
                            <Pencil size={15} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Summary and Pagination */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
          <div className="lahan-summary-bar" style={{ margin: 0 }}>
            <span>
              Menampilkan <strong>{paginatedData.length}</strong> dari{' '}
              <strong>{filteredData.length}</strong> data lahan
            </span>
          </div>

          {totalPages > 1 && (
            <div className="lahan-pagination" style={{ margin: 0 }}>
              <button
                className="lahan-page-btn"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
              >
                <ChevronLeft size={16} />
              </button>
              <div className="lahan-page-numbers">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    className={`lahan-page-num ${page === currentPage ? 'active' : ''}`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <button
                className="lahan-page-btn"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
        </div> {/* End of inner padding container */}
        </div> {/* End of admin-card */}

        {/* ===== FORM MODAL (Add/Edit) ===== */}
        <Modal
          isOpen={showFormModal}
          onClose={() => setShowFormModal(false)}
          title={editingLahan ? 'Edit Data Lahan' : 'Tambah Lahan Baru'}
          footer={
            <>
              <button
                className="lahan-btn lahan-btn-cancel"
                onClick={() => setShowFormModal(false)}
              >
                Batal
              </button>
              <button className="lahan-btn lahan-btn-green" onClick={handleFormSubmit}>
                {editingLahan ? 'Simpan Perubahan' : 'Tambah Lahan'}
              </button>
            </>
          }
        >
          <form className="lahan-form" onSubmit={handleFormSubmit}>
            <div className="lahan-form-group">
              <label className="lahan-form-label">
                <User size={14} />
                Pemilik
              </label>
              <input
                type="text"
                className="lahan-form-input"
                placeholder="Nama pemilik lahan"
                value={formData.pemilik}
                onChange={(e) => handleFormChange('pemilik', e.target.value)}
                required
              />
            </div>

            <div className="lahan-form-group">
              <label className="lahan-form-label">
                <MapPin size={14} />
                Lokasi
              </label>
              <input
                type="text"
                className="lahan-form-input"
                placeholder="Desa/Kecamatan lokasi lahan"
                value={formData.lokasi}
                onChange={(e) => handleFormChange('lokasi', e.target.value)}
                required
              />
            </div>

            <div className="lahan-form-row">
              <div className="lahan-form-group">
                <label className="lahan-form-label">
                  <Ruler size={14} />
                  Luas (Ha)
                </label>
                <input
                  type="number"
                  className="lahan-form-input"
                  placeholder="0.0"
                  step="0.1"
                  min="0"
                  value={formData.luas}
                  onChange={(e) => handleFormChange('luas', e.target.value)}
                  required
                />
              </div>

              <div className="lahan-form-group">
                <label className="lahan-form-label">
                  <Leaf size={14} />
                  Jenis Lahan
                </label>
                <div className="lahan-select-wrapper">
                  <select
                    className="lahan-select"
                    value={formData.jenisLahan}
                    onChange={(e) => handleFormChange('jenisLahan', e.target.value)}
                    required
                  >
                    <option value="">Pilih Jenis</option>
                    {jenisLahanOptions.map((j) => (
                      <option key={j} value={j}>{j}</option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="lahan-select-icon" />
                </div>
              </div>
            </div>

            <div className="lahan-form-group">
              <label className="lahan-form-label">
                <MapPin size={14} />
                Koordinat
              </label>
              <input
                type="text"
                className="lahan-form-input"
                placeholder="Contoh: -6.7320, 107.1429"
                value={formData.koordinat}
                onChange={(e) => handleFormChange('koordinat', e.target.value)}
              />
            </div>

            <div className="lahan-form-group">
              <label className="lahan-form-label">
                <FileText size={14} />
                Catatan
              </label>
              <textarea
                className="lahan-form-textarea"
                placeholder="Catatan tambahan tentang lahan..."
                rows={3}
                value={formData.catatan}
                onChange={(e) => handleFormChange('catatan', e.target.value)}
              />
            </div>
          </form>
        </Modal>

        {/* ===== DETAIL MODAL ===== */}
        <Modal
          isOpen={showDetailModal}
          onClose={() => setShowDetailModal(false)}
          title="Detail Lahan"
          size="lg"
        >
          {detailLahan && (
            <div className="lahan-detail">
              {/* Detail Card */}
              <div className="lahan-detail-card">
                <div className="lahan-detail-header">
                  <div className="lahan-detail-header-info">
                    <h3 className="lahan-detail-name">{detailLahan.pemilik?.nama || detailLahan.pemilik || '-'}</h3>
                    <p className="lahan-detail-loc">
                      <MapPin size={13} />
                      {detailLahan.lokasi}
                    </p>
                  </div>
                  <StatusBadge status={detailLahan.status_verifikasi || detailLahan.statusVerifikasi} />
                </div>

                <div className="lahan-detail-grid">
                  <div className="lahan-detail-item">
                    <span className="lahan-detail-item-label">
                      <Ruler size={14} />
                      Luas
                    </span>
                    <span className="lahan-detail-item-value">{detailLahan.luas} Ha</span>
                  </div>
                  <div className="lahan-detail-item">
                    <span className="lahan-detail-item-label">
                      <Leaf size={14} />
                      Jenis Lahan
                    </span>
                    <span className="lahan-detail-item-value">{detailLahan.jenis_lahan || detailLahan.jenisLahan}</span>
                  </div>
                  <div className="lahan-detail-item">
                    <span className="lahan-detail-item-label">
                      <MapPin size={14} />
                      Koordinat
                    </span>
                    <span className="lahan-detail-item-value">{detailLahan.koordinat}</span>
                  </div>
                  <div className="lahan-detail-item">
                    <span className="lahan-detail-item-label">
                      <Calendar size={14} />
                      Tanggal Daftar
                    </span>
                    <span className="lahan-detail-item-value">{formatTanggal(detailLahan.tanggal_daftar || detailLahan.tanggalDaftar)}</span>
                  </div>
                </div>

                {detailLahan.catatan && (
                  <div className="lahan-detail-notes">
                    <span className="lahan-detail-notes-label">
                      <FileText size={14} />
                      Catatan
                    </span>
                    <p>{detailLahan.catatan}</p>
                  </div>
                )}
              </div>

              {/* Map Placeholder */}
              <div className="lahan-detail-map">
                <div className="lahan-map-placeholder">
                  <MapPin size={32} strokeWidth={1.2} />
                  <p>Peta Lokasi Lahan</p>
                  <span>Koordinat: {detailLahan.koordinat}</span>
                </div>
              </div>

              {/* Verification History */}
              {(detailLahan.status_verifikasi === 'terverifikasi' || detailLahan.statusVerifikasi === 'terverifikasi') && (
                <div className="lahan-detail-history">
                  <h4 className="lahan-detail-section-title">
                    <Clock size={16} />
                    Riwayat Verifikasi
                  </h4>
                  <div className="lahan-timeline">
                    {verificationHistory.map((item, idx) => (
                      <div className="lahan-timeline-item" key={idx}>
                        <div className="lahan-timeline-dot">
                          {idx === verificationHistory.length - 1 ? (
                            <CheckCircle2 size={16} />
                          ) : (
                            <div className="lahan-timeline-circle" />
                          )}
                        </div>
                        <div className="lahan-timeline-content">
                          <p className="lahan-timeline-action">{item.aksi}</p>
                          <span className="lahan-timeline-meta">
                            {formatTanggal(item.tanggal)} — {item.user}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {detailLahan.statusVerifikasi === 'ditolak' && (
                <div className="lahan-detail-rejected">
                  <XCircle size={18} />
                  <div>
                    <strong>Verifikasi Ditolak</strong>
                    <p>Alasan: {detailLahan.catatan}</p>
                    <span>Oleh: {detailLahan.verifikator}</span>
                  </div>
                </div>
              )}

              {detailLahan.statusVerifikasi === 'pending' && (
                <div className="lahan-detail-pending">
                  <Clock size={18} />
                  <div>
                    <strong>Menunggu Verifikasi</strong>
                    <p>Data lahan sedang menunggu proses verifikasi lapangan oleh petugas BPP.</p>
                  </div>
                </div>
              )}

              {detailLahan.verifikator && (
                <div className="lahan-detail-verifikator">
                  <User size={14} />
                  <span>Diverifikasi oleh: <strong>{detailLahan.verifikator}</strong></span>
                </div>
              )}
            </div>
          )}
        </Modal>
      </div>
    </>
  );
}

/* ============================
   STYLES — lahan- prefix
   ============================ */
const lahanStyles = `
  .lahan-page {
    padding: 0;
  }

  /* Breadcrumb */
  .lahan-breadcrumb {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    color: #64748b;
    margin-bottom: 20px;
  }
  .lahan-breadcrumb svg {
    flex-shrink: 0;
  }
  .lahan-breadcrumb-active {
    color: #1a365d;
    font-weight: 600;
  }

  /* Header */
  .lahan-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 24px;
    gap: 16px;
    flex-wrap: wrap;
  }
  .lahan-title {
    font-size: 24px;
    font-weight: 800;
    color: #1a202c;
    margin: 0 0 4px 0;
  }
  .lahan-subtitle {
    font-size: 14px;
    color: #64748b;
    margin: 0;
  }
  .lahan-header-actions {
    display: flex;
    gap: 10px;
    align-items: center;
  }

  /* Buttons */
  .lahan-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 9px 16px;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    border: none;
    transition: all 0.2s ease;
    font-family: inherit;
    white-space: nowrap;
  }
  .lahan-btn-green {
    background: #059669;
    color: #ffffff;
  }
  .lahan-btn-green:hover {
    background: #047857;
    box-shadow: 0 4px 12px rgba(5, 150, 105, 0.3);
  }
  .lahan-btn-outline {
    background: #ffffff;
    color: #475569;
    border: 1px solid #e2e8f0;
  }
  .lahan-btn-outline:hover {
    background: #f8fafc;
    border-color: #cbd5e1;
  }
  .lahan-btn-cancel {
    background: #f1f5f9;
    color: #475569;
  }
  .lahan-btn-cancel:hover {
    background: #e2e8f0;
  }
  .lahan-btn-reset {
    background: #ffffff;
    color: #64748b;
    border: 1px solid #e2e8f0;
    padding: 9px 14px;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-family: inherit;
    transition: all 0.15s;
    white-space: nowrap;
  }
  .lahan-btn-reset:hover {
    background: #f8fafc;
    border-color: #cbd5e1;
  }

  /* Filters */
  .lahan-filters {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 16px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.04);
  }
  .lahan-filter-row {
    display: flex;
    gap: 14px;
    align-items: flex-end;
    flex-wrap: wrap;
  }
  .lahan-filter-item {
    flex: 1;
    min-width: 160px;
  }
  .lahan-filter-search {
    flex: 1.4;
  }
  .lahan-filter-action {
    flex: 0 0 auto;
  }
  .lahan-filter-label {
    display: block;
    font-size: 12px;
    font-weight: 600;
    color: #475569;
    margin-bottom: 6px;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }
  .lahan-select-wrapper {
    position: relative;
  }
  .lahan-select {
    width: 100%;
    padding: 9px 32px 9px 12px;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    font-size: 13px;
    color: #1a202c;
    background: #ffffff;
    appearance: none;
    cursor: pointer;
    font-family: inherit;
    transition: border-color 0.15s;
  }
  .lahan-select:focus {
    outline: none;
    border-color: #2d4a7a;
    box-shadow: 0 0 0 3px rgba(45, 74, 122, 0.1);
  }
  .lahan-select-icon {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
    color: #94a3b8;
  }
  .lahan-search-wrapper {
    position: relative;
  }
  .lahan-search-icon {
    position: absolute;
    left: 10px;
    top: 50%;
    transform: translateY(-50%);
    color: #94a3b8;
  }
  .lahan-search-input {
    width: 100%;
    padding: 9px 12px 9px 30px;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    font-size: 13px;
    color: #1a202c;
    background: #ffffff;
    font-family: inherit;
    transition: border-color 0.15s;
    box-sizing: border-box;
  }
  .lahan-search-input:focus {
    outline: none;
    border-color: #2d4a7a;
    box-shadow: 0 0 0 3px rgba(45, 74, 122, 0.1);
  }

  /* Summary bar */
  .lahan-summary-bar {
    font-size: 13px;
    color: #64748b;
    margin-bottom: 8px;
  }
  .lahan-summary-bar strong {
    color: #1a202c;
  }

  /* Table */
  .lahan-table-wrapper {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 1px 3px rgba(0,0,0,0.04);
  }
  .lahan-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;
  }
  .lahan-table thead th {
    background: #f8fafc;
    padding: 12px 16px;
    text-align: left;
    font-size: 12px;
    font-weight: 700;
    color: #475569;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    border-bottom: 1px solid #e2e8f0;
    white-space: nowrap;
  }
  .lahan-table tbody tr {
    border-bottom: 1px solid #f1f5f9;
    transition: background 0.1s;
  }
  .lahan-table tbody tr:last-child {
    border-bottom: none;
  }
  .lahan-table tbody tr:hover {
    background: #f8fafc;
  }
  .lahan-table tbody td {
    padding: 14px 16px;
    vertical-align: middle;
    color: #1a202c;
  }
  .lahan-td-center {
    text-align: center;
  }

  /* Cell styles */
  .lahan-cell-pemilik {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .lahan-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: linear-gradient(135deg, #2d4a7a, #1a365d);
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    font-weight: 700;
    flex-shrink: 0;
  }
  .lahan-cell-lokasi {
    display: flex;
    align-items: center;
    gap: 5px;
    color: #475569;
  }
  .lahan-cell-lokasi svg {
    color: #94a3b8;
    flex-shrink: 0;
  }
  .lahan-jenis-badge {
    display: inline-block;
    padding: 3px 10px;
    min-width: 100px;
    text-align: center;
    border-radius: 6px;
    background: #f0f4f8;
    color: #475569;
    font-size: 12px;
    font-weight: 500;
    white-space: nowrap;
  }

  /* Action buttons */
  .lahan-actions {
    display: flex;
    gap: 6px;
  }
  .lahan-action-btn {
    width: 32px;
    height: 32px;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    background: #ffffff;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.15s;
  }
  .lahan-action-view {
    color: #2d4a7a;
  }
  .lahan-action-view:hover {
    background: #e0e7ff;
    border-color: #93c5fd;
  }
  .lahan-action-edit {
    color: #d97706;
  }
  .lahan-action-edit:hover {
    background: #fef3c7;
    border-color: #fcd34d;
  }

  /* Empty state */
  .lahan-empty-row td {
    padding: 40px 16px !important;
  }
  .lahan-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    color: #94a3b8;
  }
  .lahan-empty p {
    margin: 0;
    font-size: 15px;
    font-weight: 600;
    color: #64748b;
  }
  .lahan-empty span {
    font-size: 13px;
  }

  /* Pagination */
  .lahan-pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    margin-top: 20px;
    flex-wrap: wrap;
  }
  .lahan-page-btn {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 8px 14px;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    background: #ffffff;
    color: #475569;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.15s;
    font-family: inherit;
  }
  .lahan-page-btn:hover:not(:disabled) {
    background: #f8fafc;
    border-color: #cbd5e1;
  }
  .lahan-page-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
  .lahan-page-numbers {
    display: flex;
    gap: 4px;
  }
  .lahan-page-num {
    width: 36px;
    height: 36px;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    background: #ffffff;
    color: #475569;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.15s;
    font-family: inherit;
  }
  .lahan-page-num:hover {
    background: #f8fafc;
    border-color: #cbd5e1;
  }
  .lahan-page-num.active {
    background: #1a365d;
    color: #ffffff;
    border-color: #1a365d;
  }

  /* Form */
  .lahan-form {
    display: flex;
    flex-direction: column;
    gap: 18px;
  }
  .lahan-form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
  }
  .lahan-form-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .lahan-form-label {
    font-size: 13px;
    font-weight: 600;
    color: #374151;
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .lahan-form-label svg {
    color: #94a3b8;
  }
  .lahan-form-input {
    padding: 10px 12px;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    font-size: 14px;
    color: #1a202c;
    background: #ffffff;
    font-family: inherit;
    transition: border-color 0.15s;
  }
  .lahan-form-input:focus {
    outline: none;
    border-color: #2d4a7a;
    box-shadow: 0 0 0 3px rgba(45, 74, 122, 0.1);
  }
  .lahan-form-textarea {
    padding: 10px 12px;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    font-size: 14px;
    color: #1a202c;
    background: #ffffff;
    font-family: inherit;
    resize: vertical;
    transition: border-color 0.15s;
  }
  .lahan-form-textarea:focus {
    outline: none;
    border-color: #2d4a7a;
    box-shadow: 0 0 0 3px rgba(45, 74, 122, 0.1);
  }

  /* Detail Modal */
  .lahan-detail {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  .lahan-detail-card {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    padding: 20px;
  }
  .lahan-detail-header {
    display: flex;
    align-items: center;
    gap: 14px;
    margin-bottom: 20px;
    flex-wrap: wrap;
  }
  .lahan-detail-avatar {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: linear-gradient(135deg, #2d4a7a, #1a365d);
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    font-weight: 700;
    flex-shrink: 0;
  }
  .lahan-detail-name {
    margin: 0;
    font-size: 16px;
    color: #1a202c;
  }
  .lahan-detail-loc {
    margin: 2px 0 0 0;
    font-size: 13px;
    color: #64748b;
    display: flex;
    align-items: center;
    gap: 4px;
  }
  .lahan-detail-header > span {
    margin-left: auto;
  }
  .lahan-detail-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }
  .lahan-detail-item {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .lahan-detail-item-label {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 12px;
    font-weight: 600;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.03em;
  }
  .lahan-detail-item-label svg {
    color: #94a3b8;
  }
  .lahan-detail-item-value {
    font-size: 15px;
    font-weight: 600;
    color: #1a202c;
  }
  .lahan-detail-notes {
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid #e2e8f0;
  }
  .lahan-detail-notes-label {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 12px;
    font-weight: 600;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.03em;
    margin-bottom: 6px;
  }
  .lahan-detail-notes-label svg {
    color: #94a3b8;
  }
  .lahan-detail-notes p {
    margin: 0;
    font-size: 14px;
    color: #475569;
    line-height: 1.5;
  }

  /* Map placeholder */
  .lahan-detail-map {
    border-radius: 12px;
    overflow: hidden;
  }
  .lahan-map-placeholder {
    background: linear-gradient(135deg, #e0e7ff, #dbeafe);
    padding: 40px 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    color: #475569;
    border: 2px dashed #93c5fd;
    border-radius: 12px;
  }
  .lahan-map-placeholder p {
    margin: 0;
    font-size: 15px;
    font-weight: 600;
  }
  .lahan-map-placeholder span {
    font-size: 12px;
    color: #64748b;
  }

  /* History / Timeline */
  .lahan-detail-history {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    padding: 20px;
  }
  .lahan-detail-section-title {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 0 0 16px 0;
    font-size: 15px;
    color: #1a202c;
  }
  .lahan-timeline {
    display: flex;
    flex-direction: column;
    gap: 0;
    position: relative;
    padding-left: 24px;
  }
  .lahan-timeline::before {
    content: '';
    position: absolute;
    left: 7px;
    top: 4px;
    bottom: 4px;
    width: 2px;
    background: #e2e8f0;
  }
  .lahan-timeline-item {
    display: flex;
    gap: 12px;
    position: relative;
    padding-bottom: 16px;
  }
  .lahan-timeline-item:last-child {
    padding-bottom: 0;
  }
  .lahan-timeline-dot {
    position: absolute;
    left: -24px;
    top: 2px;
    color: #059669;
    z-index: 1;
    background: #f8fafc;
    padding: 2px 0;
  }
  .lahan-timeline-circle {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #cbd5e1;
    margin: 3px;
  }
  .lahan-timeline-content {
    flex: 1;
  }
  .lahan-timeline-action {
    margin: 0;
    font-size: 13px;
    color: #1a202c;
    font-weight: 500;
  }
  .lahan-timeline-meta {
    font-size: 12px;
    color: #94a3b8;
    margin-top: 2px;
    display: block;
  }

  /* Status info boxes */
  .lahan-detail-rejected {
    display: flex;
    gap: 12px;
    align-items: flex-start;
    padding: 16px;
    background: #fef2f2;
    border: 1px solid #fecaca;
    border-radius: 10px;
    color: #991b1b;
  }
  .lahan-detail-rejected svg {
    flex-shrink: 0;
    margin-top: 2px;
  }
  .lahan-detail-rejected strong {
    display: block;
    font-size: 14px;
    margin-bottom: 4px;
  }
  .lahan-detail-rejected p {
    margin: 0;
    font-size: 13px;
    color: #b91c1c;
  }
  .lahan-detail-rejected span {
    font-size: 12px;
    color: #dc2626;
    margin-top: 4px;
    display: block;
  }

  .lahan-detail-pending {
    display: flex;
    gap: 12px;
    align-items: flex-start;
    padding: 16px;
    background: #fffbeb;
    border: 1px solid #fde68a;
    border-radius: 10px;
    color: #92400e;
  }
  .lahan-detail-pending svg {
    flex-shrink: 0;
    margin-top: 2px;
  }
  .lahan-detail-pending strong {
    display: block;
    font-size: 14px;
    margin-bottom: 4px;
  }
  .lahan-detail-pending p {
    margin: 0;
    font-size: 13px;
    color: #a16207;
  }

  .lahan-detail-verifikator {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    color: #64748b;
    padding: 12px 16px;
    background: #f8fafc;
    border-radius: 8px;
    border: 1px solid #e2e8f0;
  }
  .lahan-detail-verifikator svg {
    color: #94a3b8;
  }

  /* Responsive */
  @media (max-width: 768px) {
    .lahan-header {
      flex-direction: column;
    }
    .lahan-header-actions {
      width: 100%;
    }
    .lahan-filter-row {
      flex-direction: column;
    }
    .lahan-filter-item {
      min-width: 100%;
    }
    .lahan-form-row {
      grid-template-columns: 1fr;
    }
    .lahan-detail-grid {
      grid-template-columns: 1fr;
    }
    .lahan-table-wrapper {
      overflow-x: auto;
    }
    .lahan-table {
      min-width: 680px;
    }
  }
`;

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import lahanApi from '../api/lahan';
import masterApi from '../api/master';
import { useApi, useMutation } from '../hooks/useApi';
import { formatTanggal } from '../utils/formatters';
import StatusBadge from '../components/shared/StatusBadge';
import Modal from '../components/shared/Modal';
import '../styles/pages/DataLahan.css';

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
    fetchLahan().catch(() => {});
    fetchWilayah().catch(() => {});
    fetchJenisLahan().catch(() => {});
  }, [fetchLahan, fetchWilayah, fetchJenisLahan]);

  // Master data options
  const daftarWilayah = wilayahData || [];
  const jenisLahanOptions = jenisLahanData || [];

  // Data array
  const dataLahan = Array.isArray(lahanData) ? lahanData : [];

  // Role-based data
  const baseData = useMemo(() => {
    if (currentUser?.role === 'petani') {
      return dataLahan.filter((l) => l.pemilikId === currentUser?.id || l.pemilik_id === currentUser?.id);
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
      const getPemilikStr = (p) => typeof p === 'object' ? (p?.nama || '') : (p || '');
      result = result.filter((l) => getPemilikStr(l.pemilik).toLowerCase().includes(q) || (l.lokasi || '').toLowerCase().includes(q));
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
      pemilik: typeof lahan.pemilik === 'object' ? (lahan.pemilik?.nama || '') : (lahan.pemilik || ''),
      lokasi: lahan.lokasi,
      luas: lahan.luas,
      jenisLahan: lahan.jenis_lahan || lahan.jenisLahan,
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

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        jenis_lahan: formData.jenisLahan,
      };

      if (editingLahan) {
        await updateLahan(editingLahan.id, payload);
        toast.success('Data lahan berhasil diperbarui!');
      } else {
        await createLahan(payload);
        toast.success('Lahan baru berhasil ditambahkan!');
      }
      fetchLahan();
      setShowFormModal(false);
    } catch (err) {
      toast.error(err.message || 'Terjadi kesalahan saat menyimpan data lahan');
    }
  };

  const canAdd = hasPermission('add_lahan');
  const canEdit = hasPermission('edit_lahan') || hasPermission('edit_own_lahan');

  return (
    <>
      
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
                  {daftarWilayah.map((w, idx) => (
                    <option key={typeof w === 'object' && w !== null ? w.id || idx : w} value={typeof w === 'object' && w !== null ? w.nama : w}>{typeof w === 'object' && w !== null ? w.nama : w}</option>
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
                        <span>{typeof lahan.pemilik === 'object' ? (lahan.pemilik?.nama || '-') : (lahan.pemilik || '-')}</span>
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
                    {jenisLahanOptions.map((j, idx) => (
                      <option key={typeof j === 'object' && j !== null ? j.id || idx : j} value={typeof j === 'object' && j !== null ? j.nama || j.value : j}>{typeof j === 'object' && j !== null ? j.nama || j.label : j}</option>
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
                    <h3 className="lahan-detail-name">{typeof detailLahan.pemilik === 'object' ? (detailLahan.pemilik?.nama || '-') : (detailLahan.pemilik || '-')}</h3>
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
              {detailLahan.statusVerifikasi === 'terverifikasi' && (
                <div className="lahan-detail-section">
                  <h4 className="lahan-detail-section-title">Status Verifikasi</h4>
                  <div className="lahan-timeline">
                    <div className="lahan-timeline-item">
                      <div className="lahan-timeline-dot"><CheckCircle2 size={16} /></div>
                      <div className="lahan-timeline-content">
                        <p className="lahan-timeline-action">Lahan diverifikasi dan disetujui</p>
                        <span className="lahan-timeline-meta">
                          Oleh: {typeof detailLahan.verifikator === 'object' ? (detailLahan.verifikator?.nama || '-') : (detailLahan.verifikator || '-')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {detailLahan.statusVerifikasi === 'ditolak' && (
                <div className="lahan-detail-rejected">
                  <XCircle size={18} />
                  <div>
                    <strong>Verifikasi Ditolak</strong>
                    <p>Alasan: {detailLahan.catatan}</p>
                    <span>Oleh: {typeof detailLahan.verifikator === 'object' ? (detailLahan.verifikator?.nama || '-') : (detailLahan.verifikator || '-')}</span>
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
                  <span>Diverifikasi oleh: <strong>{typeof detailLahan.verifikator === 'object' ? (detailLahan.verifikator?.nama || '-') : (detailLahan.verifikator || '-')}</strong></span>
                </div>
              )}
            </div>
          )}
        </Modal>
      </div>
    </>
  );
}



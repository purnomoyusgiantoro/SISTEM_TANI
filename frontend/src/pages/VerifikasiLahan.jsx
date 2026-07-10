import React, { useState, useMemo, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import verifikasiLahanApi from '../api/verifikasiLahan';
import { useApi, useMutation } from '../hooks/useApi';
import { formatTanggal } from '../utils/formatters';
import * as Mock from '../data/mockData';
import StatusBadge from '../components/shared/StatusBadge';
import Modal from '../components/shared/Modal';
import {
  ShieldCheck, Clock, XCircle, CheckCircle, X, Filter,
  MapPin, User, Calendar, Layers, FileText, Search
} from 'lucide-react';

const cssText = `
  .verifikasi-page {
    font-family: var(--font-sans);
    color: var(--color-text);
  }
  .verifikasi-header {
    display: none;
  }
  .verifikasi-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
    margin-bottom: 28px;
  }
  .verifikasi-stat-card {
    background: #fff;
    border-radius: 8px;
    padding: 20px;
    display: flex;
    align-items: center;
    gap: 16px;
    border: 1px solid var(--color-border);
    transition: transform 0.2s;
  }
  .verifikasi-stat-card:hover {
    transform: translateY(-2px);
  }
  .verifikasi-stat-icon {
    width: 48px;
    height: 48px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .verifikasi-stat-icon.pending { background: #fef3c7; color: #d97706; }
  .verifikasi-stat-icon.verified { background: #d1fae5; color: #059669; }
  .verifikasi-stat-icon.rejected { background: #fee2e2; color: #dc2626; }
  .verifikasi-stat-info h3 {
    margin: 0;
    font-size: 28px;
    font-weight: 800;
    color: #1a202c;
    line-height: 1;
  }
  .verifikasi-stat-info p {
    margin: 4px 0 0 0;
    font-size: 13px;
    color: #64748b;
    font-weight: 500;
  }
  .verifikasi-filters {
    display: flex;
    gap: 16px;
    margin-bottom: 24px;
    flex-wrap: wrap;
    align-items: center;
  }
  .verifikasi-filters .filter-label {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    font-weight: 600;
    color: #475569;
  }
  .verifikasi-filter-select,
  .verifikasi-filter-input {
    padding: 8px 12px;
    border-radius: 8px;
    border: 1px solid #ced4da;
    font-size: 13px;
    color: #1a202c;
    background: #fff;
    outline: none;
    transition: border-color 0.15s;
    height: 38px;
    box-sizing: border-box;
  }
  .verifikasi-filter-select:focus,
  .verifikasi-filter-input:focus {
    border-color: var(--color-text-muted);
  }
  .verifikasi-tabs {
    display: flex;
    gap: 4px;
    background: #f0f4f8;
    padding: 4px;
    border-radius: 8px;
    margin-bottom: 24px;
    width: fit-content;
  }
  .verifikasi-tab {
    padding: 10px 20px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    border: 1px solid transparent;
    transition: all 0.2s;
    background: transparent;
    color: #64748b;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .verifikasi-tab.active {
    background: #fff;
    color: #1e293b;
    border-color: var(--color-border);
    box-shadow: 0 1px 2px rgba(0,0,0,0.05);
  }
  .verifikasi-tab:hover:not(.active) {
    color: #1a202c;
  }
  .verifikasi-tab .tab-count {
    background: #e2e8f0;
    color: #475569;
    padding: 2px 8px;
    border-radius: 10px;
    font-size: 11px;
    font-weight: 700;
  }
  .verifikasi-tab.active .tab-count {
    background: #1a365d;
    color: #fff;
  }
  .verifikasi-table-wrapper {
    overflow-x: auto;
    background: #fff;
    border-radius: 8px;
    border: 1px solid var(--color-border);
  }
  .verifikasi-table {
    width: 100%;
    min-width: 900px;
    border-collapse: collapse;
    font-size: 14px;
    table-layout: fixed;
  }
  .verifikasi-table th {
    text-align: left;
    padding: 14px 16px;
    background: #f0f4f8;
    color: #4a5568;
    font-weight: 600;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: .5px;
    border-bottom: 1px solid var(--color-border);
    white-space: nowrap;
  }
  .verifikasi-table td {
    padding: 14px 16px;
    border-bottom: 1px solid var(--color-border-light);
    color: #1a202c;
  }
  .verifikasi-table tr:last-child td { border-bottom: none; }
  .verifikasi-table tr:hover td { background: #f7fafc; }
  .verifikasi-card {
    background: #fff;
    border-radius: 8px;
    padding: 20px;
    border: 1px solid var(--color-border);
    transition: all 0.2s;
    position: relative;
  }
  .verifikasi-card:hover {
    transform: translateY(-2px);
  }
  .verifikasi-card-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 14px;
  }
  .verifikasi-card-header h4 {
    margin: 0;
    font-size: 16px;
    font-weight: 700;
    color: #1a202c;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .verifikasi-card-meta {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    margin-bottom: 14px;
  }
  .verifikasi-meta-item {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    font-size: 13px;
    color: #475569;
  }
  .verifikasi-meta-item .meta-icon {
    color: #94a3b8;
    flex-shrink: 0;
    margin-top: 1px;
  }
  .verifikasi-meta-item .meta-label {
    font-weight: 500;
    color: #94a3b8;
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }
  .verifikasi-meta-item .meta-value {
    font-weight: 600;
    color: #334155;
  }
  .verifikasi-card-notes {
    background: #f8fafc;
    border-radius: 8px;
    padding: 10px 12px;
    font-size: 13px;
    color: #64748b;
    margin-bottom: 14px;
    border-left: 3px solid #e2e8f0;
  }
  .verifikasi-card-actions {
    display: flex;
    gap: 8px;
    padding-top: 14px;
    border-top: 1px solid #f1f5f9;
  }
  .verifikasi-btn {
    padding: 8px 18px;
    border-radius: 8px;
    border: none;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.15s;
    display: flex;
    align-items: center;
    gap: 6px;
    flex: 1;
    justify-content: center;
  }
  .verifikasi-btn-approve {
    background: #059669;
    color: #fff;
  }
  .verifikasi-btn-approve:hover {
    background: #047857;
    box-shadow: 0 2px 8px rgba(5,150,105,0.35);
  }
  .verifikasi-btn-reject {
    background: #fff;
    color: #dc2626;
    border: 1px solid #fecaca;
  }
  .verifikasi-btn-reject:hover {
    background: #fef2f2;
    border-color: #dc2626;
  }
  .verifikasi-verified-info {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 14px;
    background: #ecfdf5;
    border-radius: 8px;
    border: 1px solid #a7f3d0;
    margin-top: 14px;
  }
  .verifikasi-verified-info .check-icon {
    color: #059669;
    flex-shrink: 0;
  }
  .verifikasi-verified-info .info-text {
    font-size: 13px;
    color: #047857;
  }
  .verifikasi-verified-info .info-text strong {
    font-weight: 700;
  }
  .verifikasi-rejected-info {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 14px;
    background: #fef2f2;
    border-radius: 8px;
    border: 1px solid #fecaca;
    margin-top: 14px;
  }
  .verifikasi-rejected-info .x-icon {
    color: #dc2626;
    flex-shrink: 0;
  }
  .verifikasi-rejected-info .info-text {
    font-size: 13px;
    color: #991b1b;
  }
  .verifikasi-modal-summary {
    background: #f8fafc;
    border-radius: 10px;
    padding: 16px;
    margin-bottom: 20px;
    border: 1px solid #e2e8f0;
  }
  .verifikasi-modal-summary h4 {
    margin: 0 0 12px 0;
    font-size: 14px;
    font-weight: 700;
    color: #1a365d;
  }
  .verifikasi-modal-summary .summary-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }
  .verifikasi-modal-summary .summary-item {
    font-size: 13px;
  }
  .verifikasi-modal-summary .summary-item .label {
    color: #94a3b8;
    font-weight: 500;
  }
  .verifikasi-modal-summary .summary-item .value {
    color: #1a202c;
    font-weight: 600;
  }
  .verifikasi-form-group {
    margin-bottom: 18px;
  }
  .verifikasi-form-group label {
    display: block;
    font-size: 13px;
    font-weight: 600;
    color: #334155;
    margin-bottom: 6px;
  }
  .verifikasi-form-group textarea {
    width: 100%;
    padding: 10px 12px;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    font-size: 14px;
    color: #1a202c;
    resize: vertical;
    min-height: 80px;
    font-family: inherit;
    outline: none;
    transition: border-color 0.15s, box-shadow 0.15s;
    box-sizing: border-box;
  }
  .verifikasi-form-group textarea:focus {
    border-color: #2d4a7a;
    box-shadow: 0 0 0 3px rgba(45,74,122,0.1);
  }
  .verifikasi-radio-group {
    display: flex;
    gap: 12px;
    margin-bottom: 16px;
  }
  .verifikasi-radio-option {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 16px;
    border-radius: 8px;
    border: 2px solid #e2e8f0;
    cursor: pointer;
    transition: all 0.15s;
    flex: 1;
    justify-content: center;
    font-size: 14px;
    font-weight: 600;
  }
  .verifikasi-radio-option:hover {
    border-color: #cbd5e1;
  }
  .verifikasi-radio-option.selected-approve {
    border-color: #059669;
    background: #ecfdf5;
    color: #047857;
  }
  .verifikasi-radio-option.selected-reject {
    border-color: #dc2626;
    background: #fef2f2;
    color: #991b1b;
  }
  .verifikasi-radio-option input[type="radio"] {
    display: none;
  }
  .verifikasi-modal-actions {
    display: flex;
    gap: 10px;
    justify-content: flex-end;
  }
  .verifikasi-modal-btn {
    padding: 10px 24px;
    border-radius: 8px;
    border: none;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.15s;
  }
  .verifikasi-modal-btn-cancel {
    background: #f1f5f9;
    color: #475569;
  }
  .verifikasi-modal-btn-cancel:hover {
    background: #e2e8f0;
  }
  .verifikasi-modal-btn-submit {
    background: linear-gradient(135deg, #1a365d 0%, #2d4a7a 100%);
    color: #fff;
  }
  .verifikasi-modal-btn-submit:hover {
    box-shadow: 0 2px 8px rgba(26,54,93,0.35);
  }
  .verifikasi-modal-btn-submit:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  .verifikasi-empty {
    text-align: center;
    padding: 60px 20px;
    color: #94a3b8;
  }
  .verifikasi-empty .empty-icon {
    margin-bottom: 16px;
    color: #cbd5e1;
  }
  .verifikasi-empty h3 {
    margin: 0 0 6px 0;
    font-size: 16px;
    color: #64748b;
  }
  .verifikasi-empty p {
    margin: 0;
    font-size: 13px;
  }
  @media (max-width: 768px) {
    .verifikasi-cards {
      grid-template-columns: 1fr;
    }
    .verifikasi-card-meta {
      grid-template-columns: 1fr;
    }
    .verifikasi-stats {
      grid-template-columns: 1fr;
    }
  }
`;

export default function VerifikasiLahan() {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('pending');
  const [filterWilayah, setFilterWilayah] = useState('');
  const [filterJenis, setFilterJenis] = useState('');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedLahan, setSelectedLahan] = useState(null);
  const [keputusan, setKeputusan] = useState('');
  const [catatanVerifikasi, setCatatanVerifikasi] = useState('');
  const [alasanPenolakan, setAlasanPenolakan] = useState('');
  const [lahanList, setLahanList] = useState(Mock.dataLahan);

  const counts = useMemo(() => ({
    pending: lahanList.filter(l => l.statusVerifikasi === 'pending').length,
    terverifikasi: lahanList.filter(l => l.statusVerifikasi === 'terverifikasi').length,
    ditolak: lahanList.filter(l => l.statusVerifikasi === 'ditolak').length,
  }), [lahanList]);

  const filteredLahan = useMemo(() => {
    return lahanList.filter(l => {
      if (l.statusVerifikasi !== activeTab) return false;
      if (filterWilayah && !l.lokasi.includes(filterWilayah)) return false;
      if (filterJenis && l.jenisLahan !== filterJenis) return false;
      if (filterDateFrom && l.tanggalDaftar < filterDateFrom) return false;
      if (filterDateTo && l.tanggalDaftar > filterDateTo) return false;
      return true;
    });
  }, [lahanList, activeTab, filterWilayah, filterJenis, filterDateFrom, filterDateTo]);

  const openModal = (lahan) => {
    setSelectedLahan(lahan);
    setKeputusan('');
    setCatatanVerifikasi('');
    setAlasanPenolakan('');
    setModalOpen(true);
  };

  const handleSubmit = () => {
    if (!selectedLahan || !keputusan) return;
    setLahanList(prev => prev.map(l => {
      if (l.id === selectedLahan.id) {
        return {
          ...l,
          statusVerifikasi: keputusan === 'setuju' ? 'terverifikasi' : 'ditolak',
          verifikator: currentUser?.nama || 'Ir. Hendra Wijaya',
          catatan: keputusan === 'tolak' ? alasanPenolakan : (catatanVerifikasi || l.catatan),
        };
      }
      return l;
    }));
    setModalOpen(false);
  };

  const tabs = [
    { key: 'pending', label: 'Pending', count: counts.pending },
    { key: 'terverifikasi', label: 'Terverifikasi', count: counts.terverifikasi },
    { key: 'ditolak', label: 'Ditolak', count: counts.ditolak },
  ];

  return (
    <>
      <style>{cssText}</style>
      <div className="verifikasi-page">
        <div className="admin-card">
          {/* Header Row Inside Card */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid #dee2e6' }}>
            <div>
              <h1 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#333', margin: 0 }}>Verifikasi Lahan</h1>
            </div>
            <nav style={{ marginBottom: 0, fontSize: '0.85rem', display: 'flex', alignItems: 'center', color: 'var(--color-primary)' }}>
              <span style={{ margin: '0 8px' }}>/</span>
              <span style={{ fontWeight: '500' }}>verifikasilahan</span>
            </nav>
          </div>
          
          <div style={{ padding: '20px' }}>



        <div className="verifikasi-filters">
          <span className="filter-label"><Filter size={14} /> Filter:</span>
          <select className="verifikasi-filter-select" value={filterWilayah} onChange={e => setFilterWilayah(e.target.value)}>
            <option value="">Semua Wilayah</option>
            {Mock.daftarWilayah.map(w => <option key={w} value={w}>{w}</option>)}
          </select>
          <select className="verifikasi-filter-select" value={filterJenis} onChange={e => setFilterJenis(e.target.value)}>
            <option value="">Semua Jenis</option>
            {Mock.jenisLahanOptions.map(j => <option key={j} value={j}>{j}</option>)}
          </select>
          <input type="date" className="verifikasi-filter-input" value={filterDateFrom} onChange={e => setFilterDateFrom(e.target.value)} placeholder="Dari" />
          <input type="date" className="verifikasi-filter-input" value={filterDateTo} onChange={e => setFilterDateTo(e.target.value)} placeholder="Sampai" />
        </div>

        <div className="verifikasi-tabs">
          {tabs.map(tab => (
            <button key={tab.key} className={`verifikasi-tab ${activeTab === tab.key ? 'active' : ''}`} onClick={() => setActiveTab(tab.key)}>
              {tab.label} <span className="tab-count">{tab.count}</span>
            </button>
          ))}
        </div>

        {filteredLahan.length === 0 ? (
          <div className="verifikasi-empty">
            <div className="empty-icon"><Layers size={48} /></div>
            <h3>Tidak ada data</h3>
            <p>Tidak ada lahan {activeTab} yang ditemukan dengan filter ini.</p>
          </div>
        ) : (
          <div className="verifikasi-table-wrapper">
            <table className="verifikasi-table">
              <thead>
                <tr>
                  <th style={{ width: 160 }}>Petani</th>
                  <th>Lokasi</th>
                  <th style={{ width: 100 }}>Luas</th>
                  <th style={{ width: 130 }}>Jenis Lahan</th>
                  <th style={{ width: 130 }}>Tgl Daftar</th>
                  <th style={{ width: 180 }}>Status</th>
                  <th style={{ width: 160 }}>Aksi / Ket</th>
                </tr>
              </thead>
              <tbody>
                {filteredLahan.map((lahan) => (
                  <tr key={lahan.id}>
                    <td style={{ fontWeight: 600 }}>{lahan.pemilik}</td>
                    <td>{lahan.lokasi}</td>
                    <td style={{ fontWeight: 600 }}>{lahan.luas} Ha</td>
                    <td>{lahan.jenisLahan}</td>
                    <td>{formatTanggal(lahan.tanggalDaftar)}</td>
                    <td><StatusBadge status={lahan.statusVerifikasi} /></td>
                    <td>
                      {lahan.statusVerifikasi === 'pending' && (
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            className="verifikasi-btn verifikasi-btn-approve"
                            style={{ padding: '6px 12px', fontSize: '12px', flex: 'none' }}
                            onClick={() => openModal(lahan)}
                          >
                            Verifikasi
                          </button>
                          <button
                            className="verifikasi-btn verifikasi-btn-reject"
                            style={{ padding: '6px 12px', fontSize: '12px', flex: 'none' }}
                            onClick={() => { setSelectedLahan(lahan); setKeputusan('tolak'); setCatatanVerifikasi(''); setAlasanPenolakan(''); setModalOpen(true); }}
                          >
                            Tolak
                          </button>
                        </div>
                      )}
                      {lahan.statusVerifikasi === 'terverifikasi' && (
                        <div style={{ fontSize: '12px', color: '#059669' }}>
                          {lahan.verifikator}
                        </div>
                      )}
                      {lahan.statusVerifikasi === 'ditolak' && (
                        <div style={{ fontSize: '12px', color: '#dc2626' }}>
                          {lahan.catatan}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Verifikasi Lahan" footer={
          <div className="verifikasi-modal-actions">
            <button className="verifikasi-modal-btn verifikasi-modal-btn-cancel" onClick={() => setModalOpen(false)}>Batal</button>
            <button className="verifikasi-modal-btn verifikasi-modal-btn-submit" disabled={!keputusan} onClick={handleSubmit}>Kirim Keputusan</button>
          </div>
        }>
          {selectedLahan && (
            <>
              <div className="verifikasi-modal-summary">
                <h4>Detail Lahan</h4>
                <div className="summary-grid">
                  <div className="summary-item"><span className="label">Pemilik: </span><span className="value">{selectedLahan.pemilik}</span></div>
                  <div className="summary-item"><span className="label">Lokasi: </span><span className="value">{selectedLahan.lokasi}</span></div>
                  <div className="summary-item"><span className="label">Luas: </span><span className="value">{selectedLahan.luas} Ha</span></div>
                  <div className="summary-item"><span className="label">Jenis: </span><span className="value">{selectedLahan.jenisLahan}</span></div>
                  <div className="summary-item"><span className="label">Koordinat: </span><span className="value">{selectedLahan.koordinat}</span></div>
                  <div className="summary-item"><span className="label">Terdaftar: </span><span className="value">{formatTanggal(selectedLahan.tanggalDaftar)}</span></div>
                </div>
              </div>

              <div className="verifikasi-form-group">
                <label>Catatan Verifikasi</label>
                <textarea value={catatanVerifikasi} onChange={e => setCatatanVerifikasi(e.target.value)} placeholder="Tambahkan catatan verifikasi..." />
              </div>

              <div className="verifikasi-form-group">
                <label>Keputusan</label>
                <div className="verifikasi-radio-group">
                  <label className={`verifikasi-radio-option ${keputusan === 'setuju' ? 'selected-approve' : ''}`}>
                    <input type="radio" name="keputusan" value="setuju" checked={keputusan === 'setuju'} onChange={() => setKeputusan('setuju')} />
                    <CheckCircle size={16} /> Setujui
                  </label>
                  <label className={`verifikasi-radio-option ${keputusan === 'tolak' ? 'selected-reject' : ''}`}>
                    <input type="radio" name="keputusan" value="tolak" checked={keputusan === 'tolak'} onChange={() => setKeputusan('tolak')} />
                    <XCircle size={16} /> Tolak
                  </label>
                </div>
              </div>

              {keputusan === 'tolak' && (
                <div className="verifikasi-form-group">
                  <label>Alasan Penolakan</label>
                  <textarea value={alasanPenolakan} onChange={e => setAlasanPenolakan(e.target.value)} placeholder="Jelaskan alasan penolakan lahan..." />
                </div>
              )}
            </>
          )}
        </Modal>
          </div>
        </div>
      </div>
    </>
  );
}

import React, { useState, useMemo, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import verifikasiLahanApi from '../api/verifikasiLahan';
import { useApi, useMutation } from '../hooks/useApi';
import { formatTanggal } from '../utils/formatters';
import StatusBadge from '../components/shared/StatusBadge';
import Modal from '../components/shared/Modal';
import '../styles/pages/VerifikasiLahan.css';

import {
  ShieldCheck, Clock, XCircle, CheckCircle, X, Filter,
  MapPin, User, Calendar, Layers, FileText, Search
} from 'lucide-react';



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

  // API hooks
  const { data: lahanData, loading: loadingLahan, execute: fetchLahan } = useApi(verifikasiLahanApi.getAll);
  const { mutate: terimaLahan } = useMutation(verifikasiLahanApi.terima);
  const { mutate: tolakLahan } = useMutation(verifikasiLahanApi.tolak);

  useEffect(() => {
    fetchLahan().catch(() => {});
  }, [fetchLahan]);

  const lahanList = Array.isArray(lahanData) ? lahanData : [];

  const counts = useMemo(() => ({
    pending: lahanList.filter(l => l.status_verifikasi === 'pending' || l.statusVerifikasi === 'pending').length,
    terverifikasi: lahanList.filter(l => l.status_verifikasi === 'terverifikasi' || l.statusVerifikasi === 'terverifikasi').length,
    ditolak: lahanList.filter(l => l.status_verifikasi === 'ditolak' || l.statusVerifikasi === 'ditolak').length,
  }), [lahanList]);

  const filteredLahan = useMemo(() => {
    return lahanList.filter(l => {
      const status = l.status_verifikasi || l.statusVerifikasi;
      const tgl = l.tanggal_daftar || l.tanggalDaftar;
      const jenis = l.jenis_lahan || l.jenisLahan;
      if (status !== activeTab) return false;
      if (filterWilayah && !l.lokasi.includes(filterWilayah)) return false;
      if (filterJenis && jenis !== filterJenis) return false;
      if (filterDateFrom && tgl < filterDateFrom) return false;
      if (filterDateTo && tgl > filterDateTo) return false;
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

  const handleSubmit = async () => {
    if (!selectedLahan || !keputusan) return;
    try {
      if (keputusan === 'setuju') {
        await terimaLahan(selectedLahan.id, { catatan: catatanVerifikasi });
        toast.success('Lahan berhasil diverifikasi');
      } else {
        await tolakLahan(selectedLahan.id, { catatan: alasanPenolakan });
        toast.success('Lahan berhasil ditolak');
      }
      fetchLahan();
      setModalOpen(false);
    } catch (err) {
      toast.error(err.message || 'Gagal memproses verifikasi lahan');
    }
  };

  const tabs = [
    { key: 'pending', label: 'Pending', count: counts.pending },
    { key: 'terverifikasi', label: 'Terverifikasi', count: counts.terverifikasi },
    { key: 'ditolak', label: 'Ditolak', count: counts.ditolak },
  ];

  return (
    <>
      
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

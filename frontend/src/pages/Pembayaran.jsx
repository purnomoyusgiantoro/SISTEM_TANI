import { useState, useMemo, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import tagihanApi from '../api/tagihan';
import { useApi, useMutation } from '../hooks/useApi';
import { formatRupiah, formatTanggal } from '../utils/formatters';
import * as Mock from '../data/mockData';
import '../styles/pages/Pembayaran.css';

import {
  CreditCard, AlertCircle, Clock, CheckCircle2, Upload,
  FileText, Search, Filter, ChevronDown, X, Check,
  DollarSign, TrendingUp, CalendarDays, BadgeAlert
} from 'lucide-react';

/* ── helpers ── */
const statusConfig = {
  lunas:                { label: 'Lunas',                bg: '#dcfce7', color: '#166534', border: '#86efac' },
  belum_bayar:          { label: 'Belum Bayar',          bg: '#fee2e2', color: '#991b1b', border: '#fca5a5' },
  menunggu_verifikasi:  { label: 'Menunggu Verifikasi',  bg: '#fef9c3', color: '#854d0e', border: '#fde047' },
};

function StatusBadge({ status }) {
  const cfg = statusConfig[status] || statusConfig.belum_bayar;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
      width: 145, // slightly larger to accommodate icon + text comfortably
      padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600,
      background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`,
      whiteSpace: 'nowrap'
    }}>
      {status === 'lunas' && <CheckCircle2 size={13} />}
      {status === 'belum_bayar' && <AlertCircle size={13} />}
      {status === 'menunggu_verifikasi' && <Clock size={13} />}
      {cfg.label}
    </span>
  );
}

function hitungCountdown(jatuhTempo, status) {
  if (status === 'lunas') return { text: 'Sudah lunas', overdue: false };
  const now = new Date();
  const due = new Date(jatuhTempo);
  const diff = Math.ceil((due - now) / (1000 * 60 * 60 * 24));
  if (diff < 0) return { text: `Terlambat ${Math.abs(diff)} hari`, overdue: true };
  if (diff === 0) return { text: 'Jatuh tempo hari ini', overdue: true };
  return { text: `${diff} hari lagi`, overdue: false };
}

/* ── Modal ── */
function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div className="pembayaran-modal-overlay" onClick={onClose}>
      <div className="pembayaran-modal" onClick={(e) => e.stopPropagation()}>
        <div className="pembayaran-modal-header">
          <h3>{title}</h3>
          <button className="pembayaran-modal-close" onClick={onClose}><X size={20} /></button>
        </div>
        <div className="pembayaran-modal-body">{children}</div>
      </div>
    </div>
  );
}

/* ══════════════ MAIN COMPONENT ══════════════ */
export default function Pembayaran() {
  const { currentUser } = useAuth();
  const role = currentUser?.role || 'petani';
  const isPetani = role === 'petani';
  const isPengurus = role === 'pengurus';

  const [activeTab, setActiveTab] = useState('tagihan');
  const [tagihan, setTagihan] = useState(Mock.dataTagihan);
  const [searchQuery, setSearchQuery] = useState('');

  /* upload bukti bayar state */
  const [selectedTagihan, setSelectedTagihan] = useState('');
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadAmount, setUploadAmount] = useState('');
  const [uploadDate, setUploadDate] = useState('');
  const [uploadNotes, setUploadNotes] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  /* verifikasi state */
  const [verifikasiModal, setVerifikasiModal] = useState(null);
  const [verifikasiAction, setVerifikasiAction] = useState(null);

  /* ── computed ── */
  const myTagihan = useMemo(() => {
    if (isPetani) return tagihan.filter((t) => t.petaniId === currentUser?.id);
    return tagihan;
  }, [tagihan, currentUser, isPetani]);

  const filtered = useMemo(() => {
    if (!searchQuery) return myTagihan;
    const q = searchQuery.toLowerCase();
    return myTagihan.filter(
      (t) =>
        t.id.toLowerCase().includes(q) ||
        t.peralatan.toLowerCase().includes(q) ||
        t.petani.toLowerCase().includes(q)
    );
  }, [myTagihan, searchQuery]);

  const totalTagihan = myTagihan.reduce((s, t) => s + t.jumlah, 0);
  const belumBayar = myTagihan.filter((t) => t.status === 'belum_bayar').reduce((s, t) => s + t.jumlah, 0);
  const menungguVerifikasi = myTagihan.filter((t) => t.status === 'menunggu_verifikasi').reduce((s, t) => s + t.jumlah, 0);
  const lunas = myTagihan.filter((t) => t.status === 'lunas').reduce((s, t) => s + t.jumlah, 0);

  const hariIni = new Date().toISOString().slice(0, 10);
  const pembayaranMasukHariIni = myTagihan
    .filter((t) => t.tanggalBayar === hariIni && t.status === 'lunas')
    .reduce((s, t) => s + t.jumlah, 0);
  const tagihanTertunggak = myTagihan
    .filter((t) => t.status === 'belum_bayar' && new Date(t.jatuhTempo) < new Date())
    .reduce((s, t) => s + t.jumlah, 0);

  /* ── tabs ── */
  const tabs = [
    { id: 'tagihan', label: 'Tagihan Aktif' },
    { id: 'riwayat', label: 'Riwayat Pembayaran' },
    { id: isPetani ? 'upload' : 'verifikasi', label: isPetani ? 'Upload Bukti Bayar' : 'Verifikasi Pembayaran' },
  ];

  /* ── handlers ── */
  const handleBayar = (id) => {
    setSelectedTagihan(id);
    setActiveTab('upload');
  };

  const handleUploadSubmit = (e) => {
    e.preventDefault();
    if (!selectedTagihan || !uploadFile) return;
    setTagihan((prev) =>
      prev.map((t) =>
        t.id === selectedTagihan
          ? { ...t, status: 'menunggu_verifikasi', tanggalBayar: uploadDate || hariIni, buktiPembayaran: uploadFile.name }
          : t
      )
    );
    setUploadSuccess(true);
    setTimeout(() => {
      setUploadSuccess(false);
      setSelectedTagihan('');
      setUploadFile(null);
      setUploadAmount('');
      setUploadDate('');
      setUploadNotes('');
      setActiveTab('tagihan');
    }, 2500);
  };

  const handleVerifikasi = (id, approved) => {
    setTagihan((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, status: approved ? 'lunas' : 'belum_bayar', buktiPembayaran: approved ? t.buktiPembayaran : null, tanggalBayar: approved ? t.tanggalBayar : null }
          : t
      )
    );
    setVerifikasiModal(null);
    setVerifikasiAction(null);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) setUploadFile(file);
  };

  /* ══════════════ RENDER ══════════════ */
  return (
    <>
      

      <div className="pembayaran-page">
        <div className="admin-card">
          {/* Header Row Inside Card */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid #dee2e6' }}>
            <div>
              <h1 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#333', margin: 0 }}>Pembayaran &amp; Tagihan</h1>
            </div>
            <nav style={{ marginBottom: 0, fontSize: '0.85rem', display: 'flex', alignItems: 'center', color: 'var(--color-primary)' }}>
              <span style={{ margin: '0 8px' }}>/</span>
              <span style={{ fontWeight: '500' }}>pembayaran</span>
            </nav>
          </div>
          
          <div style={{ padding: '20px' }}>


        {/* Tabs */}
        <div className="pembayaran-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`pembayaran-tab${activeTab === tab.id ? ' active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Tab: Tagihan Aktif ── */}
        {activeTab === 'tagihan' && (
          <>
            <div className="pembayaran-search-bar">
              <div className="pembayaran-search">
                <Search size={16} color="#a0aec0" />
                <input
                  type="text"
                  placeholder="Cari tagihan..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="pembayaran-table-wrap">
              <table className="pembayaran-table">
                <thead>
                  <tr>
                    <th style={{ width: 130 }}>ID Tagihan</th>
                    <th>Peralatan</th>
                    {!isPetani && <th>Petani</th>}
                    <th>Jumlah</th>
                    <th style={{ width: 120 }}>Jatuh Tempo</th>
                    <th style={{ width: 180 }}>Status</th>
                    <th style={{ width: 120 }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={isPetani ? 6 : 7} style={{ textAlign: 'center', padding: 40, color: '#a0aec0' }}>
                        Tidak ada tagihan ditemukan
                      </td>
                    </tr>
                  ) : (
                    filtered.map((t) => {
                      const cd = hitungCountdown(t.jatuhTempo, t.status);
                      return (
                        <tr key={t.id}>
                          <td style={{ fontFamily: 'monospace', fontWeight: 600, color: '#1a365d' }}>{t.id}</td>
                          <td style={{ fontWeight: 600 }}>{t.peralatan}</td>
                          {!isPetani && <td>{t.petani}</td>}
                          <td style={{ fontWeight: 700 }}>{formatRupiah(t.jumlah)}</td>
                          <td>
                            <div className={`pembayaran-card-due${cd.overdue ? ' overdue' : ''}`}>
                              {t.status === 'lunas' ? (
                                'Lunas: ' + formatTanggal(t.tanggalBayar)
                              ) : (
                                <div>
                                  {formatTanggal(t.jatuhTempo)}
                                  <div style={{ fontSize: '11px', marginTop: '2px', opacity: 0.8 }}>{cd.text}</div>
                                </div>
                              )}
                            </div>
                          </td>
                          <td><StatusBadge status={t.status} /></td>
                          <td>
                            {isPetani && t.status === 'belum_bayar' && (
                              <button className="pembayaran-btn pembayaran-btn-primary" onClick={() => handleBayar(t.id)}>
                                <Upload size={14} /> Bayar
                              </button>
                            )}
                            {isPengurus && t.status === 'menunggu_verifikasi' && (
                              <button className="pembayaran-btn pembayaran-btn-success" onClick={() => { setVerifikasiModal(t); setVerifikasiAction('approve'); }}>
                                <Check size={14} /> Verifikasi
                              </button>
                            )}
                            {!isPetani && t.status !== 'menunggu_verifikasi' && (
                              <span style={{ color: '#a0aec0', fontSize: '12px' }}>-</span>
                            )}
                            {isPetani && t.status !== 'belum_bayar' && (
                              <span style={{ color: '#a0aec0', fontSize: '12px' }}>-</span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* ── Tab: Riwayat Pembayaran ── */}
        {activeTab === 'riwayat' && (
          <div className="pembayaran-table-wrap">
            <table className="pembayaran-table">
              <thead>
                <tr>
                  <th style={{ width: 130 }}>ID Tagihan</th>
                  <th>Peralatan</th>
                  {!isPetani && <th>Petani</th>}
                  <th style={{ width: 120 }}>Jumlah</th>
                  <th style={{ width: 120 }}>Tgl Tagihan</th>
                  <th style={{ width: 120 }}>Jatuh Tempo</th>
                  <th style={{ width: 120 }}>Tgl Bayar</th>
                  <th style={{ width: 180 }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {myTagihan.length === 0 ? (
                  <tr>
                    <td colSpan={isPetani ? 7 : 8} style={{ textAlign: 'center', padding: 40, color: '#a0aec0' }}>
                      Belum ada riwayat pembayaran
                    </td>
                  </tr>
                ) : (
                  myTagihan.map((t) => (
                    <tr key={t.id}>
                      <td style={{ fontFamily: 'monospace', fontWeight: 600, color: '#1a365d' }}>{t.id}</td>
                      <td>{t.peralatan}</td>
                      {!isPetani && <td>{t.petani}</td>}
                      <td style={{ fontWeight: 600 }}>{formatRupiah(t.jumlah)}</td>
                      <td>{formatTanggal(t.tanggalTagihan)}</td>
                      <td>{formatTanggal(t.jatuhTempo)}</td>
                      <td>{t.tanggalBayar ? formatTanggal(t.tanggalBayar) : '-'}</td>
                      <td><StatusBadge status={t.status} /></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* ── Tab: Upload Bukti Bayar (Petani) ── */}
        {activeTab === 'upload' && isPetani && (
          <div className="pembayaran-form">
            {uploadSuccess ? (
              <div className="pembayaran-success-msg">
                <CheckCircle2 size={24} />
                Bukti pembayaran berhasil diupload! Menunggu verifikasi dari pengurus.
              </div>
            ) : (
              <form onSubmit={handleUploadSubmit}>
                <div className="pembayaran-form-group">
                  <label>Pilih Tagihan</label>
                  <select
                    value={selectedTagihan}
                    onChange={(e) => {
                      setSelectedTagihan(e.target.value);
                      const found = myTagihan.find((t) => t.id === e.target.value);
                      if (found) setUploadAmount(String(found.jumlah));
                    }}
                    required
                  >
                    <option value="">-- Pilih tagihan --</option>
                    {myTagihan
                      .filter((t) => t.status === 'belum_bayar')
                      .map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.id} — {t.peralatan} — {formatRupiah(t.jumlah)}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="pembayaran-form-group">
                  <label>Upload Bukti Pembayaran</label>
                  <div
                    className={`pembayaran-dropzone${dragOver ? ' drag-over' : ''}`}
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={onDrop}
                    onClick={() => document.getElementById('pembayaran-file-input').click()}
                  >
                    <Upload size={32} color="#a0aec0" />
                    <p>Seret file ke sini atau <strong>klik untuk memilih</strong></p>
                    <p style={{ fontSize: 12, color: '#a0aec0' }}>Format: JPG, PNG, PDF (Maks. 5MB)</p>
                    {uploadFile && <p className="file-name">📎 {uploadFile.name}</p>}
                  </div>
                  <input
                    id="pembayaran-file-input"
                    type="file"
                    accept=".jpg,.jpeg,.png,.pdf"
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      if (e.target.files[0]) setUploadFile(e.target.files[0]);
                    }}
                  />
                </div>

                <div className="pembayaran-form-group">
                  <label>Jumlah Pembayaran</label>
                  <input
                    type="number"
                    placeholder="Masukkan jumlah pembayaran"
                    value={uploadAmount}
                    onChange={(e) => setUploadAmount(e.target.value)}
                    required
                  />
                </div>

                <div className="pembayaran-form-group">
                  <label>Tanggal Pembayaran</label>
                  <input
                    type="date"
                    value={uploadDate}
                    onChange={(e) => setUploadDate(e.target.value)}
                    required
                  />
                </div>

                <div className="pembayaran-form-group">
                  <label>Catatan (Opsional)</label>
                  <textarea
                    placeholder="Tambahkan catatan..."
                    value={uploadNotes}
                    onChange={(e) => setUploadNotes(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  className="pembayaran-btn pembayaran-btn-primary"
                  style={{ width: '100%', justifyContent: 'center', padding: '12px 20px', fontSize: 15 }}
                  disabled={!selectedTagihan || !uploadFile}
                >
                  <Upload size={16} /> Kirim Bukti Pembayaran
                </button>
              </form>
            )}
          </div>
        )}

        {/* ── Tab: Verifikasi Pembayaran (Pengurus) ── */}
        {activeTab === 'verifikasi' && isPengurus && (
          <>
            {myTagihan.filter((t) => t.status === 'menunggu_verifikasi').length === 0 ? (
              <div className="pembayaran-empty">
                <CheckCircle2 size={48} color="#cbd5e0" />
                <p>Tidak ada pembayaran yang menunggu verifikasi</p>
              </div>
            ) : (
              <div className="pembayaran-table-wrap">
                <table className="pembayaran-table">
                  <thead>
                    <tr>
                      <th style={{ width: 150 }}>Petani</th>
                      <th style={{ width: 130 }}>ID Tagihan</th>
                      <th>Peralatan</th>
                      <th style={{ width: 140 }}>Jumlah</th>
                      <th style={{ width: 150 }}>Tanggal Upload</th>
                      <th>File Bukti</th>
                      <th style={{ width: 160 }}>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myTagihan
                      .filter((t) => t.status === 'menunggu_verifikasi')
                      .map((t) => (
                        <tr key={t.id}>
                          <td style={{ fontWeight: 600 }}>{t.petani}</td>
                          <td style={{ fontFamily: 'monospace', color: '#1a365d' }}>{t.id}</td>
                          <td>{t.peralatan}</td>
                          <td style={{ fontWeight: 600 }}>{formatRupiah(t.jumlah)}</td>
                          <td>{formatTanggal(t.tanggalBayar)}</td>
                          <td>{t.buktiPembayaran || '-'}</td>
                          <td>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <button
                                className="pembayaran-btn pembayaran-btn-success"
                                style={{ padding: '6px 12px', fontSize: '12px' }}
                                onClick={() => { setVerifikasiModal(t); setVerifikasiAction('approve'); }}
                              >
                                Setujui
                              </button>
                              <button
                                className="pembayaran-btn pembayaran-btn-danger"
                                style={{ padding: '6px 12px', fontSize: '12px' }}
                                onClick={() => { setVerifikasiModal(t); setVerifikasiAction('reject'); }}
                              >
                                Tolak
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {/* ── Modal Verifikasi ── */}
        <Modal
          open={!!verifikasiModal}
          onClose={() => { setVerifikasiModal(null); setVerifikasiAction(null); }}
          title={verifikasiAction === 'approve' ? 'Setujui Pembayaran' : 'Tolak Pembayaran'}
        >
          {verifikasiModal && (
            <>
              <p>
                {verifikasiAction === 'approve'
                  ? `Anda yakin ingin menyetujui pembayaran ${verifikasiModal.id} dari ${verifikasiModal.petani} sebesar ${formatRupiah(verifikasiModal.jumlah)}?`
                  : `Anda yakin ingin menolak pembayaran ${verifikasiModal.id} dari ${verifikasiModal.petani}? Status akan dikembalikan ke "Belum Bayar".`}
              </p>
              <div className="pembayaran-modal-actions">
                <button
                  className="pembayaran-btn pembayaran-btn-outline"
                  onClick={() => { setVerifikasiModal(null); setVerifikasiAction(null); }}
                >
                  Batal
                </button>
                <button
                  className={`pembayaran-btn ${verifikasiAction === 'approve' ? 'pembayaran-btn-success' : 'pembayaran-btn-danger'}`}
                  onClick={() => handleVerifikasi(verifikasiModal.id, verifikasiAction === 'approve')}
                >
                  {verifikasiAction === 'approve' ? 'Ya, Setujui' : 'Ya, Tolak'}
                </button>
              </div>
            </>
          )}
        </Modal>
          </div>
        </div>
      </div>
    </>
  );
}

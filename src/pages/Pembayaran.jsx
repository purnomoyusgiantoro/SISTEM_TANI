import { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { dataTagihan, dataSewa, formatRupiah, formatTanggal } from '../data/mockData';
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
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600,
      background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`,
    }}>
      {status === 'lunas' && <CheckCircle2 size={13} />}
      {status === 'belum_bayar' && <AlertCircle size={13} />}
      {status === 'menunggu_verifikasi' && <Clock size={13} />}
      {cfg.label}
    </span>
  );
}

function hitungCountdown(jatuhTempo) {
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
  const [tagihan, setTagihan] = useState(dataTagihan);
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
      <style>{`
        .pembayaran-page { font-family: var(--font-sans); color: var(--color-text); }
        .pembayaran-header { display: none; }

        /* summary cards */
        .pembayaran-summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; margin-bottom: 28px; }
        .pembayaran-summary-card { background: #fff; border-radius: 8px; padding: 20px; border: 1px solid var(--color-border); display: flex; align-items: center; gap: 14px; transition: transform .15s; }
        .pembayaran-summary-card:hover { transform: translateY(-2px); }
        .pembayaran-summary-icon { width: 48px; height: 48px; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .pembayaran-summary-info { flex: 1; }
        .pembayaran-summary-label { font-size: 13px; color: #4a5568; margin: 0 0 4px; }
        .pembayaran-summary-value { font-size: 22px; font-weight: 700; color: #1a202c; margin: 0; }

        /* tabs */
        .pembayaran-tabs { display: flex; gap: 4px; background: #f0f4f8; border-radius: 8px; padding: 4px; margin-bottom: 24px; overflow-x: auto; }
        .pembayaran-tab { padding: 10px 20px; border-radius: 8px; border: none; background: transparent; color: #4a5568; font-size: 14px; font-weight: 500; cursor: pointer; white-space: nowrap; transition: all .2s; }
        .pembayaran-tab:hover { color: #1a365d; }
        .pembayaran-tab.active { background: #fff; color: #1a365d; font-weight: 600; border: 1px solid var(--color-border); }

        /* search */
        .pembayaran-search-bar { display: flex; align-items: center; gap: 10px; margin-bottom: 20px; }
        .pembayaran-search { flex: 1; max-width: 400px; display: flex; align-items: center; gap: 8px; background: #fff; border: 1px solid var(--color-border); border-radius: 8px; height: 38px; padding: 0 14px; box-sizing: border-box; }
        .pembayaran-search input { border: none; outline: none; flex: 1; font-size: 14px; color: #1a202c; background: transparent; }
        .pembayaran-search input::placeholder { color: #a0aec0; }

        /* tagihan cards */
        .pembayaran-card-list { display: flex; flex-direction: column; gap: 14px; }
        .pembayaran-card { background: #fff; border-radius: 8px; padding: 20px; border: 1px solid var(--color-border); display: flex; flex-wrap: wrap; align-items: center; gap: 16px; transition: transform .15s; }
        .pembayaran-card:hover { transform: translateY(-1px); }
        .pembayaran-card-main { flex: 1; min-width: 200px; }
        .pembayaran-card-id { font-size: 13px; font-weight: 600; color: #1a365d; margin: 0 0 4px; font-family: monospace; }
        .pembayaran-card-equipment { font-size: 16px; font-weight: 600; color: #1a202c; margin: 0 0 4px; }
        .pembayaran-card-petani { font-size: 13px; color: #4a5568; margin: 0; }
        .pembayaran-card-amount { text-align: right; min-width: 160px; }
        .pembayaran-card-amount-value { font-size: 20px; font-weight: 700; color: #1a365d; margin: 0; }
        .pembayaran-card-due { font-size: 12px; color: #4a5568; margin: 4px 0 0; }
        .pembayaran-card-due.overdue { color: #dc2626; font-weight: 600; }
        .pembayaran-card-actions { display: flex; align-items: center; gap: 10px; }
        .pembayaran-btn { padding: 8px 18px; border-radius: 8px; border: none; font-size: 13px; font-weight: 600; cursor: pointer; transition: all .2s; display: inline-flex; align-items: center; gap: 6px; }
        .pembayaran-btn-primary { background: #1a365d; color: #fff; }
        .pembayaran-btn-primary:hover { background: #2d4a7a; }
        .pembayaran-btn-success { background: #059669; color: #fff; }
        .pembayaran-btn-success:hover { background: #047857; }
        .pembayaran-btn-danger { background: #dc2626; color: #fff; }
        .pembayaran-btn-danger:hover { background: #b91c1c; }
        .pembayaran-btn-outline { background: transparent; border: 1px solid #e2e8f0; color: #4a5568; }
        .pembayaran-btn-outline:hover { border-color: #1a365d; color: #1a365d; }
        .pembayaran-empty { text-align: center; padding: 48px 20px; color: #a0aec0; }
        .pembayaran-empty svg { margin-bottom: 12px; }
        .pembayaran-empty p { margin: 0; font-size: 15px; }

        /* table */
        .pembayaran-table-wrap { overflow-x: auto; background: #fff; border-radius: 8px; border: 1px solid var(--color-border); }
        .pembayaran-table { width: 100%; border-collapse: collapse; font-size: 14px; }
        .pembayaran-table th { text-align: left; padding: 14px 16px; background: #f0f4f8; color: #4a5568; font-weight: 600; font-size: 12px; text-transform: uppercase; letter-spacing: .5px; border-bottom: 1px solid var(--color-border); white-space: nowrap; }
        .pembayaran-table td { padding: 14px 16px; border-bottom: 1px solid var(--color-border-light); color: #1a202c; }
        .pembayaran-table tr:last-child td { border-bottom: none; }
        .pembayaran-table tr:hover td { background: #f7fafc; }

        /* upload form */
        .pembayaran-form { background: #fff; border-radius: 8px; padding: 28px; border: 1px solid var(--color-border); max-width: 600px; }
        .pembayaran-form-group { margin-bottom: 20px; }
        .pembayaran-form-group label { display: block; font-size: 14px; font-weight: 600; color: #1a202c; margin-bottom: 6px; }
        .pembayaran-form-group select,
        .pembayaran-form-group input[type="text"],
        .pembayaran-form-group input[type="number"],
        .pembayaran-form-group input[type="date"],
        .pembayaran-form-group textarea { width: 100%; padding: 10px 14px; border: 1px solid var(--color-border); border-radius: 6px; font-size: 14px; color: #1a202c; background: #fff; box-sizing: border-box; transition: border .2s; }
        .pembayaran-form-group select:focus,
        .pembayaran-form-group input:focus,
        .pembayaran-form-group textarea:focus { outline: none; border-color: var(--color-text-muted); }
        .pembayaran-form-group textarea { min-height: 80px; resize: vertical; }

        .pembayaran-dropzone { border: 2px dashed var(--color-border); border-radius: 8px; padding: 32px; text-align: center; cursor: pointer; transition: all .2s; background: #f7fafc; }
        .pembayaran-dropzone:hover, .pembayaran-dropzone.drag-over { border-color: var(--color-text-muted); background: #f8fafc; }
        .pembayaran-dropzone p { margin: 8px 0 0; font-size: 14px; color: #4a5568; }
        .pembayaran-dropzone .file-name { margin-top: 10px; font-size: 13px; font-weight: 600; color: #059669; }

        .pembayaran-success-msg { background: #dcfce7; border: 1px solid #86efac; border-radius: 8px; padding: 20px; text-align: center; color: #166534; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 10px; animation: pembayaran-fadein .3s ease; }

        /* verifikasi list */
        .pembayaran-verif-card { background: #fff; border-radius: 8px; padding: 20px; border: 1px solid var(--color-border); margin-bottom: 14px; display: flex; flex-wrap: wrap; align-items: center; gap: 16px; }
        .pembayaran-verif-info { flex: 1; min-width: 200px; }
        .pembayaran-verif-info h4 { margin: 0 0 4px; font-size: 15px; color: #1a202c; }
        .pembayaran-verif-info p { margin: 0; font-size: 13px; color: #4a5568; }

        /* modal */
        .pembayaran-modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,.45); display: flex; align-items: center; justify-content: center; z-index: 1000; animation: pembayaran-fadein .2s ease; }
        .pembayaran-modal { background: #fff; border-radius: 8px; width: 90%; max-width: 440px; border: 1px solid var(--color-border); animation: pembayaran-slideup .25s ease; }
        .pembayaran-modal-header { display: flex; align-items: center; justify-content: space-between; padding: 18px 24px; border-bottom: 1px solid #e2e8f0; }
        .pembayaran-modal-header h3 { margin: 0; font-size: 17px; color: #1a202c; }
        .pembayaran-modal-close { background: none; border: none; cursor: pointer; color: #a0aec0; padding: 4px; border-radius: 6px; }
        .pembayaran-modal-close:hover { color: #1a202c; background: #f0f4f8; }
        .pembayaran-modal-body { padding: 24px; }
        .pembayaran-modal-body p { margin: 0 0 20px; font-size: 14px; color: #4a5568; line-height: 1.6; }
        .pembayaran-modal-actions { display: flex; gap: 10px; justify-content: flex-end; }

        @keyframes pembayaran-fadein { from { opacity: 0; } to { opacity: 1; } }
        @keyframes pembayaran-slideup { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

        @media (max-width: 640px) {
          .pembayaran-page { padding: 16px; }
          .pembayaran-summary { grid-template-columns: 1fr 1fr; }
          .pembayaran-card { flex-direction: column; align-items: stretch; }
          .pembayaran-card-amount { text-align: left; }
          .pembayaran-tabs { gap: 2px; }
          .pembayaran-tab { padding: 8px 14px; font-size: 13px; }
        }
      `}</style>

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
            {/* Summary Cards */}
        <div className="pembayaran-summary">
          {isPetani ? (
            <>
              <div className="pembayaran-summary-card">
                <div className="pembayaran-summary-icon" style={{ background: '#ebf4ff' }}>
                  <DollarSign size={24} color="#1a365d" />
                </div>
                <div className="pembayaran-summary-info">
                  <p className="pembayaran-summary-label">Total Tagihan</p>
                  <p className="pembayaran-summary-value">{formatRupiah(totalTagihan)}</p>
                </div>
              </div>
              <div className="pembayaran-summary-card">
                <div className="pembayaran-summary-icon" style={{ background: '#fee2e2' }}>
                  <AlertCircle size={24} color="#dc2626" />
                </div>
                <div className="pembayaran-summary-info">
                  <p className="pembayaran-summary-label">Belum Bayar</p>
                  <p className="pembayaran-summary-value" style={{ color: '#dc2626' }}>{formatRupiah(belumBayar)}</p>
                </div>
              </div>
              <div className="pembayaran-summary-card">
                <div className="pembayaran-summary-icon" style={{ background: '#fef9c3' }}>
                  <Clock size={24} color="#d97706" />
                </div>
                <div className="pembayaran-summary-info">
                  <p className="pembayaran-summary-label">Menunggu Verifikasi</p>
                  <p className="pembayaran-summary-value" style={{ color: '#d97706' }}>{formatRupiah(menungguVerifikasi)}</p>
                </div>
              </div>
              <div className="pembayaran-summary-card">
                <div className="pembayaran-summary-icon" style={{ background: '#dcfce7' }}>
                  <CheckCircle2 size={24} color="#059669" />
                </div>
                <div className="pembayaran-summary-info">
                  <p className="pembayaran-summary-label">Lunas</p>
                  <p className="pembayaran-summary-value" style={{ color: '#059669' }}>{formatRupiah(lunas)}</p>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="pembayaran-summary-card">
                <div className="pembayaran-summary-icon" style={{ background: '#ebf4ff' }}>
                  <TrendingUp size={24} color="#1a365d" />
                </div>
                <div className="pembayaran-summary-info">
                  <p className="pembayaran-summary-label">Total Pendapatan</p>
                  <p className="pembayaran-summary-value">{formatRupiah(lunas)}</p>
                </div>
              </div>
              <div className="pembayaran-summary-card">
                <div className="pembayaran-summary-icon" style={{ background: '#dcfce7' }}>
                  <DollarSign size={24} color="#059669" />
                </div>
                <div className="pembayaran-summary-info">
                  <p className="pembayaran-summary-label">Pembayaran Masuk Hari Ini</p>
                  <p className="pembayaran-summary-value" style={{ color: '#059669' }}>{formatRupiah(pembayaranMasukHariIni)}</p>
                </div>
              </div>
              <div className="pembayaran-summary-card">
                <div className="pembayaran-summary-icon" style={{ background: '#fef9c3' }}>
                  <Clock size={24} color="#d97706" />
                </div>
                <div className="pembayaran-summary-info">
                  <p className="pembayaran-summary-label">Menunggu Verifikasi</p>
                  <p className="pembayaran-summary-value" style={{ color: '#d97706' }}>{formatRupiah(menungguVerifikasi)}</p>
                </div>
              </div>
              <div className="pembayaran-summary-card">
                <div className="pembayaran-summary-icon" style={{ background: '#fee2e2' }}>
                  <BadgeAlert size={24} color="#dc2626" />
                </div>
                <div className="pembayaran-summary-info">
                  <p className="pembayaran-summary-label">Tagihan Tertunggak</p>
                  <p className="pembayaran-summary-value" style={{ color: '#dc2626' }}>{formatRupiah(tagihanTertunggak)}</p>
                </div>
              </div>
            </>
          )}
        </div>

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

            <div className="pembayaran-card-list">
              {filtered.length === 0 ? (
                <div className="pembayaran-empty">
                  <FileText size={48} color="#cbd5e0" />
                  <p>Tidak ada tagihan ditemukan</p>
                </div>
              ) : (
                filtered.map((t) => {
                  const cd = hitungCountdown(t.jatuhTempo);
                  return (
                    <div key={t.id} className="pembayaran-card">
                      <div className="pembayaran-card-main">
                        <p className="pembayaran-card-id">{t.id}</p>
                        <p className="pembayaran-card-equipment">{t.peralatan}</p>
                        {!isPetani && <p className="pembayaran-card-petani">Petani: {t.petani}</p>}
                      </div>
                      <div className="pembayaran-card-amount">
                        <p className="pembayaran-card-amount-value">{formatRupiah(t.jumlah)}</p>
                        <p className={`pembayaran-card-due${cd.overdue ? ' overdue' : ''}`}>
                          <CalendarDays size={12} style={{ verticalAlign: -2, marginRight: 4 }} />
                          Jatuh tempo: {formatTanggal(t.jatuhTempo)} — {cd.text}
                        </p>
                      </div>
                      <div className="pembayaran-card-actions">
                        <StatusBadge status={t.status} />
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
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </>
        )}

        {/* ── Tab: Riwayat Pembayaran ── */}
        {activeTab === 'riwayat' && (
          <div className="pembayaran-table-wrap">
            <table className="pembayaran-table">
              <thead>
                <tr>
                  <th>ID Tagihan</th>
                  <th>Peralatan</th>
                  {!isPetani && <th>Petani</th>}
                  <th>Jumlah</th>
                  <th>Tgl Tagihan</th>
                  <th>Jatuh Tempo</th>
                  <th>Tgl Bayar</th>
                  <th>Status</th>
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
              myTagihan
                .filter((t) => t.status === 'menunggu_verifikasi')
                .map((t) => (
                  <div key={t.id} className="pembayaran-verif-card">
                    <div className="pembayaran-verif-info">
                      <h4>{t.petani} — {t.id}</h4>
                      <p>Peralatan: {t.peralatan}</p>
                      <p>Jumlah: <strong>{formatRupiah(t.jumlah)}</strong></p>
                      <p>Tanggal Upload: {formatTanggal(t.tanggalBayar)}</p>
                      <p>File: 📎 {t.buktiPembayaran || '-'}</p>
                    </div>
                    <div className="pembayaran-card-actions">
                      <button
                        className="pembayaran-btn pembayaran-btn-success"
                        onClick={() => { setVerifikasiModal(t); setVerifikasiAction('approve'); }}
                      >
                        <Check size={14} /> Setujui
                      </button>
                      <button
                        className="pembayaran-btn pembayaran-btn-danger"
                        onClick={() => { setVerifikasiModal(t); setVerifikasiAction('reject'); }}
                      >
                        <X size={14} /> Tolak
                      </button>
                    </div>
                  </div>
                ))
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

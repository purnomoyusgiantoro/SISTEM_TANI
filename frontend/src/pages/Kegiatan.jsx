import { useState, useMemo, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import kegiatanApi from '../api/kegiatan';
import lahanApi from '../api/lahan';
import masterApi from '../api/master';
import { useApi, useMutation } from '../hooks/useApi';
import { formatTanggal } from '../utils/formatters';
import '../styles/pages/Kegiatan.css';

import {
  Plus, Search, Filter, X, Calendar, ChevronLeft, ChevronRight,
  Camera, FileText, Clock, Sprout, Droplet, Wind, Wheat, Hammer, Wrench, MapPin
} from 'lucide-react';

const JENIS_KEGIATAN = [
  { value: 'tanam', label: 'Penanaman', icon: 'tanam', color: '#10b981' },
  { value: 'pemupukan', label: 'Pemupukan', icon: 'pupuk', color: '#8b5cf6' },
  { value: 'penyemprotan', label: 'Penyemprotan', icon: 'semprot', color: '#f59e0b' },
  { value: 'panen', label: 'Panen', icon: 'panen', color: '#ef4444' },
  { value: 'pengolahan', label: 'Pengolahan Tanah', icon: 'olah', color: '#6366f1' },
  { value: 'irigasi', label: 'Irigasi', icon: 'irigasi', color: '#0ea5e9' },
  { value: 'perawatan', label: 'Perawatan', icon: 'rawat', color: '#14b8a6' },
];

/* ── helpers ── */
function getJenisConfig(value) {
  return JENIS_KEGIATAN.find((j) => j.value === value) || { label: value, icon: 'kegiatan', color: '#6b7280' };
}

function renderKegiatanIcon(code, size = 18) {
  switch (code) {
    case 'tanam':
      return <Sprout size={size} />;
    case 'pupuk':
      return <Droplet size={size} style={{ transform: 'rotate(180deg)' }} />;
    case 'semprot':
      return <Wind size={size} />;
    case 'panen':
      return <Wheat size={size} />;
    case 'olah':
      return <Hammer size={size} />;
    case 'irigasi':
      return <Droplet size={size} />;
    case 'rawat':
      return <Wrench size={size} />;
    default:
      return <FileText size={size} />;
  }
}

function groupByDate(items) {
  const groups = {};
  items.forEach((item) => {
    if (!groups[item.tanggal]) groups[item.tanggal] = [];
    groups[item.tanggal].push(item);
  });
  return Object.entries(groups)
    .sort(([a], [b]) => new Date(b) - new Date(a));
}

/* ── Modal ── */
function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div className="kegiatan-modal-overlay" onClick={onClose}>
      <div className="kegiatan-modal" onClick={(e) => e.stopPropagation()}>
        <div className="kegiatan-modal-header">
          <h3>{title}</h3>
          <button className="kegiatan-modal-close" onClick={onClose}><X size={20} /></button>
        </div>
        <div className="kegiatan-modal-body">{children}</div>
      </div>
    </div>
  );
}

/* ── Simple Calendar ── */
function MiniCalendar({ activityDates }) {
  const [viewDate, setViewDate] = useState(new Date());
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
  ];
  const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

  const activitySet = new Set(activityDates);

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1));

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div className="kegiatan-calendar">
      <div className="kegiatan-calendar-header">
        <button onClick={prevMonth} className="kegiatan-calendar-nav"><ChevronLeft size={18} /></button>
        <span className="kegiatan-calendar-title">{monthNames[month]} {year}</span>
        <button onClick={nextMonth} className="kegiatan-calendar-nav"><ChevronRight size={18} /></button>
      </div>
      <div className="kegiatan-calendar-grid">
        {dayNames.map((d) => (
          <div key={d} className="kegiatan-calendar-day-name">{d}</div>
        ))}
        {cells.map((day, i) => {
          if (day === null) return <div key={`e-${i}`} className="kegiatan-calendar-cell empty" />;
          const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const isToday = today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;
          const hasActivity = activitySet.has(dateStr);
          return (
            <div
              key={day}
              className={`kegiatan-calendar-cell${isToday ? ' today' : ''}${hasActivity ? ' has-activity' : ''}`}
            >
              {day}
              {hasActivity && <span className="kegiatan-calendar-dot" />}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ══════════════ MAIN COMPONENT ══════════════ */
export default function Kegiatan() {
  const { currentUser, hasPermission } = useAuth();
  const role = currentUser?.role || 'petani';
  const canAdd = role === 'petani' || role === 'pengurus';

  const toast = useToast();
  const [activeTab, setActiveTab] = useState('kegiatan');

  // API hooks
  const { data: kegiatanData, loading: loadingKegiatan, execute: fetchKegiatan } = useApi(kegiatanApi.getAll);
  const { data: lahanData, execute: fetchLahan } = useApi(lahanApi.getAll);
  const { mutate: createKegiatan, loading: creatingKegiatan } = useMutation(kegiatanApi.create);

  useEffect(() => {
    fetchKegiatan().catch(() => {});
    fetchLahan().catch(() => {});
  }, [fetchKegiatan, fetchLahan]);

  const kegiatan = Array.isArray(kegiatanData) ? kegiatanData : [];

  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterJenis, setFilterJenis] = useState('');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');

  /* form state */
  const [formTanggal, setFormTanggal] = useState('');
  const [formJenis, setFormJenis] = useState('');
  const [formLahan, setFormLahan] = useState('');
  const [formDeskripsi, setFormDeskripsi] = useState('');
  const [formFoto, setFormFoto] = useState(null);

  /* ── filter ── */
  const filtered = useMemo(() => {
    let list = [...kegiatan];
    if (role === 'petani') list = list.filter((k) => k.petaniId === currentUser?.id);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (k) => k.deskripsi.toLowerCase().includes(q) || k.petani.toLowerCase().includes(q) || k.lokasi.toLowerCase().includes(q)
      );
    }
    if (filterJenis) list = list.filter((k) => k.jenis === filterJenis);
    if (filterDateFrom) list = list.filter((k) => k.tanggal >= filterDateFrom);
    if (filterDateTo) list = list.filter((k) => k.tanggal <= filterDateTo);
    return list.sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));
  }, [kegiatan, searchQuery, filterJenis, filterDateFrom, filterDateTo, role, currentUser]);

  const grouped = groupByDate(filtered);
  const activityDates = filtered.map((k) => k.tanggal);

  /* userLahan */
  const userLahan = useMemo(() => {
    const lahanList = Array.isArray(lahanData) ? lahanData : [];
    if (role === 'petani') return lahanList.filter((l) => l.pemilik_id === currentUser?.id || l.pemilikId === currentUser?.id);
    return lahanList;
  }, [role, currentUser, lahanData]);

  /* ── submit ── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('lahan_id', formLahan);
      formData.append('jenis', formJenis);
      formData.append('deskripsi', formDeskripsi);
      formData.append('tanggal', formTanggal);
      if (formFoto) formData.append('foto_file', formFoto);

      await createKegiatan(formData);
      toast.success('Kegiatan berhasil ditambahkan');
      fetchKegiatan();
      
      setShowModal(false);
      setFormTanggal('');
      setFormJenis('');
      setFormLahan('');
      setFormDeskripsi('');
      setFormFoto(null);
    } catch (err) {
      toast.error(err.message || 'Gagal menambahkan kegiatan');
    }
  };

  /* ══════════════ RENDER ══════════════ */
  return (
    <>
      

      <div className="admin-card animate-fade-in-up">
        {/* Header Row Inside Card */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid #dee2e6' }}>
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#333', margin: 0 }}>Riwayat Kegiatan Petani</h1>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', marginTop: '2px', margin: 0 }}>Catatan aktivitas pertanian harian</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {canAdd && (
              <button 
                onClick={() => setShowModal(true)}
                className="filter-btn filter-btn-primary"
              >
                <Plus size={16} /> Tambah Kegiatan
              </button>
            )}
            <nav style={{ marginBottom: 0, fontSize: '0.85rem', display: 'flex', alignItems: 'center', color: 'var(--color-primary)' }}>
              <span style={{ margin: '0 8px' }}>/</span>
              <span style={{ fontWeight: '500' }}>kegiatan</span>
            </nav>
          </div>
        </div>

        <div style={{ padding: '20px' }}>
          {/* Filters */}
          <div className="filter-row" style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
            <div style={{ fontWeight: '700', fontSize: '0.9rem', color: '#333' }}>Filter</div>
            
            <div style={{ flex: 1, minWidth: '200px', display: 'flex', alignItems: 'center', background: 'white', border: '1px solid #ced4da', borderRadius: '8px', padding: '0 12px', height: '38px', boxSizing: 'border-box' }}>
              <Search size={16} color="#a0aec0" />
              <input 
                type="text" 
                placeholder="Cari kegiatan..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ padding: '8px 8px', border: 'none', outline: 'none', width: '100%', fontSize: '0.9rem', background: 'transparent' }}
              />
            </div>

            <div>
              <input
                type="date"
                value={filterDateFrom}
                onChange={(e) => setFilterDateFrom(e.target.value)}
                className="filter-input"
                title="Dari tanggal"
              />
            </div>
            <span style={{ color: '#a0aec0' }}>-</span>
            <div>
              <input
                type="date"
                value={filterDateTo}
                onChange={(e) => setFilterDateTo(e.target.value)}
                className="filter-input"
                title="Sampai tanggal"
              />
            </div>

            <div style={{ width: '180px' }}>
              <select 
                value={filterJenis} 
                onChange={(e) => setFilterJenis(e.target.value)}
                className="filter-select"
                style={{ width: '100%' }}
              >
                <option value="">Semua Jenis</option>
                {JENIS_KEGIATAN.map((j) => (
                  <option key={j.value} value={j.value}>{j.label}</option>
                ))}
              </select>
            </div>
          </div>

        <div>
          <div>
            {filtered.length === 0 ? (
              <div className="kegiatan-empty">
                <Calendar size={48} color="#cbd5e0" />
                <p>Tidak ada kegiatan ditemukan</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                {filtered.map((item) => {
                  const cfg = getJenisConfig(item.jenis);
                  return (
                    <div
                      key={item.id}
                      style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '16px', background: 'white', border: '1px solid var(--color-border-light)', borderRadius: '12px', borderTop: `4px solid ${cfg.color}`, boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}
                    >
                      {/* Card Header: Title */}
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                        <div style={{ flex: 1 }}>
                          <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700', background: `${cfg.color}15`, color: cfg.color, display: 'inline-block', marginBottom: '6px' }}>
                            {cfg.label}
                          </span>
                          {role !== 'petani' && (
                            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                              oleh <strong style={{ color: 'var(--color-text)' }}>{item.petani}</strong>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Card Body: Description */}
                      <div style={{ flex: 1 }}>
                        <p style={{ margin: '8px 0', fontSize: '0.9rem', color: 'var(--color-text)', lineHeight: '1.5' }}>
                          {item.deskripsi}
                        </p>
                      </div>

                      {/* Card Footer: Meta Info */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingTop: '12px', borderTop: '1px solid var(--color-border-light)', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <MapPin size={14} color="var(--color-primary)" /> {item.lokasi}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Clock size={14} color="var(--color-primary)" /> {formatTanggal(item.tanggal)}
                        </div>
                        
                        {item.foto ? (
                          <div style={{ marginTop: '4px', display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px', background: '#f8fafc', border: '1px solid var(--color-border-light)', borderRadius: '6px', fontSize: '0.75rem', color: 'var(--color-primary-dark)', fontWeight: '600', alignSelf: 'flex-start' }}>
                            <Camera size={14} /> {item.foto}
                          </div>
                        ) : (
                          <div style={{ marginTop: '4px', display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px', background: '#f8fafc', border: '1px dashed var(--color-border)', borderRadius: '6px', fontSize: '0.75rem', color: 'var(--color-text-muted)', alignSelf: 'flex-start' }}>
                            <Camera size={14} /> Tanpa Foto
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

        {/* ── Modal: Tambah Kegiatan ── */}
        <Modal open={showModal} onClose={() => setShowModal(false)} title="Tambah Kegiatan Baru">
          <form onSubmit={handleSubmit}>
            <div className="kegiatan-form-group">
              <label>Tanggal</label>
              <input
                type="date"
                value={formTanggal}
                onChange={(e) => setFormTanggal(e.target.value)}
                required
              />
            </div>

            <div className="kegiatan-form-group">
              <label>Jenis Kegiatan</label>
              <select value={formJenis} onChange={(e) => setFormJenis(e.target.value)} required>
                <option value="">-- Pilih jenis kegiatan --</option>
                {JENIS_KEGIATAN.map((j) => (
                  <option key={j.value} value={j.value}>{j.label}</option>
                ))}
              </select>
            </div>

            <div className="kegiatan-form-group">
              <label>Lahan</label>
              <select value={formLahan} onChange={(e) => setFormLahan(e.target.value)} required>
                <option value="">-- Pilih lahan --</option>
                {userLahan.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.lokasi} ({l.luas} Ha — {l.jenisLahan})
                  </option>
                ))}
              </select>
            </div>

            <div className="kegiatan-form-group">
              <label>Deskripsi</label>
              <textarea
                placeholder="Jelaskan kegiatan yang dilakukan..."
                value={formDeskripsi}
                onChange={(e) => setFormDeskripsi(e.target.value)}
                required
              />
            </div>

            <div className="kegiatan-form-group">
              <label>Foto (Opsional)</label>
              <div
                className="kegiatan-form-dropzone"
                onClick={() => document.getElementById('kegiatan-foto-input').click()}
              >
                <Camera size={28} color="#a0aec0" />
                <p>Klik untuk memilih foto</p>
                <p style={{ fontSize: 11, color: '#a0aec0' }}>JPG, PNG (Maks. 5MB)</p>
                {formFoto && <p className="file-name"> {formFoto.name}</p>}
              </div>
              <input
                id="kegiatan-foto-input"
                type="file"
                accept=".jpg,.jpeg,.png"
                style={{ display: 'none' }}
                onChange={(e) => { if (e.target.files[0]) setFormFoto(e.target.files[0]); }}
              />
            </div>

            <div className="kegiatan-form-actions">
              <button
                type="button"
                className="kegiatan-btn kegiatan-btn-outline"
                onClick={() => setShowModal(false)}
              >
                Batal
              </button>
              <button type="submit" className="kegiatan-btn kegiatan-btn-primary">
                <Plus size={14} /> Simpan Kegiatan
              </button>
            </div>
          </form>
        </Modal>
        </div>
      </div>
    </>
  );
}

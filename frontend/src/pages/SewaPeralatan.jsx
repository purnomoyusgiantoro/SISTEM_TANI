import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import peralatanApi from '../api/peralatan';
import sewaApi from '../api/sewa';
import masterApi from '../api/master';
import { useApi, useMutation } from '../hooks/useApi';
import { formatRupiah, formatTanggal } from '../utils/formatters';
import * as Mock from '../data/mockData';
import StatusBadge from '../components/shared/StatusBadge';
import Modal from '../components/shared/Modal';
import { Info, Plus, Calendar, ShieldCheck, HelpCircle, Sprout, Wrench, Wind, Droplet, Hammer, Cpu } from 'lucide-react';

export default function SewaPeralatan() {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('katalog');
  const [peralatanList, setPeralatanList] = useState(Mock.peralatan);
  const [sewaList, setSewaList] = useState(Mock.dataSewa);

  const renderAlatIcon = (code) => {
    const style = { width: '40px', height: '40px' };
    switch (code) {
      case 'tractor':
      case 'hand-tractor':
        return <Sprout style={{ ...style, color: 'var(--color-secondary)' }} />;
      case 'sprayer':
        return <Wind style={{ ...style, color: 'var(--color-primary-light)' }} />;
      case 'thresher':
        return <Wrench style={{ ...style, color: 'var(--color-accent)' }} />;
      case 'pump':
        return <Droplet style={{ ...style, color: 'var(--color-info)' }} />;
      case 'cultivator':
        return <Hammer style={{ ...style, color: 'var(--color-primary)' }} />;
      case 'cutter':
        return <Wrench style={{ ...style, color: 'var(--color-danger)' }} />;
      case 'drone':
        return <Cpu style={{ ...style, color: 'var(--color-primary-dark)' }} />;
      default:
        return <Wrench style={{ ...style, color: 'var(--color-text-muted)' }} />;
    }
  };

  // Filter States
  const [selectedKategori, setSelectedKategori] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [selectedAlat, setSelectedAlat] = useState(null);
  const [showRentModal, setShowRentModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(null);

  // Form State
  const [tanggalMulai, setTanggalMulai] = useState('');
  const [tanggalSelesai, setTanggalSelesai] = useState('');
  const [catatan, setCatatan] = useState('');

  // Add Item State (Pengurus)
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemKategori, setNewItemKategori] = useState(Mock.kategoriPeralatan[0]);
  const [newItemHarga, setNewItemHarga] = useState('');
  const [newItemStok, setNewItemStok] = useState('');
  const [newItemDeskripsi, setNewItemDeskripsi] = useState('');

  // Calculate rental costs
  const calculateDuration = () => {
    if (!tanggalMulai || !tanggalSelesai) return 0;
    const start = new Date(tanggalMulai);
    const end = new Date(tanggalSelesai);
    const diff = end - start;
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

  const duration = calculateDuration();
  const totalBiaya = selectedAlat ? duration * selectedAlat.hargaPerHari : 0;

  // Filtered Equipment Catalog
  const filteredKatalog = peralatanList.filter((alat) => {
    const matchKategori = selectedKategori === 'Semua' || alat.kategori === selectedKategori;
    const matchSearch = searchQuery === '' || alat.nama.toLowerCase().includes(searchQuery.toLowerCase());
    return matchKategori && matchSearch;
  });

  // Filtered Rental History
  const filteredSewa = sewaList.filter((sewa) => {
    if (currentUser.role === 'petani') {
      return sewa.petaniId === currentUser.id;
    }
    return true; // Pengurus sees all
  });

  // Handle Rental Request Submit
  const handleRentSubmit = (e) => {
    e.preventDefault();
    if (duration <= 0) {
      alert('Tanggal selesai harus setelah tanggal mulai!');
      return;
    }

    const newSewa = {
      id: `SW-2026-${String(sewaList.length + 1).padStart(3, '0')}`,
      petaniId: currentUser.id,
      petani: currentUser.nama,
      peralatanId: selectedAlat.id,
      peralatan: selectedAlat.nama,
      tanggalMulai,
      tanggalSelesai,
      durasi: duration,
      totalBiaya,
      status: 'menunggu',
      validasi: 'pending',
      validasiOleh: null
    };

    // Update state
    setSewaList([newSewa, ...sewaList]);
    
    // Decrement available equipment count
    setPeralatanList(prev => prev.map(p => {
      if (p.id === selectedAlat.id) {
        return { ...p, tersedia: Math.max(0, p.tersedia - 1) };
      }
      return p;
    }));

    // Reset Form
    setShowRentModal(false);
    setTanggalMulai('');
    setTanggalSelesai('');
    setCatatan('');
    setActiveTab('riwayat');
  };

  // Handle Approve/Reject Rental (Pengurus)
  const handleValidation = (sewaId, approved) => {
    setSewaList(prev => prev.map(s => {
      if (s.id === sewaId) {
        return { 
          ...s, 
          validasi: approved ? 'disetujui' : 'ditolak',
          status: approved ? 'aktif' : 'selesai',
          validasiOleh: currentUser.nama 
        };
      }
      return s;
    }));
  };

  // Add Equipment Submit (Pengurus)
  const handleAddEquipment = (e) => {
    e.preventDefault();
    const newAlat = {
      id: peralatanList.length + 1,
      nama: newItemName,
      kategori: newItemKategori,
      deskripsi: newItemDeskripsi,
      hargaPerHari: Number(newItemHarga),
      stok: Number(newItemStok),
      tersedia: Number(newItemStok),
      gambar: '⚙️',
      kondisi: 'Baik'
    };

    setPeralatanList([...peralatanList, newAlat]);
    setShowAddModal(false);
    
    // Reset Form
    setNewItemName('');
    setNewItemHarga('');
    setNewItemStok('');
    setNewItemDeskripsi('');
  };

  return (
    <div style={{ animation: 'fadeIn 0.3s ease' }}>
      <style>{`
        .sewa-tabs {
          display: flex;
          border-bottom: 2px solid var(--color-border);
          margin-bottom: 24px;
        }
        .sewa-tab-btn {
          padding: 10px 20px;
          font-weight: 600;
          color: var(--color-text-secondary);
          border-bottom: 2px solid transparent;
          margin-bottom: -2px;
          cursor: pointer;
        }
        .sewa-tab-btn.active {
          color: var(--color-primary);
          border-bottom-color: var(--color-primary);
        }
        .alat-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 20px;
        }
        .alat-card {
          background: white;
          border: 1px solid var(--color-border);
          border-radius: 12px;
          overflow: hidden;
          box-shadow: var(--shadow-sm);
          transition: all 0.2s;
        }
        .alat-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-md);
        }
        .alat-card-image {
          height: 140px;
          background: #f7fafc;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 3.5rem;
          border-bottom: 1px solid var(--color-border);
        }
        .alat-card-body {
          padding: 16px;
        }
        .filters-row {
          display: flex;
          gap: 12px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }
        .filter-select, .filter-input {
          padding: 8px 12px;
          font-size: 0.9rem;
          border: 1px solid var(--color-border);
          border-radius: 6px;
        }
      `}</style>
      {/* Main Admin Card */}
      <div className="admin-card">
        
        {/* Header Row Inside Card */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid #dee2e6' }}>
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#333', margin: 0 }}>Sewa Peralatan Pertanian</h1>
          </div>
          <nav style={{ marginBottom: 0, fontSize: '0.85rem', display: 'flex', alignItems: 'center', color: 'var(--color-primary)' }}>
            <span style={{ margin: '0 8px' }}>/</span>
            <span style={{ fontWeight: '500' }}>sewaperalatan</span>
          </nav>
        </div>
        
        <div style={{ padding: '20px' }}>

      {/* Tab Navigation */}
      <div className="sewa-tabs">
        <button 
          className={`sewa-tab-btn ${activeTab === 'katalog' ? 'active' : ''}`}
          onClick={() => setActiveTab('katalog')}
        >
          Katalog Alat
        </button>
        <button 
          className={`sewa-tab-btn ${activeTab === 'riwayat' ? 'active' : ''}`}
          onClick={() => setActiveTab('riwayat')}
        >
          {currentUser.role === 'pengurus' ? 'Validasi & Riwayat Sewa' : 'Riwayat Sewa Saya'}
        </button>
      </div>

      {/* Tab Content 1: Catalog */}
      {activeTab === 'katalog' && (
        <div>
          {/* Horizontal Filter Bar */}
          <div className="filter-row">
            <div style={{ fontWeight: '700', fontSize: '0.9rem', color: '#333' }}>Filter</div>
            
            <div style={{ width: '200px' }}>
              <select 
                value={selectedKategori} 
                onChange={(e) => setSelectedKategori(e.target.value)}
                className="filter-select"
                style={{ width: '100%' }}
              >
                {Mock.kategoriPeralatan.map(kat => (
                  <option key={kat} value={kat}>{kat}</option>
                ))}
              </select>
            </div>

            <div style={{ flex: 1 }}>
              <input 
                type="text" 
                placeholder="Keyword search" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="filter-input"
                style={{ width: '100%' }}
              />
            </div>

            <button 
              className="filter-btn" 
            >
              <Wind size={16} />
            </button>

            {currentUser.role === 'pengurus' && (
              <button 
                onClick={() => setShowAddModal(true)}
                className="filter-btn filter-btn-primary"
              >
                <Plus size={16} /> Tambah Peralatan
              </button>
            )}
          </div>

          {/* Grid list of tools */}
          <div className="alat-grid">
            {filteredKatalog.map((alat) => (
              <div key={alat.id} className="alat-card">
                <div className="alat-card-image">
                  {renderAlatIcon(alat.gambar)}
                </div>
                <div className="alat-card-body">
                  <span style={{ fontSize: '0.7rem', padding: '2px 8px', background: 'var(--color-primary-50)', color: 'var(--color-primary)', borderRadius: '12px', fontWeight: '600' }}>
                    {alat.kategori}
                  </span>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: '700', marginTop: '6px', marginBottom: '8px' }}>{alat.nama}</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', height: '40px', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: '12px' }}>{alat.deskripsi}</p>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--color-border-light)', paddingTop: '12px', marginBottom: '16px' }}>
                    <div>
                      <small style={{ color: 'var(--color-text-muted)', display: 'block' }}>Harga per hari</small>
                      <span style={{ fontWeight: '700', color: 'var(--color-primary)', fontSize: '1.05rem' }}>{formatRupiah(alat.hargaPerHari)}</span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <small style={{ color: 'var(--color-text-muted)', display: 'block' }}>Ketersediaan</small>
                      <span style={{ fontSize: '0.8rem', fontWeight: '600', color: alat.tersedia > 0 ? 'var(--color-success)' : 'var(--color-danger)' }}>
                        {alat.tersedia} dari {alat.stok} unit
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button 
                      onClick={() => setShowDetailModal(alat)}
                      style={{ flex: 1, padding: '8px', border: '1px solid var(--color-border)', borderRadius: '6px', fontSize: '0.85rem', fontWeight: '600', color: 'var(--color-text-secondary)' }}
                    >
                      Detail
                    </button>
                    {currentUser.role === 'petani' && (
                      <button 
                        disabled={alat.tersedia === 0}
                        onClick={() => { setSelectedAlat(alat); setShowRentModal(true); }}
                        style={{ 
                          flex: 2, 
                          padding: '8px', 
                          background: alat.tersedia > 0 ? 'var(--color-primary)' : '#cbd5e0', 
                          color: 'white', 
                          borderRadius: '6px', 
                          fontSize: '0.85rem', 
                          fontWeight: '600',
                          cursor: alat.tersedia > 0 ? 'pointer' : 'not-allowed'
                        }}
                      >
                        {alat.tersedia > 0 ? 'Ajukan Sewa' : 'Habis disewa'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab Content 2: Rental History */}
      {activeTab === 'riwayat' && (
        <div style={{ overflowX: 'auto' }}>
          
          {/* Export and Search removed to match new reference image style */}
          
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px', border: '1px solid #dee2e6', tableLayout: 'fixed' }}>
            <thead>
              <tr style={{ background: '#f8f9fa', borderBottom: '2px solid #dee2e6', fontSize: '0.85rem', color: '#333', fontWeight: 'bold' }}>
                <th style={{ padding: '12px' }}>ID Sewa</th>
                {currentUser.role === 'pengurus' && <th style={{ padding: '12px' }}>Penyewa (Petani)</th>}
                <th style={{ padding: '12px' }}>Peralatan</th>
                <th style={{ padding: '12px' }}>Tanggal Mulai</th>
                <th style={{ padding: '12px' }}>Tanggal Selesai</th>
                <th style={{ padding: '12px' }}>Biaya</th>
                <th style={{ padding: '12px' }}>Validasi</th>
                <th style={{ padding: '12px' }}>Status Sewa</th>
                {currentUser.role === 'pengurus' && <th style={{ padding: '12px' }}>Aksi</th>}
              </tr>
            </thead>
            <tbody>
              {filteredSewa.length > 0 ? (
                filteredSewa.map((sewa) => (
                  <tr key={sewa.id} style={{ borderBottom: '1px solid var(--color-border-light)', fontSize: '0.875rem' }}>
                    <td style={{ padding: '12px', fontWeight: '600' }}>{sewa.id}</td>
                    {currentUser.role === 'pengurus' && <td style={{ padding: '12px' }}>{sewa.petani}</td>}
                    <td style={{ padding: '12px', fontWeight: '600' }}>{sewa.peralatan}</td>
                    <td style={{ padding: '12px' }}>{formatTanggal(sewa.tanggalMulai)}</td>
                    <td style={{ padding: '12px' }}>{formatTanggal(sewa.tanggalSelesai)}</td>
                    <td style={{ padding: '12px', fontWeight: '700' }}>{formatRupiah(sewa.totalBiaya)}</td>
                    <td style={{ padding: '12px' }}>
                      <span style={{ 
                        fontSize: '0.75rem', 
                        padding: '2px 8px', 
                        borderRadius: '12px', 
                        fontWeight: '600',
                        background: sewa.validasi === 'disetujui' ? 'var(--color-success-50)' : sewa.validasi === 'pending' ? 'var(--color-warning-50)' : 'var(--color-danger-50)',
                        color: sewa.validasi === 'disetujui' ? 'var(--color-success)' : sewa.validasi === 'pending' ? 'var(--color-warning)' : 'var(--color-danger)',
                        border: sewa.validasi === 'disetujui' ? '1px solid var(--color-success-light)' : sewa.validasi === 'pending' ? '1px solid var(--color-warning-light)' : '1px solid var(--color-danger-light)'
                      }}>
                        {sewa.validasi === 'disetujui' ? 'Disetujui' : sewa.validasi === 'pending' ? 'Pending' : 'Ditolak'}
                      </span>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <StatusBadge status={sewa.status} />
                    </td>
                    {currentUser.role === 'pengurus' && (
                      <td style={{ padding: '12px' }}>
                        {sewa.validasi === 'pending' ? (
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button 
                              onClick={() => handleValidation(sewa.id, true)}
                              style={{ padding: '4px 8px', background: 'var(--color-secondary)', color: 'white', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '600' }}
                            >
                              Setujui
                            </button>
                            <button 
                              onClick={() => handleValidation(sewa.id, false)}
                              style={{ padding: '4px 8px', background: 'var(--color-danger)', color: 'white', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '600' }}
                            >
                              Tolak
                            </button>
                          </div>
                        ) : (
                          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Oleh {sewa.validasiOleh}</span>
                        )}
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={currentUser.role === 'pengurus' ? 9 : 8} style={{ textAlign: 'center', padding: '40px 12px', color: 'var(--color-text-muted)' }}>
                    Belum ada riwayat sewa
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      </div> {/* End of inner padding container */}
      </div> {/* End of Admin Card */}

      {/* Rent Application Modal */}
      {showRentModal && selectedAlat && (
        <Modal 
          title={`Form Pengajuan Sewa: ${selectedAlat.nama}`} 
          onClose={() => setShowRentModal(false)}
        >
          <form onSubmit={handleRentSubmit}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '6px' }}>Harga Sewa Per Hari</label>
              <input type="text" readOnly value={formatRupiah(selectedAlat.hargaPerHari)} style={{ width: '100%', background: 'var(--color-bg)' }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '6px' }}>Mulai Sewa</label>
                <input 
                  type="date" 
                  required 
                  value={tanggalMulai} 
                  onChange={(e) => setTanggalMulai(e.target.value)} 
                  style={{ width: '100%' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '6px' }}>Selesai Sewa</label>
                <input 
                  type="date" 
                  required 
                  value={tanggalSelesai} 
                  onChange={(e) => setTanggalSelesai(e.target.value)} 
                  style={{ width: '100%' }}
                />
              </div>
            </div>

            <div style={{ background: 'var(--color-primary-50)', padding: '16px', borderRadius: '8px', border: '1px solid var(--color-primary-100)', marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '6px' }}>
                <span>Durasi sewa:</span>
                <span style={{ fontWeight: '700' }}>{duration} Hari</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}>
                <span>Total Estimasi Biaya:</span>
                <span style={{ fontWeight: '800', color: 'var(--color-primary)' }}>{formatRupiah(totalBiaya)}</span>
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '6px' }}>Catatan Kebutuhan</label>
              <textarea 
                rows="3" 
                placeholder="Tulis detail lahan atau kebutuhan alat lainnya..." 
                value={catatan}
                onChange={(e) => setCatatan(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button 
                type="button" 
                onClick={() => setShowRentModal(false)}
                style={{ padding: '8px 16px', border: '1px solid var(--color-border)', borderRadius: '6px', fontWeight: '600' }}
              >
                Batal
              </button>
              <button 
                type="submit" 
                style={{ padding: '8px 16px', background: 'var(--color-primary)', color: 'white', borderRadius: '6px', fontWeight: '600' }}
              >
                Ajukan Sewa
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Tool Detail Modal */}
      {showDetailModal && (
        <Modal 
          title={`Detail Peralatan: ${showDetailModal.nama}`}
          onClose={() => setShowDetailModal(null)}
        >
          <div style={{ display: 'flex', gap: '20px' }} className="layout-col-mobile">
            <div style={{ width: '100px', height: '100px', background: 'var(--color-primary-50)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', alignSelf: 'center', padding: '16px' }}>
              {renderAlatIcon(showDetailModal.gambar)}
            </div>
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: '0.75rem', padding: '2px 8px', background: 'var(--color-primary-50)', color: 'var(--color-primary)', borderRadius: '12px', fontWeight: '600' }}>
                {showDetailModal.kategori}
              </span>
              <p style={{ marginTop: '10px', fontSize: '0.95rem', color: 'var(--color-text-secondary)', lineHeight: '1.6' }}>
                {showDetailModal.deskripsi}
              </p>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '16px', background: '#f7fafc', padding: '12px', borderRadius: '8px' }}>
                <div>
                  <small style={{ color: 'var(--color-text-muted)' }}>Kondisi Alat</small>
                  <div style={{ fontWeight: '700', fontSize: '0.9rem' }}>{showDetailModal.kondisi || 'Sangat Baik'}</div>
                </div>
                <div>
                  <small style={{ color: 'var(--color-text-muted)' }}>Sewa per Hari</small>
                  <div style={{ fontWeight: '700', color: 'var(--color-primary)', fontSize: '0.9rem' }}>{formatRupiah(showDetailModal.hargaPerHari)}</div>
                </div>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
            <button 
              onClick={() => setShowDetailModal(null)}
              style={{ padding: '8px 16px', background: 'var(--color-primary)', color: 'white', borderRadius: '6px', fontWeight: '600' }}
            >
              Tutup
            </button>
          </div>
        </Modal>
      )}

      {/* Add Equipment Modal (Pengurus Only) */}
      {showAddModal && (
        <Modal 
          title="Tambah Peralatan Baru" 
          onClose={() => setShowAddModal(false)}
        >
          <form onSubmit={handleAddEquipment}>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '6px' }}>Nama Barang</label>
              <input 
                type="text" 
                required 
                placeholder="Contoh: Mesin Pemipil Jagung" 
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '6px' }}>Kategori</label>
                <select 
                  value={newItemKategori}
                  onChange={(e) => setNewItemKategori(e.target.value)}
                  style={{ width: '100%' }}
                >
                  {Mock.kategoriPeralatan.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '6px' }}>Tarif (Rupiah/Hari)</label>
                <input 
                  type="number" 
                  required 
                  placeholder="Contoh: 150000" 
                  value={newItemHarga}
                  onChange={(e) => setNewItemHarga(e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '6px' }}>Jumlah Unit (Stok)</label>
              <input 
                type="number" 
                required 
                placeholder="Contoh: 5" 
                value={newItemStok}
                onChange={(e) => setNewItemStok(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '6px' }}>Deskripsi Spesifikasi</label>
              <textarea 
                rows="3" 
                required
                placeholder="Detail kapasitas, bahan bakar, merk, dll..." 
                value={newItemDeskripsi}
                onChange={(e) => setNewItemDeskripsi(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button 
                type="button" 
                onClick={() => setShowAddModal(false)}
                style={{ padding: '8px 16px', border: '1px solid var(--color-border)', borderRadius: '6px', fontWeight: '600' }}
              >
                Batal
              </button>
              <button 
                type="submit" 
                style={{ padding: '8px 16px', background: 'var(--color-primary)', color: 'white', borderRadius: '6px', fontWeight: '600' }}
              >
                Simpan Peralatan
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

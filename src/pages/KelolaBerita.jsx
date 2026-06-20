import { useState } from 'react';
import { dataBerita as mockBerita, formatTanggal } from '../data/mockData';
import { Plus, Edit, Trash2, Globe, EyeOff } from 'lucide-react';
import StatusBadge from '../components/shared/StatusBadge';
import Modal from '../components/shared/Modal';

export default function KelolaBerita() {
  const [beritaList, setBeritaList] = useState(mockBerita);
  const [selectedBerita, setSelectedBerita] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(null);

  // Form State
  const [judul, setJudul] = useState('');
  const [kategori, setKategori] = useState('Harga Komoditas');
  const [isi, setIsi] = useState('');
  const [status, setStatus] = useState('published');

  const handleCreate = (e) => {
    e.preventDefault();
    const newBerita = {
      id: beritaList.length + 1,
      judul,
      kategori,
      isi,
      status,
      penulis: 'Ir. Hendra Wijaya (BPP)',
      tanggal: new Date().toISOString().split('T')[0]
    };
    setBeritaList([newBerita, ...beritaList]);
    setShowAddModal(false);
    resetForm();
  };

  const handleEdit = (e) => {
    e.preventDefault();
    setBeritaList(prev => prev.map(b => {
      if (b.id === selectedBerita.id) {
        return {
          ...b,
          judul,
          kategori,
          isi,
          status
        };
      }
      return b;
    }));
    setSelectedBerita(null);
    resetForm();
  };

  const handleDelete = () => {
    setBeritaList(prev => prev.filter(b => b.id !== showDeleteModal.id));
    setShowDeleteModal(null);
  };

  const resetForm = () => {
    setJudul('');
    setKategori('Harga Komoditas');
    setIsi('');
    setStatus('published');
  };

  const openEditModal = (berita) => {
    setSelectedBerita(berita);
    setJudul(berita.judul);
    setKategori(berita.kategori);
    setIsi(berita.isi);
    setStatus(berita.status);
  };

  return (
    <div style={{ animation: 'fadeIn 0.3s ease' }}>
      <div className="admin-card">
        {/* Header Row Inside Card */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid #dee2e6' }}>
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#333', margin: 0 }}>Kelola Berita &amp; Penyuluhan</h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button 
              onClick={() => setShowAddModal(true)}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 16px', background: 'var(--color-secondary)', color: 'white', borderRadius: '8px', fontWeight: '600', fontSize: '0.85rem', cursor: 'pointer', height: '38px', boxSizing: 'border-box' }}
            >
              <Plus size={16} /> Tambah Info
            </button>
            <nav style={{ marginBottom: 0, fontSize: '0.85rem', display: 'flex', alignItems: 'center', color: 'var(--color-primary)' }}>
              <span style={{ margin: '0 8px' }}>/</span>
              <span style={{ fontWeight: '500' }}>kelolaberita</span>
            </nav>
          </div>
        </div>
        
        <div style={{ padding: '20px' }}>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div style={{ background: 'white', padding: '16px', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
          <div style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>Total Informasi</div>
          <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--color-primary)' }}>{beritaList.length}</div>
        </div>
        <div style={{ background: 'white', padding: '16px', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
          <div style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>Diterbitkan (Online)</div>
          <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--color-success)' }}>
            {beritaList.filter(b => b.status === 'published').length}
          </div>
        </div>
        <div style={{ background: 'white', padding: '16px', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
          <div style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>Draf Penulisan</div>
          <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--color-warning)' }}>
            {beritaList.filter(b => b.status === 'draft').length}
          </div>
        </div>
      </div>

      {/* Grid of news lists for BPP editor */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {beritaList.map(berita => (
          <div 
            key={berita.id} 
            style={{ 
              background: 'white', 
              border: '1px solid var(--color-border)', 
              borderRadius: '8px', 
              padding: '20px', 
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '16px'
            }}
          >
            <div style={{ flex: 1, minWidth: '300px' }}>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.75rem', padding: '2px 8px', background: 'var(--color-primary-50)', color: 'var(--color-primary)', borderRadius: '12px', fontWeight: '600' }}>
                  {berita.kategori}
                </span>
                <StatusBadge status={berita.status} />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '6px' }}>{berita.judul}</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: '10px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{berita.isi}</p>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                <span>✍️ {berita.penulis}</span>
                <span style={{ marginLeft: '12px' }}>📅 {formatTanggal(berita.tanggal)}</span>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                onClick={() => openEditModal(berita)}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 12px', border: '1px solid var(--color-border)', borderRadius: '8px', fontSize: '0.85rem', fontWeight: '600' }}
              >
                <Edit size={14} /> Edit
              </button>
              <button 
                onClick={() => setShowDeleteModal(berita)}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 12px', border: '1px solid var(--color-danger)', color: 'var(--color-danger)', borderRadius: '8px', fontSize: '0.85rem', fontWeight: '600' }}
              >
                <Trash2 size={14} /> Hapus
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add News Modal */}
      {showAddModal && (
        <Modal title="Tambah Artikel / Info Baru" onClose={() => setShowAddModal(false)}>
          <form onSubmit={handleCreate}>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '6px' }}>Judul Informasi</label>
              <input 
                type="text" 
                required 
                placeholder="Harga pupuk subsidi terbaru..." 
                value={judul}
                onChange={(e) => setJudul(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '6px' }}>Kategori</label>
                <select 
                  value={kategori}
                  onChange={(e) => setKategori(e.target.value)}
                  style={{ width: '100%' }}
                >
                  <option value="Harga Komoditas">Harga Komoditas</option>
                  <option value="Tips Budidaya">Tips Budidaya</option>
                  <option value="Kebijakan">Kebijakan</option>
                  <option value="Musim Tanam">Musim Tanam</option>
                  <option value="Pelatihan">Pelatihan</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '6px' }}>Status</label>
                <select 
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  style={{ width: '100%' }}
                >
                  <option value="published">Diterbitkan langsung (Online)</option>
                  <option value="draft">Simpan Draf</option>
                </select>
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '6px' }}>Konten Artikel</label>
              <textarea 
                rows="6" 
                required
                placeholder="Tulis informasi lengkap disini..." 
                value={isi}
                onChange={(e) => setIsi(e.target.value)}
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
                Terbitkan
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Edit News Modal */}
      {selectedBerita && (
        <Modal title="Edit Artikel / Info" onClose={() => setSelectedBerita(null)}>
          <form onSubmit={handleEdit}>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '6px' }}>Judul Informasi</label>
              <input 
                type="text" 
                required 
                value={judul}
                onChange={(e) => setJudul(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '6px' }}>Kategori</label>
                <select 
                  value={kategori}
                  onChange={(e) => setKategori(e.target.value)}
                  style={{ width: '100%' }}
                >
                  <option value="Harga Komoditas">Harga Komoditas</option>
                  <option value="Tips Budidaya">Tips Budidaya</option>
                  <option value="Kebijakan">Kebijakan</option>
                  <option value="Musim Tanam">Musim Tanam</option>
                  <option value="Pelatihan">Pelatihan</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '6px' }}>Status</label>
                <select 
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  style={{ width: '100%' }}
                >
                  <option value="published">Diterbitkan langsung (Online)</option>
                  <option value="draft">Simpan Draf</option>
                </select>
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '6px' }}>Konten Artikel</label>
              <textarea 
                rows="6" 
                required
                value={isi}
                onChange={(e) => setIsi(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button 
                type="button" 
                onClick={() => setSelectedBerita(null)}
                style={{ padding: '8px 16px', border: '1px solid var(--color-border)', borderRadius: '6px', fontWeight: '600' }}
              >
                Batal
              </button>
              <button 
                type="submit" 
                style={{ padding: '8px 16px', background: 'var(--color-primary)', color: 'white', borderRadius: '6px', fontWeight: '600' }}
              >
                Simpan Perubahan
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <Modal title="Konfirmasi Hapus" onClose={() => setShowDeleteModal(null)}>
          <p style={{ marginBottom: '20px' }}>
            Apakah Anda yakin ingin menghapus artikel berjudul <strong>"{showDeleteModal.judul}"</strong>? Tindakan ini tidak dapat dibatalkan.
          </p>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
            <button 
              type="button" 
              onClick={() => setShowDeleteModal(null)}
              style={{ padding: '8px 16px', border: '1px solid var(--color-border)', borderRadius: '6px', fontWeight: '600' }}
            >
              Batal
            </button>
            <button 
              onClick={handleDelete}
              style={{ padding: '8px 16px', background: 'var(--color-danger)', color: 'white', borderRadius: '6px', fontWeight: '600' }}
            >
              Hapus Permanen
            </button>
          </div>
        </Modal>
      )}
          </div>
        </div>
    </div>
  );
}

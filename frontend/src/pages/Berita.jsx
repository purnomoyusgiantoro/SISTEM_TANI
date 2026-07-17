import { useState, useEffect, useMemo } from 'react';
import beritaApi from '../api/berita';
import { useApi } from '../hooks/useApi';
import { formatTanggal } from '../utils/formatters';
import { useAuth } from '../context/AuthContext';
import { FileText, Sprout, TrendingUp, Calendar, User, Search, BookOpen, Newspaper } from 'lucide-react';
import '../styles/pages/Berita.css';


export default function Berita() {
  const { currentUser } = useAuth();
  const [selectedKategori, setSelectedKategori] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBerita, setSelectedBerita] = useState(null);

  const { data: beritaData, loading, execute: fetchBerita } = useApi(beritaApi.getAll);

  useEffect(() => {
    fetchBerita({ status: 'published' }).catch(() => {});
  }, [fetchBerita]);

  const renderBeritaIcon = (category, size = 36) => {
    switch (category) {
      case 'Harga Komoditas':
        return <TrendingUp size={size} style={{ color: 'white' }} />;
      case 'Tips Budidaya':
        return <Sprout size={size} style={{ color: 'white' }} />;
      case 'Kebijakan':
        return <FileText size={size} style={{ color: 'white' }} />;
      case 'Musim Tanam':
        return <Sprout size={size} style={{ color: 'white' }} />;
      case 'Pelatihan':
        return <BookOpen size={size} style={{ color: 'white' }} />;
      default:
        return <Newspaper size={size} style={{ color: 'white' }} />;
    }
  };

  const publishedBerita = Array.isArray(beritaData) ? beritaData : [];
  
  const kategoriList = useMemo(() => {
    return ['Semua', ...new Set(publishedBerita.map((b) => b.kategori))];
  }, [publishedBerita]);

  const filtered = useMemo(() => {
    return publishedBerita.filter((b) => {
      const matchKategori = selectedKategori === 'Semua' || b.kategori === selectedKategori;
      const matchSearch =
        searchQuery === '' ||
        (b.judul || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (b.isi || '').toLowerCase().includes(searchQuery.toLowerCase());
      return matchKategori && matchSearch;
    });
  }, [publishedBerita, selectedKategori, searchQuery]);

  return (
    <div className="berita-page">
      

      <div className="admin-card">
        {/* Header Row Inside Card */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid #dee2e6' }}>
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#333', margin: 0 }}>Berita &amp; Informasi Pertanian</h1>
          </div>
          <nav style={{ marginBottom: 0, fontSize: '0.85rem', display: 'flex', alignItems: 'center', color: 'var(--color-primary)' }}>
            <span style={{ margin: '0 8px' }}>/</span>
            <span style={{ fontWeight: '500' }}>berita</span>
          </nav>
        </div>
        
        <div style={{ padding: '20px' }}>

      <div className="berita-filters">
        <input
          type="text"
          className="berita-search"
          placeholder="Cari berita..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="berita-kategori-tabs" style={{ marginBottom: '24px' }}>
        {kategoriList.map((kat) => (
          <button
            key={kat}
            className={`berita-kategori-tab ${selectedKategori === kat ? 'active' : ''}`}
            onClick={() => setSelectedKategori(kat)}
          >
            {kat}
          </button>
        ))}
      </div>

      {filtered.length > 0 ? (
        <div className="berita-grid">
          {filtered.map((berita) => {
            return (
              <div
                key={berita.id}
                className="berita-card"
                onClick={() => setSelectedBerita(berita)}
              >
                <div className="berita-card-image" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {renderBeritaIcon(berita.kategori)}
                  <span className="berita-kategori-badge">{berita.kategori}</span>
                </div>
                <div className="berita-card-body">
                  <div className="berita-card-title">{berita.judul}</div>
                  <div className="berita-card-excerpt">{berita.isi}</div>
                  <div className="berita-card-footer">
                    <span className="berita-card-author" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><User size={12} /> {typeof berita.penulis === 'object' ? (berita.penulis?.nama || '-') : (berita.penulis || '-')}</span>
                    <span className="berita-card-date" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Calendar size={12} /> {formatTanggal(berita.tanggal)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="berita-empty">
          <div className="berita-empty-icon">
            <Newspaper size={48} style={{ margin: '0 auto', color: 'var(--color-text-muted)' }} />
          </div>
          <p>Tidak ada berita yang ditemukan.</p>
        </div>
      )}

      {selectedBerita && (
        <div className="berita-detail-overlay" onClick={() => setSelectedBerita(null)}>
          <div className="berita-detail-modal" onClick={(e) => e.stopPropagation()}>
            <div className="berita-detail-header">
              <button className="berita-detail-close" onClick={() => setSelectedBerita(null)}>
                ✕
              </button>
              <div className="berita-detail-header-content">
                <span className="berita-kategori-badge">{selectedBerita.kategori}</span>
                <h2>{selectedBerita.judul}</h2>
              </div>
            </div>
            <div className="berita-detail-body">
              <div className="berita-detail-meta">
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><User size={14} /> {typeof selectedBerita.penulis === 'object' ? (selectedBerita.penulis?.nama || '-') : (selectedBerita.penulis || '-')}</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Calendar size={14} /> {formatTanggal(selectedBerita.tanggal)}</span>
              </div>
              <div className="berita-detail-content">{selectedBerita.isi}</div>
            </div>
          </div>
        </div>
      )}
          </div>
        </div>
    </div>
  );
}

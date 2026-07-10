import { useState, useEffect } from 'react';
import beritaApi from '../api/berita';
import { useApi } from '../hooks/useApi';
import { formatTanggal } from '../utils/formatters';
import * as Mock from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import { FileText, Sprout, TrendingUp, Calendar, User, Search, BookOpen, Newspaper } from 'lucide-react';

export default function Berita() {
  const { currentUser } = useAuth();
  const [selectedKategori, setSelectedKategori] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBerita, setSelectedBerita] = useState(null);

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

  const publishedBerita = Mock.dataBerita.filter((b) => b.status === 'published');
  const kategoriList = ['Semua', ...new Set(publishedBerita.map((b) => b.kategori))];

  const filtered = publishedBerita.filter((b) => {
    const matchKategori = selectedKategori === 'Semua' || b.kategori === selectedKategori;
    const matchSearch =
      searchQuery === '' ||
      b.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.isi.toLowerCase().includes(searchQuery.toLowerCase());
    return matchKategori && matchSearch;
  });

  return (
    <div className="berita-page">
      <style>{`
        .berita-page {
          animation: fadeIn 0.3s ease;
        }
        .berita-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }
        .berita-header h1 {
          font-size: 1.75rem;
          font-weight: 700;
          color: var(--color-text);
          margin: 0;
        }
        .berita-filters {
          display: flex;
          gap: 12px;
          margin-bottom: 24px;
          flex-wrap: wrap;
        }
        .berita-search {
          flex: 1;
          min-width: 200px;
          padding: 8px 12px;
          border: 1px solid var(--color-border);
          border-radius: 8px;
          font-size: 0.9rem;
          background: var(--color-card);
          transition: border-color 0.2s;
          height: 38px;
          box-sizing: border-box;
        }
        .berita-search:focus {
          outline: none;
          border-color: var(--color-text-muted);
        }
        .berita-kategori-tabs {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        .berita-kategori-tab {
          padding: 6px 16px;
          border: 1px solid var(--color-border);
          border-radius: 20px;
          background: var(--color-card);
          color: var(--color-text-secondary);
          cursor: pointer;
          font-size: 0.85rem;
          transition: all 0.2s;
        }
        .berita-kategori-tab:hover {
          background: var(--color-bg);
        }
        .berita-kategori-tab.active {
          background: var(--color-primary);
          color: white;
          border-color: var(--color-primary);
        }
        .berita-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
          gap: 24px;
        }
        .berita-card {
          background: var(--color-card);
          border-radius: 8px;
          overflow: hidden;
          transition: all 0.2s ease;
          cursor: pointer;
          border: 1px solid var(--color-border);
        }
        .berita-card:hover {
          transform: translateY(-2px);
        }
        .berita-card-image {
          height: 180px;
          background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 50%, var(--color-secondary) 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 3rem;
          position: relative;
          overflow: hidden;
        }
        .berita-card-image::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 60px;
          background: linear-gradient(transparent, rgba(0,0,0,0.3));
        }
        .berita-card-image .berita-kategori-badge {
          position: absolute;
          top: 12px;
          right: 12px;
          background: rgba(255,255,255,0.9);
          color: var(--color-primary);
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 600;
          z-index: 1;
        }
        .berita-card-body {
          padding: 20px;
        }
        .berita-card-title {
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--color-text);
          margin-bottom: 8px;
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .berita-card-excerpt {
          font-size: 0.9rem;
          color: var(--color-text-secondary);
          line-height: 1.6;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
          margin-bottom: 16px;
        }
        .berita-card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 12px;
          border-top: 1px solid var(--color-border);
        }
        .berita-card-author {
          font-size: 0.8rem;
          color: var(--color-text-muted);
        }
        .berita-card-date {
          font-size: 0.8rem;
          color: var(--color-text-muted);
        }
        .berita-empty {
          text-align: center;
          padding: 60px 20px;
          color: var(--color-text-muted);
        }
        .berita-empty-icon {
          font-size: 3rem;
          margin-bottom: 16px;
        }
        /* Detail Modal */
        .berita-detail-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
          animation: fadeIn 0.2s ease;
        }
        .berita-detail-modal {
          background: var(--color-card);
          border-radius: 16px;
          max-width: 700px;
          width: 100%;
          max-height: 85vh;
          overflow-y: auto;
          animation: slideUp 0.3s ease;
        }
        @keyframes slideUp {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .berita-detail-header {
          height: 200px;
          background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
          display: flex;
          align-items: flex-end;
          padding: 24px;
          position: relative;
        }
        .berita-detail-close {
          position: absolute;
          top: 16px;
          right: 16px;
          background: rgba(255,255,255,0.2);
          border: none;
          color: white;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          cursor: pointer;
          font-size: 1.2rem;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s;
        }
        .berita-detail-close:hover {
          background: rgba(255,255,255,0.3);
        }
        .berita-detail-header-content {
          color: white;
        }
        .berita-detail-header-content .berita-kategori-badge {
          background: rgba(255,255,255,0.2);
          color: white;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 0.8rem;
          display: inline-block;
          margin-bottom: 8px;
        }
        .berita-detail-header-content h2 {
          margin: 0;
          font-size: 1.5rem;
          line-height: 1.3;
        }
        .berita-detail-body {
          padding: 24px;
        }
        .berita-detail-meta {
          display: flex;
          gap: 20px;
          margin-bottom: 20px;
          padding-bottom: 16px;
          border-bottom: 1px solid var(--color-border);
          color: var(--color-text-muted);
          font-size: 0.9rem;
        }
        .berita-detail-content {
          font-size: 1rem;
          line-height: 1.8;
          color: var(--color-text);
        }
        @media (max-width: 768px) {
          .berita-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

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
                    <span className="berita-card-author" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><User size={12} /> {berita.penulis}</span>
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
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><User size={14} /> {selectedBerita.penulis}</span>
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

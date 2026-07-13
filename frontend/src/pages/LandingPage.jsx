import { useNavigate } from 'react-router-dom';
import { Landmark, Map, Tractor, TrendingUp } from 'lucide-react';
import '../styles/pages/LandingPage.css';


export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      

      <nav className="landing-nav">
        <div className="nav-logo" onClick={() => navigate('/')}>
          <div className="nav-logo-icon">
            <Landmark size={32} strokeWidth={1.5} />
          </div>
          <div className="nav-logo-text">
            <h1>Sistem Tani</h1>
            <span>Pemerintah Kota</span>
          </div>
        </div>
        <div className="nav-links">
          <a href="#fitur" className="nav-link">Fitur Utama</a>
          <a href="#layanan" className="nav-link">Layanan Kami</a>
          <button className="nav-btn" onClick={() => navigate('/login')}>
            Masuk Portal
          </button>
        </div>
      </nav>

      <section className="landing-hero">
        <h1 className="hero-title">Modernisasi Manajemen Lahan & Persewaan Alat Pertanian</h1>
        <p className="hero-subtitle">
          Satu wadah digital transparan untuk memantau data kepemilikan lahan petani, persewaan alat mesin tani, serta penyuluhan pertanian.
        </p>
        <div className="hero-btns">
          <button className="hero-btn-primary" onClick={() => navigate('/login')}>
            Masuk ke Portal
          </button>
          <a href="#fitur" className="hero-btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            Pelajari Fitur
          </a>
        </div>
      </section>

      <section className="stats-floating">
        <div className="stat-item">
          <div className="stat-number">1.247 Ha</div>
          <div className="stat-label">LAHAN TERDAFTAR</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">562 Orang</div>
          <div className="stat-label">PETANI AKTIF</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">89 Unit</div>
          <div className="stat-label">PERALATAN TERSEDIA</div>
        </div>
      </section>

      <section className="services-section" id="fitur">
        <div className="section-header">
          <h2>Solusi Pertanian Terpadu</h2>
          <p>Sistem Tani menyatukan berbagai peran instansi pertanian untuk hasil yang optimal.</p>
        </div>
        <div className="services-grid">
          <div className="service-card">
            <div className="service-icon-wrapper">
              <Map size={28} strokeWidth={1.5} />
            </div>
            <h3 className="service-title">Transparansi & Verifikasi Lahan</h3>
            <p className="service-desc">
              Data kepemilikan lahan tersimpan dengan aman dan teratur. BPP melakukan verifikasi faktual untuk memastikan akurasi peta pertanian wilayah.
            </p>
          </div>
          <div className="service-card">
            <div className="service-icon-wrapper">
              <Tractor size={28} strokeWidth={1.5} />
            </div>
            <h3 className="service-title">Sewa Alat Tani Praktis</h3>
            <p className="service-desc">
              Petani dapat melihat ketersediaan traktor, sprayer elektrik, hingga drone pertanian, dan langsung mengajukan sewa secara digital.
            </p>
          </div>
          <div className="service-card">
            <div className="service-icon-wrapper">
              <TrendingUp size={28} strokeWidth={1.5} />
            </div>
            <h3 className="service-title">Penyuluhan & Info Komoditas</h3>
            <p className="service-desc">
              BPP mempublikasikan harga pangan terupdate, prakiraan iklim musim tanam, tips pencegahan hama, dan menyebarkan notifikasi ke seluruh petani anggota.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2 className="cta-title">Siap Memajukan Pertanian Bersama?</h2>
          <p className="cta-desc">
            Bergabunglah dengan ratusan petani lainnya yang telah memanfaatkan ekosistem digital Sistem Tani untuk meningkatkan produktivitas.
          </p>
          <button className="cta-btn" onClick={() => navigate('/login')}>
            Mulai Sekarang &rarr;
          </button>
        </div>
      </section>

      {/* Modern Footer */}
      <footer className="landing-footer">
        <div className="footer-grid">
          <div className="footer-brand">
            <h2><Landmark size={28} color="#0f172a" /> Sistem Tani</h2>
            <p>
              Platform digital terpadu untuk pelayanan administrasi, persewaan, dan penyuluhan pertanian di lingkup Pemerintah Kota. Mendorong terwujudnya ketahanan pangan berbasis teknologi.
            </p>
          </div>
          <div className="footer-col">
            <h3>Tautan Cepat</h3>
            <ul className="footer-links">
              <li><a href="#fitur">Fitur Utama</a></li>
              <li><a href="#layanan">Layanan BPP</a></li>
              <li><a href="/login">Portal Masuk</a></li>
              <li><a href="#">Bantuan & FAQ</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h3>Hubungi Kami</h3>
            <ul className="footer-links">
              <li>Dinas Pertanian & Ketahanan Pangan</li>
              <li>Jl. Panglima Sudirman No. 12</li>
              <li>Telp: (031) 555-1234</li>
              <li>Email: info@pertanian.go.id</li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <div>&copy; 2026 Sistem Tani Pemerintah Kota. Hak Cipta Dilindungi.</div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <a href="#" style={{ color: '#94a3b8', textDecoration: 'none' }}>Kebijakan Privasi</a>
            <a href="#" style={{ color: '#94a3b8', textDecoration: 'none' }}>Syarat & Ketentuan</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

import { useNavigate } from 'react-router-dom';
import { Landmark, Map, Tractor, TrendingUp } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <style>{`
        .landing-container {
          font-family: Arial, sans-serif;
          color: #0f172a;
          min-height: 100vh;
          background: #f8fafc;
          overflow-x: hidden;
          padding-top: 74px; /* Space for fixed navbar */
        }

        /* --- Header Navigation --- */
        .landing-nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 18px 8%;
          background: #ffffff;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }

        .nav-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
        }

        .nav-logo-icon {
          color: #059669;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .nav-logo-text h1 {
          font-size: 1.5rem;
          font-weight: bold;
          color: #059669;
          margin: 0;
        }

        .nav-logo-text span {
          font-size: 0.8rem;
          color: #64748b;
          font-weight: bold;
          text-transform: uppercase;
          display: block;
        }

        .nav-links {
          display: flex;
          gap: 24px;
          align-items: center;
        }

        .nav-link {
          font-size: 1rem;
          font-weight: bold;
          color: #0f172a;
          text-decoration: none;
        }

        .nav-link:hover {
          color: #059669;
        }

        .nav-btn {
          padding: 10px 24px;
          background: #059669;
          color: white;
          border-radius: 6px;
          font-weight: bold;
          font-size: 1rem;
          border: none;
          cursor: pointer;
        }

        /* --- Hero Section --- */
        .landing-hero {
          position: relative;
          height: 80vh;
          min-height: 500px;
          background-image: linear-gradient(rgba(15, 23, 42, 0.7), rgba(15, 23, 42, 0.7)), url('/sawah_background.png');
          background-color: #0f172a;
          background-size: cover;
          background-position: center;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          padding: 0 20px;
          color: white;
        }

        .hero-title {
          font-size: 2.5rem;
          font-weight: bold;
          max-width: 850px;
          line-height: 1.3;
          margin-bottom: 20px;
          color: #ffffff;
        }

        .hero-subtitle {
          font-size: 1.25rem;
          max-width: 600px;
          color: #f8fafc;
          line-height: 1.6;
          margin-bottom: 36px;
        }

        .hero-btns {
          display: flex;
          gap: 16px;
        }

        .hero-btn-primary {
          padding: 14px 32px;
          background: #059669;
          color: white;
          border-radius: 6px;
          font-weight: bold;
          font-size: 1.1rem;
          border: none;
          cursor: pointer;
        }

        .hero-btn-secondary {
          padding: 14px 32px;
          background: transparent;
          border: 2px solid white;
          color: white;
          border-radius: 6px;
          font-weight: bold;
          font-size: 1.1rem;
          text-decoration: none;
        }

        /* --- Stats Row (Floating) --- */
        .stats-floating {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          max-width: 900px;
          width: 84%;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          box-shadow: 0 4px 6px rgba(0,0,0,0.05);
          border-radius: 8px;
          margin: -60px auto 60px auto;
          position: relative;
          z-index: 10;
          padding: 30px;
          text-align: center;
        }

        .stat-item {
          border-right: 1px solid #e2e8f0;
        }

        .stat-item:last-child {
          border-right: none;
        }

        .stat-number {
          font-size: 2rem;
          font-weight: bold;
          color: #059669;
        }

        .stat-label {
          font-size: 1rem;
          font-weight: bold;
          color: #64748b;
          margin-top: 8px;
        }

        /* --- Services Section --- */
        .services-section {
          padding: 60px 8%;
          text-align: center;
          background: #f8fafc;
        }

        .section-header {
          margin-bottom: 48px;
        }

        .section-header h2 {
          font-size: 2rem;
          font-weight: bold;
          color: #0f172a;
          margin: 0 0 10px 0;
        }

        .section-header p {
          font-size: 1.1rem;
          color: #64748b;
          margin: 0;
        }

        .services-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          margin-top: 40px;
        }

        .service-card {
          background: #ffffff;
          border-radius: 12px;
          padding: 32px 24px;
          text-align: left;
          border: 1px solid #e2e8f0;
          transition: all 0.2s ease;
          position: relative;
        }

        .service-card:hover {
          border-color: #cbd5e1;
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
          transform: translateY(-2px);
        }

        .service-icon-wrapper {
          width: 48px;
          height: 48px;
          border-radius: 10px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          color: #0f172a;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
        }

        .service-title {
          font-size: 1.35rem;
          font-weight: 800;
          margin-bottom: 16px;
          color: #0f172a;
        }

        .service-desc {
          font-size: 1.05rem;
          color: #64748b;
          line-height: 1.7;
        }

        /* --- CTA Section --- */
        .cta-section {
          background: #f8fafc;
          border-top: 1px solid #e2e8f0;
          padding: 64px 8%;
          text-align: center;
          color: #0f172a;
          position: relative;
        }
        
        .cta-content {
          position: relative;
          z-index: 2;
          max-width: 600px;
          margin: 0 auto;
        }

        .cta-title {
          font-size: 2rem;
          font-weight: 800;
          margin-bottom: 16px;
          line-height: 1.3;
          color: #0f172a;
        }

        .cta-desc {
          font-size: 1.1rem;
          color: #64748b;
          margin-bottom: 32px;
        }

        .cta-btn {
          padding: 14px 32px;
          background: #0f172a;
          color: white;
          border-radius: 8px;
          font-weight: bold;
          font-size: 1rem;
          border: none;
          cursor: pointer;
          transition: background 0.2s;
        }

        .cta-btn:hover {
          background: #1e293b;
        }

        /* --- Modern Footer --- */
        .landing-footer {
          background: #ffffff;
          border-top: 1px solid #e2e8f0;
          color: #475569;
          padding: 64px 8% 32px;
        }

        .footer-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr;
          gap: 60px;
          margin-bottom: 60px;
        }

        .footer-brand h2 {
          font-size: 1.5rem;
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 16px 0;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .footer-brand p {
          font-size: 1rem;
          line-height: 1.6;
          max-width: 400px;
          color: #64748b;
        }

        .footer-col h3 {
          font-size: 1.1rem;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 20px;
        }

        .footer-links {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .footer-links a {
          color: #64748b;
          text-decoration: none;
          transition: color 0.2s;
          font-size: 1rem;
        }

        .footer-links a:hover {
          color: #0f172a;
        }

        .footer-bottom {
          border-top: 1px solid #e2e8f0;
          padding-top: 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.9rem;
          color: #94a3b8;
        }

        @media (max-width: 900px) {
          .nav-links { display: none; }
          .stats-floating { grid-template-columns: 1fr; gap: 20px; }
          .stat-item { border-right: none; border-bottom: 1px solid #e2e8f0; padding-bottom: 16px; }
          .stat-item:last-child { border-bottom: none; padding-bottom: 0; }
          .services-grid { grid-template-columns: 1fr; gap: 24px; }
          .footer-grid { grid-template-columns: 1fr; gap: 40px; }
          .footer-bottom { flex-direction: column; gap: 16px; text-align: center; }
          .cta-title { font-size: 2rem; }
        }
      `}</style>

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

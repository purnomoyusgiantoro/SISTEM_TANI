import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import dashboardApi from '../api/dashboard';
import { useApi } from '../hooks/useApi';
import { formatRupiah } from '../utils/formatters';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import StatCard from '../components/shared/StatCard';
import StatusBadge from '../components/shared/StatusBadge';
import { 
  MapPin, 
  Package, 
  AlertCircle, 
  Maximize2, 
  Users, 
  CheckCircle, 
  XCircle, 
  FileText, 
  TrendingUp, 
  ShieldAlert, 
  HardDrive, 
  Activity, 
  Plus, 
  ArrowRight,
  TrendingDown,
  Calendar,
  Download
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../styles/pages/Dashboard.css';


export default function Dashboard() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { data: statsData, loading, error, execute: fetchStats } = useApi(dashboardApi.getStats);

  const role = currentUser?.role || 'petani';

  useEffect(() => {
    fetchStats().catch(() => {});
  }, [fetchStats]);

  const stats = statsData || {};


  // Helper date
  const getGreeting = () => {
    const hours = new Date().getHours();
    if (hours < 11) return 'Selamat Pagi';
    if (hours < 15) return 'Selamat Siang';
    if (hours < 18) return 'Selamat Sore';
    return 'Selamat Malam';
  };

  const todayDateStr = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  // Render Dashboard based on role
  const renderPetaniDashboard = () => {
    // Land owned by current farmer
    const myLahan = (stats.lahan_terbaru || []).filter(Boolean);
    const mySewa = (stats.sewa_terbaru || []).filter(Boolean);

    return (
      <div className="dashboard-grid animate-fade-in-up">

        {/* Main Content Layout */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ width: '100%' }}>
            {/* My Lands */}
            <div style={{ background: 'white', borderRadius: '12px', padding: '20px', marginBottom: '24px', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Lahan Pertanian Saya</h3>
                <button onClick={() => navigate('/data-lahan')} style={{ fontSize: '0.85rem', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '600' }}>
                  Lihat Semua <ArrowRight size={14} />
                </button>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--color-border)', textAlign: 'left', fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                      <th style={{ padding: '12px 16px' }}>Lokasi</th>
                      <th style={{ padding: '12px 16px' }}>Luas</th>
                      <th style={{ padding: '12px 16px' }}>Jenis</th>
                      <th style={{ padding: '12px 16px' }}>Status Verifikasi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myLahan.length > 0 ? (
                      myLahan.map((l) => (
                        <tr key={l.id} style={{ borderBottom: '1px solid var(--color-border-light)', fontSize: '0.85rem' }}>
                          <td style={{ padding: '12px 16px' }}>{l.lokasi}</td>
                          <td style={{ padding: '12px 16px' }}>{l.luas} Ha</td>
                          <td style={{ padding: '12px 16px' }}>{l.jenisLahan || l.jenis_lahan}</td>
                          <td style={{ padding: '12px 16px' }}>
                            <StatusBadge status={l.statusVerifikasi || l.status_verifikasi} />
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" style={{ textAlign: 'center', padding: '24px', color: 'var(--color-text-muted)' }}>Belum mendaftarkan lahan</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* My Rentals */}
            <div style={{ background: 'white', borderRadius: '12px', padding: '20px', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Riwayat Sewa Alat</h3>
                <button onClick={() => navigate('/sewa-peralatan')} style={{ fontSize: '0.85rem', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '600' }}>
                  Lihat Semua <ArrowRight size={14} />
                </button>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--color-border)', textAlign: 'left', fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                      <th style={{ padding: '12px 16px' }}>Peralatan</th>
                      <th style={{ padding: '12px 16px' }}>Tanggal Mulai</th>
                      <th style={{ padding: '12px 16px' }}>Total Biaya</th>
                      <th style={{ padding: '12px 16px' }}>Status Sewa</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mySewa.length > 0 ? (
                      mySewa.slice(0, 3).map((s) => (
                        <tr key={s.id} style={{ borderBottom: '1px solid var(--color-border-light)', fontSize: '0.85rem' }}>
                          <td style={{ padding: '12px 16px', fontWeight: '600' }}>{typeof s.peralatan === 'object' ? (s.peralatan?.nama || '-') : (s.peralatan || '-')}</td>
                          <td style={{ padding: '12px 16px' }}>{s.tanggalMulai || s.tanggal_mulai}</td>
                          <td style={{ padding: '12px 16px' }}>{formatRupiah(s.totalBiaya || s.total_biaya)}</td>
                          <td style={{ padding: '12px 16px' }}>
                            <StatusBadge status={s.status} />
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" style={{ textAlign: 'center', padding: '24px', color: 'var(--color-text-muted)' }}>Belum ada pengajuan sewa</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderPengurusDashboard = () => {
    const pendingSewa = (stats.pending_sewa || []).filter(Boolean);
    
    return (
      <div className="dashboard-grid animate-fade-in-up">

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ width: '100%' }}>
            {/* Pending Approvals */}
            <div style={{ background: 'white', borderRadius: '12px', padding: '20px', marginBottom: '24px', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Menunggu Validasi Sewa ({pendingSewa.length})</h3>
                <button onClick={() => navigate('/sewa-peralatan')} style={{ fontSize: '0.85rem', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '600' }}>
                  Kelola Semua <ArrowRight size={14} />
                </button>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', minWidth: '600px', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--color-border)', textAlign: 'left', fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                      <th style={{ width: 140, padding: '12px 16px' }}>Petani</th>
                      <th style={{ padding: '12px 16px' }}>Peralatan</th>
                      <th style={{ width: 100, padding: '12px 16px' }}>Durasi</th>
                      <th style={{ width: 130, padding: '12px 16px' }}>Biaya</th>
                      <th style={{ width: 100, padding: '12px 16px' }}>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingSewa.length > 0 ? (
                      pendingSewa.slice(0, 3).map((s) => (
                        <tr key={s.id} style={{ borderBottom: '1px solid var(--color-border-light)', fontSize: '0.85rem' }}>
                          <td style={{ padding: '12px 16px' }}>{typeof s.petani === 'object' ? (s.petani?.nama || '-') : (s.petani || '-')}</td>
                          <td style={{ padding: '12px 16px', fontWeight: '600' }}>{typeof s.peralatan === 'object' ? (s.peralatan?.nama || '-') : (s.peralatan || '-')}</td>
                          <td style={{ padding: '12px 16px' }}>{s.durasi_hari || s.durasi} Hari</td>
                          <td style={{ padding: '12px 16px' }}>{formatRupiah(s.totalBiaya || s.total_biaya)}</td>
                          <td style={{ padding: '12px 16px' }}>
                            <button onClick={() => navigate('/sewa-peralatan')} style={{ padding: '4px 8px', background: 'var(--color-primary)', color: 'white', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '600' }}>
                              Tinjau
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" style={{ textAlign: 'center', padding: '24px', color: 'var(--color-text-muted)' }}>Tidak ada pengajuan sewa pending</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Income breakdown (pure CSS viz) */}
            <div style={{ background: 'white', borderRadius: '12px', padding: '20px', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '16px' }}>Statistik Pemanfaatan Lahan per Jenis</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                    <span>Sawah</span>
                    <span style={{ fontWeight: '700' }}>56% (4.5 Ha)</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: '56%', height: '100%', background: 'var(--color-secondary)' }}></div>
                  </div>
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                    <span>Perkebunan</span>
                    <span style={{ fontWeight: '700' }}>30% (2.4 Ha)</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: '30%', height: '100%', background: 'var(--color-primary-light)' }}></div>
                  </div>
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                    <span>Tegalan / Lahan Kering</span>
                    <span style={{ fontWeight: '700' }}>14% (1.1 Ha)</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: '14%', height: '100%', background: 'var(--color-accent)' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderBPPDashboard = () => {
    const pendingVerifikasi = (stats.antrean_verifikasi || []).filter(Boolean);
    
    return (
      <div className="dashboard-grid animate-fade-in-up">


        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ width: '100%' }}>
            {/* Pending verifications */}
            <div style={{ background: 'white', borderRadius: '12px', padding: '20px', marginBottom: '24px', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Antrean Verifikasi Lahan ({pendingVerifikasi.length})</h3>
                <button onClick={() => navigate('/verifikasi-lahan')} style={{ fontSize: '0.85rem', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '600' }}>
                  Semua Antrean <ArrowRight size={14} />
                </button>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', minWidth: '600px', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--color-border)', textAlign: 'left', fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                      <th style={{ width: 150, padding: '12px 16px' }}>Petani</th>
                      <th style={{ padding: '12px 16px' }}>Lokasi Lahan</th>
                      <th style={{ width: 100, padding: '12px 16px' }}>Luas</th>
                      <th style={{ width: 110, padding: '12px 16px' }}>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingVerifikasi.length > 0 ? (
                      pendingVerifikasi.slice(0, 3).map((l) => (
                        <tr key={l.id} style={{ borderBottom: '1px solid var(--color-border-light)', fontSize: '0.85rem' }}>
                          <td style={{ padding: '12px 16px' }}>{typeof l.pemilik === 'object' ? (l.pemilik?.nama || '-') : (l.pemilik || '-')}</td>
                          <td style={{ padding: '12px 16px' }}>{l.lokasi}</td>
                          <td style={{ padding: '12px 16px' }}>{l.luas} Ha</td>
                          <td style={{ padding: '12px 16px' }}>
                            <button onClick={() => navigate('/verifikasi-lahan')} style={{ padding: '4px 8px', background: 'var(--color-secondary)', color: 'white', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '600' }}>
                              Verifikasi
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" style={{ textAlign: 'center', padding: '24px', color: 'var(--color-text-muted)' }}>Semua lahan sudah diverifikasi</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderAdminDashboard = () => {
    return (
      <div className="dashboard-grid animate-fade-in-up">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Logs */}
          <div style={{ width: '100%' }}>
          <div style={{ background: 'white', borderRadius: '12px', padding: '20px', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Log Aktivitas Sistem</h3>
              <button onClick={() => navigate('/log-aktivitas')} style={{ fontSize: '0.85rem', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '600' }}>
                Lihat Semua <ArrowRight size={14} />
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {(stats.log_aktivitas || []).filter(Boolean).slice(0, 5).map((log) => (
                <div key={log.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-border-light)', paddingBottom: '8px', fontSize: '0.85rem' }}>
                  <div>
                    <span style={{ fontWeight: '600', color: 'var(--color-text)' }}>{log.user_name || (typeof log.user === 'object' ? log.user?.nama : log.user) || '-'}</span>
                    <span style={{ color: 'var(--color-text-secondary)', marginLeft: '4px' }}>({log.aksi})</span>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>{log.detail}</div>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                    {(log.created_at || log.waktu || '').replace('T', ' ').substring(11, 16) || '-'}
                  </span>
                </div>
              ))}
            </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={{ animation: 'fadeIn 0.3s ease' }}>
      {loading && <LoadingSpinner message="Memuat dashboard..." />}
      {error && <div style={{ padding: '20px', textAlign: 'center', color: 'var(--color-danger)' }}>Gagal memuat data: {error.message}</div>}
      {/* Welcome Greeting Header */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button 
            onClick={() => {
              import('html2pdf.js').then((html2pdf) => {
                const element = document.querySelector('.admin-card') || document.body;
                const opt = {
                  margin: 0.5,
                  filename: 'Dashboard_Report.pdf',
                  image: { type: 'jpeg', quality: 0.98 },
                  html2canvas: { scale: 2, useCORS: true },
                  jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
                };
                html2pdf.default().set(opt).from(element).save();
              });
            }}
            style={{ background: 'white', padding: '8px 16px', borderRadius: '24px', border: '1px solid var(--color-border)', fontSize: '0.85rem', fontWeight: '600', color: 'var(--color-primary)', boxShadow: 'var(--shadow-xs)', display: 'inline-flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
          >
            <Download size={14} /> Unduh Laporan PDF
          </button>
          <div style={{ background: 'white', padding: '8px 16px', borderRadius: '24px', border: '1px solid var(--color-border)', fontSize: '0.85rem', fontWeight: '600', color: 'var(--color-text-secondary)', boxShadow: 'var(--shadow-xs)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Calendar size={14} /> {todayDateStr}
          </div>
        </div>
      </div>

      {/* Conditional Dashboard Rendering */}
      {!loading && !error && role === 'petani' && renderPetaniDashboard()}
      {!loading && !error && role === 'pengurus' && renderPengurusDashboard()}
      {!loading && !error && role === 'bpp' && renderBPPDashboard()}
      {!loading && !error && role === 'admin' && renderAdminDashboard()}

      
    </div>
  );
}

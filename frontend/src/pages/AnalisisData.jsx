import { useState } from 'react';
import { dataLahan, daftarWilayah, formatRupiah } from '../data/mockData';
import { BarChart2, PieChart, Map, FileDown, Download } from 'lucide-react';

export default function AnalisisData() {
  const [filterPeriod, setFilterPeriod] = useState('6Bulan');

  // Math Statistics
  const totalLahan = dataLahan.length;
  const totalLuas = dataLahan.reduce((sum, item) => sum + item.luas, 0).toFixed(1);
  const avgLuas = (totalLuas / totalLahan).toFixed(2);
  const verifiedLahan = dataLahan.filter(l => l.statusVerifikasi === 'terverifikasi').length;

  return (
    <div style={{ animation: 'fadeIn 0.3s ease' }}>
      <div className="admin-card">
        {/* Header Row Inside Card */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid #dee2e6' }}>
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#333', margin: 0 }}>Analisis &amp; Laporan Lahan</h1>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', marginTop: '2px', margin: 0 }}>
              Data statistik komprehensif kepemilikan dan verifikasi lahan wilayah Kota.
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button 
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 16px', background: 'var(--color-primary)', color: 'white', borderRadius: '8px', fontWeight: '600', fontSize: '0.85rem', height: '38px', boxSizing: 'border-box', cursor: 'pointer' }}
              onClick={() => alert('Mengunduh laporan PDF...')}
            >
              <Download size={16} /> Unduh Laporan PDF
            </button>
            <nav style={{ marginBottom: 0, fontSize: '0.85rem', display: 'flex', alignItems: 'center', color: 'var(--color-primary)' }}>
              <span style={{ margin: '0 8px' }}>/</span>
              <span style={{ fontWeight: '500' }}>analisisdata</span>
            </nav>
          </div>
        </div>

        <div style={{ padding: '20px' }}>

      {/* Stats Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '24px' }}>
        <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
          <small style={{ color: 'var(--color-text-muted)', fontWeight: '600' }}>TOTAL LAHAN TERDAFTAR</small>
          <div style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--color-primary)', marginTop: '8px' }}>{totalLahan} Unit</div>
        </div>
        <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
          <small style={{ color: 'var(--color-text-muted)', fontWeight: '600' }}>LUAS TOTAL KESELURUHAN</small>
          <div style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--color-secondary)', marginTop: '8px' }}>{totalLuas} Hektar</div>
        </div>
        <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
          <small style={{ color: 'var(--color-text-muted)', fontWeight: '600' }}>RATA-RATA LUAS LAHAN</small>
          <div style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--color-accent)', marginTop: '8px' }}>{avgLuas} Hektar</div>
        </div>
        <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
          <small style={{ color: 'var(--color-text-muted)', fontWeight: '600' }}>PERSENTASE TERVERIFIKASI</small>
          <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#10b981', marginTop: '8px' }}>
            {((verifiedLahan / totalLahan) * 100).toFixed(0)}%
          </div>
        </div>
      </div>

      {/* Main Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }} className="layout-col-mobile">
        
        {/* Land types distribution */}
        <div style={{ background: 'white', borderRadius: '12px', padding: '24px', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BarChart2 size={18} style={{ color: 'var(--color-primary)' }} /> Distribusi Jenis Lahan
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
                <span>Sawah</span>
                <span style={{ fontWeight: '700' }}>45% (10.2 Ha)</span>
              </div>
              <div style={{ width: '100%', height: '12px', background: '#e2e8f0', borderRadius: '6px', overflow: 'hidden' }}>
                <div style={{ width: '45%', height: '100%', background: 'var(--color-secondary)' }}></div>
              </div>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
                <span>Tegalan / Lahan Kering</span>
                <span style={{ fontWeight: '700' }}>25% (5.6 Ha)</span>
              </div>
              <div style={{ width: '100%', height: '12px', background: '#e2e8f0', borderRadius: '6px', overflow: 'hidden' }}>
                <div style={{ width: '25%', height: '100%', background: 'var(--color-primary-light)' }}></div>
              </div>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
                <span>Perkebunan</span>
                <span style={{ fontWeight: '700' }}>20% (4.5 Ha)</span>
              </div>
              <div style={{ width: '100%', height: '12px', background: '#e2e8f0', borderRadius: '6px', overflow: 'hidden' }}>
                <div style={{ width: '20%', height: '100%', background: 'var(--color-accent)' }}></div>
              </div>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
                <span>Kolam Ikan</span>
                <span style={{ fontWeight: '700' }}>5% (1.1 Ha)</span>
              </div>
              <div style={{ width: '100%', height: '12px', background: '#e2e8f0', borderRadius: '6px', overflow: 'hidden' }}>
                <div style={{ width: '5%', height: '100%', background: '#3b82f6' }}></div>
              </div>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
                <span>Ladang Terbuka</span>
                <span style={{ fontWeight: '700' }}>5% (1.1 Ha)</span>
              </div>
              <div style={{ width: '100%', height: '12px', background: '#e2e8f0', borderRadius: '6px', overflow: 'hidden' }}>
                <div style={{ width: '5%', height: '100%', background: '#8b5cf6' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Verification Statuses */}
        <div style={{ background: 'white', borderRadius: '12px', padding: '24px', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <PieChart size={18} style={{ color: 'var(--color-secondary)' }} /> Status Verifikasi Lahan
          </h3>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '30px', height: '200px' }} className="layout-col-mobile">
            {/* Donut representation */}
            <div style={{ 
              width: '140px', 
              height: '140px', 
              borderRadius: '50%', 
              background: 'conic-gradient(var(--color-secondary) 0% 60%, var(--color-warning) 60% 90%, var(--color-danger) 90% 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div style={{ width: '84px', height: '84px', background: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '1.1rem' }}>
                {totalLahan} Lahan
              </div>
            </div>

            {/* Legend indicators */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '12px', height: '12px', background: 'var(--color-secondary)', borderRadius: '3px' }}></div>
                <span>Terverifikasi: <strong>60% ({verifiedLahan})</strong></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '12px', height: '12px', background: 'var(--color-warning)', borderRadius: '3px' }}></div>
                <span>Pending: <strong>30% (3)</strong></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '12px', height: '12px', background: 'var(--color-danger)', borderRadius: '3px' }}></div>
                <span>Ditolak: <strong>10% (1)</strong></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lands per region table breakdowns */}
      <div style={{ background: 'white', borderRadius: '12px', padding: '24px', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Map size={18} style={{ color: 'var(--color-accent)' }} /> Rincian Lahan Berdasarkan Wilayah Kecamatan
        </h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem', tableLayout: 'fixed', minWidth: '700px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--color-border)', color: 'var(--color-text-secondary)', fontWeight: '700' }}>
                <th style={{ padding: '12px' }}>Nama Wilayah (Kecamatan)</th>
                <th style={{ width: 140, padding: '12px' }}>Jumlah Lahan</th>
                <th style={{ width: 160, padding: '12px' }}>Total Luas Wilayah</th>
                <th style={{ width: 180, padding: '12px' }}>Kepadatan</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid var(--color-border-light)' }}>
                <td style={{ padding: '12px', fontWeight: '600' }}>Kec. Cianjur</td>
                <td style={{ padding: '12px' }}>3 Lahan</td>
                <td style={{ padding: '12px', fontWeight: '750' }}>5.1 Ha</td>
                <td style={{ padding: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ flex: 1, height: '6px', background: '#e2e8f0', borderRadius: '3px' }}>
                      <div style={{ width: '65%', height: '100%', background: 'var(--color-secondary)', borderRadius: '3px' }}></div>
                    </div>
                    <span>Tinggi</span>
                  </div>
                </td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--color-border-light)' }}>
                <td style={{ padding: '12px', fontWeight: '600' }}>Kec. Lembang</td>
                <td style={{ padding: '12px' }}>1 Lahan</td>
                <td style={{ padding: '12px', fontWeight: '750' }}>3.2 Ha</td>
                <td style={{ padding: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ flex: 1, height: '6px', background: '#e2e8f0', borderRadius: '3px' }}>
                      <div style={{ width: '40%', height: '100%', background: 'var(--color-primary-light)', borderRadius: '3px' }}></div>
                    </div>
                    <span>Sedang</span>
                  </div>
                </td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--color-border-light)' }}>
                <td style={{ padding: '12px', fontWeight: '600' }}>Kec. Bandung</td>
                <td style={{ padding: '12px' }}>2 Lahan</td>
                <td style={{ padding: '12px', fontWeight: '750' }}>6.0 Ha</td>
                <td style={{ padding: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ flex: 1, height: '6px', background: '#e2e8f0', borderRadius: '3px' }}>
                      <div style={{ width: '80%', height: '100%', background: 'var(--color-secondary)', borderRadius: '3px' }}></div>
                    </div>
                    <span>Sangat Tinggi</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <style>{`
        @media (max-width: 900px) {
          .layout-col-mobile {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
        </div>
      </div>
    </div>
  );
}

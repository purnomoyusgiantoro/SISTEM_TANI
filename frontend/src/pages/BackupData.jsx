import { useState, useEffect } from 'react';
import * as Mock from '../data/mockData';
import { useToast } from '../context/ToastContext';
import backupApi from '../api/backup';
import { useApi, useMutation } from '../hooks/useApi';
import { Database, Download, UploadCloud, Trash2, Calendar, HardDrive, ShieldAlert } from 'lucide-react';
import Modal from '../components/shared/Modal';

export default function BackupData() {
  const [backups, setBackups] = useState([
    { id: 1, nama: 'backup_db_simantan_auto_20260620.sql', ukuran: '245 MB', tanggal: '2026-06-20 06:00', tipe: 'Otomatis', status: 'sukses' },
    { id: 2, nama: 'backup_db_simantan_manual_20260618.sql', ukuran: '242 MB', tanggal: '2026-06-18 14:30', tipe: 'Manual', status: 'sukses' },
    { id: 3, nama: 'backup_db_simantan_auto_20260613.sql', ukuran: '238 MB', tanggal: '2026-06-13 06:00', tipe: 'Otomatis', status: 'sukses' },
  ]);

  const [scheduleAuto, setScheduleAuto] = useState(true);
  const [scheduleFrequency, setScheduleFrequency] = useState('Harian');
  const [showRestoreModal, setShowRestoreModal] = useState(null);

  const handleBackupNow = () => {
    const newBackup = {
      id: backups.length + 1,
      nama: `backup_db_simantan_manual_${new Date().toISOString().slice(0,10).replace(/-/g,'')}.sql`,
      ukuran: '246 MB',
      tanggal: new Date().toISOString().replace('T',' ').slice(0,16),
      tipe: 'Manual',
      status: 'sukses'
    };
    
    // Simulating delay
    alert('Memulai proses pencadangan database...');
    setBackups([newBackup, ...backups]);
    alert('Pencadangan database berhasil disimpan!');
  };

  const handleRestore = (backup) => {
    alert(`Memulihkan sistem dari cadangan file: ${backup.nama}`);
    setShowRestoreModal(null);
    alert('Sistem berhasil dipulihkan!');
  };

  const handleDelete = (id) => {
    if (window.confirm('Hapus file backup ini secara permanen?')) {
      setBackups(prev => prev.filter(b => b.id !== id));
    }
  };

  return (
    <div style={{ animation: 'fadeIn 0.3s ease' }}>
      <div className="admin-card">
        {/* Header Row Inside Card */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid #dee2e6' }}>
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#333', margin: 0 }}>Backup &amp; Pemulihan Data</h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button 
              onClick={handleBackupNow}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 16px', background: 'var(--color-secondary)', color: 'white', borderRadius: '8px', fontWeight: '600', fontSize: '0.85rem', cursor: 'pointer', height: '38px', boxSizing: 'border-box' }}
            >
              <Database size={16} /> Backup Sekarang
            </button>
            <nav style={{ marginBottom: 0, fontSize: '0.85rem', display: 'flex', alignItems: 'center', color: 'var(--color-primary)' }}>
              <span style={{ margin: '0 8px' }}>/</span>
              <span style={{ fontWeight: '500' }}>backupdata</span>
            </nav>
          </div>
        </div>
        
        <div style={{ padding: '20px' }}>

      {/* Warning Box */}
      <div style={{ display: 'flex', gap: '16px', background: 'var(--color-danger-50)', border: '1px solid var(--color-danger-light)', borderRadius: '8px', padding: '16px', marginBottom: '24px', alignItems: 'center' }}>
        <ShieldAlert size={36} style={{ color: 'var(--color-danger)', flexShrink: 0 }} />
        <div>
          <h4 style={{ color: 'var(--color-danger)', fontWeight: '700', fontSize: '0.9rem' }}>Peringatan Penting Pemulihan Data (Restore)</h4>
          <p style={{ fontSize: '0.825rem', color: 'var(--color-text)', marginTop: '2px' }}>
            Pemulihan sistem menggunakan file cadangan lama akan menimpa data aktif saat ini. Pastikan tidak ada transaksi sewa atau verifikasi yang sedang berlangsung saat memulihkan database.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }} className="layout-col-mobile">
        
        {/* Left Side: Backup History */}
        <div style={{ background: 'white', borderRadius: '8px', border: '1px solid var(--color-border)', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Cadangan Tersedia</h3>
            <button 
              onClick={handleBackupNow}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', background: 'var(--color-secondary)', color: 'white', borderRadius: '8px', fontWeight: '600', fontSize: '0.9rem' }}
            >
              <Database size={16} /> Backup Sekarang
            </button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem', tableLayout: 'fixed', minWidth: '800px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--color-border)', color: 'var(--color-text-secondary)', fontWeight: '700' }}>
                  <th style={{ padding: '12px' }}>Nama File Cadangan</th>
                  <th style={{ width: 100, padding: '12px' }}>Ukuran</th>
                  <th style={{ width: 150, padding: '12px' }}>Tanggal Dibuat</th>
                  <th style={{ width: 100, padding: '12px' }}>Tipe</th>
                  <th style={{ width: 140, padding: '12px' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {backups.map(backup => (
                  <tr key={backup.id} style={{ borderBottom: '1px solid var(--color-border-light)' }}>
                    <td style={{ padding: '12px', fontWeight: '600', color: 'var(--color-primary-light)' }}>{backup.nama}</td>
                    <td style={{ padding: '12px' }}>{backup.ukuran}</td>
                    <td style={{ padding: '12px', color: 'var(--color-text-muted)' }}>{backup.tanggal}</td>
                    <td style={{ padding: '12px' }}>
                      <span style={{ 
                        fontSize: '0.75rem', 
                        padding: '1px 6px', 
                        borderRadius: '4px',
                        background: backup.tipe === 'Otomatis' ? 'var(--color-primary-50)' : '#f1f5f9',
                        color: backup.tipe === 'Otomatis' ? 'var(--color-primary)' : 'var(--color-text)'
                      }}>{backup.tipe}</span>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button 
                          onClick={() => setShowRestoreModal(backup)}
                          style={{ padding: '4px 8px', background: 'var(--color-primary)', color: 'white', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '600' }}
                        >
                          Restore
                        </button>
                        <button 
                          onClick={() => handleDelete(backup.id)}
                          style={{ padding: '4px', color: 'var(--color-danger)' }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Side: Settings & Upload */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Automated Schedule settings */}
          <div style={{ background: 'white', borderRadius: '8px', border: '1px solid var(--color-border)', padding: '20px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calendar size={18} style={{ color: 'var(--color-primary)' }} /> Jadwal Cadangan
            </h3>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.9rem' }}>Backup Otomatis</span>
              <input 
                type="checkbox" 
                checked={scheduleAuto}
                onChange={() => setScheduleAuto(!scheduleAuto)}
                style={{ width: '20px', height: '20px', cursor: 'pointer' }}
              />
            </div>

            {scheduleAuto && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <label style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', fontWeight: '600' }}>Frekuensi</label>
                <select 
                  value={scheduleFrequency}
                  onChange={(e) => setScheduleFrequency(e.target.value)}
                  style={{ padding: '8px', fontSize: '0.85rem' }}
                >
                  <option value="Harian">Setiap Hari (Pukul 06:00)</option>
                  <option value="Mingguan">Setiap Minggu (Hari Minggu)</option>
                  <option value="Bulanan">Setiap Bulan (Tanggal 1)</option>
                </select>
              </div>
            )}
          </div>

          {/* Upload Backup File directly */}
          <div style={{ background: 'white', borderRadius: '8px', border: '1px solid var(--color-border)', padding: '20px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <UploadCloud size={18} style={{ color: 'var(--color-secondary)' }} /> Unggah File Backup
            </h3>
            <div style={{ border: '2px dashed var(--color-border)', padding: '24px 16px', textAlign: 'center', borderRadius: '8px', cursor: 'pointer' }}>
              <UploadCloud size={32} style={{ margin: '0 auto 12px auto', color: 'var(--color-text-muted)' }} />
              <div style={{ fontSize: '0.85rem', fontWeight: '600' }}>Tarik & Lepas File .SQL</div>
              <small style={{ color: 'var(--color-text-muted)' }}>Maksimal ukuran 500 MB</small>
            </div>
          </div>

        </div>
      </div>

      {/* Restore Confirmation Modal */}
      {showRestoreModal && (
        <Modal title="Konfirmasi Pemulihan Database" onClose={() => setShowRestoreModal(null)}>
          <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
            <ShieldAlert size={24} style={{ color: 'var(--color-danger)', flexShrink: 0 }} />
            <p style={{ fontSize: '0.9rem', color: 'var(--color-text)' }}>
              Apakah Anda benar-benar yakin ingin memulihkan database SIMANTAN menggunakan berkas <strong>"{showRestoreModal.nama}"</strong>? 
              <br/><br/>
              Tindakan ini akan menimpa seluruh data transaksi, lahan, sewa, serta berita yang terdaftar saat ini secara tidak dapat dibatalkan.
            </p>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
            <button 
              type="button" 
              onClick={() => setShowRestoreModal(null)}
              style={{ padding: '8px 16px', border: '1px solid var(--color-border)', borderRadius: '6px', fontWeight: '600' }}
            >
              Batal
            </button>
            <button 
              onClick={() => handleRestore(showRestoreModal)}
              style={{ padding: '8px 16px', background: 'var(--color-danger)', color: 'white', borderRadius: '6px', fontWeight: '600' }}
            >
              Ya, Pulihkan Sekarang
            </button>
          </div>
        </Modal>
      )}
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

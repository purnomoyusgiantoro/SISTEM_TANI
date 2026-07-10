import { useState, useEffect } from 'react';
import * as Mock from '../data/mockData';
import { useToast } from '../context/ToastContext';
import logApi from '../api/log';
import { useApi } from '../hooks/useApi';
import { FileText, Download, ShieldAlert, CheckCircle, Info, RefreshCw } from 'lucide-react';
import StatusBadge from '../components/shared/StatusBadge';

export default function LogAktivitas() {
  const [logs, setLogs] = useState(Mock.logAktivitas);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLevel, setFilterLevel] = useState('semua');

  // Filter logs logic
  const filteredLogs = logs.filter(log => {
    const matchSearch = searchQuery === '' || 
      log.user.toLowerCase().includes(searchQuery.toLowerCase()) || 
      log.aksi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.detail.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchLevel = filterLevel === 'semua' || log.level === filterLevel;
    
    return matchSearch && matchLevel;
  });

  const getLogIcon = (level) => {
    switch (level) {
      case 'success':
        return <CheckCircle size={16} style={{ color: 'var(--color-success)' }} />;
      case 'error':
        return <ShieldAlert size={16} style={{ color: 'var(--color-danger)' }} />;
      case 'warning':
        return <ShieldAlert size={16} style={{ color: 'var(--color-warning)' }} />;
      default:
        return <Info size={16} style={{ color: 'var(--color-info)' }} />;
    }
  };

  const handleExport = () => {
    alert('Mengekspor log aktivitas ke CSV...');
  };

  return (
    <div style={{ animation: 'fadeIn 0.3s ease' }}>
      <div className="admin-card">
        {/* Header Row Inside Card */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid #dee2e6' }}>
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#333', margin: 0 }}>Log Aktivitas Sistem</h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button 
              onClick={() => setLogs(Mock.logAktivitas)}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '0 16px', border: '1px solid var(--color-border)', borderRadius: '8px', fontSize: '0.85rem', fontWeight: '600', background: 'white', cursor: 'pointer', height: '38px', boxSizing: 'border-box' }}
            >
              <RefreshCw size={14} /> Refresh
            </button>
            <button 
              onClick={handleExport}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '0 16px', background: 'var(--color-primary)', color: 'white', borderRadius: '8px', fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer', height: '38px', boxSizing: 'border-box' }}
            >
              <Download size={14} /> Ekspor CSV
            </button>
            <nav style={{ marginBottom: 0, fontSize: '0.85rem', display: 'flex', alignItems: 'center', color: 'var(--color-primary)' }}>
              <span style={{ margin: '0 8px' }}>/</span>
              <span style={{ fontWeight: '500' }}>logaktivitas</span>
            </nav>
          </div>
        </div>
        
        <div style={{ padding: '20px' }}>

      {/* Filter Options */}
      <div className="filter-row">
        <input 
          type="text" 
          placeholder="Cari kata kunci log (pengguna, aksi, detail)..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="filter-input"
          style={{ flex: 1, minWidth: '240px' }}
        />
        <select 
          value={filterLevel}
          onChange={(e) => setFilterLevel(e.target.value)}
          className="filter-select"
          style={{ width: '180px' }}
        >
          <option value="semua">Semua Tingkatan</option>
          <option value="info">Informasi (Info)</option>
          <option value="success">Sukses (Success)</option>
          <option value="warning">Peringatan (Warning)</option>
          <option value="error">Kesalahan (Error)</option>
        </select>
      </div>

      {/* Logs Table Area */}
      <div style={{ background: 'white', borderRadius: '8px', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '700px', tableLayout: 'fixed' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--color-border)', fontSize: '0.85rem', color: 'var(--color-text-secondary)', background: 'var(--color-bg)', fontWeight: '700' }}>
                <th style={{ padding: '12px 16px', width: '60px' }}>Tipe</th>
                <th style={{ padding: '12px 16px', width: '180px' }}>Waktu Kejadian</th>
                <th style={{ padding: '12px 16px', width: '160px' }}>Pengguna</th>
                <th style={{ padding: '12px 16px', width: '160px' }}>Aksi</th>
                <th style={{ padding: '12px 16px' }}>Detail Log</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.length > 0 ? (
                filteredLogs.map(log => (
                  <tr 
                    key={log.id} 
                    style={{ 
                      borderBottom: '1px solid var(--color-border-light)', 
                      fontSize: '0.875rem',
                      borderLeft: `3px solid ${
                        log.level === 'error' ? 'var(--color-danger)' : 
                        log.level === 'warning' ? 'var(--color-warning)' : 
                        log.level === 'success' ? 'var(--color-success)' : 
                        'var(--color-info)'
                      }`
                    }}
                  >
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                      {getLogIcon(log.level)}
                    </td>
                    <td style={{ padding: '12px 16px', color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>
                      {log.waktu}
                    </td>
                    <td style={{ padding: '12px 16px', fontWeight: '600' }}>
                      {log.user}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ 
                        fontSize: '0.75rem', 
                        fontWeight: '600', 
                        background: '#f1f5f9', 
                        padding: '2px 8px', 
                        borderRadius: '4px',
                        color: 'var(--color-text)'
                      }}>
                        {log.aksi}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>
                      {log.detail}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '40px 16px', color: 'var(--color-text-muted)' }}>
                    Tidak ada catatan log yang cocok
                  </td>
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
}

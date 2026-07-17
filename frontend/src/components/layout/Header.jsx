import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { Bell, Search, Menu, User, Settings, LogOut, ChevronDown } from 'lucide-react';

export default function Header({ toggleMobileSidebar }) {
  const { currentUser, logout } = useAuth();
  const { notifications, unreadCount, fetchNotifications, markAsRead, markAllAsRead } = useNotification();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const notifRef = useRef(null);
  const profileRef = useRef(null);

  // Close menus on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Title Mapping based on path
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.startsWith('/dashboard')) return 'Dashboard';
    if (path.startsWith('/data-lahan')) return 'Manajemen Data Lahan';
    if (path.startsWith('/sewa-peralatan')) return 'Sewa Peralatan Pertanian';
    if (path.startsWith('/pembayaran')) return 'Pembayaran & Tagihan';
    if (path.startsWith('/kegiatan')) return 'Catatan Kegiatan Lapangan';
    if (path.startsWith('/struktur-organisasi')) return 'Struktur Organisasi';
    if (path.startsWith('/berita')) return 'Berita Pertanian';
    if (path.startsWith('/verifikasi-lahan')) return 'Verifikasi Lahan (BPP)';
    if (path.startsWith('/kelola-berita')) return 'Kelola Berita & Informasi';
    if (path.startsWith('/analisis-data')) return 'Analisis & Statistik';
    if (path.startsWith('/kelola-pengguna')) return 'Manajemen Pengguna';
    if (path.startsWith('/log-aktivitas')) return 'Log Aktivitas Sistem';
    if (path.startsWith('/backup-data')) return 'Backup & Restore Data';
    return 'Sistem Tani';
  };

  const handleTextResize = (action) => {
    const html = document.documentElement;
    if (action === 'increase') {
      html.style.fontSize = '110%';
    } else if (action === 'decrease') {
      html.style.fontSize = '90%';
    } else {
      html.style.fontSize = '100%';
    }
  };



  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getInitials = (name) => {
    if (!name) return 'US';
    return name
      .split(' ')
      .map(n => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <header className="header">
      <button className="header-menu-btn" style={{ display: 'flex' }} onClick={toggleMobileSidebar}>
        <Menu size={20} />
      </button>

      <h2 className="header-title" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{getPageTitle()}</h2>

      <div className="header-actions" style={{ marginLeft: 'auto' }}>
        {/* Accessibility Tools */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'var(--color-bg)', padding: '4px 8px', borderRadius: '20px', border: '1px solid var(--color-border)' }}>
          <button onClick={() => handleTextResize('decrease')} style={{ fontSize: '0.75rem', fontWeight: 'bold', padding: '2px 6px', color: 'var(--color-text-secondary)', cursor: 'pointer' }}>A-</button>
          <button onClick={() => handleTextResize('reset')} style={{ fontSize: '0.85rem', fontWeight: 'bold', padding: '2px 6px', color: 'var(--color-text-secondary)', cursor: 'pointer' }}>A</button>
          <button onClick={() => handleTextResize('increase')} style={{ fontSize: '1rem', fontWeight: 'bold', padding: '2px 6px', color: 'var(--color-text-secondary)', cursor: 'pointer' }}>A+</button>
        </div>

        {/* Notifications */}
        <div className="header-notification" ref={notifRef}>
          <button 
            className="header-icon-btn" 
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="header-notification-badge">{unreadCount}</span>
            )}
          </button>

          {showNotifications && (
            <div className="header-notification-panel">
              <div className="header-notification-header">
                <h4>Notifikasi</h4>
                {unreadCount > 0 && (
                  <button onClick={markAllAsRead}>Tandai dibaca semua</button>
                )}
              </div>
              <div className="header-notification-list">
                {notifications.length > 0 ? (
                  notifications.map((notif, idx) => (
                    <div 
                      key={notif?.id || idx} 
                      className={`header-notification-item ${!notif?.dibaca ? 'unread' : ''}`}
                      style={{
                        padding: '12px 16px',
                        borderBottom: '1px solid var(--color-border)',
                        backgroundColor: 'transparent',
                        fontSize: '0.85rem'
                      }}
                    >
                      <div style={{ fontWeight: !notif?.dibaca ? '800' : '600', color: 'var(--color-text)', marginBottom: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {!notif?.dibaca && <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-info)' }}></span>}
                        {notif?.judul}
                      </div>
                      <div style={{ color: 'var(--color-text-secondary)' }}>{notif?.pesan}</div>
                      <small style={{ display: 'block', marginTop: '4px', color: 'var(--color-text-muted)' }}>
                        {notif?.waktu}
                      </small>
                    </div>
                  ))
                ) : (
                  <div style={{ padding: '24px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                    Tidak ada notifikasi baru
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile Menu */}
        <div className="header-profile" ref={profileRef} style={{ position: 'relative' }}>
          <button 
            className="flex items-center gap-2" 
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            style={{ padding: '4px 12px 4px 4px', borderRadius: '24px', border: '1px solid var(--color-border)', background: 'white', transition: 'background 0.2s', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <div className="sidebar-user-avatar" style={{ width: '32px', height: '32px', fontSize: '0.8rem', background: '#f8f9fa', color: '#495057', border: '1px solid #dee2e6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
              {getInitials(currentUser?.nama)}
            </div>
            <div style={{ textAlign: 'left', display: 'none' }} className="profile-text-hidden">
              <div style={{ fontSize: '1rem', fontWeight: '600', color: '#333' }}>{currentUser?.nama}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', textTransform: 'capitalize' }}>{currentUser?.role}</div>
            </div>
            <ChevronDown size={14} style={{ color: 'var(--color-text-muted)', marginLeft: '4px' }} />
          </button>

          {showProfileMenu && (
            <div 
              className="header-profile-dropdown"
              style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                width: '180px',
                background: 'white',
                border: '1px solid var(--color-border)',
                borderRadius: '4px',
                boxShadow: 'none',
                marginTop: '8px',
                zIndex: 100,
                padding: '6px 0'
              }}
            >
              <div style={{ padding: '8px 16px', borderBottom: '1px solid var(--color-border)', marginBottom: '4px' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--color-text)' }}>{currentUser?.nama}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'capitalize' }}>{currentUser?.role}</div>
              </div>
              <button 
                onClick={() => navigate('/dashboard')} 
                style={{ 
                  width: '100%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px', 
                  padding: '8px 16px', 
                  fontSize: '0.85rem', 
                  color: 'var(--color-text-secondary)' 
                }}
              >
                <User size={14} /> Profil Saya
              </button>
              <button 
                style={{ 
                  width: '100%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px', 
                  padding: '8px 16px', 
                  fontSize: '0.85rem', 
                  color: 'var(--color-text-secondary)' 
                }}
              >
                <Settings size={14} /> Pengaturan
              </button>
              <button 
                onClick={handleLogout}
                style={{ 
                  width: '100%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px', 
                  padding: '8px 16px', 
                  fontSize: '0.85rem', 
                  color: 'var(--color-danger)',
                  borderTop: '1px solid var(--color-border)',
                  marginTop: '4px'
                }}
              >
                <LogOut size={14} /> Keluar
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

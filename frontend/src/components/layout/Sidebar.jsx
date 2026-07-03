import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  MapPin,
  Tractor,
  CreditCard,
  CalendarDays,
  Users,
  Newspaper,
  CheckCircle,
  ShieldCheck,
  Package,
  FileBarChart,
  UserCog,
  ClipboardList,
  DatabaseBackup,
  Landmark,
  ChevronLeft,
  ChevronRight,
  Wheat,
} from 'lucide-react';

const navConfig = {
  petani: [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Data Lahan', path: '/data-lahan', icon: MapPin },
    { 
      label: 'Keuangan', 
      icon: CreditCard,
      subItems: [
        { label: 'Pembayaran', path: '/pembayaran' }
      ]
    },
    { 
      label: 'Sewa Peralatan', 
      icon: Tractor,
      subItems: [
        { label: 'Penyewaan', path: '/sewa-peralatan' }
      ]
    },
    { 
      label: 'Organisasi Tani',
      icon: Users,
      subItems: [
        { label: 'Kegiatan', path: '/kegiatan' },
        { label: 'Struktur Organisasi', path: '/struktur-organisasi' }
      ]
    },
    { label: 'Berita Pertanian', path: '/berita', icon: Newspaper }
  ],
  pengurus: [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Data Lahan', path: '/data-lahan', icon: MapPin },
    { 
      label: 'Sewa Peralatan', 
      icon: Tractor,
      subItems: [
        { label: 'Data Sewa', path: '/sewa-peralatan' }
      ]
    },
    { 
      label: 'Keuangan', 
      icon: CreditCard,
      subItems: [
        { label: 'Pembayaran', path: '/pembayaran' }
      ]
    },
    { 
      label: 'Kelola Organisasi',
      icon: Users,
      subItems: [
        { label: 'Kegiatan', path: '/kegiatan' },
        { label: 'Struktur Organisasi', path: '/struktur-organisasi' }
      ]
    },
    { label: 'Kelola Berita', path: '/berita', icon: Newspaper }
  ],
  bpp: [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Data Lahan', path: '/data-lahan', icon: MapPin },
    { label: 'Verifikasi Lahan', path: '/verifikasi-lahan', icon: ShieldCheck },
    { label: 'Kelola Berita', path: '/kelola-berita', icon: Newspaper },
    { label: 'Analisis Data', path: '/analisis-data', icon: FileBarChart },
  ],
  admin: [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Kelola Pengguna', path: '/kelola-pengguna', icon: UserCog },
    { label: 'Log Aktivitas', path: '/log-aktivitas', icon: ClipboardList },
    { label: 'Backup Data', path: '/backup-data', icon: DatabaseBackup },
  ],
};

const roleLabels = {
  petani: 'Petani',
  pengurus: 'Pengurus',
  bpp: 'BPP',
  admin: 'Administrator',
};

export default function Sidebar({ isOpen, onToggle }) {
  const { currentUser } = useAuth();
  const location = useLocation();

  const role = currentUser?.role || 'petani';
  const items = navConfig[role] || navConfig.petani;
  const [expandedMenus, setExpandedMenus] = useState({});

  const toggleSubMenu = (label) => {
    setExpandedMenus(prev => ({
      ...prev,
      [label]: !prev[label]
    }));
  };

  const getInitials = (name) => {
    if (!name) return '?';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const isActive = (path) => {
    if (path === '/dashboard') {
      return location.pathname === '/' || location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <aside className={`sidebar${isOpen ? '' : ''}`} style={{ background: '#2d3748' }}>
      {/* Logo Section */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <Landmark size={22} />
        </div>
        <div className="sidebar-logo-text">
          <h1>Sistem Tani</h1>
          <p>Manajemen Lahan Pertanian</p>
        </div>
      </div>

      {/* User Info (Moved to Top) */}
      <div className="sidebar-user" style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <div className="sidebar-user-avatar">
          {getInitials(currentUser?.nama)}
        </div>
        <div className="sidebar-user-info">
          <div className="sidebar-user-name">
            {currentUser?.nama || 'Pengguna'}
          </div>
          <span className="sidebar-user-role">
            {roleLabels[role] || role}
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav" style={{ padding: '0' }}>
        {items.map((item, index) => {
          const Icon = item.icon;
          
          if (item.subItems) {
            const isExpanded = expandedMenus[item.label];
            const hasActiveChild = item.subItems.some(sub => isActive(sub.path));
            
            return (
              <div key={`parent-${index}`} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <div 
                  onClick={() => toggleSubMenu(item.label)}
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    padding: '12px 20px', 
                    color: 'rgba(255, 255, 255, 0.8)', 
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    background: isExpanded || hasActiveChild ? 'rgba(0,0,0,0.2)' : 'transparent'
                  }}
                >
                  <Icon size={18} style={{ marginRight: '12px' }} />
                  <span style={{ flex: 1 }}>{item.label}</span>
                  <ChevronLeft size={16} style={{ transform: isExpanded ? 'rotate(-90deg)' : 'none', transition: 'transform 0.2s', opacity: 0.5 }} />
                </div>
                {isExpanded && (
                  <div style={{ background: 'rgba(0,0,0,0.1)', padding: '4px 0' }}>
                    {item.subItems.map((sub, subIdx) => (
                      <Link
                        key={`sub-${index}-${subIdx}`}
                        to={sub.path}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          padding: '8px 20px 8px 50px',
                          color: isActive(sub.path) ? 'var(--color-text-inverse)' : 'rgba(255,255,255,0.6)',
                          fontSize: '0.85rem',
                          textDecoration: 'none',
                          background: isActive(sub.path) ? 'rgba(255,255,255,0.05)' : 'transparent'
                        }}
                        onClick={() => {
                          if (window.innerWidth < 768 && onToggle) onToggle();
                        }}
                      >
                        <span style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '1.2rem', lineHeight: 1 }}>&#8594;</span> {sub.label}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          }

          const active = isActive(item.path);

          return (
            <Link
              key={item.path}
              to={item.path}
              style={{
                display: 'flex', 
                alignItems: 'center', 
                padding: '12px 20px', 
                color: active ? 'var(--color-text-inverse)' : 'rgba(255, 255, 255, 0.8)', 
                textDecoration: 'none',
                fontSize: '0.9rem',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                background: active ? 'rgba(0,0,0,0.2)' : 'transparent'
              }}
              onClick={() => {
                if (window.innerWidth < 768 && onToggle) {
                  onToggle();
                }
              }}
            >
              <Icon size={18} style={{ marginRight: '12px' }} />
              <span style={{ flex: 1 }}>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

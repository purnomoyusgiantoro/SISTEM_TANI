import { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

export default function Layout({ children }) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const toggleMobileSidebar = () => {
    setMobileSidebarOpen(!mobileSidebarOpen);
  };

  const closeMobileSidebar = () => {
    setMobileSidebarOpen(false);
  };

  return (
    <div className="app-layout">
      {/* Sidebar - Desktop and Mobile */}
      <div 
        className={`app-sidebar ${mobileSidebarOpen ? 'active' : ''}`}
        style={{
          transform: mobileSidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          zIndex: 1000,
          width: '260px',
          transition: 'transform 0.3s ease'
        }}
      >
        <Sidebar closeMobileSidebar={closeMobileSidebar} />
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div 
          className="mobile-overlay active"
          onClick={closeMobileSidebar}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 999
          }}
        />
      )}

      {/* Main App Content Area */}
      <div 
        className="app-main"
        style={{
          marginLeft: '0px',
          width: '100%',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Header toggleMobileSidebar={toggleMobileSidebar} />
        
        <main 
          className="app-content"
          style={{
            flex: 1,
            padding: '24px',
            backgroundColor: '#f0f4f8'
          }}
        >
          {children}
        </main>
        
        {/* Footer */}
        <footer style={{
          padding: '16px 24px',
          background: 'white',
          borderTop: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.85rem',
          color: '#64748b'
        }}>
          <div>Copyright © 2021-2022 <span style={{ color: 'var(--color-primary)', fontWeight: '600' }}>Sistem Tani</span>. All rights reserved.</div>
          <div style={{ fontWeight: '500' }}>Version 1.0 - 3.0.2</div>
        </footer>
      </div>

      {/* Desktop Responsive Layout adjustment styles */}
      <style>{`
        @media (min-width: 1024px) {
          .app-sidebar {
            transform: translateX(0) !important;
          }
          .app-main {
            margin-left: 260px !important;
            width: calc(100% - 260px) !important;
          }
          .header-menu-btn {
            display: none !important;
          }
          .profile-text-hidden {
            display: block !important;
          }
        }
      `}</style>
    </div>
  );
}

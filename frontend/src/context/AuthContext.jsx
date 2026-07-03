import { createContext, useContext, useState } from 'react';
import { users } from '../data/mockData';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = (email, password) => {
    // Mock login - find user by email
    const user = users.find((u) => u.email === email);
    if (user) {
      setCurrentUser(user);
      setIsAuthenticated(true);
      return { success: true, user };
    }
    return { success: false, error: 'Email atau password salah' };
  };

  const loginAsRole = (role) => {
    // Quick login by role for demo
    const user = users.find((u) => u.role === role && u.status === 'aktif');
    if (user) {
      setCurrentUser(user);
      setIsAuthenticated(true);
      return { success: true, user };
    }
    return { success: false, error: 'User tidak ditemukan' };
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  const hasPermission = (permission) => {
    if (!currentUser) return false;
    const permissions = {
      petani: [
        'view_own_lahan', 'edit_own_lahan', 'sewa_barang', 'view_barang',
        'view_organisasi', 'update_kegiatan', 'view_tagihan', 'upload_bukti_bayar',
        'view_berita',
      ],
      pengurus: [
        'view_all_lahan', 'edit_lahan', 'add_lahan', 'sewa_barang', 'view_barang',
        'view_organisasi', 'edit_organisasi', 'add_barang', 'validasi_sewa',
        'kelola_tagihan', 'verifikasi_pembayaran', 'view_berita',
      ],
      bpp: [
        'view_all_lahan', 'verifikasi_lahan', 'kelola_berita', 'analisis_data',
        'notifikasi_petani', 'view_organisasi',
      ],
      admin: [
        'kelola_akun', 'log_aktivitas', 'backup_restore', 'view_all',
      ],
    };
    return permissions[currentUser.role]?.includes(permission) || false;
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      isAuthenticated,
      login,
      loginAsRole,
      logout,
      hasPermission,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

export default AuthContext;

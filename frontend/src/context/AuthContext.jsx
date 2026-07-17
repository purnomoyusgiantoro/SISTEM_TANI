// ──────────────────────────────────────────
// AuthContext — Token-based auth (Sanctum)
// ──────────────────────────────────────────

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import authApi from '../api/auth';
import { STORAGE_KEYS } from '../utils/constants';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem(STORAGE_KEYS.TOKEN));
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Loading on app start (validating token)

  // ── Save/clear token in localStorage ──
  const saveAuth = useCallback((userData, authToken) => {
    localStorage.setItem(STORAGE_KEYS.TOKEN, authToken);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
    setToken(authToken);
    setCurrentUser(userData);
    setIsAuthenticated(true);
  }, []);

  const clearAuth = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    setToken(null);
    setCurrentUser(null);
    setIsAuthenticated(false);
  }, []);

  // ── Login ──
  const login = useCallback(
    async (email, password) => {
      const result = await authApi.login(email, password);
      const { user, token: authToken } = result.data;
      saveAuth(user, authToken);
      return { success: true, user };
    },
    [saveAuth]
  );

  // ── Quick login by role (demo/development) ──
  const loginAsRole = useCallback(
    async (role) => {
      // Preset demo accounts
      const demoAccounts = {
        petani: { email: 'budi@ruangtani.id', password: 'password' },
        pengurus: { email: 'ahmad@ruangtani.id', password: 'password' },
        bpp: { email: 'hendra@ruangtani.id', password: 'password' },
        admin: { email: 'admin@ruangtani.id', password: 'password' },
      };

      const account = demoAccounts[role];
      if (!account) {
        throw new Error('Role tidak ditemukan');
      }

      return login(account.email, account.password);
    },
    [login]
  );

  // ── Logout ──
  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      // Even if API call fails, still clear local auth
    }
    clearAuth();
  }, [clearAuth]);

  // ── Refresh user data ──
  const refreshUser = useCallback(async () => {
    try {
      const result = await authApi.me();
      const user = result.data;
      setCurrentUser(user);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      return user;
    } catch {
      clearAuth();
      return null;
    }
  }, [clearAuth]);

  // ── Check permissions ──
  const hasPermission = useCallback(
    (permission) => {
      if (!currentUser) return false;
      const permissions = {
        petani: [
          'view_own_lahan', 'edit_own_lahan', 'add_lahan', 'sewa_barang', 'view_barang',
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
    },
    [currentUser]
  );

  // ── Validate token on app load ──
  useEffect(() => {
    const validateToken = async () => {
      const storedToken = localStorage.getItem(STORAGE_KEYS.TOKEN);

      if (!storedToken) {
        setIsLoading(false);
        return;
      }

      try {
        // Try to load cached user first for instant UI
        const cachedUser = localStorage.getItem(STORAGE_KEYS.USER);
        if (cachedUser) {
          const user = JSON.parse(cachedUser);
          setCurrentUser(user);
          setIsAuthenticated(true);
        }

        // Then validate token with API
        const result = await authApi.me();
        const user = result.data;
        setCurrentUser(user);
        setIsAuthenticated(true);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      } catch {
        // Token invalid → clear auth
        clearAuth();
      } finally {
        setIsLoading(false);
      }
    };

    validateToken();
  }, [clearAuth]);

  // ── Listen for 401 events from API client ──
  useEffect(() => {
    const handleUnauthorized = () => {
      clearAuth();
    };
    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
    };
  }, [clearAuth]);

  // Show loading screen while validating token
  if (isLoading) {
    return (
      <div className="auth-loading">
        <div className="auth-loading-spinner"></div>
        <p>Memuat...</p>
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        token,
        isAuthenticated,
        isLoading,
        login,
        loginAsRole,
        logout,
        refreshUser,
        hasPermission,
      }}
    >
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

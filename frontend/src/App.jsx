import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { NotificationProvider } from './context/NotificationContext';
import Layout from './components/layout/Layout';
import LoadingSpinner from './components/shared/LoadingSpinner';
import ErrorBoundary from './components/shared/ErrorBoundary';

// ── Lazy-loaded pages (code splitting) ──
const LandingPage = lazy(() => import('./pages/LandingPage'));
const Login = lazy(() => import('./pages/Login'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const DataLahan = lazy(() => import('./pages/DataLahan'));
const SewaPeralatan = lazy(() => import('./pages/SewaPeralatan'));
const Pembayaran = lazy(() => import('./pages/Pembayaran'));
const Kegiatan = lazy(() => import('./pages/Kegiatan'));
const StrukturOrganisasi = lazy(() => import('./pages/StrukturOrganisasi'));
const Berita = lazy(() => import('./pages/Berita'));
const VerifikasiLahan = lazy(() => import('./pages/VerifikasiLahan'));
const KelolaBerita = lazy(() => import('./pages/KelolaBerita'));
const AnalisisData = lazy(() => import('./pages/AnalisisData'));
const KelolaPengguna = lazy(() => import('./pages/KelolaPengguna'));
const LogAktivitas = lazy(() => import('./pages/LogAktivitas'));
const BackupData = lazy(() => import('./pages/BackupData'));

function PageLoader() {
  return <LoadingSpinner size="large" message="Memuat halaman..." />;
}

function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, currentUser } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(currentUser?.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Layout><ErrorBoundary>{children}</ErrorBoundary></Layout>;
}

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <ErrorBoundary>
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />}
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/data-lahan"
          element={
            <ProtectedRoute allowedRoles={['petani', 'pengurus', 'bpp']}>
              <DataLahan />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sewa-peralatan"
          element={
            <ProtectedRoute allowedRoles={['petani', 'pengurus']}>
              <SewaPeralatan />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pembayaran"
          element={
            <ProtectedRoute allowedRoles={['petani', 'pengurus']}>
              <Pembayaran />
            </ProtectedRoute>
          }
        />
        <Route
          path="/kegiatan"
          element={
            <ProtectedRoute allowedRoles={['petani', 'pengurus']}>
              <Kegiatan />
            </ProtectedRoute>
          }
        />
        <Route
          path="/struktur-organisasi"
          element={
            <ProtectedRoute allowedRoles={['petani', 'pengurus', 'bpp']}>
              <StrukturOrganisasi />
            </ProtectedRoute>
          }
        />
        <Route
          path="/berita"
          element={
            <ProtectedRoute allowedRoles={['petani', 'pengurus']}>
              <Berita />
            </ProtectedRoute>
          }
        />
        <Route
          path="/verifikasi-lahan"
          element={
            <ProtectedRoute allowedRoles={['bpp']}>
              <VerifikasiLahan />
            </ProtectedRoute>
          }
        />
        <Route
          path="/kelola-berita"
          element={
            <ProtectedRoute allowedRoles={['bpp']}>
              <KelolaBerita />
            </ProtectedRoute>
          }
        />
        <Route
          path="/analisis-data"
          element={
            <ProtectedRoute allowedRoles={['bpp']}>
              <AnalisisData />
            </ProtectedRoute>
          }
        />
        <Route
          path="/kelola-pengguna"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <KelolaPengguna />
            </ProtectedRoute>
          }
        />
        <Route
          path="/log-aktivitas"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <LogAktivitas />
            </ProtectedRoute>
          }
        />
        <Route
          path="/backup-data"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <BackupData />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<LandingPage />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Suspense>
    </ErrorBoundary>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <NotificationProvider>
            <AppRoutes />
          </NotificationProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/layout/Layout';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import DataLahan from './pages/DataLahan';
import SewaPeralatan from './pages/SewaPeralatan';
import Pembayaran from './pages/Pembayaran';
import Kegiatan from './pages/Kegiatan';
import StrukturOrganisasi from './pages/StrukturOrganisasi';
import Berita from './pages/Berita';
import VerifikasiLahan from './pages/VerifikasiLahan';
import KelolaBerita from './pages/KelolaBerita';
import AnalisisData from './pages/AnalisisData';
import KelolaPengguna from './pages/KelolaPengguna';
import LogAktivitas from './pages/LogAktivitas';
import BackupData from './pages/BackupData';

function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, currentUser } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(currentUser?.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Layout>{children}</Layout>;
}

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
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
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

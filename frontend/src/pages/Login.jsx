import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Users, Building2, Shield, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import '../styles/pages/Login.css';


export default function Login() {
  const navigate = useNavigate();
  const { login, loginAsRole } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      if (err.status === 422) {
        setError('Email atau password salah');
      } else if (err.status === 403) {
        setError('Akun Anda dinonaktifkan. Hubungi admin.');
      } else {
        setError(err.message || 'Tidak dapat terhubung ke server');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (role) => {
    setError('');
    setLoading(true);
    try {
      await loginAsRole(role);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Gagal login. Pastikan backend sudah berjalan.');
    } finally {
      setLoading(false);
    }
  };


  const roleButtons = [
    { role: 'petani', label: 'Petani', icon: User },
    { role: 'pengurus', label: 'Pengurus', icon: Users },
    { role: 'bpp', label: 'BPP', icon: Building2 },
    { role: 'admin', label: 'Admin', icon: Shield },
  ];

  return (
    <>
      

      <div className="login-container">
        <div className="login-hero"></div>

        <div className="login-form-panel">
          <div className="login-form-wrapper">
            <div className="login-brand">
              <h1>Sistem Tani</h1>
              <p>Sistem Manajemen Lahan & Sewa Alat Pertanian</p>
            </div>

            {error && <div className="login-error">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="login-field">
                <label className="login-label" htmlFor="email">Email</label>
                <div className="login-input-wrap">
                  <Mail size={18} strokeWidth={2} className="login-input-icon" />
                  <input
                    id="email"
                    className="login-input"
                    type="email"
                    placeholder="Masukkan email Anda"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="login-field">
                <label className="login-label" htmlFor="password">Password</label>
                <div className="login-input-wrap">
                  <Lock size={18} strokeWidth={2} className="login-input-icon" />
                  <input
                    id="password"
                    className="login-input"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Masukkan password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="login-toggle-pw"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                  >
                    {showPassword ? <EyeOff size={18} strokeWidth={2} /> : <Eye size={18} strokeWidth={2} />}
                  </button>
                </div>
              </div>

              <div className="login-remember-row">
                <label className="login-checkbox-wrap">
                  <input
                    type="checkbox"
                    className="login-checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span className="login-checkbox-label">Ingat Saya</span>
                </label>
              </div>

              <button type="submit" className="login-submit-btn" disabled={loading}>
                {loading ? 'Memproses...' : 'MASUK'}
              </button>
            </form>

            <div className="login-divider">
              <div className="login-divider-line" />
              <span className="login-divider-text">Masuk Cepat (Demo)</span>
              <div className="login-divider-line" />
            </div>

            <div className="login-roles-grid">
              {roleButtons.map((rb) => (
                <button
                  key={rb.role}
                  type="button"
                  className="login-role-btn"
                  disabled={loading}
                  onClick={() => handleQuickLogin(rb.role)}
                >
                  <rb.icon size={18} strokeWidth={2} />
                  {rb.label}
                </button>
              ))}
            </div>

            <div className="login-footer">
              <p className="login-footer-text" style={{ fontSize: '12px' }}>
                <strong>Pemerintah Kota - Dinas Pertanian & Ketahanan Pangan</strong><br />
                Jl. Panglima Sudirman No. 12, Kota Setempat 60271<br />
                Telp: (031) 555-1234 | Email: info@pertanian.go.id<br />
                &copy; 2026 Hak Cipta Dilindungi.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

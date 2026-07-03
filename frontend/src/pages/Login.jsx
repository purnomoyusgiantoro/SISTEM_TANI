import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Users, Building2, Shield, Mail, Lock, Eye, EyeOff } from 'lucide-react';

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

    await new Promise((r) => setTimeout(r, 800));

    const result = login(email, password);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  const handleQuickLogin = async (role) => {
    setError('');
    setLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    const result = loginAsRole(role);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  const roleButtons = [
    { role: 'petani', label: 'Petani', icon: User },
    { role: 'pengurus', label: 'Pengurus', icon: Users },
    { role: 'bpp', label: 'BPP', icon: Building2 },
    { role: 'admin', label: 'Admin', icon: Shield },
  ];

  return (
    <>
      <style>{`
        .login-container {
          min-height: 100vh;
          display: flex;
          font-family: Arial, sans-serif;
          background: #f8fafc;
        }

        /* LEFT HERO PANEL */
        .login-hero {
          flex: 0 0 60%;
          background-image: url('/petani_indonesia.png');
          background-size: cover;
          background-position: center;
          background-color: #0f172a;
        }

        /* RIGHT FORM PANEL */
        .login-form-panel {
          flex: 0 0 40%;
          background: #ffffff;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 40px;
        }

        .login-form-wrapper {
          width: 100%;
          max-width: 400px;
        }

        .login-brand {
          text-align: center;
          margin-bottom: 40px;
        }

        .login-brand h1 {
          font-size: 32px;
          font-weight: bold;
          color: #059669;
          margin: 0 0 8px 0;
          letter-spacing: 2px;
        }

        .login-brand p {
          font-size: 16px;
          color: #64748b;
          margin: 0;
        }

        .login-error {
          padding: 12px 16px;
          background: #fee2e2;
          color: #b91c1c;
          border: 1px solid #fca5a5;
          border-radius: 6px;
          margin-bottom: 24px;
          font-weight: bold;
          text-align: center;
        }

        .login-field {
          margin-bottom: 20px;
        }

        .login-label {
          display: block;
          font-size: 15px;
          font-weight: bold;
          color: #0f172a;
          margin-bottom: 8px;
        }

        .login-input-wrap {
          position: relative;
          display: flex;
          align-items: center;
        }

        .login-input-icon {
          position: absolute;
          left: 14px;
          color: #94a3b8;
          pointer-events: none;
          transition: color 0.2s;
        }

        .login-input {
          width: 100%;
          padding: 14px 16px 14px 44px;
          font-size: 16px;
          border: 1px solid #cbd5e1;
          border-radius: 6px;
          background: #f8fafc;
          color: #0f172a;
          box-sizing: border-box;
          transition: border-color 0.2s, background 0.2s;
        }

        .login-input:focus {
          border-color: #059669;
          outline: none;
          background: #ffffff;
        }

        .login-input-wrap:focus-within .login-input-icon {
          color: #059669;
        }

        .login-toggle-pw {
          position: absolute;
          right: 12px;
          background: none;
          border: none;
          color: #64748b;
          cursor: pointer;
          display: flex;
          align-items: center;
          padding: 4px;
          transition: color 0.2s;
        }

        .login-toggle-pw:hover {
          color: #0f172a;
        }

        .login-remember-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
        }

        .login-checkbox-wrap {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
        }

        .login-checkbox {
          width: 18px;
          height: 18px;
          cursor: pointer;
        }

        .login-checkbox-label {
          font-size: 15px;
          color: #0f172a;
        }

        .login-submit-btn {
          width: 100%;
          padding: 16px;
          font-size: 16px;
          font-weight: bold;
          color: #ffffff;
          background: #059669;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          transition: background 0.2s;
        }

        .login-submit-btn:hover:not(:disabled) {
          background: #047857;
        }

        .login-submit-btn:disabled {
          background: #94a3b8;
          cursor: not-allowed;
        }

        .login-divider {
          display: flex;
          align-items: center;
          gap: 16px;
          margin: 30px 0;
        }

        .login-divider-line {
          flex: 1;
          height: 1px;
          background: #cbd5e1;
        }

        .login-divider-text {
          font-size: 14px;
          color: #64748b;
          font-weight: bold;
        }

        .login-roles-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .login-role-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px;
          font-size: 15px;
          font-weight: bold;
          color: #0f172a;
          background: #ffffff;
          border: 1px solid #cbd5e1;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .login-role-btn:hover:not(:disabled) {
          border-color: #059669;
          color: #059669;
          background: #f0fdf4;
        }

        .login-role-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .login-footer {
          margin-top: 40px;
          text-align: center;
        }

        .login-footer-text {
          font-size: 13px;
          color: #64748b;
          margin: 0;
          line-height: 1.5;
        }

        @media (max-width: 1024px) {
          .login-container {
            flex-direction: column;
          }
          .login-hero {
            flex: none;
            height: 300px;
          }
          .login-form-panel {
            flex: none;
            padding: 40px 24px;
          }
        }
      `}</style>

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

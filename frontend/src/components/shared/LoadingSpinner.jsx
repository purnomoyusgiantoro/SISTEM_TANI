// ──────────────────────────────────────────
// LoadingSpinner Component
// ──────────────────────────────────────────

function LoadingSpinner({ size = 'medium', message = 'Memuat data...' }) {
  const sizeClass = `spinner-${size}`;

  return (
    <div className="loading-spinner-container">
      <div className={`loading-spinner ${sizeClass}`}>
        <div className="spinner-ring"></div>
      </div>
      {message && <p className="loading-message">{message}</p>}
    </div>
  );
}

export default LoadingSpinner;

import React from 'react';

export default function StatCard({ icon: Icon, label, title, value, color, variant, trend, subtitle }) {
  const displayLabel = title || label;
  
  let finalColor = color || '#1a365d';
  if (variant) {
    switch(variant) {
      case 'primary': finalColor = '#059669'; break; // Green
      case 'secondary': finalColor = '#2563eb'; break; // Blue
      case 'info': finalColor = '#0284c7'; break; // Light Blue
      case 'warning': finalColor = '#d97706'; break; // Orange
      case 'danger': finalColor = '#dc2626'; break; // Red
      case 'success': finalColor = '#16a34a'; break; // Green
      default: break;
    }
  }
  return (
    <>
      <style>{`
        .statcard {
          background: #ffffff;
          border-radius: 4px;
          padding: 20px;
          display: flex;
          align-items: flex-start;
          gap: 16px;
          border: 1px solid #dee2e6;
        }
        .statcard-icon-wrap {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .statcard-content {
          flex: 1;
          min-width: 0;
        }
        .statcard-label {
          font-size: 13px;
          font-weight: 500;
          color: #4a5568;
          margin: 0 0 4px 0;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .statcard-value {
          font-size: 28px;
          font-weight: 700;
          color: #1a202c;
          margin: 0;
          line-height: 1.2;
        }
        .statcard-trend {
          font-size: 12px;
          font-weight: 600;
          margin-top: 4px;
          display: inline-flex;
          align-items: center;
          gap: 2px;
          padding: 2px 8px;
          border-radius: 20px;
        }
        .statcard-trend.up {
          color: #059669;
          background: #ecfdf5;
        }
        .statcard-trend.down {
          color: #dc2626;
          background: #fef2f2;
        }
        .statcard-subtitle {
          font-size: 12px;
          color: #a0aec0;
          margin-top: 4px;
        }
      `}</style>
      <div className="statcard">
        <div
          className="statcard-icon-wrap"
          style={{ color: '#495057' }}
        >
          {Icon && <Icon size={24} />}
        </div>
        <div className="statcard-content">
          <p className="statcard-label">{displayLabel}</p>
          <p className="statcard-value">{value}</p>
          {trend && (
            <span className={`statcard-trend ${trend.startsWith('+') || trend.startsWith('↑') ? 'up' : 'down'}`}>
              {trend}
            </span>
          )}
          {subtitle && <p className="statcard-subtitle">{subtitle}</p>}
        </div>
      </div>
    </>
  );
}

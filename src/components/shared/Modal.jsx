import React, { useEffect } from 'react';
import { X } from 'lucide-react';

const styles = `
  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 20px;
    animation: modal-fade-in 0.2s ease;
  }
  .modal-container {
    background: #ffffff;
    border-radius: 16px;
    width: 100%;
    max-width: 560px;
    max-height: 90vh;
    display: flex;
    flex-direction: column;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
    animation: modal-slide-up 0.3s ease;
  }
  .modal-container.modal-lg {
    max-width: 720px;
  }
  .modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 24px;
    border-bottom: 1px solid #e2e8f0;
  }
  .modal-header h3 {
    margin: 0;
    font-size: 18px;
    font-weight: 700;
    color: #1a202c;
  }
  .modal-close-btn {
    background: none;
    border: none;
    cursor: pointer;
    padding: 6px;
    border-radius: 8px;
    color: #64748b;
    transition: all 0.15s;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .modal-close-btn:hover {
    background: #f1f5f9;
    color: #1a202c;
  }
  .modal-body {
    padding: 24px;
    overflow-y: auto;
    flex: 1;
  }
  .modal-footer {
    padding: 16px 24px;
    border-top: 1px solid #e2e8f0;
    display: flex;
    justify-content: flex-end;
    gap: 10px;
  }
  @keyframes modal-fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes modal-slide-up {
    from { opacity: 0; transform: translateY(20px) scale(0.97); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }
`;

export default function Modal({ isOpen, onClose, title, children, footer, size = '' }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <style>{styles}</style>
      <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
        <div className={`modal-container ${size === 'lg' ? 'modal-lg' : ''}`}>
          <div className="modal-header">
            <h3>{title}</h3>
            <button className="modal-close-btn" onClick={onClose}><X size={20} /></button>
          </div>
          <div className="modal-body">
            {children}
          </div>
          {footer && <div className="modal-footer">{footer}</div>}
        </div>
      </div>
    </>
  );
}

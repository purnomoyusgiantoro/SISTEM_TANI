// ──────────────────────────────────────────
// EmptyState Component
// ──────────────────────────────────────────

import { Inbox } from 'lucide-react';

function EmptyState({
  title = 'Data Kosong',
  description = 'Belum ada data yang tersedia.',
  icon: Icon = Inbox,
  action,
  actionLabel,
}) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        <Icon size={48} strokeWidth={1.5} />
      </div>
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-description">{description}</p>
      {action && actionLabel && (
        <button className="btn btn-primary" onClick={action}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export default EmptyState;

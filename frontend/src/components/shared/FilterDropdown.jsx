// ──────────────────────────────────────────
// FilterDropdown Component
// ──────────────────────────────────────────

import { ChevronDown } from 'lucide-react';

function FilterDropdown({
  label,
  options = [],
  value = '',
  onChange,
  placeholder = 'Semua',
  className = '',
}) {
  return (
    <div className={`filter-dropdown ${className}`}>
      {label && <label className="filter-dropdown-label">{label}</label>}
      <div className="filter-dropdown-wrapper">
        <select
          className="filter-dropdown-select"
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
        >
          <option value="">{placeholder}</option>
          {options.map((opt) => {
            const optValue = typeof opt === 'object' ? opt.value : opt;
            const optLabel = typeof opt === 'object' ? opt.label : opt;
            return (
              <option key={optValue} value={optValue}>
                {optLabel}
              </option>
            );
          })}
        </select>
        <ChevronDown size={16} className="filter-dropdown-icon" />
      </div>
    </div>
  );
}

export default FilterDropdown;

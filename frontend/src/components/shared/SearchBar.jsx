// ──────────────────────────────────────────
// SearchBar Component
// ──────────────────────────────────────────

import { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { SEARCH_DEBOUNCE_MS } from '../../utils/constants';

function SearchBar({
  placeholder = 'Cari...',
  value = '',
  onChange,
  debounceMs = SEARCH_DEBOUNCE_MS,
  className = '',
}) {
  const [localValue, setLocalValue] = useState(value);
  const timerRef = useRef(null);
  const isFirstMount = useRef(true);

  // Sync external value changes
  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }
    setLocalValue(value);
  }, [value]);

  // Debounced onChange
  useEffect(() => {
    if (isFirstMount.current) return;

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      onChange?.(localValue);
    }, debounceMs);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localValue, debounceMs]);

  const handleClear = () => {
    setLocalValue('');
    onChange?.('');
  };

  return (
    <div className={`search-bar ${className}`}>
      <Search size={18} className="search-bar-icon" />
      <input
        type="text"
        className="search-bar-input"
        placeholder={placeholder}
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
      />
      {localValue && (
        <button
          className="search-bar-clear"
          onClick={handleClear}
          aria-label="Hapus pencarian"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}

export default SearchBar;

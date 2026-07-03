import { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

export default function DataTable({ columns, data, emptyMessage = 'Tidak ada data ditemukan' }) {
  const [sortConfig, setSortConfig] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  // Handle Sorting
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortedData = (dataToSort) => {
    if (!sortConfig) return dataToSort;
    return [...dataToSort].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortConfig.direction === 'ascending' ? aValue - bValue : bValue - aValue;
      }

      const strA = String(aValue).toLowerCase();
      const strB = String(bValue).toLowerCase();
      if (strA < strB) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (strA > strB) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
  };

  // Filter based on search term (looks in all string/number fields of row)
  const filteredData = data.filter((row) => {
    if (!searchTerm) return true;
    return Object.values(row).some((val) => {
      if (val === null || val === undefined) return false;
      return String(val).toLowerCase().includes(searchTerm.toLowerCase());
    });
  });

  const sortedData = getSortedData(filteredData);

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="table-container" style={{ background: 'white', borderRadius: '12px', border: '1px solid var(--color-border)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
      {/* Top Table Control Bar */}
      <div style={{ padding: '16px', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>Tampilkan:</span>
          <select 
            value={itemsPerPage} 
            onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
            style={{ padding: '4px 8px', fontSize: '0.85rem', border: '1px solid var(--color-border)', borderRadius: '6px' }}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>
        <div>
          <input 
            type="text" 
            placeholder="Cari di tabel..." 
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            style={{ padding: '6px 12px', fontSize: '0.85rem', border: '1px solid var(--color-border)', borderRadius: '6px', width: '220px' }}
          />
        </div>
      </div>

      {/* Main Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--color-bg)', borderBottom: '1px solid var(--color-border)' }}>
              {columns.map((column) => (
                <th 
                  key={column.accessor || column.header}
                  onClick={() => column.sortable !== false && column.accessor && requestSort(column.accessor)}
                  style={{
                    padding: '12px 16px',
                    fontSize: '0.85rem',
                    fontWeight: '700',
                    color: 'var(--color-text-secondary)',
                    cursor: column.sortable !== false && column.accessor ? 'pointer' : 'default',
                    userSelect: 'none'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {column.header}
                    {column.sortable !== false && column.accessor && sortConfig && sortConfig.key === column.accessor ? (
                      sortConfig.direction === 'ascending' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                    ) : null}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((row, rowIndex) => (
                <tr 
                  key={row.id || rowIndex} 
                  style={{ 
                    borderBottom: '1px solid var(--color-border-light)',
                    backgroundColor: rowIndex % 2 === 1 ? '#fafbfe' : 'white',
                    transition: 'background-color 0.2s'
                  }}
                  className="table-row-hover"
                >
                  {columns.map((column) => (
                    <td key={column.header} style={{ padding: '14px 16px', fontSize: '0.875rem', color: 'var(--color-text)' }}>
                      {column.render ? column.render(row, rowIndex) : row[column.accessor]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} style={{ textAlign: 'center', padding: '40px 16px', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div style={{ padding: '16px', borderTop: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
            Menampilkan {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, sortedData.length)} dari {sortedData.length} data
          </span>
          <div style={{ display: 'flex', gap: '4px' }}>
            <button 
              disabled={currentPage === 1}
              onClick={() => paginate(currentPage - 1)}
              style={{
                padding: '6px 12px',
                fontSize: '0.85rem',
                border: '1px solid var(--color-border)',
                borderRadius: '6px',
                backgroundColor: currentPage === 1 ? 'var(--color-bg)' : 'white',
                color: currentPage === 1 ? 'var(--color-text-muted)' : 'var(--color-text)',
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
              }}
            >
              Kembali
            </button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => paginate(i + 1)}
                style={{
                  width: '32px',
                  height: '32px',
                  fontSize: '0.85rem',
                  border: '1px solid var(--color-border)',
                  borderRadius: '6px',
                  backgroundColor: currentPage === i + 1 ? 'var(--color-primary)' : 'white',
                  color: currentPage === i + 1 ? 'white' : 'var(--color-text)',
                  fontWeight: currentPage === i + 1 ? '700' : '400'
                }}
              >
                {i + 1}
              </button>
            ))}
            <button 
              disabled={currentPage === totalPages}
              onClick={() => paginate(currentPage + 1)}
              style={{
                padding: '6px 12px',
                fontSize: '0.85rem',
                border: '1px solid var(--color-border)',
                borderRadius: '6px',
                backgroundColor: currentPage === totalPages ? 'var(--color-bg)' : 'white',
                color: currentPage === totalPages ? 'var(--color-text-muted)' : 'var(--color-text)',
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
              }}
            >
              Lanjut
            </button>
          </div>
        </div>
      )}

      <style>{`
        .table-row-hover:hover {
          background-color: var(--color-primary-50) !important;
        }
      `}</style>
    </div>
  );
}

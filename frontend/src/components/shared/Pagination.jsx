// ──────────────────────────────────────────
// Pagination Component
// ──────────────────────────────────────────

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  perPage,
  perPageOptions = [10, 25, 50],
  onPerPageChange,
  total,
}) {
  if (totalPages <= 1 && !onPerPageChange) return null;

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      // Always show first page
      pages.push(1);

      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);

      // Adjust if near start or end
      if (currentPage <= 3) {
        end = Math.min(4, totalPages - 1);
      }
      if (currentPage >= totalPages - 2) {
        start = Math.max(totalPages - 3, 2);
      }

      if (start > 2) pages.push('...');
      for (let i = start; i <= end; i++) pages.push(i);
      if (end < totalPages - 1) pages.push('...');

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div className="pagination-container">
      {/* Per page selector */}
      {onPerPageChange && (
        <div className="pagination-per-page">
          <span>Tampilkan</span>
          <select
            value={perPage}
            onChange={(e) => onPerPageChange(Number(e.target.value))}
            className="pagination-select"
          >
            {perPageOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          <span>data{total != null ? ` dari ${total}` : ''}</span>
        </div>
      )}

      {/* Page navigation */}
      {totalPages > 1 && (
        <div className="pagination-nav">
          {/* First page */}
          <button
            className="pagination-btn"
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
            title="Halaman pertama"
          >
            <ChevronsLeft size={16} />
          </button>

          {/* Previous */}
          <button
            className="pagination-btn"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            title="Sebelumnya"
          >
            <ChevronLeft size={16} />
          </button>

          {/* Page numbers */}
          {pages.map((page, idx) =>
            page === '...' ? (
              <span key={`ellipsis-${idx}`} className="pagination-ellipsis">
                ⋯
              </span>
            ) : (
              <button
                key={page}
                className={`pagination-btn pagination-page ${
                  currentPage === page ? 'active' : ''
                }`}
                onClick={() => onPageChange(page)}
              >
                {page}
              </button>
            )
          )}

          {/* Next */}
          <button
            className="pagination-btn"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            title="Selanjutnya"
          >
            <ChevronRight size={16} />
          </button>

          {/* Last page */}
          <button
            className="pagination-btn"
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
            title="Halaman terakhir"
          >
            <ChevronsRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}

export default Pagination;

// ──────────────────────────────────────────
// usePagination Hook
// ──────────────────────────────────────────

import { useState, useCallback, useMemo } from 'react';
import { PAGINATION } from '../utils/constants';

/**
 * Hook to manage pagination state.
 *
 * @param {object} options
 * @param {number} options.initialPage - Starting page (default 1)
 * @param {number} options.initialPerPage - Items per page (default 10)
 * @returns Pagination state and handlers
 *
 * @example
 * const { page, perPage, setPage, setPerPage, paginationParams, totalPages } = usePagination();
 *
 * useEffect(() => {
 *   fetchData({ ...paginationParams, ...filters });
 * }, [page, perPage]);
 */
export function usePagination({
  initialPage = PAGINATION.DEFAULT_PAGE,
  initialPerPage = PAGINATION.DEFAULT_PER_PAGE,
} = {}) {
  const [page, setPage] = useState(initialPage);
  const [perPage, setPerPageState] = useState(initialPerPage);
  const [total, setTotal] = useState(0);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(total / perPage)),
    [total, perPage]
  );

  const setPerPage = useCallback((newPerPage) => {
    setPerPageState(newPerPage);
    setPage(1); // Reset to page 1 when changing per_page
  }, []);

  const goToPage = useCallback(
    (newPage) => {
      setPage(Math.max(1, Math.min(newPage, totalPages)));
    },
    [totalPages]
  );

  const nextPage = useCallback(() => {
    setPage((prev) => Math.min(prev + 1, totalPages));
  }, [totalPages]);

  const prevPage = useCallback(() => {
    setPage((prev) => Math.max(prev - 1, 1));
  }, []);

  const resetPage = useCallback(() => {
    setPage(1);
  }, []);

  // Params to pass to API
  const paginationParams = useMemo(
    () => ({ page, per_page: perPage }),
    [page, perPage]
  );

  /**
   * Update total from API meta response
   * @param {object} meta - { current_page, last_page, per_page, total }
   */
  const updateFromMeta = useCallback((meta) => {
    if (meta) {
      if (meta.total != null) setTotal(meta.total);
      if (meta.current_page != null) setPage(meta.current_page);
    }
  }, []);

  return {
    page,
    perPage,
    total,
    totalPages,
    setPage: goToPage,
    setPerPage,
    setTotal,
    nextPage,
    prevPage,
    resetPage,
    paginationParams,
    updateFromMeta,
    perPageOptions: PAGINATION.PER_PAGE_OPTIONS,
  };
}

export default usePagination;

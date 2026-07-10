// ──────────────────────────────────────────
// useApi Hook — Generic API call handler
// ──────────────────────────────────────────
// Handles loading, error, and data states for API calls.

import { useState, useCallback, useRef, useEffect } from 'react';

/**
 * Generic hook for API calls with loading/error/data state management.
 *
 * @example
 * const { data, loading, error, execute } = useApi(lahanApi.getAll);
 *
 * useEffect(() => {
 *   execute({ page: 1 });
 * }, []);
 */
export function useApi(apiFn, { immediate = false, initialParams = null } = {}) {
  const [data, setData] = useState(null);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const execute = useCallback(
    async (...args) => {
      setLoading(true);
      setError(null);

      try {
        const result = await apiFn(...args);
        if (mountedRef.current) {
          setData(result.data);
          setMeta(result.meta || null);
        }
        return result;
      } catch (err) {
        if (mountedRef.current) {
          setError(err);
        }
        throw err;
      } finally {
        if (mountedRef.current) {
          setLoading(false);
        }
      }
    },
    [apiFn]
  );

  // Reset state
  const reset = useCallback(() => {
    setData(null);
    setMeta(null);
    setError(null);
    setLoading(false);
  }, []);

  // Auto-execute on mount if immediate=true
  useEffect(() => {
    if (immediate) {
      execute(initialParams);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    data,
    meta,
    loading,
    error,
    execute,
    reset,
    setData,
  };
}

/**
 * Hook for API mutations (create, update, delete) — no auto-execute.
 * Returns a simpler interface focused on one-off operations.
 *
 * @example
 * const { mutate, loading } = useMutation(lahanApi.create);
 * const handleSubmit = async (data) => {
 *   try {
 *     await mutate(data);
 *     toast.success('Berhasil disimpan');
 *   } catch (err) {
 *     toast.error(err.message);
 *   }
 * };
 */
export function useMutation(apiFn) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const mutate = useCallback(
    async (...args) => {
      setLoading(true);
      setError(null);

      try {
        const result = await apiFn(...args);
        if (mountedRef.current) {
          setLoading(false);
        }
        return result;
      } catch (err) {
        if (mountedRef.current) {
          setError(err);
          setLoading(false);
        }
        throw err;
      }
    },
    [apiFn]
  );

  const reset = useCallback(() => {
    setError(null);
    setLoading(false);
  }, []);

  return { mutate, loading, error, reset };
}

export default useApi;

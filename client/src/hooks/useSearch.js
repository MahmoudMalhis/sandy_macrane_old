import { useCallback, useEffect, useState } from "react";

export const useSearch = (searchFunction, options = {}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { debounceMs = 500, minLength = 2, immediate = false } = options;

  const search = useCallback(
    async (term) => {
      if (term.length < minLength) {
        setResults([]);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const searchResults = await searchFunction(term);
        setResults(searchResults.data || searchResults);
      } catch (err) {
        setError(err.message);
        setResults([]);
      } finally {
        setLoading(false);
      }
    },
    [searchFunction, minLength]
  );

  // Debounced search effect
  useEffect(() => {
    if (!searchTerm && !immediate) return;

    const timeoutId = setTimeout(() => {
      search(searchTerm);
    }, debounceMs);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, search, debounceMs, immediate]);

  const clearSearch = () => {
    setSearchTerm("");
    setResults([]);
    setError(null);
  };

  return {
    searchTerm,
    setSearchTerm,
    results,
    loading,
    error,
    search: () => search(searchTerm),
    clearSearch,
  };
};

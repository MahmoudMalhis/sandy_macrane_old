import { useEffect, useState, useCallback } from "react";

export const useFilter = (initialFilters = {}, onFilterChange) => {
  const [filters, setFilters] = useState(initialFilters);
  const [activeFilters, setActiveFilters] = useState({});

  // ✅ Wrap onFilterChange في useCallback لمنع re-creation
  const stableOnFilterChange = useCallback(
    (active) => {
      onFilterChange?.(active);
    },
    [onFilterChange]
  );

  useEffect(() => {
    const active = Object.entries(filters).reduce((acc, [key, value]) => {
      if (value && value !== "all" && value !== "" && value !== null) {
        acc[key] = value;
      }
      return acc;
    }, {});

    setActiveFilters(active);
    stableOnFilterChange(active);
  }, [filters, stableOnFilterChange]);

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const updateFilters = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const resetFilters = () => {
    setFilters(initialFilters);
  };

  const resetFilter = (key) => {
    setFilters((prev) => ({ ...prev, [key]: initialFilters[key] || "" }));
  };

  const hasActiveFilters = Object.keys(activeFilters).length > 0;

  return {
    filters,
    activeFilters,
    updateFilter,
    updateFilters,
    resetFilters,
    resetFilter,
    hasActiveFilters,
  };
};

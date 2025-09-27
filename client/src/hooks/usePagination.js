import { useState } from "react";

export const usePagination = (initialState = {}) => {
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0,
    ...initialState,
  });

  const nextPage = () => {
    if (pagination.page < pagination.pages) {
      setPagination((prev) => ({ ...prev, page: prev.page + 1 }));
    }
  };

  const prevPage = () => {
    if (pagination.page > 1) {
      setPagination((prev) => ({ ...prev, page: prev.page - 1 }));
    }
  };

  const goToPage = (page) => {
    if (page >= 1 && page <= pagination.pages) {
      setPagination((prev) => ({ ...prev, page }));
    }
  };

  const setLimit = (limit) => {
    setPagination((prev) => ({ ...prev, limit, page: 1 }));
  };

  const updatePagination = (newPagination) => {
    setPagination((prev) => ({ ...prev, ...newPagination }));
  };

  const reset = () => {
    setPagination((prev) => ({ ...prev, page: 1, total: 0, pages: 0 }));
  };

  const hasNext = pagination.page < pagination.pages;
  const hasPrev = pagination.page > 1;
  const isFirst = pagination.page === 1;
  const isLast = pagination.page === pagination.pages;

  return {
    pagination,
    nextPage,
    prevPage,
    goToPage,
    setLimit,
    updatePagination,
    reset,
    hasNext,
    hasPrev,
    isFirst,
    isLast,
  };
};

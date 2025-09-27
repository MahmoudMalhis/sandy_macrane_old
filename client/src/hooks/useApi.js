import { useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";

export const useApi = (apiFunction, dependencies = [], options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { immediate = true, onSuccess, onError, showToast = false } = options;

  const execute = useCallback(
    async (...args) => {
      try {
        setLoading(true);
        setError(null);

        const result = await apiFunction(...args);

        if (result.success !== false) {
          setData(result.data || result);
          onSuccess && onSuccess(result);
          showToast && toast.success("تم بنجاح");
        } else {
          throw new Error(result.message || "حدث خطأ");
        }

        return result;
      } catch (err) {
        setError(err.message);
        onError && onError(err);
        showToast && toast.error(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [apiFunction, onSuccess, onError, showToast]
  );

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, dependencies);

  return { data, loading, error, execute, refetch: execute };
};

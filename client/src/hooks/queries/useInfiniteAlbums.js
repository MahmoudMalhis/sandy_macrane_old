// client/src/hooks/queries/useInfiniteAlbums.js - مُصحح لمنع re-render

import { useInfiniteQuery } from "@tanstack/react-query";
import { albumsAPI } from "../../api/albums";

export const albumsKeys = {
  all: ["albums"],
  lists: () => [...albumsKeys.all, "list"],
  infinite: (filters) => [...albumsKeys.lists(), "infinite", filters],
};

/**
 * Hook لـ Infinite Scroll مع Albums
 * ✅ مُحسّن لمنع re-render عند البحث
 */
export const useInfiniteAlbums = (filters = {}) => {
  return useInfiniteQuery({
    queryKey: albumsKeys.infinite(filters),
    queryFn: async ({ pageParam = 1 }) => {
      const params = {
        page: pageParam,
        limit: filters.limit || 6,
        ...(filters.category &&
          filters.category !== "all" && {
            category: filters.category,
          }),
        ...(filters.search && { search: filters.search }),
        sort: filters.sort || "created_at",
      };

      const response = await albumsAPI.getAll(params);

      if (!response.success) {
        throw new Error("فشل في تحميل الألبومات");
      }

      return {
        data: response.data,
        pagination: response.pagination,
      };
    },
    getNextPageParam: (lastPage) => {
      const { page, pages } = lastPage.pagination;
      return page < pages ? page + 1 : undefined;
    },

    // ✅ الحل الرئيسي: الحفاظ على البيانات السابقة أثناء التحميل
    placeholderData: (previousData) => previousData,

    staleTime: 3 * 60 * 1000, // 3 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (استبدل cacheTime بـ gcTime)

    // ✅ تحسينات إضافية
    refetchOnWindowFocus: false, // منع إعادة التحميل عند العودة للنافذة
    retry: 2, // محاولتين فقط عند الفشل
  });
};

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { reviewsAPI } from "../../api/reviews";
import { toast } from "react-hot-toast";

export const reviewsKeys = {
  all: ["reviews"],
  lists: () => [...reviewsKeys.all, "list"],
  list: (filters) => [...reviewsKeys.lists(), filters],
  stats: () => [...reviewsKeys.all, "stats"],
  featured: (limit) => [...reviewsKeys.all, "featured", limit],
  public: (filters) => [...reviewsKeys.all, "public", filters],
};

export const useReviews = (filters = {}) => {
  return useQuery({
    queryKey: reviewsKeys.list(filters),
    queryFn: async () => {
      const params = {
        page: filters.page || 1,
        limit: filters.limit || 20,
        ...(filters.search && { search: filters.search }),
      };

      if (filters.status && filters.status !== "all") {
        params.status = filters.status;
      }

      if (filters.rating && filters.rating !== "all") {
        params.min_rating = filters.rating;
      }

      const response = await reviewsAPI.getAllAdmin(params);
      if (!response.success) throw new Error("فشل في جلب التقييمات");

      return {
        data: response.data,
        pagination: response.pagination,
      };
    },
    staleTime: 2 * 60 * 1000,
  });
};

export const usePublicReviews = (filters = {}) => {
  return useQuery({
    queryKey: reviewsKeys.public(filters),
    queryFn: async () => {
      const params = {
        page: filters.page || 1,
        limit: filters.limit || 100,
        status: "published",
      };

      if (filters.linked_album_id) {
        params.linked_album_id = filters.linked_album_id;
      }

      const response = await reviewsAPI.getAll(params);
      if (!response.success) throw new Error("فشل في جلب التقييمات");

      return {
        data: response.data,
        pagination: response.pagination,
      };
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useReviewsStats = () => {
  return useQuery({
    queryKey: reviewsKeys.stats(),
    queryFn: async () => {
      const response = await reviewsAPI.getStats();
      if (!response.success) throw new Error("فشل في تحميل الإحصائيات");
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useFeaturedReviews = (limit = 4) => {
  return useQuery({
    queryKey: reviewsKeys.featured(limit),
    queryFn: async () => {
      const response = await reviewsAPI.getFeatured(limit);
      if (!response.success) throw new Error("فشل في جلب التقييمات المميزة");
      return response.data;
    },
    staleTime: 10 * 60 * 1000,
  });
};

export const useCreateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reviewData) => {
      const response = await reviewsAPI.create(reviewData);
      if (!response.success) {
        throw new Error(response.message || "فشل في إنشاء التقييم");
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reviewsKeys.all });
    },
    onError: (error) => {
      console.error("Create review error:", error);
    },
  });
};

export const useUpdateReviewStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ reviewId, status }) =>
      reviewsAPI.changeStatus(reviewId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reviewsKeys.all });
      toast.success("تم تحديث حالة التقييم");
    },
    onError: (error) => {
      toast.error(error.message || "فشل في التحديث");
    },
  });
};

export const useReview = (reviewId, options = {}) => {
  return useQuery({
    queryKey: [...reviewsKeys.all, "detail", reviewId],
    queryFn: async () => {
      const response = await reviewsAPI.getById(reviewId);
      if (!response.success) throw new Error("فشل في تحميل التقييم");
      return response.data;
    },
    enabled: !!reviewId && options.enabled !== false,
    staleTime: 5 * 60 * 1000,
  });
};

export const useDeleteReview = (onSuccessCallback) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reviewId) => reviewsAPI.delete(reviewId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reviewsKeys.all });
      toast.success("تم حذف التقييم بنجاح");

      if (onSuccessCallback) {
        onSuccessCallback();
      }
    },
    onError: (error) => {
      toast.error(error.message || "فشل في الحذف");
    },
  });
};

export const useAlbumReviews = (albumId) => {
  return useQuery({
    queryKey: [...reviewsKeys.all, "album", albumId],
    queryFn: async () => {
      const response = await reviewsAPI.getByAlbum(albumId, {
        status: "published",
      });
      if (!response.success) {
        console.warn("فشل في تحميل التقييمات");
        return [];
      }
      return response.data || [];
    },
    enabled: !!albumId,
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: 0,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    onError: (error) => {
      if (error.status !== 429) {
        console.error("خطأ في تحميل التقييمات:", error.message);
      }
    },
  });
};

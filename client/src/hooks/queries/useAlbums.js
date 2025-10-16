import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { albumsAPI, adminAPI } from "../../api/albums";
import { toast } from "react-hot-toast";

export const albumsKeys = {
  all: ["albums"],
  lists: () => [...albumsKeys.all, "list"],
  list: (filters) => [...albumsKeys.lists(), filters],
  details: () => [...albumsKeys.all, "detail"],
  detail: (id) => [...albumsKeys.details(), id],
  bySlug: (slug) => [...albumsKeys.all, "slug", slug],
  featured: (limit) => [...albumsKeys.all, "featured", limit],
  media: (albumId) => [...albumsKeys.all, "media", albumId],
};

// ==================== QUERIES ====================

export const useAlbums = (filters = {}) => {
  return useQuery({
    queryKey: albumsKeys.list(filters),
    queryFn: async () => {
      const params = {
        page: filters.page || 1,
        limit: filters.limit || 12,
        ...(filters.category && filters.category !== "all" && { category: filters.category }),
        ...(filters.search && { search: filters.search }),
        ...(filters.sort && { sort: filters.sort }),
      };
      const response = await albumsAPI.getAll(params);
      if (!response.success) throw new Error("فشل في تحميل الألبومات");
      return response;
    },
    staleTime: 3 * 60 * 1000,
    keepPreviousData: true, // Important for pagination
  });
};

export const useAlbum = (albumId) => {
  return useQuery({
    queryKey: albumsKeys.detail(albumId),
    queryFn: async () => {
      const response = await adminAPI.getAlbumById(albumId);
      if (!response.success) throw new Error("فشل في تحميل الألبوم");
      return response.data;
    },
    enabled: !!albumId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useAlbumBySlug = (slug) => {
  return useQuery({
    queryKey: albumsKeys.bySlug(slug),
    queryFn: async () => {
      const response = await albumsAPI.getBySlug(slug);
      if (!response.success) throw new Error("الألبوم غير موجود");
      return response.data;
    },
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });
};

export const useFeaturedAlbums = (limit = 6) => {
  return useQuery({
    queryKey: albumsKeys.featured(limit),
    queryFn: async () => {
      const response = await albumsAPI.getFeatured(limit);
      if (!response.success) throw new Error("فشل في تحميل الألبومات المميزة");
      return response.data;
    },
    staleTime: 10 * 60 * 1000,
  });
};

export const useAlbumMedia = (albumId) => {
  return useQuery({
    queryKey: albumsKeys.media(albumId),
    queryFn: async () => {
      const response = await adminAPI.getAlbumMedia(albumId);
      if (!response.success) throw new Error("فشل في تحميل الصور");
      return response.data;
    },
    enabled: !!albumId,
    staleTime: 2 * 60 * 1000,
  });
};

// ==================== MUTATIONS ====================

/**
 * إنشاء ألبوم جديد
 */
export const useCreateAlbum = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (albumData) => {
      const response = await adminAPI.createAlbum(albumData);
      if (!response.success) throw new Error(response.message || "فشل في إنشاء الألبوم");
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: albumsKeys.lists() });
      toast.success("تم إنشاء الألبوم بنجاح");
    },
    onError: (error) => {
      toast.error(error.message || "فشل في إنشاء الألبوم");
    },
  });
};

/**
 * تحديث بيانات ألبوم
 */
export const useUpdateAlbum = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ albumId, data }) => {
      const response = await adminAPI.updateAlbum(albumId, data);
      if (!response.success) throw new Error(response.message || "فشل في تحديث الألبوم");
      return response.data;
    },
    onSuccess: (data, variables) => {
      // Update specific album cache
      queryClient.invalidateQueries({ queryKey: albumsKeys.detail(variables.albumId) });
      // Update lists
      queryClient.invalidateQueries({ queryKey: albumsKeys.lists() });
      // Update featured if applicable
      queryClient.invalidateQueries({ queryKey: albumsKeys.all });
      toast.success("تم تحديث الألبوم بنجاح");
    },
    onError: (error) => {
      toast.error(error.message || "فشل في تحديث الألبوم");
    },
  });
};

/**
 * حذف ألبوم
 */
export const useDeleteAlbum = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (albumId) => {
      const response = await adminAPI.deleteAlbum(albumId);
      if (!response.success) throw new Error(response.message || "فشل في حذف الألبوم");
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: albumsKeys.all });
      toast.success("تم حذف الألبوم بنجاح");
    },
    onError: (error) => {
      toast.error(error.message || "فشل في حذف الألبوم");
    },
  });
};

/**
 * تحديث حالة ألبوم (published/draft)
 */
export const useUpdateAlbumStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ albumId, status }) => {
      const response = await adminAPI.updateAlbum(albumId, { status });
      if (!response.success) throw new Error(response.message || "فشل في تحديث الحالة");
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: albumsKeys.all });
      toast.success("تم تحديث حالة الألبوم");
    },
    onError: (error) => {
      toast.error(error.message || "فشل في التحديث");
    },
  });
};

/**
 * رفع صور للألبوم
 */
export const useUploadAlbumMedia = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ albumId, images }) => {
      const response = await adminAPI.uploadAlbumMedia(albumId, images);
      if (!response.success) throw new Error(response.message || "فشل في رفع الصور");
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: albumsKeys.media(variables.albumId) });
      queryClient.invalidateQueries({ queryKey: albumsKeys.detail(variables.albumId) });
      toast.success(`تم رفع ${data.length || 1} صورة بنجاح`);
    },
    onError: (error) => {
      toast.error(error.message || "فشل في رفع الصور");
    },
  });
};

/**
 * حذف صورة من ألبوم
 */
export const useDeleteAlbumMedia = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ albumId, mediaId }) => {
      const response = await adminAPI.deleteAlbumMedia(albumId, mediaId);
      if (!response.success) throw new Error(response.message || "فشل في حذف الصورة");
      return response;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: albumsKeys.media(variables.albumId) });
      toast.success("تم حذف الصورة");
    },
    onError: (error) => {
      toast.error(error.message || "فشل في حذف الصورة");
    },
  });
};

/**
 * تعيين صورة غلاف للألبوم
 */
export const useSetAlbumCover = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ albumId, mediaId }) => {
      const response = await adminAPI.setAlbumCover(albumId, mediaId);
      if (!response.success) throw new Error(response.message || "فشل في تعيين الغلاف");
      return response;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: albumsKeys.detail(variables.albumId) });
      queryClient.invalidateQueries({ queryKey: albumsKeys.media(variables.albumId) });
      toast.success("تم تعيين صورة الغلاف");
    },
    onError: (error) => {
      toast.error(error.message || "فشل في تعيين الغلاف");
    },
  });
};


import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminAPI } from "../../api/admin";
import { settingsAPI } from "../../api/settings";
import { toast } from "react-hot-toast";

export const settingsKeys = {
  all: ["settings"],
  public: () => [...settingsKeys.all, "public"],
  admin: () => [...settingsKeys.all, "admin"],
};

export const usePublicSettings = () => {
  return useQuery({
    queryKey: settingsKeys.public(),
    queryFn: async () => {
      const response = await settingsAPI.getPublic();
      if (!response.success) throw new Error("فشل في تحميل الإعدادات");
      return response.data;
    },
    staleTime: 15 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
};

export const useAdminSettings = () => {
  return useQuery({
    queryKey: settingsKeys.admin(),
    queryFn: async () => {
      const response = await adminAPI.getSettings();
      if (!response.success) throw new Error("فشل في تحميل الإعدادات");
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
    placeholderData: (previousData) => previousData,
    refetchOnWindowFocus: false,
  });
};

export const useUpdateHomeSlider = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => adminAPI.updateHomeSlider(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.all });
      toast.success("تم حفظ إعدادات السلايدر بنجاح");
    },
    onError: (error) => {
      toast.error(error.message || "فشل في حفظ إعدادات السلايدر");
    },
  });
};

export const useUpdateHomeAbout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => adminAPI.updateHomeAbout(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.all });
      toast.success("تم حفظ إعدادات النبذة التعريفية بنجاح");
    },
    onError: (error) => {
      toast.error(error.message || "فشل في حفظ إعدادات النبذة التعريفية");
    },
  });
};

export const useUpdateHomeCTA = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => adminAPI.updateHomeCTA(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.all });
      toast.success("تم حفظ إعدادات الدعوة لاتخاذ إجراء بنجاح");
    },
    onError: (error) => {
      toast.error(error.message || "فشل في حفظ إعدادات الدعوة لاتخاذ إجراء");
    },
  });
};

export const useUpdateHomeAlbums = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => adminAPI.updateHomeAlbums(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.all });
      toast.success("تم حفظ إعدادات الألبومات بنجاح");
    },
    onError: (error) => {
      toast.error(error.message || "فشل في حفظ إعدادات الألبومات");
    },
  });
};

export const useUpdateHomeTestimonials = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => adminAPI.updateHomeTestimonials(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.all });
      toast.success("تم حفظ إعدادات التقييمات بنجاح");
    },
    onError: (error) => {
      toast.error(error.message || "فشل في حفظ إعدادات التقييمات");
    },
  });
};

export const useUpdateHomeWhatsApp = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => adminAPI.updateHomeWhatsApp(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.all });
      toast.success("تم حفظ إعدادات واتساب بنجاح");
    },
    onError: (error) => {
      toast.error(error.message || "فشل في حفظ إعدادات واتساب");
    },
  });
};

export const useUpdateHomeSections = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => adminAPI.updateHomeSections(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.all });
      toast.success("تم حفظ ترتيب الأقسام بنجاح");
    },
    onError: (error) => {
      toast.error(error.message || "فشل في حفظ ترتيب الأقسام");
    },
  });
};

export const useUpdateSiteMeta = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => adminAPI.updateSiteMeta(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.all });
      toast.success("تم حفظ إعدادات SEO بنجاح");
    },
    onError: (error) => {
      toast.error(error.message || "فشل في حفظ إعدادات SEO");
    },
  });
};

export const useUploadFile = () => {
  return useMutation({
    mutationFn: async (formData) => {
      const response = await adminAPI.uploadFile(formData);
      if (!response.success)
        throw new Error(response.message || "فشل في رفع الملف");
      return response.data;
    },
    onError: (error) => {
      toast.error(error.message || "فشل في رفع الملف");
    },
  });
};

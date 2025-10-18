import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { aboutPageAPI } from "../../api/aboutPage";
import { adminAPI } from "../../api/admin";
import { toast } from "react-hot-toast";

export const aboutPageKeys = {
  all: ["aboutPage"],
  public: () => [...aboutPageKeys.all, "public"],
  admin: () => [...aboutPageKeys.all, "admin"],
};

export const usePublicAboutPage = () => {
  return useQuery({
    queryKey: aboutPageKeys.public(),
    queryFn: async () => {
      const response = await aboutPageAPI.getPublic();
      if (!response.success) throw new Error("فشل في تحميل بيانات الصفحة");
      return response.data;
    },
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
};

export const useAdminAboutPage = () => {
  return useQuery({
    queryKey: aboutPageKeys.admin(),
    queryFn: async () => {
      const response = await aboutPageAPI.getAdmin();
      if (!response.success) throw new Error("فشل في تحميل الإعدادات");
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
    placeholderData: (previousData) => previousData,
    refetchOnWindowFocus: false,
  });
};

export const useUpdateAboutHero = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => aboutPageAPI.updateHero(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: aboutPageKeys.all });
      toast.success("تم حفظ قسم Hero بنجاح");
    },
    onError: (error) => {
      toast.error(error.message || "فشل في حفظ قسم Hero");
    },
  });
};

export const useUpdateAboutStats = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => aboutPageAPI.updateStats(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: aboutPageKeys.all });
      toast.success("تم حفظ الإحصائيات بنجاح");
    },
    onError: (error) => {
      toast.error(error.message || "فشل في حفظ الإحصائيات");
    },
  });
};

export const useUpdateAboutStory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => aboutPageAPI.updateStory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: aboutPageKeys.all });
      toast.success("تم حفظ قسم القصة بنجاح");
    },
    onError: (error) => {
      toast.error(error.message || "فشل في حفظ قسم القصة");
    },
  });
};

export const useUpdateAboutValues = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => aboutPageAPI.updateValues(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: aboutPageKeys.all });
      toast.success("تم حفظ القيم بنجاح");
    },
    onError: (error) => {
      toast.error(error.message || "فشل في حفظ القيم");
    },
  });
};

export const useUpdateAboutWorkshop = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => aboutPageAPI.updateWorkshop(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: aboutPageKeys.all });
      toast.success("تم حفظ قسم الورشة بنجاح");
    },
    onError: (error) => {
      toast.error(error.message || "فشل في حفظ قسم الورشة");
    },
  });
};

export const useUpdateAboutTimeline = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => aboutPageAPI.updateTimeline(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: aboutPageKeys.all });
      toast.success("تم حفظ الخط الزمني بنجاح");
    },
    onError: (error) => {
      toast.error(error.message || "فشل في حفظ الخط الزمني");
    },
  });
};

export const useUpdateAboutSEO = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => aboutPageAPI.updateSEO(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: aboutPageKeys.all });
      toast.success("تم حفظ إعدادات SEO بنجاح");
    },
    onError: (error) => {
      toast.error(error.message || "فشل في حفظ إعدادات SEO");
    },
  });
};

export const useUploadAboutImage = () => {
  return useMutation({
    mutationFn: async (file) => {
      const formData = new FormData();
      formData.append("file", file);
      const response = await adminAPI.uploadFile(formData);
      if (!response.success) throw new Error("فشل في رفع الصورة");
      return response.data.url;
    },
    onError: (error) => {
      toast.error(error.message || "فشل في رفع الصورة");
    },
  });
};

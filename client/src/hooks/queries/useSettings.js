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
    cacheTime: 30 * 60 * 1000,
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
  });
};

export const useUpdateSettings = (section) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      let response;
      switch (section) {
        case "slider":
          response = await adminAPI.updateHomeSlider(data);
          break;
        case "about":
          response = await adminAPI.updateHomeAbout(data);
          break;
        case "cta":
          response = await adminAPI.updateHomeCTA(data);
          break;
        case "testimonials":
          response = await adminAPI.updateHomeTestimonials(data);
          break;
        case "whatsapp":
          response = await adminAPI.updateWhatsAppSettings(data);
          break;
        default:
          throw new Error("Invalid section");
      }
      if (!response.success) throw new Error(response.message);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.all });
      toast.success("تم حفظ الإعدادات بنجاح");
    },
    onError: (error) => {
      toast.error(error.message || "فشل في حفظ الإعدادات");
    },
  });
};

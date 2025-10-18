import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { settingsAPI } from "../../api/settings";
import { toast } from "react-hot-toast";

export const faqKeys = {
  all: ["faq"],
  public: () => [...faqKeys.all, "public"],
  admin: () => [...faqKeys.all, "admin"],
};

export const usePublicFAQs = () => {
  return useQuery({
    queryKey: faqKeys.public(),
    queryFn: async () => {
      const response = await settingsAPI.getFAQSettingsPublic();
      if (!response.success) throw new Error("فشل في تحميل الأسئلة الشائعة");
      return response.data;
    },
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
};

export const useAdminFAQs = () => {
  return useQuery({
    queryKey: faqKeys.admin(),
    queryFn: async () => {
      const response = await settingsAPI.getFAQSettings();
      if (!response.success) throw new Error("فشل في تحميل إعدادات الأسئلة");
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
    placeholderData: (previousData) => previousData,
    refetchOnWindowFocus: false,
  });
};

export const useUpdateFAQs = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (faqData) => {
      const response = await settingsAPI.updateFAQSettings(faqData);
      if (!response.success)
        throw new Error(response.message || "فشل في حفظ الأسئلة");
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: faqKeys.all });
      toast.success("تم حفظ الأسئلة الشائعة بنجاح");
    },
    onError: (error) => {
      toast.error(error.message || "فشل في حفظ الأسئلة الشائعة");
    },
  });
};

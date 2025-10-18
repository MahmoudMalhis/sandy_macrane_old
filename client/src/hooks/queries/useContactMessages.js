import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { contactAPI } from "../../api/contact";
import { toast } from "react-hot-toast";

export const contactKeys = {
  all: ["contact"],
  lists: () => [...contactKeys.all, "list"],
  list: (filters) => [...contactKeys.lists(), filters],
  stats: () => [...contactKeys.all, "stats"],
};

export const useContactMessages = (filters = {}) => {
  return useQuery({
    queryKey: contactKeys.list(filters),
    queryFn: async () => {
      const response = await contactAPI.getAll(filters);
      if (!response.success) throw new Error("فشل في تحميل الرسائل");
      return {
        data: response.data,
        pagination: response.pagination,
      };
    },
    placeholderData: (previousData) => previousData,
    staleTime: 1 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
  });
};

export const useContactStats = () => {
  return useQuery({
    queryKey: contactKeys.stats(),
    queryFn: async () => {
      const response = await contactAPI.getStats();
      if (!response.success) throw new Error("فشل في تحميل الإحصائيات");
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useMarkAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (messageId) => contactAPI.markAsRead(messageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contactKeys.all });
    },
  });
};

export const useDeleteMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (messageId) => contactAPI.delete(messageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contactKeys.all });
      toast.success("تم حذف الرسالة");
    },
    onError: (error) => {
      toast.error(error.message || "فشل في الحذف");
    },
  });
};

export const useUpdateContactStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ messageId, status }) =>
      contactAPI.updateStatus(messageId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contactKeys.all });
      toast.success("تم تحديث الحالة بنجاح");
    },
    onError: (error) => {
      toast.error(error.message || "فشل في تحديث الحالة");
    },
  });
};

export const useUpdateContactPriority = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ messageId, priority }) =>
      contactAPI.updatePriority(messageId, priority),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contactKeys.all });
      toast.success("تم تحديث الأولوية بنجاح");
    },
    onError: (error) => {
      toast.error(error.message || "فشل في تحديث الأولوية");
    },
  });
};

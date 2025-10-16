import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { inquiriesAPI } from "../../api/inquiries";
import { toast } from "react-hot-toast";

export const inquiriesKeys = {
  all: ["inquiries"],
  lists: () => [...inquiriesKeys.all, "list"],
  list: (filters) => [...inquiriesKeys.lists(), filters],
  stats: () => [...inquiriesKeys.all, "stats"],
};

export const useInquiries = (filters = {}) => {
  return useQuery({
    queryKey: inquiriesKeys.list(filters),
    queryFn: async () => {
      const params = {
        page: 1,
        limit: 50,
        ...(filters.status &&
          filters.status !== "all" && { status: filters.status }),
        ...(filters.type &&
          filters.type !== "all" && { product_type: filters.type }),
        ...(filters.search && { search: filters.search }),
      };
      const response = await inquiriesAPI.getAll(params);
      if (!response.success)
        throw new Error(response.message || "فشل في تحميل الطلبات");
      return response.data;
    },
    staleTime: 2 * 60 * 1000,
    retry: 1,
  });
};

export const useInquiriesStats = () => {
  return useQuery({
    queryKey: inquiriesKeys.stats(),
    queryFn: async () => {
      const response = await inquiriesAPI.getStats();
      if (!response.success) throw new Error("فشل في تحميل الإحصائيات");
      return {
        total: response.data.total,
        new: response.data.byStatus.new,
        in_progress:
          response.data.byStatus.in_review + response.data.byStatus.contacted,
        completed: response.data.byStatus.closed,
      };
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useUpdateInquiryStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ inquiryId, newStatus }) =>
      inquiriesAPI.updateStatus(inquiryId, newStatus),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: inquiriesKeys.all });
      toast.success("تم تحديث حالة الطلب بنجاح");
    },
    onError: (error) => {
      toast.error(error.message || "فشل في تحديث الحالة");
    },
  });
};

export const useDeleteInquiry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (inquiryId) => inquiriesAPI.delete(inquiryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: inquiriesKeys.all });
      toast.success("تم حذف الطلب بنجاح");
    },
    onError: (error) => {
      toast.error(error.message || "فشل في حذف الطلب");
    },
  });
};

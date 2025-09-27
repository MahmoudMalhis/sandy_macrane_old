// client/src/api/inquiries.js - API للطلبات والاستعلامات
import { apiClient } from "./config.js";

export const inquiriesAPI = {
  // Public routes - إرسال طلب جديد
  create: (data) => {
    const formData = new FormData();

    // إضافة البيانات الأساسية
    formData.append("customer_name", data.customer_name);
    formData.append("phone_whatsapp", data.phone_whatsapp);
    formData.append("product_type", data.product_type);
    formData.append("notes", data.notes || "");

    if (data.email) {
      formData.append("email", data.email);
    }

    if (data.album_id) {
      formData.append("album_id", data.album_id);
    }

    // إضافة الصور المرفقة
    if (data.attached_images && data.attached_images.length > 0) {
      data.attached_images.forEach((image) => {
        formData.append("images", image.file);
      });
    }

    return apiClient.post("/inquiries", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // Admin routes - إدارة الطلبات
  getAll: (params) => apiClient.get("/inquiries/admin", { params }),
  getById: (id) => apiClient.get(`/inquiries/admin/${id}`),
  updateStatus: (id, status, notes = null) =>
    apiClient.put(`/inquiries/admin/${id}/status`, { status, notes }),
  delete: (id) => apiClient.delete(`/inquiries/admin/${id}`),
  getStats: () => apiClient.get("/inquiries/admin/stats"),
  generateWhatsAppLink: (id) =>
    apiClient.get(`/inquiries/admin/${id}/whatsapp`),
};

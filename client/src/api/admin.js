import { apiClient } from "./config.js";

export const adminAPI = {
  // Dashboard Stats
  getStats: () => apiClient.get("/admin/stats"),

  // Albums Management
  getAlbums: (params) => apiClient.get("/albums/admin", { params }),
  getAlbumById: (id) => apiClient.get(`/albums/admin/${id}`),
  createAlbum: (data) => apiClient.post("/albums/admin", data),
  deleteAlbum: (id) => apiClient.delete(`/albums/admin/${id}`),
  getAlbumsStats: () => apiClient.get("/albums/admin/stats"),

  /**
   * تحديث بيانات الألبوم - مُصحح
   */
  updateAlbum: (albumId, data) =>
    apiClient.put(`/albums/admin/${albumId}`, data),

  // Media Management
  uploadMedia: (albumId, formData) =>
    apiClient.post(`/media/album/${albumId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  /**
   * رفع صور للألبوم - دالة مُضافة
   */
  uploadAlbumMedia: (albumId, formData) =>
    apiClient.post(`/media/album/${albumId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  getAlbumMedia: (albumId) => apiClient.get(`/media/album/${albumId}`),

  /**
   * تحديث وسائط محددة - مُصحح
   */
  updateMedia: (mediaId, data) =>
    apiClient.put(`/media/admin/${mediaId}`, data),

  /**
   * حذف وسائط متعددة - مُصحح
   */
  deleteMedia: (mediaIds) =>
    apiClient.delete("/media/admin/bulk-delete", {
      data: { mediaIds },
    }),

  /**
   * إعادة ترتيب الوسائط في الألبوم - مُصحح
   */
  reorderMedia: (albumId, reorderData) =>
    apiClient.post(`/albums/admin/${albumId}/media/reorder`, {
      media: reorderData,
    }),

  /**
   * تعيين صورة كغلاف للألبوم - مُصحح
   */
  setCoverImage: (albumId, mediaId) =>
    apiClient.post(`/albums/admin/${albumId}/cover`, { mediaId }),

  // Reviews Management
  getReviews: (params) => apiClient.get("/reviews/admin", { params }),
  getReviewById: (id) => apiClient.get(`/reviews/admin/${id}`),
  updateReview: (id, data) => apiClient.put(`/reviews/admin/${id}`, data),
  updateReviewStatus: (id, status) =>
    apiClient.put(`/reviews/admin/${id}/status`, { status }),
  deleteReview: (id) => apiClient.delete(`/reviews/admin/${id}`),
  getReviewsStats: () => apiClient.get("/reviews/admin/stats"),

  // Inquiries Management
  getInquiries: (params) => apiClient.get("/inquiries/admin", { params }),
  getInquiryById: (id) => apiClient.get(`/inquiries/admin/${id}`),
  updateInquiryStatus: (id, status, notes = null) =>
    apiClient.put(`/inquiries/admin/${id}/status`, { status, notes }),
  deleteInquiry: (id) => apiClient.delete(`/inquiries/admin/${id}`),
  getInquiriesStats: () => apiClient.get("/inquiries/admin/stats"),
  generateWhatsAppLink: (id) =>
    apiClient.get(`/inquiries/admin/${id}/whatsapp`),

  // Settings Management
  getSettings: () => apiClient.get("/settings/admin"),
  getAllHomeSettings: () => apiClient.get("/settings/admin/home"),
  updateSettings: (data) => apiClient.put("/settings/admin", data),
  updateHomeSlider: (data) =>
    apiClient.put("/settings/admin/home/slider", data),
  updateHomeAbout: (data) => apiClient.put("/settings/admin/home/about", data),
  updateHomeCTA: (data) => apiClient.put("/settings/admin/home/cta", data),
  updateHomeAlbums: (data) =>
    apiClient.put("/settings/admin/home/albums", data),
  updateHomeTestimonials: (data) =>
    apiClient.put("/settings/admin/home/testimonials", data),
  updateHomeWhatsApp: (data) =>
    apiClient.put("/settings/admin/home/whatsapp", data),
  updateHomeSections: (data) =>
    apiClient.put("/settings/admin/home/sections", data),
  updateSiteMeta: (data) => apiClient.put("/settings/admin/site/meta", data),

  // Media Upload (general)
  uploadFile: (formData) =>
    apiClient.post("/media/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
};

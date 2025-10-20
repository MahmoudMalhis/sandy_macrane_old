
import { apiClient } from "./config.js";

export const adminAPI = {
  getStats: (params = {}) => apiClient.get("/admin/stats", { params }),

  getNotifications: () => apiClient.get("/admin/notifications"),

  markNotificationAsRead: (id) =>
    apiClient.patch(`/admin/notifications/${id}/read`),

  markAllNotificationsAsRead: () =>
    apiClient.patch("/admin/notifications/read-all"),

  deleteNotification: (id) => apiClient.delete(`/admin/notifications/${id}`),

  getActivities: (params) => apiClient.get("/admin/activities", { params }),

  exportData: (type, format = "json") =>
    apiClient.get(`/admin/export/${type}`, { params: { format } }),

  getAlbums: (params) => apiClient.get("/albums/admin", { params }),
  getAlbumById: (id) => apiClient.get(`/albums/admin/${id}`),
  createAlbum: (data) => apiClient.post("/albums/admin", data),
  updateAlbum: (albumId, data) =>
    apiClient.put(`/albums/admin/${albumId}`, data),
  deleteAlbum: (id) => apiClient.delete(`/albums/admin/${id}`),
  getAlbumsStats: () => apiClient.get("/albums/admin/stats"),
  setCoverImage: (albumId, mediaId) =>
    apiClient.post(`/albums/admin/${albumId}/cover`, { mediaId }),

  uploadMedia: (albumId, formData) =>
    apiClient.post(`/media/album/${albumId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  uploadAlbumMedia: (albumId, formData) =>
    apiClient.post(`/media/album/${albumId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  getAlbumMedia: (albumId) => apiClient.get(`/media/album/${albumId}`),
  updateMedia: (mediaId, data) =>
    apiClient.put(`/media/admin/${mediaId}`, data),
  deleteMedia: (mediaIds) =>
    apiClient.delete("/media/admin/bulk-delete", {
      data: { mediaIds },
    }),
  reorderMedia: (albumId, mediaIds) =>
    apiClient.post(`/media/album/${albumId}/reorder`, {
      mediaIds: mediaIds,
    }),

  getReviews: (params) => apiClient.get("/reviews/admin", { params }),
  getReviewById: (id) => apiClient.get(`/reviews/admin/${id}`),
  updateReview: (id, data) => apiClient.put(`/reviews/admin/${id}`, data),
  updateReviewStatus: (id, status) =>
    apiClient.put(`/reviews/admin/${id}/status`, { status }),
  deleteReview: (id) => apiClient.delete(`/reviews/admin/${id}`),
  getReviewsStats: () => apiClient.get("/reviews/admin/stats"),

  getInquiries: (params) => apiClient.get("/inquiries/admin", { params }),
  getInquiryById: (id) => apiClient.get(`/inquiries/admin/${id}`),
  updateInquiryStatus: (id, status, notes = null) =>
    apiClient.put(`/inquiries/admin/${id}/status`, { status, notes }),
  deleteInquiry: (id) => apiClient.delete(`/inquiries/admin/${id}`),
  getInquiriesStats: () => apiClient.get("/inquiries/admin/stats"),
  generateWhatsAppLink: (id) =>
    apiClient.get(`/inquiries/admin/${id}/whatsapp`),

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

  uploadFile: (formData) =>
    apiClient.post("/media/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  saveFcmToken: (token) =>
    apiClient.post("/admin/fcm-token", { fcm_token: token }),

  deleteFcmToken: (token) =>
    apiClient.delete("/admin/fcm-token", { data: { fcm_token: token } }),
};


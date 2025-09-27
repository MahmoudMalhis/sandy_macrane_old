// client/src/api/admin.js - مُحدث للاتصال بالباك إند
import { apiClient } from "./config.js";

export const adminAPI = {
  // Dashboard Stats
  getStats: () => apiClient.get("/admin/stats"),

  // Albums Management
  getAlbums: (params) => apiClient.get("/albums/admin", { params }),
  getAlbumById: (id) => apiClient.get(`/albums/admin/${id}`),
  createAlbum: (data) => apiClient.post("/albums/admin", data),
  updateAlbum: (id, data) => apiClient.put(`/albums/admin/${id}`, data),
  deleteAlbum: (id) => apiClient.delete(`/albums/admin/${id}`),
  getAlbumsStats: () => apiClient.get("/albums/admin/stats"),

  // Media Management
  uploadMedia: (albumId, formData) =>
    apiClient.post(`/media/album/${albumId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  getAlbumMedia: (albumId) => apiClient.get(`/media/album/${albumId}`),
  updateMedia: (id, data) => apiClient.put(`/media/${id}`, data),
  deleteMedia: (id) => apiClient.delete(`/media/${id}`),
  reorderMedia: (albumId, mediaIds) =>
    apiClient.post(`/media/album/${albumId}/reorder`, { mediaIds }),

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

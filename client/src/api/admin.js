import { apiClient } from "./config.js";

export const adminAPI = {
  getStats: () => apiClient.get("/admin/stats"),

  getAlbums: (params) => apiClient.get("/albums/admin", { params }),
  getAlbumById: (id) => apiClient.get(`/albums/admin/${id}`),
  createAlbum: (data) => apiClient.post("/albums/admin", data),
  deleteAlbum: (id) => apiClient.delete(`/albums/admin/${id}`),
  getAlbumsStats: () => apiClient.get("/albums/admin/stats"),

  updateAlbum: (albumId, data) =>
    apiClient.put(`/albums/admin/${albumId}`, data),

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

  setCoverImage: (albumId, mediaId) =>
    apiClient.post(`/albums/admin/${albumId}/cover`, { mediaId }),

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
};

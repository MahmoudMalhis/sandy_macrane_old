// client/src/api/auth.js - API Client محدث
import { apiClient } from "./config";

// ==================== Auth APIs ====================
export const authAPI = {
  login: (credentials) => apiClient.post("/auth/login", credentials),
  getProfile: () => apiClient.get("/auth/profile"),
  changePassword: (passwordData) =>
    apiClient.post("/auth/change-password", passwordData),
  checkSetupStatus: () => apiClient.get("/auth/setup-status"),
  setupFirstAdmin: (data) => apiClient.post("/auth/setup-first-admin", data),
  verifyEmail: (token) => apiClient.get(`/auth/verify-email/${token}`),
  resendVerificationEmail: (data) =>
    apiClient.post("/auth/resend-verification", data),
};

// ==================== Admin APIs ====================
export const adminAPI = {
  // Dashboard Stats - محدث لدعم معامل days
  getStats: (params = {}) => apiClient.get("/admin/stats", { params }),

  // System Health
  getSystemHealth: () => apiClient.get("/admin/system-health"),

  // Albums Management
  getAlbums: (params) => apiClient.get("/albums/admin", { params }),
  getAlbumById: (id) => apiClient.get(`/albums/admin/${id}`),
  createAlbum: (data) => apiClient.post("/albums/admin", data),
  updateAlbum: (id, data) => apiClient.put(`/albums/admin/${id}`, data),
  deleteAlbum: (id) => apiClient.delete(`/albums/admin/${id}`),
  getAlbumStats: () => apiClient.get("/albums/admin/stats"),

  // Testimonials/Reviews Management
  getTestimonials: (params) => apiClient.get("/reviews/admin", { params }),
  getTestimonialById: (id) => apiClient.get(`/reviews/admin/${id}`),
  updateTestimonialStatus: (id, status) =>
    apiClient.put(`/reviews/admin/${id}/status`, { status }),
  deleteTestimonial: (id) => apiClient.delete(`/reviews/admin/${id}`),
  getReviewStats: () => apiClient.get("/reviews/admin/stats"),

  // Inquiries Management
  getInquiries: (params) => apiClient.get("/inquiries/admin", { params }),
  getInquiryById: (id) => apiClient.get(`/inquiries/admin/${id}`),
  updateInquiryStatus: (id, status) =>
    apiClient.put(`/inquiries/admin/${id}/status`, { status }),
  deleteInquiry: (id) => apiClient.delete(`/inquiries/admin/${id}`),
  getInquiryStats: () => apiClient.get("/inquiries/admin/stats"),

  // Settings Management
  getSettings: () => apiClient.get("/settings/admin"),
  updateSettings: (data) => apiClient.put("/settings/admin", data),
  updateWhatsApp: (phoneNumber) =>
    apiClient.put("/settings/admin/whatsapp/owner", { phoneNumber }),
  updateSocialLinks: (links) =>
    apiClient.put("/settings/admin/social/links", links),
  updateSiteMeta: (meta) => apiClient.put("/settings/admin/site/meta", meta),

  // Media Upload
  uploadMedia: (formData) =>
    apiClient.post("/media/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  uploadAlbumMedia: (albumId, formData) =>
    apiClient.post(`/media/album/${albumId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  deleteMedia: (id) => apiClient.delete(`/media/${id}`),
};

// ==================== Public APIs ====================
export const publicAPI = {
  // Albums
  getPublicAlbums: (params) => apiClient.get("/albums", { params }),
  getAlbumBySlug: (slug) => apiClient.get(`/albums/slug/${slug}`),
  getFeaturedAlbums: () => apiClient.get("/albums/featured"),

  // Reviews
  getPublicReviews: (params) => apiClient.get("/reviews", { params }),
  getFeaturedReviews: () => apiClient.get("/reviews/featured"),
  submitReview: (data) => apiClient.post("/reviews", data),

  // Inquiries
  submitInquiry: (data) => apiClient.post("/inquiries", data),

  // Settings
  getPublicSettings: () => apiClient.get("/settings/public"),
};

// Export default للاستخدام السهل
export default {
  auth: authAPI,
  admin: adminAPI,
  public: publicAPI,
};

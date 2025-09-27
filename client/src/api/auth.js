// client/src/api/auth.js - مُصحح
import { apiClient } from "./config";

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

// src/api/admin.js
export const adminAPI = {
  // Dashboard Stats
  getStats: () => apiClient.get("/admin/stats"),

  // Albums Management
  getAlbums: (params) => apiClient.get("/albums/admin", { params }),
  createAlbum: (data) => apiClient.post("/albums/admin", data),
  updateAlbum: (id, data) => apiClient.put(`/albums/admin/${id}`, data),
  deleteAlbum: (id) => apiClient.delete(`/albums/admin/${id}`),

  // Testimonials Management
  getTestimonials: (params) => apiClient.get("/reviews/admin", { params }),
  updateTestimonialStatus: (id, status) =>
    apiClient.put(`/reviews/admin/${id}/status`, { status }),
  deleteTestimonial: (id) => apiClient.delete(`/reviews/admin/${id}`),

  // Settings Management
  getSettings: () => apiClient.get("/settings/admin"),
  updateSettings: (data) => apiClient.put("/settings/admin", data),
  updateWhatsApp: (phoneNumber) =>
    apiClient.put("/settings/admin/whatsapp/owner", { phoneNumber }),
  updateSocialLinks: (links) =>
    apiClient.put("/settings/admin/social/links", links),

  // Media Upload
  uploadMedia: (formData) =>
    apiClient.post("/media/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
};

// client/src/api/albums.js
import { apiClient } from "./config.js";

export const albumsAPI = {
  // Public routes
  getAll: (params) => apiClient.get("/albums", { params }),
  getFeatured: (limit) => apiClient.get(`/albums/featured?limit=${limit || 6}`),
  getBySlug: (slug) => apiClient.get(`/albums/slug/${slug}`),

  // Admin routes
  getAllAdmin: (params) => apiClient.get("/albums/admin", { params }),
  getById: (id) => apiClient.get(`/albums/admin/${id}`),
  create: (data) => apiClient.post("/albums/admin", data),
  update: (id, data) => apiClient.put(`/albums/admin/${id}`, data),
  delete: (id) => apiClient.delete(`/albums/admin/${id}`),
  getStats: () => apiClient.get("/albums/admin/stats"),
};

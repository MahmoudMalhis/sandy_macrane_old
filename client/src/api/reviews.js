import { apiClient } from "./config.js";

export const reviewsAPI = {
  getAll: (params = {}) => {
    const queryParams = {};

    if (params.page) queryParams.page = params.page;
    if (params.limit) queryParams.limit = params.limit;
    if (params.status) queryParams.status = params.status;
    if (params.linked_album_id)
      queryParams.linked_album_id = params.linked_album_id;

    return apiClient.get("/reviews", { params: queryParams });
  },

  getFeatured: (limit) =>
    apiClient.get(`/reviews/featured?limit=${limit || 3}`),

  create: (data) => {
    const formData = new FormData();
    formData.append("author_name", data.author_name);
    formData.append("rating", data.rating);
    formData.append("text", data.text);
    if (data.linked_album_id) {
      formData.append("linked_album_id", data.linked_album_id);
    }
    if (data.review_image) {
      formData.append("review_image", data.review_image);
    }

    return apiClient.post("/reviews", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  getAllAdmin: (params = {}) => {
    const queryParams = {};

    if (params.page) queryParams.page = params.page;
    if (params.limit) queryParams.limit = params.limit;
    if (params.status) queryParams.status = params.status;
    if (params.linked_album_id)
      queryParams.linked_album_id = params.linked_album_id;
    if (params.search) queryParams.search = params.search;
    if (params.min_rating) queryParams.min_rating = params.min_rating;
    if (params.author_name) queryParams.author_name = params.author_name;
    if (params.date_from) queryParams.date_from = params.date_from;
    if (params.date_to) queryParams.date_to = params.date_to;
    if (params.sort_by) queryParams.sort_by = params.sort_by;
    if (params.sort_order) queryParams.sort_order = params.sort_order;

    return apiClient.get("/reviews/admin", { params: queryParams });
  },

  getById: (id) => apiClient.get(`/reviews/admin/${id}`),

  update: (id, data) => {
    const updateData = {};

    if (data.author_name !== undefined)
      updateData.author_name = data.author_name;
    if (data.rating !== undefined) updateData.rating = data.rating;
    if (data.text !== undefined) updateData.text = data.text;
    if (data.linked_album_id !== undefined)
      updateData.linked_album_id = data.linked_album_id;
    if (data.status !== undefined) updateData.status = data.status;

    return apiClient.put(`/reviews/admin/${id}`, updateData);
  },

  changeStatus: (id, status) =>
    apiClient.put(`/reviews/admin/${id}/status`, { status }),

  delete: (id) => apiClient.delete(`/reviews/admin/${id}`),

  getStats: () => apiClient.get("/reviews/admin/stats"),

  updateMultiple: (ids, updateData) =>
    apiClient.put("/reviews/admin/bulk-update", { ids, ...updateData }),

  changeMultipleStatus: (ids, status) =>
    apiClient.put("/reviews/admin/bulk-status", { ids, status }),

  deleteMultiple: (ids) =>
    apiClient.delete("/reviews/admin/bulk-delete", { data: { ids } }),

  exportReviews: (params = {}) => {
    const queryParams = { format: "csv", ...params };
    return apiClient.get("/reviews/admin/export", {
      params: queryParams,
      responseType: "blob",
    });
  },

  getDetailedStats: (params = {}) => {
    const queryParams = {};
    if (params.date_from) queryParams.date_from = params.date_from;
    if (params.date_to) queryParams.date_to = params.date_to;
    if (params.group_by) queryParams.group_by = params.group_by;

    return apiClient.get("/reviews/admin/stats/detailed", {
      params: queryParams,
    });
  },

  advancedSearch: (searchParams) => {
    const params = {
      page: searchParams.page || 1,
      limit: searchParams.limit || 20,
    };

    if (searchParams.query) params.query = searchParams.query;
    if (searchParams.author_name) params.author_name = searchParams.author_name;

    if (searchParams.rating_min) params.rating_min = searchParams.rating_min;
    if (searchParams.rating_max) params.rating_max = searchParams.rating_max;
    if (searchParams.exact_rating)
      params.exact_rating = searchParams.exact_rating;

    if (searchParams.status) {
      if (Array.isArray(searchParams.status)) {
        params.status = searchParams.status.join(",");
      } else {
        params.status = searchParams.status;
      }
    }

    if (searchParams.created_after)
      params.created_after = searchParams.created_after;
    if (searchParams.created_before)
      params.created_before = searchParams.created_before;

    if (searchParams.album_id) params.album_id = searchParams.album_id;
    if (searchParams.has_album) params.has_album = searchParams.has_album;

    if (searchParams.has_image) params.has_image = searchParams.has_image;

    if (searchParams.sort_by) params.sort_by = searchParams.sort_by;
    if (searchParams.sort_order) params.sort_order = searchParams.sort_order;

    return apiClient.get("/reviews/admin/search", { params });
  },

  analyzeSentiment: (reviewId) =>
    apiClient.post(`/reviews/admin/${reviewId}/sentiment`),

  linkToAlbum: (reviewId, albumId) =>
    apiClient.put(`/reviews/admin/${reviewId}/link-album`, {
      album_id: albumId,
    }),

  unlinkFromAlbum: (reviewId) =>
    apiClient.delete(`/reviews/admin/${reviewId}/link-album`),

  getByAlbum: (albumId, params = {}) => {
    const queryParams = {
      linked_album_id: albumId, 
      status: params.status || "published",
      ...params,
    };
    return apiClient.get("/reviews", { params: queryParams });
  },

  getSimilar: (reviewId, limit = 5) =>
    apiClient.get(`/reviews/admin/${reviewId}/similar?limit=${limit}`),

  updateAdminNotes: (reviewId, notes) =>
    apiClient.put(`/reviews/admin/${reviewId}/notes`, { admin_notes: notes }),

  markHelpful: (reviewId, helpful = true) =>
    apiClient.post(`/reviews/admin/${reviewId}/helpful`, { helpful }),

  reportReview: (reviewId, reason, description = "") =>
    apiClient.post(`/reviews/${reviewId}/report`, { reason, description }),

  getReports: (params = {}) =>
    apiClient.get("/reviews/admin/reports", { params }),

  handleReport: (reportId, action, notes = "") =>
    apiClient.put(`/reviews/admin/reports/${reportId}`, { action, notes }),
};

import { apiClient } from "./config";

export const aboutPageAPI = {
  getPublic: () => apiClient.get("/settings/about-page/public"),

  getAdmin: () => apiClient.get("/settings/admin/about-page"),

  updateHero: (data) => apiClient.put("/settings/admin/about-page/hero", data),

  updateStory: (data) =>
    apiClient.put("/settings/admin/about-page/story", data),

  updateValues: (data) =>
    apiClient.put("/settings/admin/about-page/values", data),

  updateWorkshop: (data) =>
    apiClient.put("/settings/admin/about-page/workshop", data),

  updateTimeline: (data) =>
    apiClient.put("/settings/admin/about-page/timeline", data),

  updateSEO: (data) => apiClient.put("/settings/admin/about-page/seo", data),

  updateAll: (data) => apiClient.put("/settings/admin/about-page/all", data),

  updateStats: (data) =>
    apiClient.put("/settings/admin/about-page/stats", data),
};

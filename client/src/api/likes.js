// client/src/api/likes.js
/**
 * Likes API Client
 * استدعاءات API للإعجابات
 */

import { apiClient } from "./config.js";

export const likesAPI = {
  /**
   * إضافة إعجاب لألبوم
   * @param {number} albumId - معرف الألبوم
   * @returns {Promise} - النتيجة
   */
  like: (albumId) => apiClient.post(`/albums/${albumId}/like`),

  /**
   * إزالة إعجاب من ألبوم
   * @param {number} albumId - معرف الألبوم
   * @returns {Promise} - النتيجة
   */
  unlike: (albumId) => apiClient.post(`/albums/${albumId}/unlike`),

  /**
   * الحصول على عدد الإعجابات
   * @param {number} albumId - معرف الألبوم
   * @returns {Promise} - عدد الإعجابات
   */
  getCount: (albumId) => apiClient.get(`/albums/${albumId}/likes`),

  /**
   * الحصول على الألبومات الأكثر إعجاباً
   * @param {number} limit - عدد النتائج
   * @returns {Promise} - قائمة الألبومات
   */
  getMostLiked: (limit = 10) =>
    apiClient.get(`/albums/most-liked?limit=${limit}`),
};

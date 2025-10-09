/**
 * Likes Service
 * يدير عمليات الإعجاب على الألبومات
 */

import db, { fn } from "../../db/knex.js";

class LikesService {
  /**
   * إضافة إعجاب لألبوم
   * @param {number} albumId - معرف الألبوم
   * @returns {object} - البيانات المحدثة
   */
  static async likeAlbum(albumId) {
    try {
      const album = await db("albums").where("id", albumId).first();

      if (!album) {
        throw new Error("Album not found");
      }

      await db("albums")
        .where("id", albumId)
        .increment("likes_count", 1)
        .update({ updated_at: fn.now() });

      const updatedAlbum = await db("albums")
        .where("id", albumId)
        .select("id", "likes_count")
        .first();

      return {
        albumId: updatedAlbum.id,
        likesCount: updatedAlbum.likes_count,
        action: "liked",
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * إزالة إعجاب من ألبوم
   * @param {number} albumId - معرف الألبوم
   * @returns {object} - البيانات المحدثة
   */
  static async unlikeAlbum(albumId) {
    try {
      const album = await db("albums").where("id", albumId).first();

      if (!album) {
        throw new Error("Album not found");
      }

      if (album.likes_count > 0) {
        await db("albums")
          .where("id", albumId)
          .decrement("likes_count", 1)
          .update({ updated_at: fn.now() });
      }

      const updatedAlbum = await db("albums")
        .where("id", albumId)
        .select("id", "likes_count")
        .first();

      return {
        albumId: updatedAlbum.id,
        likesCount: updatedAlbum.likes_count,
        action: "unliked",
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * الحصول على عدد الإعجابات لألبوم
   * @param {number} albumId - معرف الألبوم
   * @returns {number} - عدد الإعجابات
   */
  static async getLikesCount(albumId) {
    try {
      const album = await db("albums")
        .where("id", albumId)
        .select("likes_count")
        .first();

      if (!album) {
        throw new Error("Album not found");
      }

      return album.likes_count || 0;
    } catch (error) {
      throw error;
    }
  }

  /**
   * الحصول على الألبومات الأكثر إعجاباً
   * @param {number} limit - عدد النتائج
   * @returns {Array} - قائمة الألبومات
   */
  static async getMostLiked(limit = 10) {
    try {
      const albums = await db("albums")
        .where("status", "published")
        .orderBy("likes_count", "desc")
        .limit(limit)
        .select(
          "id",
          "slug",
          "title",
          "category",
          "cover_image",
          "likes_count",
          "view_count"
        );

      return albums;
    } catch (error) {
      throw error;
    }
  }
}

export const likeAlbum = LikesService.likeAlbum.bind(LikesService);
export const unlikeAlbum = LikesService.unlikeAlbum.bind(LikesService);
export const getLikesCount = LikesService.getLikesCount.bind(LikesService);
export const getMostLiked = LikesService.getMostLiked.bind(LikesService);

export default LikesService;

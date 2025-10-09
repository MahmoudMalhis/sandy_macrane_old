import {
  likeAlbum as _likeAlbum,
  unlikeAlbum as _unlikeAlbum,
  getLikesCount as _getLikesCount,
  getMostLiked as _getMostLiked,
} from "./likes.service.js";
import { error as _error, info } from "../../utils/logger.js";

class LikesController {
  static async likeAlbum(req, res) {
    try {
      const albumId = parseInt(req.params.id);

      if (!albumId || isNaN(albumId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid album ID",
        });
      }

      const result = await _likeAlbum(albumId);

      info("Album liked", { albumId, likesCount: result.likesCount });

      res.json({
        success: true,
        data: result,
        message: "تم الإعجاب بالألبوم",
      });
    } catch (error) {
      if (error.message === "Album not found") {
        return res.status(404).json({
          success: false,
          message: "الألبوم غير موجود",
        });
      }

      _error("Like album failed", {
        albumId: req.params.id,
        error: error.message,
      });

      res.status(500).json({
        success: false,
        message: "فشل في إضافة الإعجاب",
      });
    }
  }

  static async unlikeAlbum(req, res) {
    try {
      const albumId = parseInt(req.params.id);

      if (!albumId || isNaN(albumId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid album ID",
        });
      }

      const result = await _unlikeAlbum(albumId);

      info("Album unliked", { albumId, likesCount: result.likesCount });

      res.json({
        success: true,
        data: result,
        message: "تم إلغاء الإعجاب",
      });
    } catch (error) {
      if (error.message === "Album not found") {
        return res.status(404).json({
          success: false,
          message: "الألبوم غير موجود",
        });
      }

      _error("Unlike album failed", {
        albumId: req.params.id,
        error: error.message,
      });

      res.status(500).json({
        success: false,
        message: "فشل في إلغاء الإعجاب",
      });
    }
  }

  static async getLikesCount(req, res) {
    try {
      const albumId = parseInt(req.params.id);

      if (!albumId || isNaN(albumId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid album ID",
        });
      }

      const likesCount = await _getLikesCount(albumId);

      res.json({
        success: true,
        data: {
          albumId,
          likesCount,
        },
      });
    } catch (error) {
      if (error.message === "Album not found") {
        return res.status(404).json({
          success: false,
          message: "الألبوم غير موجود",
        });
      }

      _error("Get likes count failed", {
        albumId: req.params.id,
        error: error.message,
      });

      res.status(500).json({
        success: false,
        message: "فشل في جلب عدد الإعجابات",
      });
    }
  }

  /**
   * الحصول على الألبومات الأكثر إعجاباً
   * GET /albums/most-liked
   */
  static async getMostLiked(req, res) {
    try {
      const { limit } = req.query;
      const albums = await _getMostLiked(parseInt(limit) || 10);

      res.json({
        success: true,
        data: albums,
      });
    } catch (error) {
      _error("Get most liked albums failed", { error: error.message });

      res.status(500).json({
        success: false,
        message: "فشل في جلب الألبومات الأكثر إعجاباً",
      });
    }
  }
}


export const likeAlbum = LikesController.likeAlbum;
export const unlikeAlbum = LikesController.unlikeAlbum;
export const getLikesCount = LikesController.getLikesCount;
export const getMostLiked = LikesController.getMostLiked;

export default LikesController;
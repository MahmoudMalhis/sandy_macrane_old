

import {
  addMultipleToAlbum,
  getByAlbum,
  update as _update,
  deleteMedia as _delete,
  reorder as _reorder,
  bulkDelete as _bulkDelete,
} from "./service.js";
import { getById } from "../albums/service.js";
import { processUploadedFiles, deleteFile } from "../../utils/upload.js";
import { info, error as _error } from "../../utils/logger.js";

/**
 * Media Controller - Updated for Cloudinary
 * يتعامل مع رفع وإدارة الصور عبر Cloudinary
 */
class MediaController {
  /**
   * رفع صور جديدة إلى ألبوم معين
   * @route POST /api/media/album/:albumId
   */
  static async uploadToAlbum(req, res) {
    try {
      const { albumId } = req.params;

      
      await getById(parseInt(albumId), false);

      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          success: false,
          message: "لم يتم رفع أي ملفات",
        });
      }

      
      const processedFiles = processUploadedFiles(req, req.files);

      
      const mediaData = processedFiles.map((file) => ({
        url: file.url, 
        alt: req.body.alt || file.originalname,
        cloudinary_id: file.cloudinary_id, 
      }));

      
      const media = await addMultipleToAlbum(parseInt(albumId), mediaData);

      info("Media uploaded to album via Cloudinary", {
        albumId: parseInt(albumId),
        mediaCount: media.length,
        uploadedBy: req.user.email,
      });

      res.status(201).json({
        success: true,
        message: "تم رفع الصور بنجاح",
        data: media,
      });
    } catch (error) {
      if (error.message === "Album not found") {
        return res.status(404).json({
          success: false,
          message: "الألبوم غير موجود",
        });
      }

      _error("Media upload failed", {
        albumId: req.params.albumId,
        uploadedBy: req.user?.email,
        error: error.message,
      });

      res.status(500).json({
        success: false,
        message: "فشل في رفع الصور",
        error: error.message,
      });
    }
  }

  /**
   * الحصول على جميع صور ألبوم معين
   * @route GET /api/media/album/:albumId
   */
  static async getAlbumMedia(req, res) {
    try {
      const { albumId } = req.params;
      const media = await getByAlbum(parseInt(albumId));

      res.json({
        success: true,
        data: media,
      });
    } catch (error) {
      _error("Get album media failed", {
        albumId: req.params.albumId,
        error: error.message,
      });

      res.status(500).json({
        success: false,
        message: "فشل في تحميل الصور",
      });
    }
  }

  /**
   * إعادة ترتيب الصور في الألبوم
   * @route POST /api/media/album/:albumId/reorder
   */
  static async reorder(req, res) {
    try {
      const { albumId } = req.params;
      const { mediaIds } = req.body;

      await _reorder(parseInt(albumId), mediaIds);

      info("Media reordered", {
        albumId: parseInt(albumId),
        reorderedBy: req.user.email,
      });

      res.json({
        success: true,
        message: "تم إعادة ترتيب الصور بنجاح",
      });
    } catch (error) {
      _error("Reorder media failed", {
        albumId: req.params.albumId,
        error: error.message,
      });

      res.status(500).json({
        success: false,
        message: "فشل في إعادة الترتيب",
      });
    }
  }

  /**
   * تحديث بيانات صورة معينة
   * @route PUT /api/media/admin/:id
   */
  static async update(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const media = await _update(parseInt(id), updateData);

      info("Media updated", {
        mediaId: parseInt(id),
        updatedBy: req.user.email,
      });

      res.json({
        success: true,
        message: "تم تحديث الصورة بنجاح",
        data: media,
      });
    } catch (error) {
      if (error.message === "Media not found") {
        return res.status(404).json({
          success: false,
          message: "الصورة غير موجودة",
        });
      }

      _error("Update media failed", {
        mediaId: req.params.id,
        error: error.message,
      });

      res.status(500).json({
        success: false,
        message: "فشل في تحديث الصورة",
      });
    }
  }

  static async deleteMedia(req, res) {
    try {
      const { id } = req.params;

      
      const media = await getByAlbum(null, parseInt(id)); 

      
      await _delete(parseInt(id));

      
      if (media && media.url) {
        await deleteFile(media.url);
      }

      info("Media deleted from DB and Cloudinary", {
        mediaId: parseInt(id),
        deletedBy: req.user.email,
      });

      res.json({
        success: true,
        message: "تم حذف الصورة بنجاح",
      });
    } catch (error) {
      if (error.message === "Media not found") {
        return res.status(404).json({
          success: false,
          message: "الصورة غير موجودة",
        });
      }

      _error("Delete media failed", {
        mediaId: req.params.id,
        error: error.message,
      });

      res.status(500).json({
        success: false,
        message: "فشل في حذف الصورة",
      });
    }
  }

  /**
   * حذف عدة صور دفعة واحدة
   * @route DELETE /api/media/admin/bulk-delete
   */
  static async bulkDelete(req, res) {
    try {
      const { mediaIds } = req.body;

      if (!mediaIds || mediaIds.length === 0) {
        return res.status(400).json({
          success: false,
          message: "لم يتم تحديد صور للحذف",
        });
      }

      
      
      

      
      await _bulkDelete(mediaIds);

      
      
      
      
      
      

      info("Bulk delete media", {
        count: mediaIds.length,
        deletedBy: req.user.email,
      });

      res.json({
        success: true,
        message: `تم حذف ${mediaIds.length} صورة بنجاح`,
      });
    } catch (error) {
      _error("Bulk delete media failed", {
        count: req.body.mediaIds?.length,
        error: error.message,
      });

      res.status(500).json({
        success: false,
        message: "فشل في الحذف الجماعي",
      });
    }
  }
}


export const uploadToAlbum = MediaController.uploadToAlbum;
export const getAlbumMedia = MediaController.getAlbumMedia;
export const reorder = MediaController.reorder;
export const update = MediaController.update;
export const deleteMedia = MediaController.deleteMedia;
export const bulkDelete = MediaController.bulkDelete;

export default MediaController;

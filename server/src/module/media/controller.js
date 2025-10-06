import {
  addMultipleToAlbum,
  getByAlbum,
  update as _update,
  deleteMedia as _delete,
  reorder as _reorder,
  bulkDelete as _bulkDelete,
} from "./service.js";
import { getById } from "../albums/service.js";
import { processUploadedFiles } from "../../utils/upload.js";
import { info, error as _error } from "../../utils/logger.js";

class MediaController {
  static async uploadToAlbum(req, res) {
    try {
      const { albumId } = req.params;

      await getById(parseInt(albumId), false);

      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          success: false,
          message: "No files uploaded",
        });
      }

      const processedFiles = processUploadedFiles(req, req.files);

      const mediaData = processedFiles.map((file) => ({
        url: file.url,
        alt: req.body.alt || file.originalname,
      }));

      const media = await addMultipleToAlbum(parseInt(albumId), mediaData);

      info("Media uploaded to album", {
        albumId: parseInt(albumId),
        mediaCount: media.length,
        uploadedBy: req.user.email,
      });

      res.status(201).json({
        success: true,
        message: "Media uploaded successfully",
        data: media,
      });
    } catch (error) {
      if (error.message === "Album not found") {
        return res.status(404).json({
          success: false,
          message: "Album not found",
        });
      }

      _error("Media upload failed", {
        albumId: req.params.albumId,
        uploadedBy: req.user?.email,
        error: error.message,
      });

      res.status(500).json({
        success: false,
        message: "Failed to upload media",
      });
    }
  }

  static async getAlbumMedia(req, res) {
    try {
      const { albumId } = req.params;

      await getById(parseInt(albumId), false);

      const media = await getByAlbum(parseInt(albumId));

      res.json({
        success: true,
        data: media,
      });
    } catch (error) {
      if (error.message === "Album not found") {
        return res.status(404).json({
          success: false,
          message: "Album not found",
        });
      }

      _error("Get album media failed", {
        albumId: req.params.albumId,
        error: error.message,
      });

      res.status(500).json({
        success: false,
        message: "Failed to fetch media",
      });
    }
  }

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
        message: "Media updated successfully",
        data: media,
      });
    } catch (error) {
      if (error.message === "Media not found") {
        return res.status(404).json({
          success: false,
          message: "Media not found",
        });
      }

      _error("Update media failed", {
        mediaId: req.params.id,
        updatedBy: req.user?.email,
        error: error.message,
      });

      res.status(500).json({
        success: false,
        message: "Failed to update media",
      });
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;
      const media = await _delete(parseInt(id));

      info("Media deleted", {
        mediaId: parseInt(id),
        albumId: media.album_id,
        deletedBy: req.user.email,
      });

      res.json({
        success: true,
        message: "Media deleted successfully",
        data: media,
      });
    } catch (error) {
      if (error.message === "Media not found") {
        return res.status(404).json({
          success: false,
          message: "Media not found",
        });
      }

      _error("Delete media failed", {
        mediaId: req.params.id,
        deletedBy: req.user?.email,
        error: error.message,
      });

      res.status(500).json({
        success: false,
        message: "Failed to delete media",
      });
    }
  }

  static async reorder(req, res) {
    try {
      const { albumId } = req.params;
      const { mediaIds } = req.body;

      if (!Array.isArray(mediaIds)) {
        return res.status(400).json({
          success: false,
          message: "mediaIds must be an array",
        });
      }

      await getById(parseInt(albumId), false);

      const media = await _reorder(parseInt(albumId), mediaIds);

      info("Media reordered", {
        albumId: parseInt(albumId),
        reorderedBy: req.user.email,
      });

      res.json({
        success: true,
        message: "Media reordered successfully",
        data: media,
      });
    } catch (error) {
      if (error.message === "Album not found") {
        return res.status(404).json({
          success: false,
          message: "Album not found",
        });
      }

      _error("Reorder media failed", {
        albumId: req.params.albumId,
        reorderedBy: req.user?.email,
        error: error.message,
      });

      res.status(500).json({
        success: false,
        message: "Failed to reorder media",
      });
    }
  }

  static async bulkDelete(req, res) {
    try {
      const { mediaIds } = req.body;

      if (!Array.isArray(mediaIds) || mediaIds.length === 0) {
        return res.status(400).json({
          success: false,
          message: "mediaIds array is required",
        });
      }

      const result = await _bulkDelete(mediaIds);

      info("Bulk media delete", {
        requestedCount: mediaIds.length,
        deletedCount: result.deletedCount,
        failedCount: result.failedCount,
        deletedBy: req.user.email,
      });

      res.json({
        success: true,
        message: `تم حذف ${result.deletedCount} صورة بنجاح`,
        data: result,
      });
    } catch (error) {
      _error("Bulk delete media failed", {
        deletedBy: req.user?.email,
        error: error.message,
      });

      res.status(500).json({
        success: false,
        message: "Failed to delete media",
      });
    }
  }
}

export const uploadToAlbum = MediaController.uploadToAlbum;
export const getAlbumMedia = MediaController.getAlbumMedia;
export const update = MediaController.update;
export const reorder = MediaController.reorder;
export const bulkDelete = MediaController.bulkDelete;

export { MediaController as delete };
export const deleteMedia = MediaController.delete;

export default MediaController;

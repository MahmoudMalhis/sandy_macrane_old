import {
  create as _create,
  getAll as _getAll,
  getById as _getById,
  update as _update,
  changeStatus as _changeStatus,
  deleteReview as _delete, // تم تغيير هذا السطر
  getFeatured as _getFeatured,
  getStats as _getStats,
} from "./service.js";
import { processUploadedFiles } from "../../utils/upload.js";
import { info, error as _error } from "../../utils/logger.js";

class ReviewsController {
  // Create new review (public)
  static async create(req, res) {
    try {
      const { author_name, rating, text, linked_album_id } = req.body;

      let attached_image = null;

      // Process uploaded image if exists
      if (req.file) {
        const processedFiles = processUploadedFiles(req, [req.file]);
        attached_image = processedFiles[0].url;
      }

      const review = await _create({
        author_name,
        rating: parseInt(rating),
        text,
        attached_image,
        linked_album_id: linked_album_id ? parseInt(linked_album_id) : null,
      });

      info("New review created", {
        reviewId: review.id,
        author_name,
        rating: parseInt(rating),
        linked_album_id,
      });

      res.status(201).json({
        success: true,
        message: "تم إرسال تقييمك بنجاح وسيظهر بعد المراجعة",
        data: review,
      });
    } catch (error) {
      _error("Create review failed", {
        reviewData: req.body,
        error: error.message,
      });

      res.status(500).json({
        success: false,
        message: "فشل في إرسال التقييم، يرجى المحاولة مرة أخرى",
      });
    }
  }

  // Get all reviews (public)
  static async getAll(req, res) {
    try {
      const { linked_album_id, page, limit } = req.query;

      const result = await _getAll({
        status: "published", // Only published for public
        linked_album_id: linked_album_id
          ? parseInt(linked_album_id)
          : undefined,
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 12,
      });

      res.json({
        success: true,
        data: result.reviews,
        pagination: result.pagination,
      });
    } catch (error) {
      _error("Get reviews failed", { error: error.message });
      res.status(500).json({
        success: false,
        message: "Failed to fetch reviews",
      });
    }
  }

  // Get all reviews (admin)
  static async getAllAdmin(req, res) {
    try {
      const { status, linked_album_id, page, limit } = req.query;

      const result = await _getAll({
        status,
        linked_album_id: linked_album_id
          ? parseInt(linked_album_id)
          : undefined,
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 12,
      });

      res.json({
        success: true,
        data: result.reviews,
        pagination: result.pagination,
      });
    } catch (error) {
      _error("Get reviews admin failed", { error: error.message });
      res.status(500).json({
        success: false,
        message: "Failed to fetch reviews",
      });
    }
  }

  // Get review by ID (admin)
  static async getById(req, res) {
    try {
      const { id } = req.params;
      const review = await _getById(parseInt(id));

      res.json({
        success: true,
        data: review,
      });
    } catch (error) {
      if (error.message === "Review not found") {
        return res.status(404).json({
          success: false,
          message: "Review not found",
        });
      }

      _error("Get review failed", {
        reviewId: req.params.id,
        error: error.message,
      });

      res.status(500).json({
        success: false,
        message: "Failed to fetch review",
      });
    }
  }

  // Update review (admin)
  static async update(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const review = await _update(parseInt(id), updateData);

      info("Review updated", {
        reviewId: parseInt(id),
        updatedBy: req.user.email,
      });

      res.json({
        success: true,
        message: "Review updated successfully",
        data: review,
      });
    } catch (error) {
      if (error.message === "Review not found") {
        return res.status(404).json({
          success: false,
          message: "Review not found",
        });
      }

      _error("Update review failed", {
        reviewId: req.params.id,
        updatedBy: req.user?.email,
        error: error.message,
      });

      res.status(500).json({
        success: false,
        message: "Failed to update review",
      });
    }
  }

  // Change review status (admin)
  static async changeStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const review = await _changeStatus(parseInt(id), status);

      info("Review status changed", {
        reviewId: parseInt(id),
        newStatus: status,
        changedBy: req.user.email,
      });

      res.json({
        success: true,
        message: "Review status updated successfully",
        data: review,
      });
    } catch (error) {
      if (error.message === "Review not found") {
        return res.status(404).json({
          success: false,
          message: "Review not found",
        });
      }

      _error("Change review status failed", {
        reviewId: req.params.id,
        changedBy: req.user?.email,
        error: error.message,
      });

      res.status(500).json({
        success: false,
        message: "Failed to update review status",
      });
    }
  }

  // Delete review (admin)
  static async delete(req, res) {
    try {
      const { id } = req.params;
      const review = await _delete(parseInt(id));

      info("Review deleted", {
        reviewId: parseInt(id),
        author: review.author_name,
        deletedBy: req.user.email,
      });

      res.json({
        success: true,
        message: "Review deleted successfully",
        data: review,
      });
    } catch (error) {
      if (error.message === "Review not found") {
        return res.status(404).json({
          success: false,
          message: "Review not found",
        });
      }

      _error("Delete review failed", {
        reviewId: req.params.id,
        deletedBy: req.user?.email,
        error: error.message,
      });

      res.status(500).json({
        success: false,
        message: "Failed to delete review",
      });
    }
  }

  // Get featured reviews (public)
  static async getFeatured(req, res) {
    try {
      const { limit } = req.query;
      const reviews = await _getFeatured(parseInt(limit) || 3);

      res.json({
        success: true,
        data: reviews,
      });
    } catch (error) {
      _error("Get featured reviews failed", { error: error.message });
      res.status(500).json({
        success: false,
        message: "Failed to fetch featured reviews",
      });
    }
  }

  // Get reviews statistics (admin)
  static async getStats(req, res) {
    try {
      const stats = await _getStats();

      res.json({
        success: true,
        data: stats,
      });
    } catch (error) {
      _error("Get reviews stats failed", { error: error.message });
      res.status(500).json({
        success: false,
        message: "Failed to fetch statistics",
      });
    }
  }
}

// Export named functions
export const create = ReviewsController.create;
export const getAll = ReviewsController.getAll;
export const getAllAdmin = ReviewsController.getAllAdmin;
export const getById = ReviewsController.getById;
export const update = ReviewsController.update;
export const changeStatus = ReviewsController.changeStatus; // إضافة هذا السطر
export const getFeatured = ReviewsController.getFeatured;
export const getStats = ReviewsController.getStats;
export const deleteReview = ReviewsController.delete.bind(ReviewsController);

export default ReviewsController;

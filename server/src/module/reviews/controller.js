// server/src/module/reviews/controller.js - UPDATED CREATE METHOD

import {
  create as _create,
  getAll as _getAll,
  getById as _getById,
  update as _update,
  deleteReview as _delete,
  changeStatus as _changeStatus,
  getStats as _getStats,
  getFeatured as _getFeatured,
} from "./service.js";
import { info, error as _error } from "../../utils/logger.js";
import { deleteFile } from "../../utils/upload.js";

class ReviewsController {
  /**
   * إنشاء تقييم جديد (Public)
   * @route POST /api/reviews
   *
   * ⚠️ UPDATED: يتعامل مع صور Cloudinary
   */
  static async create(req, res) {
    try {
      const { author_name, rating, text, linked_album_id } = req.body;

      // إعداد بيانات التقييم
      const reviewData = {
        author_name,
        rating: parseInt(rating),
        text,
        linked_album_id: linked_album_id ? parseInt(linked_album_id) : null,
        status: "pending", // جميع التقييمات تبدأ بحالة pending
      };

      // إضافة صورة التقييم إذا تم رفعها (من Cloudinary)
      if (req.file) {
        reviewData.attached_image = req.file.path; // Cloudinary URL
        reviewData.cloudinary_id = req.file.filename; // Public ID
      }

      // إنشاء التقييم في قاعدة البيانات
      const review = await _create(reviewData);

      info("New review created with Cloudinary image", {
        reviewId: review.id,
        author: author_name,
        rating,
        hasImage: !!req.file,
      });

      res.status(201).json({
        success: true,
        message: "تم إنشاء التقييم بنجاح وسيتم مراجعته قريباً",
        data: review,
      });
    } catch (error) {
      _error("Create review failed", {
        error: error.message,
        body: req.body,
      });

      res.status(500).json({
        success: false,
        message: "فشل في إنشاء التقييم",
        error: error.message,
      });
    }
  }

  /**
   * الحصول على جميع التقييمات (Public)
   * @route GET /api/reviews
   */
  static async getAll(req, res) {
    try {
      const {
        page = 1,
        limit = 10,
        status = "published",
        rating,
        linked_album_id,
        has_image,
        sort_by = "created_at",
        sort_order = "desc",
      } = req.query;

      const filters = {
        status,
        ...(rating && { rating: parseInt(rating) }),
        ...(linked_album_id && {
          linked_album_id: parseInt(linked_album_id),
        }),
        ...(has_image !== undefined && {
          has_image: has_image === "true",
        }),
      };

      const result = await _getAll({
        page: parseInt(page),
        limit: parseInt(limit),
        filters,
        sort_by,
        sort_order,
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
        message: "فشل في تحميل التقييمات",
      });
    }
  }

  /**
   * الحصول على جميع التقييمات (Admin)
   * @route GET /api/reviews/admin
   */
  static async getAll(req, res) {
    try {
      const {
        page = 1,
        limit = 20,
        status,
        rating,
        linked_album_id,
        has_image,
        sort_by = "created_at",
        sort_order = "desc",
      } = req.query;

      const filters = {
        ...(status && { status }),
        ...(rating && { rating: parseInt(rating) }),
        ...(linked_album_id && {
          linked_album_id: parseInt(linked_album_id),
        }),
        ...(has_image !== undefined && {
          has_image: has_image === "true",
        }),
      };

      const result = await _getAll({
        page: parseInt(page),
        limit: parseInt(limit),
        filters,
        sort_by,
        sort_order,
      });

      res.json({
        success: true,
        data: result.reviews,
        pagination: result.pagination,
      });
    } catch (error) {
      _error("Get admin reviews failed", { error: error.message });

      res.status(500).json({
        success: false,
        message: "فشل في تحميل التقييمات",
      });
    }
  }

  /**
   * الحصول على تقييم معين
   * @route GET /api/reviews/admin/:id
   */
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
          message: "التقييم غير موجود",
        });
      }

      _error("Get review by ID failed", {
        reviewId: req.params.id,
        error: error.message,
      });

      res.status(500).json({
        success: false,
        message: "فشل في تحميل التقييم",
      });
    }
  }

  /**
   * تحديث تقييم معين
   * @route PUT /api/reviews/admin/:id
   */
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
        message: "تم تحديث التقييم بنجاح",
        data: review,
      });
    } catch (error) {
      if (error.message === "Review not found") {
        return res.status(404).json({
          success: false,
          message: "التقييم غير موجود",
        });
      }

      _error("Update review failed", {
        reviewId: req.params.id,
        error: error.message,
      });

      res.status(500).json({
        success: false,
        message: "فشل في تحديث التقييم",
      });
    }
  }

  /**
   * حذف تقييم معين
   * @route DELETE /api/reviews/admin/:id
   *
   * ⚠️ UPDATED: يحذف الصورة من Cloudinary أيضاً
   */
  static async deleteReview(req, res) {
    try {
      const { id } = req.params;

      // الحصول على بيانات التقييم قبل الحذف
      const review = await _getById(parseInt(id));

      // حذف من قاعدة البيانات
      await _delete(parseInt(id));

      // حذف الصورة من Cloudinary إذا كانت موجودة
      if (review.attached_image) {
        await deleteFile(review.attached_image);
      }

      info("Review deleted from DB and Cloudinary", {
        reviewId: parseInt(id),
        deletedBy: req.user.email,
        hadImage: !!review.attached_image,
      });

      res.json({
        success: true,
        message: "تم حذف التقييم بنجاح",
      });
    } catch (error) {
      if (error.message === "Review not found") {
        return res.status(404).json({
          success: false,
          message: "التقييم غير موجود",
        });
      }

      _error("Delete review failed", {
        reviewId: req.params.id,
        error: error.message,
      });

      res.status(500).json({
        success: false,
        message: "فشل في حذف التقييم",
      });
    }
  }

  /**
   * تغيير حالة تقييم معين
   * @route PUT /api/reviews/admin/:id/status
   */
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
        message: `تم تغيير حالة التقييم إلى ${status}`,
        data: review,
      });
    } catch (error) {
      if (error.message === "Review not found") {
        return res.status(404).json({
          success: false,
          message: "التقييم غير موجود",
        });
      }

      _error("Change review status failed", {
        reviewId: req.params.id,
        error: error.message,
      });

      res.status(500).json({
        success: false,
        message: "فشل في تغيير حالة التقييم",
      });
    }
  }

  /**
   * الحصول على إحصائيات التقييمات
   * @route GET /api/reviews/admin/stats
   */
  static async getStats(req, res) {
    try {
      const { dateFrom, dateTo } = req.query;

      const dateRange =
        dateFrom && dateTo ? { from: dateFrom, to: dateTo } : null;

      const stats = await _getStats(dateRange);

      res.json({
        success: true,
        data: stats,
      });
    } catch (error) {
      _error("Get review stats failed", { error: error.message });

      res.status(500).json({
        success: false,
        message: "فشل في تحميل الإحصائيات",
      });
    }
  }

  /**
   * الحصول على التقييمات المميزة
   * @route GET /api/reviews/featured
   */
  static async getFeatured(req, res) {
    try {
      const limit = parseInt(req.query.limit) || 3;
      const reviews = await _getFeatured(limit);

      res.json({
        success: true,
        data: reviews,
      });
    } catch (error) {
      _error("Get featured reviews failed", { error: error.message });

      res.status(500).json({
        success: false,
        message: "فشل في تحميل التقييمات المميزة",
      });
    }
  }
}

// Export methods
export const create = ReviewsController.create;
export const getAll = ReviewsController.getAll;
export const getAllAdmin = ReviewsController.getAll;
export const getById = ReviewsController.getById;
export const update = ReviewsController.update;
export const deleteReview = ReviewsController.deleteReview;
export const changeStatus = ReviewsController.changeStatus;
export const getStats = ReviewsController.getStats;
export const getFeatured = ReviewsController.getFeatured;

export default ReviewsController;

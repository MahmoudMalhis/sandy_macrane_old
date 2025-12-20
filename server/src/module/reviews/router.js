// server/src/module/reviews/router.js - FIXED VERSION

import { Router } from "express";
import { body, query } from "express-validator";
import {
  create,
  getAll,
  getById,
  update,
  deleteReview,
  changeStatus,
  getStats,
  getFeatured,
} from "./controller.js";
import { authGuard } from "../../middlewares/authGuard.js";
import { validate } from "../../middlewares/validate.js";
import { uploadReviewImage } from "../../utils/upload.js"; // Cloudinary uploader للتقييمات
import { formLimiter } from "../../middlewares/rateLimiter.js";

const router = Router();

/**
 * ==================== Validation Schemas ====================
 */

const createReviewValidation = [
  body("author_name")
    .trim()
    .notEmpty()
    .withMessage("اسم الكاتب مطلوب")
    .isLength({ min: 2, max: 100 })
    .withMessage("اسم الكاتب يجب أن يكون بين 2 و 100 حرف"),
  body("rating")
    .isInt({ min: 1, max: 5 })
    .withMessage("التقييم يجب أن يكون بين 1 و 5"),
  body("text")
    .trim()
    .notEmpty()
    .withMessage("نص التقييم مطلوب")
    .isLength({ min: 10, max: 1000 })
    .withMessage("نص التقييم يجب أن يكون بين 10 و 1000 حرف"),
  body("linked_album_id")
    .optional()
    .isInt({ min: 1 })
    .withMessage("معرف الألبوم يجب أن يكون رقم موجب"),
];

const updateReviewValidation = [
  body("author_name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("اسم الكاتب يجب أن يكون بين 2 و 100 حرف"),
  body("rating")
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage("التقييم يجب أن يكون بين 1 و 5"),
  body("text")
    .optional()
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage("نص التقييم يجب أن يكون بين 10 و 1000 حرف"),
  body("linked_album_id")
    .optional()
    .isInt({ min: 1 })
    .withMessage("معرف الألبوم يجب أن يكون رقم موجب"),
];

const statusValidation = [
  body("status")
    .isIn(["pending", "published", "hidden"])
    .withMessage("الحالة يجب أن تكون: pending أو published أو hidden"),
];

const queryValidation = [
  query("page").optional().isInt({ min: 1 }).toInt(),
  query("limit").optional().isInt({ min: 1, max: 100 }).toInt(),
  query("status")
    .optional()
    .isIn(["pending", "published", "hidden"])
    .withMessage("الحالة يجب أن تكون: pending أو published أو hidden"),
  query("rating").optional().isInt({ min: 1, max: 5 }).toInt(),
  query("linked_album_id").optional().isInt({ min: 1 }).toInt(),
  query("has_image").optional().isBoolean().toBoolean(),
  query("sort_by")
    .optional()
    .isIn(["created_at", "rating", "author_name"])
    .withMessage("يمكن الترتيب حسب: created_at أو rating أو author_name"),
  query("sort_order")
    .optional()
    .isIn(["asc", "desc"])
    .withMessage("ترتيب الفرز يجب أن يكون: asc أو desc"),
];

/**
 * ==================== Public Routes ====================
 */

/**
 * @route   GET /api/reviews
 * @desc    الحصول على جميع التقييمات المنشورة
 * @access  Public
 */
router.get("/", queryValidation, validate, getAll);

/**
 * @route   GET /api/reviews/featured
 * @desc    الحصول على التقييمات المميزة
 * @access  Public
 */
router.get("/featured", getFeatured);

/**
 * @route   POST /api/reviews
 * @desc    إنشاء تقييم جديد (مع صورة اختيارية)
 * @access  Public (مع rate limiting)
 *
 * ⚠️ UPDATED: يستخدم Cloudinary لرفع صورة التقييم
 */
router.post(
  "/",
  formLimiter,
  uploadReviewImage.single("review_image"), // Cloudinary middleware
  createReviewValidation,
  validate,
  create
);

/**
 * ==================== Admin Routes ====================
 */
router.use("/admin", authGuard);

/**
 * @route   GET /api/reviews/admin
 * @desc    الحصول على جميع التقييمات (مع فلترة)
 * @access  Private (Admin only)
 */
router.get("/admin", queryValidation, validate, getAll);

/**
 * @route   GET /api/reviews/admin/stats
 * @desc    الحصول على إحصائيات التقييمات
 * @access  Private (Admin only)
 */
router.get("/admin/stats", getStats);

/**
 * @route   GET /api/reviews/admin/:id
 * @desc    الحصول على تقييم معين
 * @access  Private (Admin only)
 */
router.get("/admin/:id", getById);

/**
 * @route   PUT /api/reviews/admin/:id
 * @desc    تحديث تقييم معين
 * @access  Private (Admin only)
 */
router.put("/admin/:id", updateReviewValidation, validate, update);

/**
 * @route   PUT /api/reviews/admin/:id/status
 * @desc    تغيير حالة تقييم معين
 * @access  Private (Admin only)
 */
router.put("/admin/:id/status", statusValidation, validate, changeStatus);

/**
 * @route   DELETE /api/reviews/admin/:id
 * @desc    حذف تقييم معين (من DB و Cloudinary)
 * @access  Private (Admin only)
 */
router.delete("/admin/:id", deleteReview);

// Advanced admin features can be added here later

export default router;

// server/src/module/media/router.js

import { Router } from "express";
import { body } from "express-validator";
import {
  uploadToAlbum,
  getAlbumMedia,
  reorder,
  update,
  deleteMedia,
  bulkDelete,
} from "./controller.js";
import { authGuard } from "../../middlewares/authGuard.js";
import { validate } from "../../middlewares/validate.js";
import { uploadAlbumMedia } from "../../utils/upload.js"; // استيراد Cloudinary uploader

const router = Router();

/**
 * Validation schemas
 */
const mediaUpdateValidation = [
  body("alt")
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage("النص البديل يجب ألا يتجاوز 255 حرف"),
  body("is_cover")
    .optional()
    .isBoolean()
    .withMessage("is_cover يجب أن يكون true أو false"),
  body("sort_order")
    .optional()
    .isInt({ min: 0 })
    .withMessage("ترتيب الفرز يجب أن يكون رقم موجب"),
];

const reorderValidation = [
  body("mediaIds")
    .isArray()
    .withMessage("mediaIds يجب أن يكون مصفوفة")
    .custom((value) => {
      if (!value.every((id) => Number.isInteger(id) && id > 0)) {
        throw new Error("جميع معرفات الصور يجب أن تكون أرقام موجبة");
      }
      return true;
    }),
];

const bulkDeleteValidation = [
  body("mediaIds")
    .isArray()
    .withMessage("mediaIds يجب أن يكون مصفوفة")
    .custom((value) => {
      if (!value.every((id) => Number.isInteger(id) && id > 0)) {
        throw new Error("جميع معرفات الصور يجب أن تكون أرقام موجبة");
      }
      return true;
    }),
];

/**
 * Routes - جميع المسارات تتطلب تسجيل دخول
 */
router.use(authGuard);

/**
 * @route   POST /api/media/album/:albumId
 * @desc    رفع صور جديدة إلى ألبوم معين (Cloudinary)
 * @access  Private (Admin only)
 *
 * يقبل حتى 10 صور في طلب واحد
 */
router.post(
  "/album/:albumId",
  uploadAlbumMedia.array("media_files", 10), // Cloudinary middleware
  uploadToAlbum
);

/**
 * @route   GET /api/media/album/:albumId
 * @desc    الحصول على جميع صور ألبوم معين
 * @access  Private (Admin only)
 */
router.get("/album/:albumId", getAlbumMedia);

/**
 * @route   POST /api/media/album/:albumId/reorder
 * @desc    إعادة ترتيب الصور في الألبوم
 * @access  Private (Admin only)
 */
router.post("/album/:albumId/reorder", reorderValidation, validate, reorder);

/**
 * @route   PUT /api/media/admin/:id
 * @desc    تحديث بيانات صورة معينة (alt, is_cover, sort_order)
 * @access  Private (Admin only)
 */
router.put("/admin/:id", mediaUpdateValidation, validate, update);

/**
 * @route   DELETE /api/media/admin/:id
 * @desc    حذف صورة معينة (من DB و Cloudinary)
 * @access  Private (Admin only)
 */
router.delete("/admin/:id", deleteMedia);

/**
 * @route   DELETE /api/media/admin/bulk-delete
 * @desc    حذف عدة صور دفعة واحدة (من DB و Cloudinary)
 * @access  Private (Admin only)
 */
router.delete("/admin/bulk-delete", bulkDeleteValidation, validate, bulkDelete);

export default router;

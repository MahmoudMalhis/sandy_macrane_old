// server/src/module/reviews/router.js - مُحدث مع دعم البحث المتقدم
import { Router } from "express";
import { body, query } from "express-validator";
import {
  getAll,
  getFeatured,
  create,
  getAllAdmin,
  getStats,
  getById,
  update,
  changeStatus,
  deleteReview,
} from "./controller.js";
import { authGuard } from "../../middlewares/authGuard.js";
import { validate } from "../../middlewares/validate.js";
import { formLimiter } from "../../middlewares/rateLimiter.js";
import { upload } from "../../utils/upload.js";

const router = Router();

// Review creation validation
const createReviewValidation = [
  body("author_name")
    .trim()
    .notEmpty()
    .withMessage("Author name is required")
    .isLength({ max: 100 })
    .withMessage("Author name must not exceed 100 characters"),
  body("rating")
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5"),
  body("text")
    .trim()
    .notEmpty()
    .withMessage("Review text is required")
    .isLength({ max: 1000 })
    .withMessage("Review text must not exceed 1000 characters"),
  body("linked_album_id")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Album ID must be a positive integer"),
];

// Review update validation
const updateReviewValidation = [
  body("author_name")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Author name must not exceed 100 characters"),
  body("rating")
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5"),
  body("text")
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Review text must not exceed 1000 characters"),
  body("linked_album_id")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Album ID must be a positive integer"),
  body("status")
    .optional()
    .isIn(["pending", "published", "hidden"])
    .withMessage("Status must be pending, published, or hidden"),
];

// Status change validation
const statusValidation = [
  body("status")
    .isIn(["pending", "published", "hidden"])
    .withMessage("Status must be pending, published, or hidden"),
];

// Enhanced query validation for advanced filtering and search
const queryValidation = [
  // Pagination
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),

  // Status filters
  query("status")
    .optional()
    .custom((value) => {
      if (typeof value === "string") {
        const validStatuses = ["pending", "published", "hidden", "all"];
        const statuses = value.split(",");
        return statuses.every((status) =>
          validStatuses.includes(status.trim())
        );
      }
      return ["pending", "published", "hidden", "all"].includes(value);
    })
    .withMessage(
      "Status must be pending, published, hidden, all, or comma-separated list"
    ),

  // Rating filters
  query("min_rating")
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage("Min rating must be between 1 and 5"),
  query("max_rating")
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage("Max rating must be between 1 and 5"),
  query("exact_rating")
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage("Exact rating must be between 1 and 5"),

  // Search filters
  query("search")
    .optional()
    .isLength({ min: 1, max: 100 })
    .withMessage("Search term must be between 1 and 100 characters"),
  query("author_name")
    .optional()
    .isLength({ min: 1, max: 100 })
    .withMessage("Author name must be between 1 and 100 characters"),

  // Date filters
  query("date_from")
    .optional()
    .isDate()
    .withMessage("Invalid date_from format"),
  query("date_to").optional().isDate().withMessage("Invalid date_to format"),

  // Album filters
  query("linked_album_id")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Album ID must be a positive integer"),
  query("has_album")
    .optional()
    .isBoolean()
    .withMessage("has_album must be boolean"),

  // Image filter
  query("has_image")
    .optional()
    .isBoolean()
    .withMessage("has_image must be boolean"),

  // Sorting
  query("sort_by")
    .optional()
    .isIn(["created_at", "rating", "author_name", "status", "album_title"])
    .withMessage(
      "sort_by must be created_at, rating, author_name, status, or album_title"
    ),
  query("sort_order")
    .optional()
    .isIn(["asc", "desc"])
    .withMessage("sort_order must be asc or desc"),
];

// Bulk operations validation
const bulkValidation = [
  body("ids")
    .isArray({ min: 1 })
    .withMessage("IDs array is required")
    .custom((ids) => {
      return ids.every((id) => Number.isInteger(id) && id > 0);
    })
    .withMessage("All IDs must be positive integers"),
];

const bulkUpdateValidation = [
  ...bulkValidation,
  body("status")
    .optional()
    .isIn(["pending", "published", "hidden"])
    .withMessage("Status must be pending, published, or hidden"),
  body("linked_album_id")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Album ID must be a positive integer"),
];

// Export validation
const exportValidation = [
  query("format")
    .optional()
    .isIn(["csv", "json", "xlsx"])
    .withMessage("Format must be csv, json, or xlsx"),
  ...queryValidation, // Include all search filters for export
];

// Public routes
router.get("/", queryValidation, validate, getAll);
router.get("/featured", getFeatured);
router.post(
  "/",
  formLimiter,
  upload.single("review_image"),
  createReviewValidation,
  validate,
  create
);

// Admin routes
router.use("/admin", authGuard);

// Basic admin operations
router.get("/admin", queryValidation, validate, getAllAdmin);
router.get("/admin/stats", getStats);
router.get("/admin/:id", getById);
router.put("/admin/:id", updateReviewValidation, validate, update);
router.put("/admin/:id/status", statusValidation, validate, changeStatus);
router.delete("/admin/:id", deleteReview);

// Advanced admin features would be added here
// For now, we'll focus on the core functionality that the frontend needs

export default router;

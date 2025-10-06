import { Router } from "express";
import { body, query } from "express-validator";
import {
  getAll,
  getFeatured,
  getBySlug,
  getAllAdmin,
  getStats,
  getById,
  create,
  update,
  delete as deleteAlbum,
} from "./controller.js";
import { authGuard } from "../../middlewares/authGuard.js";
import { validate } from "../../middlewares/validate.js";

const router = Router();

// Album creation/update validation
const albumValidation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ max: 255 })
    .withMessage("Title must not exceed 255 characters"),
  body("category")
    .isIn(["macrame", "frame"])
    .withMessage("Category must be either macrame or frame"),
  body("description")
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Description must not exceed 1000 characters"),
  body("maker_note")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Maker note must not exceed 500 characters"),
  body("status")
    .optional()
    .isIn(["draft", "published"])
    .withMessage("Status must be either draft or published"),
  body("tags").optional().isArray().withMessage("Tags must be an array"),
];

const albumUpdateValidation = [
  body("title")
    .optional() // ✅ جعله optional
    .trim()
    .notEmpty()
    .withMessage("Title cannot be empty")
    .isLength({ max: 255 })
    .withMessage("Title must not exceed 255 characters"),
  body("category")
    .optional() // ✅ جعله optional
    .isIn(["macrame", "frame"])
    .withMessage("Category must be either macrame or frame"),
  body("description")
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Description must not exceed 1000 characters"),
  body("maker_note")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Maker note must not exceed 500 characters"),
  body("status")
    .optional()
    .isIn(["draft", "published"])
    .withMessage("Status must be either draft or published"),
  body("tags").optional().isArray().withMessage("Tags must be an array"),
];

// Query validation for filtering
const queryValidation = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),
  query("category")
    .optional()
    .isIn(["all", "macrame", "frame"])
    .withMessage("Category must be all, macrame, or frame"),
  query("sort")
    .optional()
    .isIn(["created_at", "title", "view_count"])
    .withMessage("Sort must be created_at, title, or view_count"),
];

// Public routes
router.get("/", queryValidation, validate, getAll);
router.get("/featured", getFeatured);
router.get("/slug/:slug", getBySlug);

// Admin routes
router.use("/admin", authGuard); // All admin routes require authentication

router.get("/admin", queryValidation, validate, getAllAdmin);
router.get("/admin/stats", getStats);
router.get("/admin/:id", getById);
router.post("/admin", albumValidation, validate, create);
router.put("/admin/:id", albumUpdateValidation, validate, update);
router.delete("/admin/:id", deleteAlbum);

export default router;

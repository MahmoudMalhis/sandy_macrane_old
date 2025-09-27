import { Router } from "express";
import { body, query } from "express-validator";
import {
  create,
  getAll,
  getStats,
  getById,
  updateStatus,
  generateWhatsAppLink,
  delete as deleteInquiry,
} from "./controller.js";
import { authGuard } from "../../middlewares/authGuard.js";
import { validate } from "../../middlewares/validate.js";
import { formLimiter } from "../../middlewares/rateLimiter.js";

const router = Router();

// Inquiry creation validation
const createInquiryValidation = [
  body("customer_name")
    .trim()
    .notEmpty()
    .withMessage("Customer name is required")
    .isLength({ max: 100 })
    .withMessage("Customer name must not exceed 100 characters"),
  body("phone_whatsapp")
    .trim()
    .notEmpty()
    .withMessage("WhatsApp phone number is required")
    .matches(/^[0-9+\-\s()]+$/)
    .withMessage("Invalid phone number format")
    .isLength({ max: 20 })
    .withMessage("Phone number must not exceed 20 characters"),
  body("product_type")
    .isIn(["macrame", "frame"])
    .withMessage("Product type must be either macrame or frame"),
  body("album_id")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Album ID must be a positive integer"),
  body("notes")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Notes must not exceed 500 characters"),
];

// Update status validation
const updateStatusValidation = [
  body("status")
    .isIn(["new", "in_review", "contacted", "closed"])
    .withMessage("Status must be new, in_review, contacted, or closed"),
  body("notes")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Notes must not exceed 500 characters"),
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
  query("status")
    .optional()
    .isIn(["new", "in_review", "contacted", "closed"])
    .withMessage("Status must be new, in_review, contacted, or closed"),
  query("product_type")
    .optional()
    .isIn(["macrame", "frame"])
    .withMessage("Product type must be macrame or frame"),
  query("dateFrom").optional().isDate().withMessage("Invalid dateFrom format"),
  query("dateTo").optional().isDate().withMessage("Invalid dateTo format"),
];

// Public routes
router.post("/", formLimiter, createInquiryValidation, validate, create);

// Admin routes
router.use("/admin", authGuard);

router.get("/admin", queryValidation, validate, getAll);
router.get("/admin/stats", getStats);
router.get("/admin/:id", getById);
router.put("/admin/:id/status", updateStatusValidation, validate, updateStatus);
router.get("/admin/:id/whatsapp", generateWhatsAppLink);
router.delete("/admin/:id", deleteInquiry);

export default router;

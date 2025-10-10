import express from "express";
import { body, query } from "express-validator";
import { validate } from "../../middlewares/validate.js"; 
import { authGuard } from "../../middlewares/authGuard.js"; 
import { formLimiter } from "../../middlewares/rateLimiter.js"; 

import {
  create,
  getAll,
  getById,
  updateStatus,
  updatePriority,
  updateNotes,
  markAsRead,
  getStats,
  generateReplyTemplate,
  deleteMessage,
} from "./controller.js";

const router = express.Router();

const createMessageValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Name must be between 2 and 100 characters"),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Valid email is required")
    .normalizeEmail(),
  body("phone")
    .optional()
    .trim()
    .matches(/^[+]?[0-9\s-()]+$/)
    .withMessage("Invalid phone number format"),
  body("subject")
    .trim()
    .notEmpty()
    .withMessage("Subject is required")
    .isLength({ min: 3, max: 200 })
    .withMessage("Subject must be between 3 and 200 characters"),
  body("message")
    .trim()
    .notEmpty()
    .withMessage("Message is required")
    .isLength({ min: 10, max: 5000 })
    .withMessage("Message must be between 10 and 5000 characters"),
];

const queryValidation = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be at least 1"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),
  query("status")
    .optional()
    .isIn(["new", "read", "in_progress", "replied", "archived"])
    .withMessage("Invalid status value"),
  query("priority")
    .optional()
    .isIn(["low", "normal", "high", "urgent"])
    .withMessage("Invalid priority value"),
  query("search")
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage("Search query too long"),
  query("dateFrom")
    .optional()
    .isISO8601()
    .withMessage("Invalid dateFrom format"),
  query("dateTo").optional().isISO8601().withMessage("Invalid dateTo format"),
];

const updateStatusValidation = [
  body("status")
    .notEmpty()
    .withMessage("Status is required")
    .isIn(["new", "read", "in_progress", "replied", "archived"])
    .withMessage("Invalid status value"),
  body("admin_notes")
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage("Admin notes too long"),
];

const updatePriorityValidation = [
  body("priority")
    .notEmpty()
    .withMessage("Priority is required")
    .isIn(["low", "normal", "high", "urgent"])
    .withMessage("Invalid priority value"),
];

const updateNotesValidation = [
  body("admin_notes")
    .notEmpty()
    .withMessage("Admin notes are required")
    .trim()
    .isLength({ max: 2000 })
    .withMessage("Admin notes too long"),
];

router.post("/", formLimiter, createMessageValidation, validate, create);
router.use("/admin", authGuard);
router.get("/admin", queryValidation, validate, getAll);
router.get("/admin/stats", getStats);
router.get("/admin/:id", getById);
router.put("/admin/:id/status", updateStatusValidation, validate, updateStatus);
router.put(
  "/admin/:id/priority",
  updatePriorityValidation,
  validate,
  updatePriority
);
router.put("/admin/:id/notes", updateNotesValidation, validate, updateNotes);
router.put("/admin/:id/read", markAsRead);
router.get("/admin/:id/reply-template", generateReplyTemplate);
router.delete("/admin/:id", deleteMessage);

export default router;

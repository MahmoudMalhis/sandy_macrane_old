import { Router } from "express";
import { query } from "express-validator";
import { getStats, getAnalytics, getSystemHealth } from "./controller.js";
import { authGuard } from "../../middlewares/authGuard.js";
import { validate } from "../../middlewares/validate.js";

const router = Router();

// Analytics query validation
const analyticsValidation = [
  query("period")
    .optional()
    .isIn(["month", "quarter", "year"])
    .withMessage("Period must be month, quarter, or year"),
];

// All admin routes require authentication
router.use(authGuard);

// Statistics routes
router.get("/stats", getStats);
router.get("/analytics", analyticsValidation, validate, getAnalytics);
router.get("/system-health", getSystemHealth);

export default router;

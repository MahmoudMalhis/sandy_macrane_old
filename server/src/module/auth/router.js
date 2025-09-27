// server/src/module/auth/router.js - مُصحح
import { Router } from "express";
import { body } from "express-validator";
import {
  login,
  getProfile,
  changePassword,
  checkSetupStatus,
  setupFirstAdmin,
  verifyEmail,
  resendVerificationEmail,
} from "./controller.js";
import { authGuard } from "../../middlewares/authGuard.js";
import { validate } from "../../middlewares/validate.js";

const router = Router();

const setupAdminValidation = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      "Password must contain at least one lowercase, uppercase, and number"
    ),
];

const loginValidation = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

const resendEmailValidation = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email"),
];

const changePasswordValidation = [
  body("currentPassword")
    .isLength({ min: 6 })
    .withMessage("Current password is required"),
  body("newPassword")
    .isLength({ min: 8 })
    .withMessage("New password must be at least 8 characters long")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      "New password must contain at least one lowercase, uppercase, and number"
    ),
];

// Public routes
router.get("/setup-status", checkSetupStatus);
router.post(
  "/setup-first-admin",
  setupAdminValidation,
  validate,
  setupFirstAdmin
);
router.get("/verify-email/:token", verifyEmail);
router.post("/login", loginValidation, validate, login);
router.post(
  "/resend-verification",
  resendEmailValidation,
  validate,
  resendVerificationEmail
);

// Protected routes
router.use(authGuard);
router.get("/profile", getProfile);
router.post(
  "/change-password",
  changePasswordValidation,
  validate,
  changePassword
);

export default router;

// server/src/module/auth/controller.js - مُصحح
import AuthService from "./service.js";
import Logger from "../../utils/logger.js";
import db from "../../db/knex.js";

class AuthController {
  static async checkSetupStatus(req, res) {
    try {
      const hasAdmin = await AuthService.hasAnyAdmin();
      res.json({
        success: true,
        data: { needsSetup: !hasAdmin, hasAdmin },
      });
    } catch (error) {
      Logger.error("Check setup status failed", { error: error.message });
      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  }

  static async setupFirstAdmin(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: "Email and password are required",
        });
      }

      const result = await AuthService.createFirstAdmin(email, password);

      Logger.info("First admin account created", { email });

      res.status(201).json({
        success: true,
        message: result.message,
        data: { email: result.email },
      });
    } catch (error) {
      Logger.error("Setup first admin failed", { error: error.message });

      if (error.message === "Admin account already exists") {
        return res.status(409).json({
          success: false,
          message: "Admin account already exists",
        });
      }

      res.status(500).json({
        success: false,
        message: "Failed to create admin account",
      });
    }
  }

  static async verifyEmail(req, res) {
    try {
      const { token } = req.params;

      if (!token) {
        return res.status(400).json({
          success: false,
          message: "Verification token is required",
        });
      }

      const result = await AuthService.verifyEmail(token);

      Logger.info("Email verified successfully", {
        token: token.substring(0, 8) + "...",
      });

      res.json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      Logger.error("Email verification failed", {
        token: req.params.token?.substring(0, 8) + "...",
        error: error.message,
      });

      if (error.message === "Invalid or expired verification token") {
        return res.status(400).json({
          success: false,
          message: "رابط التفعيل غير صحيح أو منتهي الصلاحية",
        });
      }

      res.status(500).json({
        success: false,
        message: "فشل في تفعيل الحساب",
      });
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: "Email and password are required",
        });
      }

      const result = await AuthService.login(email, password);

      Logger.info("User logged in", {
        email,
        emailVerified: result.user.email_verified,
      });

      res.json({
        success: true,
        message: "Login successful",
        data: result,
      });
    } catch (error) {
      Logger.error("Login failed", {
        email: req.body.email,
        error: error.message,
      });

      if (error.message === "Invalid credentials") {
        return res.status(401).json({
          success: false,
          message: "بيانات تسجيل الدخول غير صحيحة",
        });
      }

      if (error.message === "Please verify your email before logging in") {
        return res.status(401).json({
          success: false,
          message: "يرجى تفعيل بريدك الإلكتروني قبل تسجيل الدخول",
        });
      }

      res.status(500).json({
        success: false,
        message: "فشل في تسجيل الدخول",
      });
    }
  }

  static async getProfile(req, res) {
    try {
      const user = await db("admin_users")
        .select(
          "id",
          "email",
          "role",
          "email_verified",
          "last_login_at",
          "created_at"
        )
        .where("id", req.user.id)
        .first();

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      res.json({
        success: true,
        data: user,
      });
    } catch (error) {
      Logger.error("Get profile failed", {
        userId: req.user.id,
        error: error.message,
      });

      res.status(500).json({
        success: false,
        message: "Failed to get profile",
      });
    }
  }

  static async changePassword(req, res) {
    try {
      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          success: false,
          message: "Current password and new password are required",
        });
      }

      if (newPassword.length < 8) {
        return res.status(400).json({
          success: false,
          message: "كلمة المرور الجديدة يجب أن تكون 8 أحرف على الأقل",
        });
      }

      await AuthService.changePassword(
        req.user.id,
        currentPassword,
        newPassword
      );

      Logger.info("Password changed", {
        userId: req.user.id,
        email: req.user.email,
      });

      res.json({
        success: true,
        message: "تم تغيير كلمة المرور بنجاح",
      });
    } catch (error) {
      Logger.error("Change password failed", {
        userId: req.user.id,
        error: error.message,
      });

      if (error.message === "Invalid current password") {
        return res.status(400).json({
          success: false,
          message: "كلمة المرور الحالية غير صحيحة",
        });
      }

      res.status(500).json({
        success: false,
        message: "فشل في تغيير كلمة المرور",
      });
    }
  }

  // إعادة إرسال إيميل التفعيل
  static async resendVerificationEmail(req, res) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({
          success: false,
          message: "Email is required",
        });
      }

      const result = await AuthService.resendVerificationEmail(email);

      Logger.info("Verification email resent", { email });

      res.json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      Logger.error("Resend verification email failed", {
        email: req.body.email,
        error: error.message,
      });

      if (error.message === "User not found") {
        return res.status(404).json({
          success: false,
          message: "البريد الإلكتروني غير مسجل",
        });
      }

      if (error.message === "Email is already verified") {
        return res.status(400).json({
          success: false,
          message: "البريد الإلكتروني مفعل مسبقاً",
        });
      }

      res.status(500).json({
        success: false,
        message: "فشل في إرسال رسالة التفعيل",
      });
    }
  }
}

// Named exports
export const checkSetupStatus = AuthController.checkSetupStatus;
export const setupFirstAdmin = AuthController.setupFirstAdmin;
export const verifyEmail = AuthController.verifyEmail;
export const login = AuthController.login;
export const getProfile = AuthController.getProfile;
export const changePassword = AuthController.changePassword;
export const resendVerificationEmail = AuthController.resendVerificationEmail;

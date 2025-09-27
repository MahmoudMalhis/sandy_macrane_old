// server/src/module/auth/service.js - مُصحح
import { compare, hash } from "bcrypt";
import jwt from "jsonwebtoken";
import db, { fn } from "../../db/knex.js";
import emailService from "../../utils/emailService.js";

const { sign } = jwt;

class AuthService {
  // تحقق من وجود أي admin
  static async hasAnyAdmin() {
    const [result] = await db("admin_users").count("* as count");
    return parseInt(result.count) > 0;
  }

  // إنشاء أول حساب إدارة (غير مفعل)
  static async createFirstAdmin(email, password) {
    try {
      // تحقق أنه لا يوجد أي admin
      const hasAdmin = await this.hasAnyAdmin();
      if (hasAdmin) {
        throw new Error("Admin account already exists");
      }

      // hash كلمة المرور
      const passwordHash = await hash(password, 10);

      // إنشاء token التفعيل
      const verificationToken = emailService.generateVerificationToken();
      const verificationExpiresAt = new Date();
      verificationExpiresAt.setHours(verificationExpiresAt.getHours() + 24); // 24 ساعة

      // إنشاء الحساب
      const [userId] = await db("admin_users").insert({
        email,
        password_hash: passwordHash,
        role: "owner",
        email_verified: false,
        verification_token: verificationToken,
        verification_sent_at: fn.now(),
        verification_expires_at: verificationExpiresAt,
        created_at: fn.now(),
        updated_at: fn.now(),
      });

      // إرسال إيميل التفعيل
      try {
        await emailService.sendVerificationEmail(email, verificationToken);
      } catch (emailError) {
        console.warn("Failed to send verification email:", emailError.message);
        // لا نريد أن يفشل إنشاء الحساب بسبب فشل الإيميل
        // في هذه الحالة، نفعل الحساب مباشرة
        await db("admin_users").where("id", userId).update({
          email_verified: true,
          verification_token: null,
          verification_sent_at: null,
          verification_expires_at: null,
          updated_at: fn.now(),
        });

        return {
          id: userId,
          email,
          message: "تم إنشاء الحساب وتفعيله بنجاح. يمكنك تسجيل الدخول الآن.",
        };
      }

      return {
        id: userId,
        email,
        message: "تم إنشاء الحساب. يرجى التحقق من إيميلك لتفعيل الحساب.",
      };
    } catch (error) {
      throw error;
    }
  }

  // تفعيل الحساب
  static async verifyEmail(token) {
    try {
      console.log("Verifying token:", token);

      const user = await db("admin_users")
        .where("verification_token", token)
        .first();

      console.log("Found user for token:", user ? "Yes" : "No");

      if (!user) {
        throw new Error("Invalid or expired verification token");
      }

      // تحقق من صلاحية التوقيت
      const now = new Date();
      const expiresAt = new Date(user.verification_expires_at);

      console.log("Token expires at:", expiresAt);
      console.log("Current time:", now);
      console.log("Token expired:", now > expiresAt);

      if (now > expiresAt) {
        throw new Error("Invalid or expired verification token");
      }

      // تحقق إذا كان مفعل مسبقاً
      if (user.email_verified) {
        return {
          success: true,
          message: "الحساب مفعل مسبقاً. يمكنك تسجيل الدخول.",
        };
      }

      // تفعيل الحساب
      await db("admin_users").where("id", user.id).update({
        email_verified: true,
        verification_token: null,
        verification_sent_at: null,
        verification_expires_at: null,
        updated_at: fn.now(),
      });

      console.log("Account verified successfully for user:", user.email);

      return {
        success: true,
        message: "تم تفعيل الحساب بنجاح. يمكنك الآن تسجيل الدخول.",
      };
    } catch (error) {
      console.error("Email verification error:", error);
      throw error;
    }
  }

  // تسجيل الدخول (مع التحقق من التفعيل)
  static async login(email, password) {
    try {
      const user = await db("admin_users").where("email", email).first();

      if (!user) {
        throw new Error("Invalid credentials");
      }

      // تحقق من كلمة المرور أولاً
      const isPasswordValid = await compare(password, user.password_hash);
      if (!isPasswordValid) {
        throw new Error("Invalid credentials");
      }

      // إذا كانت البيئة development أو لم يتم إعداد الإيميل، تجاهل التحقق من التفعيل
      const skipEmailVerification =
        process.env.NODE_ENV === "development" ||
        !process.env.EMAIL_USER ||
        !process.env.EMAIL_PASSWORD;

      if (!skipEmailVerification && !user.email_verified) {
        throw new Error("Please verify your email before logging in");
      }

      // تحديث آخر دخول
      await db("admin_users").where("id", user.id).update({
        last_login_at: fn.now(),
        updated_at: fn.now(),
      });

      // إنشاء JWT
      const token = sign(
        {
          id: user.id,
          email: user.email,
          role: user.role,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: process.env.JWT_EXPIRES_IN || "7d",
        }
      );

      return {
        token,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          last_login_at: new Date(),
          email_verified: user.email_verified,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  static async changePassword(userId, currentPassword, newPassword) {
    try {
      // جلب المستخدم
      const user = await db("admin_users").where("id", userId).first();

      if (!user) {
        throw new Error("User not found");
      }

      // التحقق من كلمة المرور الحالية
      const isCurrentPasswordValid = await compare(
        currentPassword,
        user.password_hash
      );
      if (!isCurrentPasswordValid) {
        throw new Error("Invalid current password");
      }

      // hash كلمة المرور الجديدة
      const newPasswordHash = await hash(newPassword, 10);

      // تحديث كلمة المرور
      await db("admin_users").where("id", userId).update({
        password_hash: newPasswordHash,
        updated_at: fn.now(),
      });

      return {
        success: true,
        message: "Password changed successfully",
      };
    } catch (error) {
      throw error;
    }
  }

  // إعادة إرسال إيميل التفعيل
  static async resendVerificationEmail(email) {
    try {
      const user = await db("admin_users").where("email", email).first();

      if (!user) {
        throw new Error("User not found");
      }

      if (user.email_verified) {
        throw new Error("Email is already verified");
      }

      // إنشاء token جديد
      const verificationToken = emailService.generateVerificationToken();
      const verificationExpiresAt = new Date();
      verificationExpiresAt.setHours(verificationExpiresAt.getHours() + 24);

      await db("admin_users").where("id", user.id).update({
        verification_token: verificationToken,
        verification_sent_at: fn.now(),
        verification_expires_at: verificationExpiresAt,
        updated_at: fn.now(),
      });

      // إرسال الإيميل
      await emailService.sendVerificationEmail(email, verificationToken);

      return {
        success: true,
        message: "تم إرسال رسالة التفعيل مرة أخرى",
      };
    } catch (error) {
      throw error;
    }
  }
}

export default AuthService;

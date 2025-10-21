import { compare, hash } from "bcrypt";
import jwt from "jsonwebtoken";
import db, { fn } from "../../db/knex.js";
import emailService from "../../utils/sendgridService.js";

const { sign } = jwt;

class AuthService {
  static async hasAnyAdmin() {
    const [result] = await db("admin_users").count("* as count");
    return parseInt(result.count) > 0;
  }

  static async createFirstAdmin(email, password) {
    try {
      const hasAdmin = await this.hasAnyAdmin();
      if (hasAdmin) {
        throw new Error("Admin account already exists");
      }

      const passwordHash = await hash(password, 10);

      const verificationToken = emailService.generateVerificationToken();
      const verificationExpiresAt = new Date();
      verificationExpiresAt.setHours(verificationExpiresAt.getHours() + 24);

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

      const response = {
        id: userId,
        email,
        message:
          "تم إنشاء الحساب بنجاح. يرجى التحقق من بريدك الإلكتروني لتفعيل الحساب.",
      };

      emailService
        .sendVerificationEmail(email, verificationToken)
        .then(() => {
          console.log("✅ Verification email sent successfully to:", email);
        })
        .catch((emailError) => {
          console.error(
            "❌ Failed to send verification email:",
            emailError.message
          );

          db("admin_users")
            .where("id", userId)
            .update({
              email_verified: true,
              verification_token: null,
              verification_sent_at: null,
              verification_expires_at: null,
              updated_at: fn.now(),
            })
            .then(() => {
              console.log("✅ Account auto-verified due to email failure");
            })
            .catch((dbError) => {
              console.error(
                "❌ Failed to auto-verify account:",
                dbError.message
              );
            });
        });

      return response;
    } catch (error) {
      throw error;
    }
  }

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

      const now = new Date();
      const expiresAt = new Date(user.verification_expires_at);

      console.log("Token expires at:", expiresAt);
      console.log("Current time:", now);
      console.log("Token expired:", now > expiresAt);

      if (now > expiresAt) {
        throw new Error("Invalid or expired verification token");
      }

      if (user.email_verified) {
        return {
          success: true,
          message: "الحساب مفعل مسبقاً. يمكنك تسجيل الدخول.",
        };
      }

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

  static async login(email, password) {
    try {
      const user = await db("admin_users").where("email", email).first();

      if (!user) {
        throw new Error("Invalid credentials");
      }

      const isPasswordValid = await compare(password, user.password_hash);
      if (!isPasswordValid) {
        throw new Error("Invalid credentials");
      }

      const skipEmailVerification =
        process.env.NODE_ENV === "development" ||
        !process.env.EMAIL_USER ||
        !process.env.EMAIL_PASSWORD;

      if (!skipEmailVerification && !user.email_verified) {
        throw new Error("Please verify your email before logging in");
      }

      await db("admin_users").where("id", user.id).update({
        last_login_at: fn.now(),
        updated_at: fn.now(),
      });

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
      const user = await db("admin_users").where("id", userId).first();

      if (!user) {
        throw new Error("User not found");
      }

      const isCurrentPasswordValid = await compare(
        currentPassword,
        user.password_hash
      );
      if (!isCurrentPasswordValid) {
        throw new Error("Invalid current password");
      }

      const newPasswordHash = await hash(newPassword, 10);

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

  static async resendVerificationEmail(email) {
    try {
      const user = await db("admin_users").where("email", email).first();

      if (!user) {
        throw new Error("User not found");
      }

      if (user.email_verified) {
        throw new Error("Email is already verified");
      }

      const verificationToken = emailService.generateVerificationToken();
      const verificationExpiresAt = new Date();
      verificationExpiresAt.setHours(verificationExpiresAt.getHours() + 24);

      await db("admin_users").where("id", user.id).update({
        verification_token: verificationToken,
        verification_sent_at: fn.now(),
        verification_expires_at: verificationExpiresAt,
        updated_at: fn.now(),
      });

      const response = {
        success: true,
        message: "تم إرسال رسالة التفعيل. يرجى التحقق من بريدك الإلكتروني.",
      };

      emailService
        .sendVerificationEmail(email, verificationToken)
        .then(() => {
          console.log("✅ Verification email resent successfully to:", email);
        })
        .catch((emailError) => {
          console.error(
            "❌ Failed to resend verification email:",
            emailError.message
          );
        });

      return response;
    } catch (error) {
      throw error;
    }
  }
}

export default AuthService;

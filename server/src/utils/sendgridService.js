import sgMail from "@sendgrid/mail";
import crypto from "crypto";
import Logger from "./logger.js";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export default {
  generateVerificationToken: () => {
    return crypto.randomBytes(32).toString("hex");
  },

  sendVerificationEmail: async (email, token) => {
    try {
      const verificationUrl = `${process.env.FRONTEND_URL}/admin/verify-email/${token}`;

      const msg = {
        to: email,
        from: process.env.EMAIL_FROM,
        subject: "تفعيل حسابك - Sandy Macrame",
        html: `
          <!DOCTYPE html>
          <html dir="rtl" lang="ar">
          <head>
            <meta charset="UTF-8">
            <style>
              body { font-family: Arial, sans-serif; background: #f5f5f5; padding: 20px; }
              .container { background: white; padding: 30px; border-radius: 10px; max-width: 600px; margin: 0 auto; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
              .button { background: #6B46C1; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; }
              h1 { color: #333; }
              .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>🎨 مرحباً بك في Sandy Macrame</h1>
              <p>شكراً لتسجيلك! يرجى تفعيل بريدك الإلكتروني بالضغط على الزر أدناه:</p>
              <a href="${verificationUrl}" class="button">تفعيل البريد الإلكتروني</a>
              <p>أو انسخ هذا الرابط في المتصفح:</p>
              <p style="background: #f5f5f5; padding: 10px; border-radius: 5px; word-break: break-all;">
                ${verificationUrl}
              </p>
              <p class="footer">
                هذا الرابط صالح لمدة 24 ساعة فقط.<br>
                إذا لم تقم بالتسجيل، يرجى تجاهل هذه الرسالة.
              </p>
            </div>
          </body>
          </html>
        `,
      };

      await sgMail.send(msg);

      Logger.info("✅ SendGrid email sent successfully", { to: email });
      return { success: true };
    } catch (error) {
      Logger.error("❌ SendGrid email failed", {
        to: email,
        error: error.message,
        code: error.code,
      });
      throw error;
    }
  },
};

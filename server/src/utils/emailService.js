// server/src/utils/emailService.js - مُصحح
import nodemailer from "nodemailer";
import crypto from "crypto";

class EmailService {
  constructor() {
    // تحقق من إعدادات الإيميل
    const hasEmailConfig = process.env.EMAIL_USER && process.env.EMAIL_PASSWORD;

    if (hasEmailConfig) {
      this.transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST || "smtp.gmail.com",
        port: parseInt(process.env.EMAIL_PORT) || 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
      });
    } else {
      console.warn(
        "⚠️  Email configuration not found. Email features will be disabled."
      );
      this.transporter = null;
    }
  }

  // تحقق من إعداد الإيميل
  isConfigured() {
    return this.transporter !== null;
  }

  // إنشاء token تفعيل
  generateVerificationToken() {
    return crypto.randomBytes(32).toString("hex");
  }

  // إرسال إيميل التفعيل
  async sendVerificationEmail(email, token) {
    if (!this.isConfigured()) {
      throw new Error("Email service is not configured");
    }

    const verificationUrl = `${
      process.env.FRONTEND_URL || "http://localhost:5173"
    }/admin/verify-email/${token}`;

    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: email,
      subject: "تفعيل حساب الإدارة - ساندي مكرمية",
      html: this.getVerificationEmailTemplate(verificationUrl, email),
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log("✅ Verification email sent:", info.messageId);
      return info;
    } catch (error) {
      console.error("❌ Failed to send verification email:", error);
      throw error;
    }
  }

  // قالب إيميل التفعيل
  getVerificationEmailTemplate(verificationUrl, email) {
    return `
      <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9f9f9;">
        <!-- Header -->
        <div style="background: #8b5f8c; color: white; padding: 30px; text-align: center;">
          <h1 style="margin: 0; font-size: 28px;">ساندي مكرمية</h1>
          <h2 style="margin: 10px 0 0 0; font-size: 20px; font-weight: normal;">تفعيل حساب الإدارة</h2>
        </div>
        
        <!-- Content -->
        <div style="padding: 40px 30px; background: white;">
          <h3 style="color: #333; margin-bottom: 20px;">مرحباً ${email}</h3>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 25px;">
            تم إنشاء حساب إدارة جديد بهذا الإيميل في موقع ساندي مكرمية.
          </p>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 30px;">
            لتفعيل الحساب واستكمال عملية التسجيل، يرجى الضغط على الزر أدناه:
          </p>
          
          <!-- Button -->
          <div style="text-align: center; margin: 40px 0;">
            <a href="${verificationUrl}" 
               style="background: #8b5f8c; color: white; padding: 15px 40px; 
                      text-decoration: none; border-radius: 8px; display: inline-block;
                      font-weight: bold; font-size: 16px;">
              تفعيل الحساب الآن
            </a>
          </div>
          
          <!-- Alternative link -->
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 30px 0;">
            <p style="margin: 0 0 10px 0; color: #666; font-size: 14px;">
              إذا لم يعمل الزر أعلاه، يمكنك نسخ الرابط التالي ولصقه في المتصفح:
            </p>
            <p style="margin: 0; word-break: break-all; color: #8b5f8c; font-size: 14px;">
              ${verificationUrl}
            </p>
          </div>
          
          <!-- Warning -->
          <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 8px; margin: 25px 0;">
            <p style="margin: 0; color: #856404; font-weight: bold;">
              ⚠️ هام: هذا الرابط صالح لمدة 24 ساعة فقط.
            </p>
          </div>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 0;">
            إذا لم تكن قد طلبت إنشاء هذا الحساب، يرجى تجاهل هذا الإيميل.
          </p>
        </div>
        
        <!-- Footer -->
        <div style="background: #f8f9fa; padding: 20px 30px; text-align: center;">
          <p style="margin: 0; color: #999; font-size: 12px;">
            هذا إيميل تلقائي من نظام ساندي مكرمية، يرجى عدم الرد عليه.
          </p>
          <p style="margin: 5px 0 0 0; color: #999; font-size: 12px;">
            © ${new Date().getFullYear()} ساندي مكرمية - جميع الحقوق محفوظة
          </p>
        </div>
      </div>
    `;
  }

  // اختبار الاتصال
  async testConnection() {
    if (!this.isConfigured()) {
      return { success: false, error: "Email service not configured" };
    }

    try {
      await this.transporter.verify();
      return { success: true, message: "Email service connected successfully" };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

export default new EmailService();

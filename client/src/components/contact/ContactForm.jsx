// client/src/components/contact/ContactForm.jsx - UPDATED VERSION

import { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  Send,
  MessageCircle,
  CheckCircle,
} from "lucide-react";
import { contactAPI } from "../../api/contact"; // ⭐ NEW IMPORT
import { toast } from "react-hot-toast"; // ⭐ NEW IMPORT
import { openWhatsApp } from "../../utils/whatsapp";

const ContactForm = ({ contactInfo }) => {
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setSending(true);
    setSuccess(false);

    try {
      // ⭐ استخدام الـ API الحقيقي بدلاً من المحاكاة
      const response = await contactAPI.sendMessage({
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        subject: data.subject,
        message: data.message,
      });

      if (response.success) {
        setSuccess(true);
        toast.success("تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.");
        reset(); // مسح النموذج

        // إخفاء رسالة النجاح بعد 5 ثوانٍ
        setTimeout(() => {
          setSuccess(false);
        }, 5000);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error(
        error.message || "فشل في إرسال الرسالة. يرجى المحاولة مرة أخرى."
      );
    } finally {
      setSending(false);
    }
  };

  const handleWhatsAppClick = () => {
    const message = "مرحباً ساندي، أود التواصل معك بخصوص منتجاتكم الرائعة";
    openWhatsApp(contactInfo?.whatsapp, message);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="bg-white rounded-2xl shadow-xl p-8 lg:p-10"
    >
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          أرسل لنا رسالة
        </h3>
        <p className="text-gray-600">
          نحن هنا لمساعدتك. املأ النموذج وسنرد عليك في أقرب وقت ممكن
        </p>
      </div>

      {/* Success Message */}
      {success && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-6 bg-green-50 border-2 border-green-500 rounded-lg p-4"
        >
          <div className="flex items-center gap-3">
            <CheckCircle className="text-green-500 flex-shrink-0" size={24} />
            <div>
              <h3 className="text-green-800 font-semibold text-lg mb-1">
                تم الإرسال بنجاح!
              </h3>
              <p className="text-green-700 text-sm">
                سنرد عليك في أقرب وقت ممكن
              </p>
            </div>
          </div>
        </motion.div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Name & Email Row */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              الاسم الكامل *
            </label>
            <div className="relative">
              <User
                className="absolute right-3 top-3 text-gray-400"
                size={20}
              />
              <input
                {...register("name", {
                  required: "الاسم مطلوب",
                  minLength: {
                    value: 2,
                    message: "الاسم يجب أن يكون أكثر من حرفين",
                  },
                })}
                type="text"
                className={`w-full pr-12 pl-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent transition-all ${
                  errors.name ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="أدخل اسمك الكامل"
              />
            </div>
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              البريد الإلكتروني *
            </label>
            <div className="relative">
              <Mail
                className="absolute right-3 top-3 text-gray-400"
                size={20}
              />
              <input
                {...register("email", {
                  required: "البريد الإلكتروني مطلوب",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "تنسيق البريد الإلكتروني غير صحيح",
                  },
                })}
                type="email"
                className={`w-full pr-12 pl-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent transition-all ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="example@email.com"
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>
        </div>

        {/* Phone & Subject Row */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              رقم الهاتف
            </label>
            <div className="relative">
              <Phone
                className="absolute right-3 top-3 text-gray-400"
                size={20}
              />
              <input
                {...register("phone")}
                type="tel"
                className="w-full pr-12 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent transition-all"
                placeholder="+970 599 123 456"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              الموضوع *
            </label>
            <select
              {...register("subject", {
                required: "يرجى اختيار موضوع الرسالة",
              })}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent transition-all ${
                errors.subject ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">اختر الموضوع...</option>
              <option value="استفسار عن المنتجات">استفسار عن المنتجات</option>
              <option value="طلب تصميم مخصص">طلب تصميم مخصص</option>
              <option value="استفسار عن الأسعار">استفسار عن الأسعار</option>
              <option value="معلومات الشحن والتوصيل">
                معلومات الشحن والتوصيل
              </option>
              <option value="شكوى أو اقتراح">شكوى أو اقتراح</option>
              <option value="أخرى">أخرى</option>
            </select>
            {errors.subject && (
              <p className="text-red-500 text-sm mt-1">
                {errors.subject.message}
              </p>
            )}
          </div>
        </div>

        {/* Message */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            رسالتك *
          </label>
          <textarea
            {...register("message", {
              required: "الرسالة مطلوبة",
              minLength: {
                value: 10,
                message: "الرسالة يجب أن تكون أكثر من 10 أحرف",
              },
            })}
            rows={5}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent resize-none transition-all ${
              errors.message ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="اكتب رسالتك هنا..."
          ></textarea>
          {errors.message && (
            <p className="text-red-500 text-sm mt-1">
              {errors.message.message}
            </p>
          )}
        </div>

        {/* Submit Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            type="submit"
            disabled={sending}
            className="flex-1 bg-purple hover:bg-purple-hover text-white py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {sending ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <Send size={20} />
            )}
            {sending ? "جارٍ الإرسال..." : "إرسال الرسالة"}
          </button>

          <button
            type="button"
            onClick={handleWhatsAppClick}
            className="flex-1 bg-green-500 text-white py-3 px-6 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
          >
            <MessageCircle size={20} />
            واتساب فوري
          </button>
        </div>

        <div className="text-center">
          <button
            type="button"
            onClick={() =>
              (window.location.href = `tel:${contactInfo.whatsapp}`)
            }
            className="text-purple hover:text-purple-hover hover:underline transition-colors"
          >
            أو اتصل بنا مباشرة
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default ContactForm;

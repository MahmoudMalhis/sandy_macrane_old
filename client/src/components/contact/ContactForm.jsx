/* eslint-disable no-unused-vars */
// client/src/components/contact/ContactForm.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import {
  Send,
  MessageCircle,
  CheckCircle,
  User,
  Mail,
  Phone,
  MessageSquare,
  AlertCircle,
} from "lucide-react";
import { toast } from "react-hot-toast";
import Button from "../common/Button";

const ContactForm = ({ isVisible, contactInfo }) => {
  const [messageSent, setMessageSent] = useState(false);
  const [sending, setSending] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    setSending(true);
    try {
      // محاكاة إرسال الرسالة
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // إنشاء رسالة واتساب
      const whatsappMessage = `مرحباً ساندي،

تم إرسال رسالة جديدة عبر موقعك:

الاسم: ${data.name}
البريد الإلكتروني: ${data.email}
الهاتف: ${data.phone || "غير محدد"}
الموضوع: ${data.subject}

الرسالة:
${data.message}

---
تم الإرسال عبر موقع ساندي مكرمية`;

      // فتح واتساب مع الرسالة
      const whatsappUrl = `https://wa.me/${
        contactInfo.whatsapp
      }?text=${encodeURIComponent(whatsappMessage)}`;
      window.open(whatsappUrl, "_blank");

      setMessageSent(true);
      reset();
      toast.success("تم إرسال رسالتك بنجاح!");

      // إخفاء رسالة النجاح بعد 5 ثوان
      setTimeout(() => {
        setMessageSent(false);
      }, 5000);
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("حدث خطأ في إرسال الرسالة، يرجى المحاولة مرة أخرى");
    } finally {
      setSending(false);
    }
  };

  const handleWhatsAppClick = () => {
    const message = "مرحباً ساندي، أود التواصل معك بخصوص منتجاتكم الرائعة";
    const whatsappUrl = `https://wa.me/${
      contactInfo.whatsapp
    }?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={isVisible ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.8, delay: 0.4 }}
    >
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-purple mb-6">أرسل لنا رسالة</h2>

        {/* رسالة النجاح */}
        {messageSent && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6"
          >
            <div className="flex items-center gap-3">
              <CheckCircle className="text-green-600" size={24} />
              <div>
                <h3 className="font-semibold text-green-800">
                  تم إرسال رسالتك بنجاح!
                </h3>
                <p className="text-green-700 text-sm">
                  سنرد عليك في أقرب وقت ممكن
                </p>
              </div>
            </div>
          </motion.div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                  className={`w-full pr-12 pl-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="أدخل اسمك الكامل"
                />
              </div>
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.name.message}
                </p>
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
                  className={`w-full pr-12 pl-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent ${
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
                  className="w-full pr-12 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
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
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent ${
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              رسالتك *
            </label>
            <div className="relative">
              <MessageSquare
                className="absolute right-3 top-3 text-gray-400"
                size={20}
              />
              <textarea
                {...register("message", {
                  required: "الرسالة مطلوبة",
                  minLength: {
                    value: 10,
                    message: "الرسالة يجب أن تكون أكثر من 10 أحرف",
                  },
                })}
                rows={5}
                className={`w-full pr-12 pl-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent resize-none ${
                  errors.message ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="اكتب رسالتك هنا..."
              />
            </div>
            {errors.message && (
              <p className="text-red-500 text-sm mt-1">
                {errors.message.message}
              </p>
            )}
          </div>

          {/* ملاحظة الخصوصية */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="text-blue-600 mt-0.5" size={16} />
              <p className="text-blue-800 text-sm">
                <strong>ملاحظة:</strong> معلوماتك آمنة معنا. سيتم استخدام
                بياناتك للرد على استفسارك فقط ولن نشاركها مع أي طرف ثالث.
              </p>
            </div>
          </div>

          {/* أزرار الإرسال */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              type="submit"
              disabled={sending}
              className="flex-1 flex items-center justify-center gap-2 py-3"
            >
              {sending ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <Send size={20} />
              )}
              {sending ? "جارٍ الإرسال..." : "إرسال الرسالة"}
            </Button>

            <button
              type="button"
              onClick={handleWhatsAppClick}
              className="flex-1 bg-green-500 text-white py-3 px-6 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2 cursor-pointer"
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
              className="text-purple hover:text-purple-hover hover:underline cursor-pointer"
            >
              أو اتصل بنا مباشرة
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default ContactForm;

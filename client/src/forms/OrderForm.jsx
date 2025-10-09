/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import {
  X,
  Upload,
  Phone,
  Mail,
  User,
  Image,
  Trash2,
  Send,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import { toast } from "react-hot-toast";
import Button from "../components/common/Button";
import useAppStore from "../store/useAppStore";
import { inquiriesAPI } from "../api/inquiries"; // ✅ استيراد API

export default function OrderForm() {
  const { isOrderFormOpen, selectedAlbum, closeOrderForm } = useAppStore();
  const [uploadedImages, setUploadedImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [sending, setSending] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  useEffect(() => {
    if (isOrderFormOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOrderFormOpen]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm();

  if (!isOrderFormOpen) return null;

  // رفع الصور
  const handleImageUpload = async (event) => {
    const files = Array.from(event.target.files);

    if (files.length === 0) return;

    if (uploadedImages.length + files.length > 5) {
      toast.error("يمكن رفع حد أقصى 5 صور");
      return;
    }

    setUploading(true);

    try {
      const newImages = [];

      for (const file of files) {
        if (!file.type.startsWith("image/")) {
          toast.error(`${file.name} ليس ملف صورة صحيح`);
          continue;
        }

        if (file.size > 5 * 1024 * 1024) {
          toast.error(`${file.name} كبير جداً (حد أقصى 5MB)`);
          continue;
        }

        const imageUrl = URL.createObjectURL(file);
        newImages.push({
          id: Date.now() + Math.random(),
          file,
          url: imageUrl,
          name: file.name,
          size: file.size,
        });
      }

      setUploadedImages((prev) => [...prev, ...newImages]);
      toast.success(`تم رفع ${newImages.length} صور بنجاح`);
    } catch (error) {
      console.error("Error uploading images:", error);
      toast.error("فشل في رفع الصور");
    } finally {
      setUploading(false);
    }
  };

  // حذف صورة
  const removeImage = (imageId) => {
    setUploadedImages((prev) => {
      const imageToRemove = prev.find((img) => img.id === imageId);
      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.url);
      }
      return prev.filter((img) => img.id !== imageId);
    });
  };

  // ✅ إرسال النموذج - المُحدّث
  const onSubmit = async (data) => {
    setSending(true);

    try {
      // تحضير البيانات للإرسال
      const inquiryData = {
        customer_name: data.name,
        phone_whatsapp: data.whatsapp,
        email: data.email || null,
        product_type: data.productType,
        album_id: selectedAlbum?.id || null,
        notes: `
          المقاسات المطلوبة: ${data.dimensions || "غير محدد"}
          الألوان المفضلة: ${data.colors || "غير محدد"}

          وصف الطلب:
          ${data.description}
        `.trim(),
        attached_images: uploadedImages,
      };

      // إرسال الطلب إلى الـ API
      const response = await inquiriesAPI.create(inquiryData);

      if (response.success) {
        toast.success("تم إرسال طلبك بنجاح!");
        setFormSubmitted(true);

        // فتح واتساب (اختياري)
        if (response.data.whatsappLink) {
          setTimeout(() => {
            window.open(response.data.whatsappLink, "_blank");
          }, 1000);
        }

        // إغلاق النموذج بعد 3 ثوان
        setTimeout(() => {
          handleClose();
        }, 3000);
      } else {
        throw new Error(response.message || "فشل في إرسال الطلب");
      }
    } catch (error) {
      console.error("Error sending order:", error);

      if (error.response?.status === 400) {
        toast.error("يرجى التحقق من البيانات المدخلة");
      } else if (error.response?.status === 500) {
        toast.error("حدث خطأ في الخادم، يرجى المحاولة لاحقاً");
      } else {
        toast.error("حدث خطأ في إرسال الطلب، يرجى المحاولة مرة أخرى");
      }
    } finally {
      setSending(false);
    }
  };

  const getProductTypeText = (type) => {
    const types = {
      macrame: "مكرمية",
      frame: "برواز",
      other: "أخرى",
    };
    return types[type] || type;
  };

  const handleClose = () => {
    uploadedImages.forEach((img) => {
      URL.revokeObjectURL(img.url);
    });

    setUploadedImages([]);
    setFormSubmitted(false);
    reset();
    closeOrderForm();
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-[#8b5f8c91] flex justify-center z-50 p-4"
        onClick={handleClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-xl w-full max-w-2xl max-h-[80vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* رأس النموذج */}
          <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-xl z-2">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-purple">
                  طلب منتج جديد
                </h2>
                <p className="text-gray-600 mt-1">
                  املأ النموذج وسنتواصل معك قريباً
                </p>
              </div>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X size={24} />
              </button>
            </div>
          </div>

          <div className="p-6">
            {/* رسالة النجاح */}
            {formSubmitted && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6"
              >
                <div className="flex items-center gap-3">
                  <CheckCircle className="text-green-600" size={32} />
                  <div>
                    <h3 className="font-bold text-green-800 text-lg">
                      تم إرسال طلبك بنجاح!
                    </h3>
                    <p className="text-green-700 mt-1">
                      سنتواصل معك قريباً عبر واتساب
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* معلومات الألبوم المختار */}
            {selectedAlbum && !formSubmitted && (
              <div className="bg-purple bg-opacity-10 border border-purple border-opacity-30 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-4">
                  {selectedAlbum.cover_image && (
                    <img
                      src={selectedAlbum.cover_image}
                      alt={selectedAlbum.title}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                  )}
                  <div>
                    <p className="text-sm text-gray-400 mb-1">
                      المنتج المرجعي:
                    </p>
                    <h3 className="font-bold text-gray-300">
                      {selectedAlbum.title}
                    </h3>
                  </div>
                </div>
              </div>
            )}

            {/* النموذج */}
            {!formSubmitted && (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* الاسم */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الاسم الكامل <span className="text-red-500">*</span>
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
                          value: 3,
                          message: "الاسم يجب أن يكون 3 أحرف على الأقل",
                        },
                      })}
                      type="text"
                      className="w-full pr-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
                      placeholder="أدخل اسمك الكامل"
                    />
                  </div>
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                {/* رقم الواتساب */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    رقم الواتساب <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone
                      className="absolute right-3 top-3 text-gray-400"
                      size={20}
                    />
                    <input
                      {...register("whatsapp", {
                        required: "رقم الواتساب مطلوب",
                        pattern: {
                          value: /^[0-9+\s()-]+$/,
                          message: "رقم الهاتف غير صحيح",
                        },
                      })}
                      type="tel"
                      className="w-full pr-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
                      placeholder="+970 599 123 456"
                      dir="ltr"
                    />
                  </div>
                  {errors.whatsapp && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.whatsapp.message}
                    </p>
                  )}
                </div>

                {/* البريد الإلكتروني */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    البريد الإلكتروني (اختياري)
                  </label>
                  <div className="relative">
                    <Mail
                      className="absolute right-3 top-3 text-gray-400"
                      size={20}
                    />
                    <input
                      {...register("email", {
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: "البريد الإلكتروني غير صحيح",
                        },
                      })}
                      type="email"
                      className="w-full pr-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
                      placeholder="example@email.com"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* نوع المنتج */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    نوع المنتج <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register("productType", {
                      required: "يرجى اختيار نوع المنتج",
                    })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
                  >
                    <option value="">اختر نوع المنتج</option>
                    <option value="macrame">مكرمية</option>
                    <option value="frame">برواز</option>
                    <option value="other">أخرى</option>
                  </select>
                  {errors.productType && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.productType.message}
                    </p>
                  )}
                </div>

                {/* المقاسات */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    المقاسات المطلوبة (اختياري)
                  </label>
                  <input
                    {...register("dimensions")}
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
                    placeholder="مثال: 50 × 70 سم"
                  />
                </div>

                {/* الألوان */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الألوان المفضلة (اختياري)
                  </label>
                  <input
                    {...register("colors")}
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
                    placeholder="مثال: أبيض، بيج، رمادي"
                  />
                </div>

                {/* وصف الطلب */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    وصف الطلب <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    {...register("description", {
                      required: "الوصف مطلوب",
                      minLength: {
                        value: 10,
                        message: "الوصف يجب أن يكون 10 أحرف على الأقل",
                      },
                    })}
                    rows={4}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent resize-none"
                    placeholder="صف المنتج الذي تريده بالتفصيل..."
                  />
                  {errors.description && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.description.message}
                    </p>
                  )}
                </div>

                {/* رفع الصور */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    صور مرجعية (اختياري - حد أقصى 5 صور)
                  </label>

                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple transition-colors">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                      disabled={uploading || uploadedImages.length >= 5}
                    />
                    <label
                      htmlFor="image-upload"
                      className={`cursor-pointer ${
                        uploadedImages.length >= 5
                          ? "cursor-not-allowed opacity-50"
                          : ""
                      }`}
                    >
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600 mb-1">
                        {uploading ? "جاري الرفع..." : "اضغط لرفع الصور"}
                      </p>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, JPEG - حد أقصى 5MB لكل صورة
                      </p>
                    </label>
                  </div>

                  {/* عرض الصور المرفوعة */}
                  {uploadedImages.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                      {uploadedImages.map((image) => (
                        <div
                          key={image.id}
                          className="relative group border rounded-lg overflow-hidden"
                        >
                          <img
                            src={image.url}
                            alt={image.name}
                            className="w-full h-32 object-cover"
                          />
                          <div className="absolute inset-0 bg-[#0000007a] bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button
                              type="button"
                              onClick={() => removeImage(image.id)}
                              className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 truncate">
                            {image.name}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* ملاحظة */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="text-orange-500 mt-1" size={20} />
                    <div className="text-sm text-gray-700">
                      <p className="font-medium mb-2">ملاحظة مهمة:</p>
                      <ul className="space-y-1 list-disc list-inside">
                        <li>
                          بإرسال هذا الطلب، أنت توافق على تواصلنا معك عبر واتساب
                          أو الهاتف
                        </li>
                        <li>سنقوم بحفظ معلوماتك لمتابعة طلبك فقط</li>
                        <li>لن نشارك معلوماتك مع أطراف خارجية</li>
                        <li>يمكنك طلب حذف معلوماتك في أي وقت</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* أزرار النموذج */}
                <div className="flex gap-4 pt-4">
                  <Button
                    type="submit"
                    loading={sending}
                    disabled={formSubmitted}
                    className="flex-1"
                  >
                    <Send size={18} className="ml-2" />
                    {sending ? "جاري الإرسال..." : "إرسال الطلب"}
                  </Button>

                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={sending}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    إلغاء
                  </button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

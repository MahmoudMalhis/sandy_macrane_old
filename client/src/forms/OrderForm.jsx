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
  MessageSquare,
  Image as ImageIcon,
  Trash2,
  Send,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import { toast } from "react-hot-toast";
import Button from "../components/common/Button";
import useAppStore from "../store/useAppStore";

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

    // تنظيف عند إلغاء المكون
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

    // فحص عدد الصور (حد أقصى 5)
    if (uploadedImages.length + files.length > 5) {
      toast.error("يمكن رفع حد أقصى 5 صور");
      return;
    }

    setUploading(true);

    try {
      const newImages = [];

      for (const file of files) {
        // فحص نوع الملف
        if (!file.type.startsWith("image/")) {
          toast.error(`${file.name} ليس ملف صورة صحيح`);
          continue;
        }

        // فحص حجم الملف (حد أقصى 5MB)
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`${file.name} كبير جداً (حد أقصى 5MB)`);
          continue;
        }

        // إنشاء preview للصورة
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

  // إرسال النموذج
  const onSubmit = async (data) => {
    setSending(true);

    try {
      // محاكاة رفع الصور لخدمة خارجية (Cloudinary مثلاً)
      let imageUrls = [];

      if (uploadedImages.length > 0) {
        // هنا يجب تطبيق رفع حقيقي لخدمة الصور
        // للمحاكاة، سنستخدم URL.createObjectURL
        imageUrls = uploadedImages.map((img) => img.url);
      }

      // إنشاء رسالة واتساب
      const whatsappMessage = `مرحباً ساندي،

تم إرسال طلب جديد عبر موقعك:

👤 الاسم: ${data.name}
📱 واتساب: ${data.whatsapp}
📧 البريد: ${data.email || "غير محدد"}
🎨 نوع المنتج: ${getProductTypeText(data.productType)}
${selectedAlbum ? `📁 الألبوم المرجعي: ${selectedAlbum.title}` : ""}
📏 المقاسات المطلوبة: ${data.dimensions || "غير محدد"}
🎨 الألوان المفضلة: ${data.colors || "غير محدد"}

📝 وصف الطلب:
${data.description}

${
  uploadedImages.length > 0
    ? `🖼️ عدد الصور المرفقة: ${uploadedImages.length}`
    : ""
}

---
تم الإرسال عبر موقع ساندي مكرمية`;

      // فتح واتساب مع الرسالة
      const whatsappURL = `https://wa.me/970599123456?text=${encodeURIComponent(
        whatsappMessage
      )}`;
      window.open(whatsappURL, "_blank");

      // حفظ الطلب محلياً (يمكن إرساله لقاعدة البيانات لاحقاً)
      const orderData = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        customer: {
          name: data.name,
          whatsapp: data.whatsapp,
          email: data.email,
        },
        order: {
          productType: data.productType,
          selectedAlbum: selectedAlbum,
          dimensions: data.dimensions,
          colors: data.colors,
          description: data.description,
          images: imageUrls,
        },
        status: "sent",
      };

      // حفظ في localStorage للمتابعة
      const existingOrders = JSON.parse(
        localStorage.getItem("customerOrders") || "[]"
      );
      existingOrders.push(orderData);
      localStorage.setItem("customerOrders", JSON.stringify(existingOrders));

      setFormSubmitted(true);
      toast.success("تم إرسال طلبك بنجاح!");

      // إعادة تعيين النموذج بعد 3 ثوان
      setTimeout(() => {
        handleClose();
      }, 3000);
    } catch (error) {
      console.error("Error sending order:", error);
      toast.error("حدث خطأ في إرسال الطلب، يرجى المحاولة مرة أخرى");
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
    // تنظيف الصور المرفوعة
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
                    <p className="text-green-700">
                      تم فتح واتساب لإكمال التواصل. سنرد عليك في أقرب وقت ممكن.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* الألبوم المحدد */}
            {selectedAlbum && (
              <div className="bg-purple bg-opacity-10 border border-purple border-opacity-20 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-4">
                  <img
                    src={
                      selectedAlbum.cover_image || selectedAlbum.media?.[0]?.url
                    }
                    alt={selectedAlbum.title}
                    className="w-16 h-16 rounded-lg object-cover"
                    loading="lazy"
                  />
                  <div>
                    <h3 className="font-semibold text-purple">
                      الألبوم المرجعي:
                    </h3>
                    <p className="text-gray-700">{selectedAlbum.title}</p>
                    <p className="text-sm text-gray-600">
                      {selectedAlbum.description}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* معلومات التواصل */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                  معلومات التواصل
                </h3>

                <div className="grid md:grid-cols-2 gap-4">
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
                          minLength: { value: 2, message: "الاسم قصير جداً" },
                        })}
                        type="text"
                        className="w-full pr-12 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
                        placeholder="اسمك الكامل"
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
                      رقم واتساب *
                    </label>
                    <div className="relative">
                      <Phone
                        className="absolute right-3 top-3 text-gray-400"
                        size={20}
                      />
                      <input
                        {...register("whatsapp", {
                          required: "رقم واتساب مطلوب",
                          pattern: {
                            value: /^[0-9+]+$/,
                            message: "رقم غير صحيح",
                          },
                        })}
                        type="tel"
                        className="w-full pr-12 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
                        placeholder="970599123456"
                      />
                    </div>
                    {errors.whatsapp && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.whatsapp.message}
                      </p>
                    )}
                  </div>
                </div>

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
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "بريد إلكتروني غير صحيح",
                        },
                      })}
                      type="email"
                      className="w-full pr-12 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
                      placeholder="your@email.com"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>

              {/* تفاصيل الطلب */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                  تفاصيل الطلب
                </h3>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      نوع المنتج *
                    </label>
                    <select
                      {...register("productType", {
                        required: "نوع المنتج مطلوب",
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

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      المقاسات المطلوبة
                    </label>
                    <input
                      {...register("dimensions")}
                      type="text"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
                      placeholder="مثل: 60سم × 80سم"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الألوان المفضلة
                  </label>
                  <input
                    {...register("colors")}
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
                    placeholder="مثل: أبيض وذهبي، أو حسب الديكور"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    وصف الطلب والملاحظات *
                  </label>
                  <div className="relative">
                    <MessageSquare
                      className="absolute right-3 top-3 text-gray-400"
                      size={20}
                    />
                    <textarea
                      {...register("description", {
                        required: "وصف الطلب مطلوب",
                        minLength: { value: 10, message: "الوصف قصير جداً" },
                      })}
                      rows={4}
                      className="w-full pr-12 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent resize-none"
                      placeholder="اكتب تفاصيل ما تريده، أي أفكار خاصة، أو ملاحظات عن المكان الذي ستوضع فيه القطعة..."
                    />
                  </div>
                  {errors.description && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.description.message}
                    </p>
                  )}
                </div>
              </div>

              {/* رفع الصور */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                  صور مرجعية (اختياري)
                </h3>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-center">
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
                      className={`cursor-pointer flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 transition-colors ${
                        uploadedImages.length >= 5
                          ? "border-gray-300 bg-gray-100 cursor-not-allowed"
                          : "border-purple border-opacity-50 hover:border-opacity-100 hover:bg-purple hover:bg-opacity-5"
                      }`}
                    >
                      <Upload className="h-10 w-10 text-gray-400 mb-2" />
                      <p className="text-sm font-medium text-gray-700 mb-1">
                        {uploadedImages.length >= 5
                          ? "تم الوصول للحد الأقصى (5 صور)"
                          : "اضغط لرفع صور أو اسحبها هنا"}
                      </p>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, WEBP حتى 5MB لكل صورة (حد أقصى 5 صور)
                      </p>
                    </label>
                  </div>

                  {/* الصور المرفوعة */}
                  {uploadedImages.length > 0 && (
                    <div className="mt-4">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {uploadedImages.map((image) => (
                          <div key={image.id} className="relative group">
                            <img
                              src={image.url}
                              alt={image.name}
                              className="w-full h-24 object-cover rounded-lg border border-gray-200"
                              loading="lazy"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(image.id)}
                              className="absolute top-1 left-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Trash2 size={12} />
                            </button>
                            <div className="absolute bottom-1 right-1 bg-black bg-opacity-50 text-white text-xs px-1 rounded">
                              {formatFileSize(image.size)}
                            </div>
                          </div>
                        ))}
                      </div>
                      <p className="text-sm text-gray-600 mt-2">
                        {uploadedImages.length} من 5 صور مرفوعة
                      </p>
                    </div>
                  )}

                  {uploading && (
                    <div className="mt-4 text-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple mx-auto"></div>
                      <p className="text-sm text-gray-600 mt-2">
                        جاري رفع الصور...
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* شروط الخصوصية */}
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
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

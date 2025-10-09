/* eslint-disable no-unused-vars */
// client/src/components/forms/ReviewForm.jsx - نموذج إضافة تقييم
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Star,
  Upload,
  X,
  User,
  MessageSquare,
  Camera,
  Send,
  AlertCircle,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { reviewsAPI } from "../api/reviews";
import { albumsAPI } from "../api/albums";

const ReviewForm = ({
  isOpen,
  onClose,
  linkedAlbum = null,
  onSubmitSuccess = null,
}) => {
  const [formData, setFormData] = useState({
    author_name: "",
    rating: 0,
    text: "",
    linked_album_id: linkedAlbum?.id || null,
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [albums, setAlbums] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState(linkedAlbum?.id || null);
  const [albumPreview, setAlbumPreview] = useState(linkedAlbum || null);

  useEffect(() => {
    if (isOpen && !linkedAlbum) {
      fetchAlbums();
    }
  }, [isOpen]);

  const fetchAlbums = async () => {
    try {
      const response = await albumsAPI.getAll({ status: "published" });
      if (response.success) {
        setAlbums(response.data);
      }
    } catch (error) {
      console.error("Error fetching albums:", error);
    }
  };

  // تحديث معاينة الألبوم عند تغيير الاختيار
  const handleAlbumSelection = (albumId) => {
    const album = albums.find((a) => a.id === parseInt(albumId));
    setSelectedAlbum(albumId);
    setAlbumPreview(album);
    setFormData((prev) => ({
      ...prev,
      linked_album_id: albumId ? parseInt(albumId) : null,
    }));
  };

  // معالجة تغيير البيانات
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // معالجة اختيار التقييم
  const handleRatingClick = (rating) => {
    setFormData((prev) => ({
      ...prev,
      rating,
    }));
  };

  // معالجة اختيار الصورة
  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // التحقق من نوع الملف
      if (!file.type.startsWith("image/")) {
        toast.error("يرجى اختيار ملف صورة صالح");
        return;
      }

      // التحقق من حجم الملف (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("حجم الصورة يجب أن يكون أقل من 5 ميجابايت");
        return;
      }

      setSelectedImage(file);

      // إنشاء معاينة للصورة
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // إزالة الصورة المختارة
  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  // التحقق من صحة النموذج
  const validateForm = () => {
    if (!formData.author_name.trim()) {
      toast.error("يرجى إدخال اسمك");
      return false;
    }

    if (formData.author_name.length < 2) {
      toast.error("الاسم يجب أن يكون حرفين على الأقل");
      return false;
    }

    if (formData.rating === 0) {
      toast.error("يرجى اختيار تقييم");
      return false;
    }

    if (!formData.text.trim()) {
      toast.error("يرجى كتابة رأيك");
      return false;
    }

    if (formData.text.length < 10) {
      toast.error("التقييم يجب أن يكون 10 أحرف على الأقل");
      return false;
    }

    return true;
  };

  // إرسال التقييم
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const submitData = {
        ...formData,
        review_image: selectedImage,
      };

      const response = await reviewsAPI.create(submitData);

      if (response.success) {
        toast.success("تم إرسال تقييمك بنجاح! سيظهر بعد المراجعة");

        // إعادة تعيين النموذج
        setFormData({
          author_name: "",
          rating: 0,
          text: "",
          linked_album_id: linkedAlbum?.id || null,
        });
        setSelectedImage(null);
        setImagePreview(null);

        // استدعاء callback إذا كان متوفراً
        if (onSubmitSuccess) {
          onSubmitSuccess(response.data);
        }

        // إغلاق النموذج
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        toast.error("فشل في إرسال التقييم، يرجى المحاولة مرة أخرى");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("حدث خطأ في إرسال التقييم");
    } finally {
      setLoading(false);
    }
  };

  // رسم النجوم
  const renderStars = () => {
    return [...Array(5)].map((_, index) => {
      const starValue = index + 1;
      const isActive = starValue <= (hoveredRating || formData.rating);

      return (
        <motion.button
          key={index}
          type="button"
          onClick={() => handleRatingClick(starValue)}
          onMouseEnter={() => setHoveredRating(starValue)}
          onMouseLeave={() => setHoveredRating(0)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className={`p-1 transition-colors duration-200 ${
            isActive ? "text-yellow-500" : "text-gray-300 hover:text-yellow-400"
          }`}
        >
          <Star size={28} className={isActive ? "fill-current" : ""} />
        </motion.button>
      );
    });
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">شاركنا رأيك</h2>
            <p className="text-gray-600 mt-1">
              {linkedAlbum
                ? `تقييم لـ "${linkedAlbum.title}"`
                : "أضف تقييماً جديداً"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} className="text-gray-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* معلومات المنتج المرتبط */}
          {linkedAlbum && (
            <div className="bg-purple bg-opacity-10 rounded-lg p-4">
              <div className="flex items-center gap-4">
                {linkedAlbum.cover_image && (
                  <img
                    src={linkedAlbum.cover_image}
                    alt={linkedAlbum.title}
                    className="w-16 h-16 rounded-lg object-cover"
                    loading="lazy"
                  />
                )}
                <div>
                  <h3 className="font-medium text-purple">
                    {linkedAlbum.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {linkedAlbum.category === "macrame" ? "مكرمية" : "برواز"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* الاسم */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <User size={16} className="inline ml-1" />
              الاسم الكامل *
            </label>
            <input
              type="text"
              value={formData.author_name}
              onChange={(e) => handleInputChange("author_name", e.target.value)}
              placeholder="أدخل اسمك الكامل"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent transition-colors"
              maxLength={100}
              required
            />
          </div>

          {/* التقييم */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              تقييمك *
            </label>
            <div className="flex items-center gap-2">
              {renderStars()}
              <span className="text-sm text-gray-600 mr-3">
                {formData.rating > 0
                  ? `${formData.rating} من 5 نجوم`
                  : "اختر تقييمك"}
              </span>
            </div>
          </div>

          {/* النص */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MessageSquare size={16} className="inline ml-1" />
              رأيك وتجربتك *
            </label>
            <textarea
              value={formData.text}
              onChange={(e) => handleInputChange("text", e.target.value)}
              placeholder="شاركنا تجربتك مع المنتج... ما الذي أعجبك؟ كيف كانت الجودة والخدمة؟"
              rows={5}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent resize-none transition-colors"
              maxLength={1000}
              required
            />
            <div className="text-sm text-gray-500 text-left mt-1">
              {formData.text.length}/1000
            </div>
          </div>

          {/* إضافة صورة */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Camera size={16} className="inline ml-1" />
              إضافة صورة (اختياري)
            </label>

            {!imagePreview ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <Upload size={32} className="text-gray-400 mb-2" />
                  <p className="text-gray-600">اضغط لاختيار صورة</p>
                  <p className="text-xs text-gray-500 mt-1">
                    PNG, JPG, GIF حتى 5MB
                  </p>
                </label>
              </div>
            ) : (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="معاينة"
                  className="w-full h-48 object-cover rounded-lg"
                  loading="lazy"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            )}
          </div>

          {!linkedAlbum && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                اختر المنتج (اختياري)
              </label>
              <select
                value={selectedAlbum || ""}
                onChange={(e) => handleAlbumSelection(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
              >
                <option value="">لا يوجد منتج محدد</option>
                {albums.map((album) => (
                  <option key={album.id} value={album.id}>
                    {album.title} -{" "}
                    {album.category === "macrame" ? "مكرمية" : "برواز"}
                  </option>
                ))}
              </select>

              {/* معاينة الألبوم المختار */}
              {albumPreview && (
                <div className="mt-4 bg-purple bg-opacity-10 rounded-lg p-4">
                  <div className="flex items-center gap-4">
                    {albumPreview.cover_image && (
                      <img
                        src={albumPreview.cover_image}
                        alt={albumPreview.title}
                        className="w-16 h-16 rounded-lg object-cover"
                        loading="lazy"
                      />
                    )}
                    <div>
                      <h3 className="font-medium text-gray-300">
                        {albumPreview.title}
                      </h3>
                      <p className="text-sm text-gray-100">
                        {albumPreview.category === "macrame"
                          ? "مكرمية"
                          : "برواز"}
                      </p>
                      {albumPreview.description && (
                        <p className="text-xs text-gray-50 mt-1 line-clamp-2">
                          {albumPreview.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* تنبيه */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex">
              <AlertCircle className="text-blue-400 mt-0.5 ml-2" size={20} />
              <div className="text-sm text-blue-700">
                <p className="font-medium mb-1">ملاحظة مهمة:</p>
                <p>
                  سيتم مراجعة تقييمك قبل نشره للتأكد من جودة المحتوى. عادة ما
                  يتم الموافقة على التقييمات خلال 24 ساعة.
                </p>
              </div>
            </div>
          </div>

          {/* أزرار العمل */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-purple text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  جاري الإرسال...
                </>
              ) : (
                <>
                  <Send size={16} />
                  إرسال التقييم
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              إلغاء
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default ReviewForm;

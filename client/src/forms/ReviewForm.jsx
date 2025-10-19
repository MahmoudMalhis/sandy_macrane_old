import { useState } from "react";
// eslint-disable-next-line no-unused-vars
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
import { usePublicAlbums } from "../hooks/queries/useAlbums";
import { useCreateReview } from "../hooks/queries/useReviews";

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
  const [hoveredRating, setHoveredRating] = useState(0);
  const [selectedAlbum, setSelectedAlbum] = useState(linkedAlbum?.id || null);
  const [albumPreview, setAlbumPreview] = useState(linkedAlbum || null);

  const { data: albumsData, isLoading: albumsLoading } = usePublicAlbums({
    status: "published",
    enabled: !linkedAlbum && isOpen, 
  });

  const createReviewMutation = useCreateReview();

  const albums = albumsData?.data || [];
  const loading = createReviewMutation.isPending;

  const handleAlbumSelection = (albumId) => {
    const album = albums.find((a) => a.id === parseInt(albumId));
    setSelectedAlbum(albumId);
    setAlbumPreview(album);
    setFormData((prev) => ({
      ...prev,
      linked_album_id: albumId ? parseInt(albumId) : null,
    }));
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleRatingClick = (rating) => {
    setFormData((prev) => ({
      ...prev,
      rating,
    }));
  };

  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("يرجى اختيار ملف صورة صالح");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("حجم الصورة يجب أن يكون أقل من 5 ميجابايت");
      return;
    }

    setSelectedImage(file);

    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const submitData = {
      ...formData,
      review_image: selectedImage,
    };

    createReviewMutation.mutate(submitData, {
      onSuccess: (data) => {
        toast.success("تم إرسال تقييمك بنجاح! سيظهر بعد المراجعة");

        setFormData({
          author_name: "",
          rating: 0,
          text: "",
          linked_album_id: linkedAlbum?.id || null,
        });
        setSelectedImage(null);
        setImagePreview(null);

        if (onSubmitSuccess) {
          onSubmitSuccess(data);
        }

        setTimeout(() => {
          onClose();
        }, 1500);
      },
      onError: (error) => {
        console.error("Error submitting review:", error);
        toast.error(error.message || "حدث خطأ في إرسال التقييم");
      },
    });
  };

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
                ? `تقييمك لـ "${linkedAlbum.title}"`
                : "نحن نقدر تقييمك ونتطلع لسماع رأيك"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={loading}
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <User size={16} className="inline ml-1" />
              اسمك *
            </label>
            <input
              type="text"
              value={formData.author_name}
              onChange={(e) => handleInputChange("author_name", e.target.value)}
              placeholder="أدخل اسمك الكريم"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent transition-colors"
              maxLength={100}
              disabled={loading}
              required
            />
          </div>

          {!linkedAlbum && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                المنتج (اختياري)
              </label>
              {albumsLoading ? (
                <div className="text-center py-4 text-gray-500">
                  جاري تحميل المنتجات...
                </div>
              ) : (
                <>
                  <select
                    value={selectedAlbum || ""}
                    onChange={(e) => handleAlbumSelection(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent transition-colors"
                    disabled={loading}
                  >
                    <option value="">اختر منتج (اختياري)</option>
                    {albums.map((album) => (
                      <option key={album.id} value={album.id}>
                        {album.title}
                      </option>
                    ))}
                  </select>

                  {albumPreview && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg flex items-center gap-3">
                      {albumPreview.cover_image && (
                        <img
                          src={albumPreview.cover_image}
                          alt={albumPreview.title}
                          className="w-16 h-16 object-cover rounded"
                        />
                      )}
                      <div>
                        <p className="font-medium text-purple">
                          {albumPreview.title}
                        </p>
                        <p className="text-sm text-gray-600 line-clamp-1">
                          {albumPreview.description}
                        </p>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              التقييم *
            </label>
            <div className="flex flex-col items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <div className="flex gap-2">{renderStars()}</div>
              <span className="text-sm text-gray-600">
                {formData.rating > 0
                  ? `${formData.rating} من 5 نجوم`
                  : "اختر تقييمك"}
              </span>
            </div>
          </div>

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
              disabled={loading}
              required
            />
            <div className="text-sm text-gray-500 text-left mt-1">
              {formData.text.length}/1000
            </div>
          </div>

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
                  id="review-image"
                  disabled={loading}
                />
                <label
                  htmlFor="review-image"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <Upload className="w-12 h-12 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600">اضغط لرفع صورة</span>
                  <span className="text-xs text-gray-400 mt-1">
                    PNG, JPG (حد أقصى 5MB)
                  </span>
                </label>
              </div>
            ) : (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="معاينة"
                  className="w-full h-48 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                  disabled={loading}
                >
                  <X size={16} />
                </button>
              </div>
            )}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="text-blue-500 mt-0.5" size={20} />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">ملاحظة هامة:</p>
                <p>
                  سيتم مراجعة تقييمك قبل النشر للتأكد من جودته. عادة ما يتم
                  الموافقة على التقييمات خلال 24 ساعة.
                </p>
              </div>
            </div>
          </div>

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

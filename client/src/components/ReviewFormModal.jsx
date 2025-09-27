import { useState } from "react";
import { X, Star, Upload } from "lucide-react";
import { reviewsAPI } from "../api/reviews";
import toast from "react-hot-toast";

export default function ReviewFormModal({ onClose, onSuccess, albumId }) {
  const [authorName, setAuthorName] = useState("");
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");
  const [reviewImage, setReviewImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await reviewsAPI.create({
        author_name: authorName,
        rating,
        text,
        linked_album_id: albumId || null,
        review_image: reviewImage,
      });

      if (response.success) {
        toast.success("تم إضافة تقييمك بنجاح 🎉");
        onSuccess(response.data);
        onClose();
      } else {
        toast.error("فشل في إضافة التقييم");
      }
    } catch (err) {
      console.error(err);
      toast.error("حدث خطأ غير متوقع");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#8b5f8c]/70 backdrop-blur-md z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 relative">
        {/* زر الإغلاق */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl font-bold text-purple mb-4">اترك تقييمك</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* الاسم */}
          <div>
            <label className="block text-sm font-medium mb-1">اسمك</label>
            <input
              type="text"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              required
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-purple"
              placeholder="اكتب اسمك هنا"
            />
          </div>

          {/* التقييم */}
          <div>
            <label className="block text-sm font-medium mb-1">التقييم</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={28}
                  className={`cursor-pointer ${
                    star <= rating
                      ? "text-yellow-500 fill-yellow-500"
                      : "text-gray-300"
                  }`}
                  onClick={() => setRating(star)}
                />
              ))}
            </div>
          </div>

          {/* النص */}
          <div>
            <label className="block text-sm font-medium mb-1">ملاحظاتك</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows="4"
              required
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-purple"
              placeholder="شاركنا رأيك عن المنتج..."
            />
          </div>

          {/* صورة اختيارية */}
          <div>
            <label className="block text-sm font-medium mb-1">
              أضف صورة (اختياري)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setReviewImage(e.target.files[0])}
              className="block w-full text-sm text-gray-600 cursor-pointer"
            />
          </div>

          {/* زر الإرسال */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple text-white py-3 rounded-lg font-semibold hover:bg-purple-hover transition disabled:opacity-50"
          >
            {loading ? "جاري الإرسال..." : "إرسال التقييم"}
          </button>
        </form>
      </div>
    </div>
  );
}

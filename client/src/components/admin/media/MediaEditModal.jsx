// client/src/components/admin/media/MediaEditModal.jsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Save, Star } from "lucide-react";
import Button from "../../common/Button";

/**
 * نافذة تعديل الوسائط
 * @param {boolean} isOpen - حالة فتح النافذة
 * @param {Function} onClose - دالة إغلاق النافذة
 * @param {Object} media - بيانات الوسائط المراد تعديلها
 * @param {Function} onUpdate - دالة حفظ التحديثات
 */
const MediaEditModal = ({ isOpen, onClose, media, onUpdate }) => {
  const [formData, setFormData] = useState({
    alt: "",
    is_cover: false,
  });
  const [saving, setSaving] = useState(false);

  // تحديث البيانات عند تغيير الوسائط
  useEffect(() => {
    if (media) {
      setFormData({
        alt: media.alt || "",
        is_cover: media.is_cover || false,
      });
    }
  }, [media]);

  /**
   * معالجة حفظ التعديلات
   */
  const handleSave = async (e) => {
    e.preventDefault();
    
    if (!media) return;

    setSaving(true);
    try {
      await onUpdate(media.id, formData);
      onClose();
    } catch (error) {
      console.error("Error updating media:", error);
    } finally {
      setSaving(false);
    }
  };

  /**
   * معالجة تغيير قيم النموذج
   */
  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (!isOpen || !media) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          {/* رأس النافذة */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">
              تعديل الوسائط
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* محتوى النافذة */}
          <form onSubmit={handleSave} className="p-6">
            {/* معاينة الصورة */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                معاينة الصورة
              </label>
              <div className="relative">
                <img
                  src={media.url}
                  alt={media.alt || "معاينة"}
                  className="w-full h-48 object-cover rounded-lg border"
                  loading="lazy"
                />
                {media.is_cover && (
                  <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded-md text-xs flex items-center">
                    <Star className="w-3 h-3 ml-1" />
                    صورة الغلاف
                  </div>
                )}
              </div>
            </div>

            {/* وصف الصورة */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                وصف الصورة (Alt Text)
              </label>
              <textarea
                value={formData.alt}
                onChange={(e) => handleChange('alt', e.target.value)}
                placeholder="أدخل وصف للصورة..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent resize-none"
              />
              <p className="text-xs text-gray-500 mt-1">
                الوصف يساعد في تحسين محركات البحث وإمكانية الوصول
              </p>
            </div>

            {/* صورة الغلاف */}
            <div className="mb-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.is_cover}
                  onChange={(e) => handleChange('is_cover', e.target.checked)}
                  className="w-4 h-4 text-purple border-gray-300 rounded focus:ring-purple"
                />
                <span className="mr-2 text-sm font-medium text-gray-700">
                  جعل هذه الصورة غلاف الألبوم
                </span>
              </label>
              <p className="text-xs text-gray-500 mt-1 mr-6">
                صورة الغلاف ستظهر كمعاينة للألبوم في الصفحة الرئيسية
              </p>
            </div>

            {/* معلومات إضافية */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                معلومات الملف
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">تاريخ الرفع:</span>
                  <br />
                  <span className="font-medium">
                    {new Date(media.created_at).toLocaleDateString('ar-SA')}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">الترتيب:</span>
                  <br />
                  <span className="font-medium">
                    #{media.order_index || 'غير محدد'}
                  </span>
                </div>
              </div>
            </div>

            {/* أزرار التحكم */}
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={saving}
              >
                إلغاء
              </Button>
              <Button
                type="submit"
                loading={saving}
                disabled={saving}
                className="px-6"
              >
                <Save className="w-4 h-4 ml-2" />
                {saving ? "جاري الحفظ..." : "حفظ التعديلات"}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default MediaEditModal;
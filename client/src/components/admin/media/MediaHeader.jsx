// client/src/components/admin/media/MediaHeader.jsx
import { useState } from "react";
import { ArrowRight, Camera, Edit, Check, X } from "lucide-react";
import Button from "../../common/Button";

/**
 * مكون رأس صفحة إدارة الوسائط مع إمكانية تعديل اسم الألبوم
 * @param {Object} album - بيانات الألبوم
 * @param {Function} onBackClick - دالة العودة للصفحة السابقة
 * @param {Function} onAlbumUpdate - دالة تحديث بيانات الألبوم
 */
const MediaHeader = ({ album, onBackClick, onAlbumUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(album?.title || "");
  const [isUpdating, setIsUpdating] = useState(false);

  /**
   * بدء تعديل اسم الألبوم
   */
  const startEditing = () => {
    setEditedTitle(album?.title || "");
    setIsEditing(true);
  };

  /**
   * إلغاء التعديل
   */
  const cancelEditing = () => {
    setEditedTitle(album?.title || "");
    setIsEditing(false);
  };

  /**
   * حفظ اسم الألبوم الجديد
   */
  const saveTitle = async () => {
    if (!editedTitle.trim()) {
      return;
    }

    if (editedTitle.trim() === album?.title) {
      setIsEditing(false);
      return;
    }

    setIsUpdating(true);

    try {
      const success = await onAlbumUpdate(editedTitle.trim());
      if (success) {
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Error updating album title:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  /**
   * معالجة الضغط على Enter أو Escape
   */
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      saveTitle();
    } else if (e.key === "Escape") {
      cancelEditing();
    }
  };

  return (
    <div className="mb-6">
      {/* زر العودة */}
      <Button
        variant="outline"
        onClick={onBackClick}
        className="mb-4 flex items-center"
      >
        <ArrowRight className="w-4 h-4 ml-2" />
        العودة للألبومات
      </Button>

      {/* عنوان الصفحة */}
      <div className="flex items-center justify-between">
        <div className="flex items-center flex-1">
          <Camera className="w-8 h-8 text-purple ml-3 flex-shrink-0" />
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-800 mb-1">
              إدارة صور الألبوم
            </h1>

            {/* اسم الألبوم - قابل للتعديل */}
            <div className="flex items-center gap-2">
              <span className="text-gray-600">الألبوم:</span>

              {isEditing ? (
                <div className="flex items-center gap-2 flex-1">
                  <input
                    type="text"
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    onKeyDown={handleKeyPress}
                    className="flex-1 max-w-md px-3 py-1 border border-purple rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent text-purple font-semibold"
                    placeholder="اسم الألبوم"
                    autoFocus
                    disabled={isUpdating}
                  />

                  <div className="flex gap-1">
                    <button
                      onClick={saveTitle}
                      disabled={isUpdating || !editedTitle.trim()}
                      className="p-1 text-green-600 hover:bg-green-100 rounded transition-colors disabled:opacity-50"
                      title="حفظ"
                    >
                      <Check size={16} />
                    </button>

                    <button
                      onClick={cancelEditing}
                      disabled={isUpdating}
                      className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors disabled:opacity-50"
                      title="إلغاء"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 group">
                  <span className="font-semibold text-purple">
                    {album?.title || "غير محدد"}
                  </span>

                  <button
                    onClick={startEditing}
                    className="p-1 text-gray-400 hover:text-purple opacity-0 group-hover:opacity-100 transition-all duration-200"
                    title="تعديل اسم الألبوم"
                  >
                    <Edit size={14} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* معلومات إضافية */}
        {album && (
          <div className="hidden md:flex items-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Camera size={16} />
              <span>{album.media?.length || 0} صورة</span>
            </div>

            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>نشط</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaHeader;

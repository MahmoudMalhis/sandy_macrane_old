// client/src/components/admin/media/MediaStats.jsx
import { Image as ImageIcon, CheckSquare, Eye } from "lucide-react";

/**
 * مكون عرض إحصائيات الوسائط
 * @param {number} totalMedia - إجمالي عدد الوسائط
 * @param {number} selectedCount - عدد الوسائط المحددة
 * @param {string} albumTitle - عنوان الألبوم
 */
const MediaStats = ({ totalMedia, selectedCount, albumTitle }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      {/* إجمالي الصور */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">إجمالي الصور</p>
            <p className="text-3xl font-bold text-gray-800">{totalMedia}</p>
          </div>
          <div className="bg-blue-500 p-3 rounded-full">
            <ImageIcon size={24} className="text-white" />
          </div>
        </div>
      </div>

      {/* الصور المحددة */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">محدد</p>
            <p className="text-3xl font-bold text-purple">{selectedCount}</p>
          </div>
          <div className="bg-purple p-3 rounded-full">
            <CheckSquare size={24} className="text-white" />
          </div>
        </div>
      </div>

      {/* معلومات الألبوم */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">الألبوم</p>
            <p className="text-lg font-bold text-gray-800 truncate">
              {albumTitle || "غير محدد"}
            </p>
          </div>
          <div className="bg-green-500 p-3 rounded-full">
            <Eye size={24} className="text-white" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaStats;

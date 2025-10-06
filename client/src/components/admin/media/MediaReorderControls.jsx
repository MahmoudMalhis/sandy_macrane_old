import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUp,
  ArrowDown,
  ChevronsUp,
  ChevronsDown,
  RotateCcw,
  SortAsc,
  SortDesc,
  Calendar,
  Type,
  HardDrive,
  Settings,
} from "lucide-react";
import Button from "../../common/Button";

/**
 * مكون أدوات التحكم المتقدمة في ترتيب الوسائط
 * @param {Object} mediaReorder - Hook إدارة الترتيب
 * @param {number} selectedItemId - معرف العنصر المحدد
 * @param {boolean} hasSelection - هل يوجد عنصر محدد
 */
const MediaReorderControls = ({
  mediaReorder,
  selectedItemId,
  hasSelection,
}) => {
  const [showAdvancedControls, setShowAdvancedControls] = useState(false);
  const [sortMenuOpen, setSortMenuOpen] = useState(false);

  const {
    moveItemForward,
    moveItemBackward,
    moveItemToStart,
    moveItemToEnd,
    resetOrder,
    autoSort,
    getItemPosition,
    canMoveForward,
    canMoveBackward,
    hasChanges,
    isReordering,
    totalItems,
  } = mediaReorder;

  /**
   * خيارات الترتيب التلقائي
   */
  const sortOptions = [
    {
      key: "name",
      label: "حسب الاسم",
      icon: Type,
      description: "ترتيب أبجدي حسب اسم الملف",
    },
    {
      key: "date",
      label: "حسب التاريخ",
      icon: Calendar,
      description: "الأحدث أولاً",
    },
    {
      key: "size",
      label: "حسب الحجم",
      icon: HardDrive,
      description: "الأكبر أولاً",
    },
  ];

  /**
   * معالجة الترتيب التلقائي
   */
  const handleAutoSort = async (sortBy) => {
    setSortMenuOpen(false);
    await autoSort(sortBy);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 border-t border-gray-200">
      {/* العنوان والمعلومات */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Settings className="w-5 h-5 text-purple" />
          <h3 className="font-semibold text-gray-800">أدوات إعادة الترتيب</h3>

          {hasSelection && selectedItemId && (
            <span className="bg-purple text-white text-xs px-2 py-1 rounded-full">
              موضع {getItemPosition(selectedItemId)} من {totalItems}
            </span>
          )}
        </div>

        {hasChanges && (
          <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">
            تم التعديل
          </span>
        )}
      </div>

      {/* أدوات التحكم الأساسية */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 mb-4">
        {/* نقل للأعلى خطوة واحدة */}
        <Button
          size="sm"
          variant="outline"
          onClick={() => moveItemBackward(selectedItemId)}
          disabled={
            !hasSelection || !canMoveBackward(selectedItemId) || isReordering
          }
          className="flex items-center gap-1"
          title="نقل خطوة للأعلى"
        >
          <ArrowUp className="w-4 h-4" />
          <span className="hidden sm:inline">أعلى</span>
        </Button>

        {/* نقل للأسفل خطوة واحدة */}
        <Button
          size="sm"
          variant="outline"
          onClick={() => moveItemForward(selectedItemId)}
          disabled={
            !hasSelection || !canMoveForward(selectedItemId) || isReordering
          }
          className="flex items-center gap-1"
          title="نقل خطوة للأسفل"
        >
          <ArrowDown className="w-4 h-4" />
          <span className="hidden sm:inline">أسفل</span>
        </Button>

        {/* نقل إلى البداية */}
        <Button
          size="sm"
          variant="outline"
          onClick={() => moveItemToStart(selectedItemId)}
          disabled={
            !hasSelection || !canMoveBackward(selectedItemId) || isReordering
          }
          className="flex items-center gap-1"
          title="نقل إلى البداية"
        >
          <ChevronsUp className="w-4 h-4" />
          <span className="hidden sm:inline">البداية</span>
        </Button>

        {/* نقل إلى النهاية */}
        <Button
          size="sm"
          variant="outline"
          onClick={() => moveItemToEnd(selectedItemId)}
          disabled={
            !hasSelection || !canMoveForward(selectedItemId) || isReordering
          }
          className="flex items-center gap-1"
          title="نقل إلى النهاية"
        >
          <ChevronsDown className="w-4 h-4" />
          <span className="hidden sm:inline">النهاية</span>
        </Button>

        {/* إعادة تعيين */}
        <Button
          size="sm"
          variant="outline"
          onClick={resetOrder}
          disabled={!hasChanges || isReordering}
          className="flex items-center gap-1"
          title="إعادة تعيين الترتيب"
        >
          <RotateCcw className="w-4 h-4" />
          <span className="hidden sm:inline">إعادة تعيين</span>
        </Button>

        {/* أدوات متقدمة */}
        <Button
          size="sm"
          variant="outline"
          onClick={() => setShowAdvancedControls(!showAdvancedControls)}
          className="flex items-center gap-1"
          title="أدوات متقدمة"
        >
          <Settings className="w-4 h-4" />
          <span className="hidden sm:inline">متقدم</span>
        </Button>
      </div>

      {/* الأدوات المتقدمة */}
      <AnimatePresence>
        {showAdvancedControls && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-gray-200 pt-4"
          >
            {/* قسم الترتيب التلقائي */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                ترتيب تلقائي
              </h4>

              <div className="relative">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setSortMenuOpen(!sortMenuOpen)}
                  disabled={isReordering}
                  className="flex items-center gap-2"
                >
                  <SortAsc className="w-4 h-4" />
                  اختر نوع الترتيب
                </Button>

                <AnimatePresence>
                  {sortMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-64"
                    >
                      {sortOptions.map((option) => {
                        const IconComponent = option.icon;
                        return (
                          <button
                            key={option.key}
                            onClick={() => handleAutoSort(option.key)}
                            disabled={isReordering}
                            className="w-full text-right px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 disabled:opacity-50"
                          >
                            <div className="flex items-center gap-3">
                              <IconComponent className="w-4 h-4 text-purple" />
                              <div className="flex-1">
                                <p className="font-medium text-gray-800">
                                  {option.label}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {option.description}
                                </p>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* معلومات إضافية */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <h4 className="text-sm font-semibold text-blue-800 mb-2">
                💡 نصائح للترتيب:
              </h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• اسحب الصور مباشرة لترتيبها يدوياً</li>
                <li>• اختر صورة ثم استخدم الأزرار للنقل السريع</li>
                <li>• استخدم الترتيب التلقائي لتنظيم سريع</li>
                <li>• الصورة الأولى ستكون الغلاف الافتراضي</li>
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* مؤشر حالة الترتيب */}
      <AnimatePresence>
        {isReordering && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center gap-2 mt-4 p-3 bg-purple-50 border border-purple-200 rounded-lg"
          >
            <div className="w-4 h-4 border-2 border-purple border-t-transparent rounded-full animate-spin"></div>
            <span className="text-purple font-medium">
              جاري حفظ الترتيب الجديد...
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MediaReorderControls;

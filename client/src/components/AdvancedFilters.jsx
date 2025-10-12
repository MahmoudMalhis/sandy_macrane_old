// client/src/components/AdvancedFilters.jsx
import { useState } from "react";
import { X, Search, Calendar, SlidersHorizontal } from "lucide-react";

export default function AdvancedFilters({
  onFilterChange,
  filterOptions = {},
  initialFilters = {},
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState(initialFilters);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);

  // تطبيق الفلاتر
  const applyFilters = () => {
    onFilterChange(filters);
    setIsOpen(false);

    // حساب عدد الفلاتر النشطة
    const count = Object.values(filters).filter(
      (val) => val && val !== "" && val !== "all"
    ).length;
    setActiveFiltersCount(count);
  };

  // إعادة تعيين الفلاتر
  const resetFilters = () => {
    const emptyFilters = Object.keys(filters).reduce((acc, key) => {
      acc[key] = "";
      return acc;
    }, {});

    setFilters(emptyFilters);
    onFilterChange(emptyFilters);
    setActiveFiltersCount(0);
    setIsOpen(false);
  };

  // تحديث فلتر معين
  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="relative">
      {/* زر الفلتر */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
      >
        <SlidersHorizontal size={20} className="text-gray-600" />
        <span className="text-gray-700">فلاتر متقدمة</span>
        {activeFiltersCount > 0 && (
          <span className="bg-purple text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {activeFiltersCount}
          </span>
        )}
      </button>

      {/* نافذة الفلاتر */}
      {isOpen && (
        <>
          {/* خلفية شفافة للإغلاق */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          ></div>

          {/* محتوى الفلاتر */}
          <div className="absolute left-0 mt-2 w-96 bg-white rounded-lg shadow-2xl z-50 border border-gray-200">
            {/* رأس الفلاتر */}
            <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-purple to-pink">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">
                  الفلاتر المتقدمة
                </h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:bg-white/20 rounded p-1"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* محتوى الفلاتر */}
            <div className="p-4 max-h-96 overflow-y-auto space-y-4">
              {/* فلتر البحث */}
              {filterOptions.search && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    البحث
                  </label>
                  <div className="relative">
                    <Search
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <input
                      type="text"
                      value={filters.search || ""}
                      onChange={(e) => updateFilter("search", e.target.value)}
                      placeholder="ابحث..."
                      className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
                    />
                  </div>
                </div>
              )}

              {/* فلتر الحالة */}
              {filterOptions.status && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الحالة
                  </label>
                  <select
                    value={filters.status || ""}
                    onChange={(e) => updateFilter("status", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
                  >
                    <option value="">الكل</option>
                    {filterOptions.status.map((status) => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* فلتر التاريخ من */}
              {filterOptions.dateFrom && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    من تاريخ
                  </label>
                  <div className="relative">
                    <Calendar
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <input
                      type="date"
                      value={filters.dateFrom || ""}
                      onChange={(e) => updateFilter("dateFrom", e.target.value)}
                      className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
                    />
                  </div>
                </div>
              )}

              {/* فلتر التاريخ إلى */}
              {filterOptions.dateTo && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    إلى تاريخ
                  </label>
                  <div className="relative">
                    <Calendar
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <input
                      type="date"
                      value={filters.dateTo || ""}
                      onChange={(e) => updateFilter("dateTo", e.target.value)}
                      className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
                    />
                  </div>
                </div>
              )}

              {/* فلتر الفئة */}
              {filterOptions.category && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الفئة
                  </label>
                  <select
                    value={filters.category || ""}
                    onChange={(e) => updateFilter("category", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
                  >
                    <option value="">الكل</option>
                    {filterOptions.category.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* فلتر الترتيب */}
              {filterOptions.sortBy && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ترتيب حسب
                  </label>
                  <select
                    value={filters.sortBy || ""}
                    onChange={(e) => updateFilter("sortBy", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
                  >
                    {filterOptions.sortBy.map((sort) => (
                      <option key={sort.value} value={sort.value}>
                        {sort.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* فلتر التقييم */}
              {filterOptions.rating && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    التقييم
                  </label>
                  <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((rating) => (
                      <label
                        key={rating}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="rating"
                          value={rating}
                          checked={filters.rating === rating.toString()}
                          onChange={(e) =>
                            updateFilter("rating", e.target.value)
                          }
                          className="text-purple focus:ring-purple"
                        />
                        <span className="text-sm text-gray-700">
                          {"⭐".repeat(rating)}{" "}
                          {rating === 5 ? "فأكثر" : `و أكثر`}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* أزرار التحكم */}
            <div className="p-4 border-t border-gray-200 bg-gray-50 flex gap-2">
              <button
                onClick={resetFilters}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                إعادة تعيين
              </button>
              <button
                onClick={applyFilters}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-purple to-pink text-white rounded-lg hover:opacity-90 transition-opacity duration-200"
              >
                تطبيق
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

import { useState } from "react";
import {
  Search,
  Filter,
  X,
  Calendar,
  Star,
  Tag,
  SlidersHorizontal,
} from "lucide-react";

/**
 * مكون فلترة متقدم قابل لإعادة الاستخدام
 */
export default function AdvancedFilters({
  onFilterChange,
  filterConfig = {},
  initialFilters = {},
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState(initialFilters);
  const [searchTerm, setSearchTerm] = useState("");

  // تطبيق الفلاتر
  const applyFilters = () => {
    const activeFilters = {
      search: searchTerm,
      ...Object.fromEntries(
        Object.entries(filters).filter(
          ([_, value]) => value !== "" && value !== null && value !== undefined
        )
      ),
    };
    onFilterChange(activeFilters);
    setIsOpen(false);
  };

  // إعادة تعيين الفلاتر
  const resetFilters = () => {
    setFilters(initialFilters);
    setSearchTerm("");
    onFilterChange({ search: "" });
  };

  // حساب عدد الفلاتر النشطة
  const activeFiltersCount =
    Object.values(filters).filter(
      (v) => v !== "" && v !== null && v !== undefined
    ).length + (searchTerm ? 1 : 0);

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 mb-6" dir="rtl">
      {/* شريط البحث والفلاتر */}
      <div className="flex gap-3">
        {/* مربع البحث */}
        <div className="flex-1 relative">
          <Search
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="ابحث..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && applyFilters()}
            className="w-full pr-10 pl-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
          />
        </div>

        {/* زر الفلاتر */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-2 px-4 py-2.5 border rounded-lg transition-all ${
            activeFiltersCount > 0
              ? "border-purple-500 bg-purple-50 text-purple-600"
              : "border-gray-300 hover:bg-gray-50 text-gray-700"
          }`}
        >
          <SlidersHorizontal size={20} />
          <span className="font-medium">فلتر</span>
          {activeFiltersCount > 0 && (
            <span className="bg-purple-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              {activeFiltersCount}
            </span>
          )}
        </button>

        {/* زر البحث */}
        <button
          onClick={applyFilters}
          className="px-6 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
        >
          بحث
        </button>
      </div>

      {/* بانل الفلاتر المتقدمة */}
      {isOpen && (
        <div className="mt-4 pt-4 border-t border-gray-200 animate-fadeIn">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* فلتر الحالة */}
            {filterConfig.status && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الحالة
                </label>
                <select
                  value={filters.status || ""}
                  onChange={(e) =>
                    setFilters({ ...filters, status: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                >
                  <option value="">الكل</option>
                  {filterConfig.status.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* فلتر الفئة */}
            {filterConfig.category && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Tag size={16} className="inline ml-1" />
                  الفئة
                </label>
                <select
                  value={filters.category || ""}
                  onChange={(e) =>
                    setFilters({ ...filters, category: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                >
                  <option value="">الكل</option>
                  {filterConfig.category.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* فلتر التقييم */}
            {filterConfig.rating && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Star size={16} className="inline ml-1" />
                  التقييم
                </label>
                <select
                  value={filters.rating || ""}
                  onChange={(e) =>
                    setFilters({ ...filters, rating: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                >
                  <option value="">الكل</option>
                  <option value="5">5 نجوم</option>
                  <option value="4">4 نجوم فأكثر</option>
                  <option value="3">3 نجوم فأكثر</option>
                </select>
              </div>
            )}

            {/* فلتر التاريخ - من */}
            {filterConfig.dateRange && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar size={16} className="inline ml-1" />
                  من تاريخ
                </label>
                <input
                  type="date"
                  value={filters.dateFrom || ""}
                  onChange={(e) =>
                    setFilters({ ...filters, dateFrom: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                />
              </div>
            )}

            {/* فلتر التاريخ - إلى */}
            {filterConfig.dateRange && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar size={16} className="inline ml-1" />
                  إلى تاريخ
                </label>
                <input
                  type="date"
                  value={filters.dateTo || ""}
                  onChange={(e) =>
                    setFilters({ ...filters, dateTo: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                />
              </div>
            )}

            {/* فلتر مخصص */}
            {filterConfig.custom &&
              filterConfig.custom.map((customFilter) => (
                <div key={customFilter.key}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {customFilter.icon && (
                      <customFilter.icon size={16} className="inline ml-1" />
                    )}
                    {customFilter.label}
                  </label>
                  {customFilter.type === "select" ? (
                    <select
                      value={filters[customFilter.key] || ""}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          [customFilter.key]: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                    >
                      <option value="">الكل</option>
                      {customFilter.options.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={customFilter.type || "text"}
                      value={filters[customFilter.key] || ""}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          [customFilter.key]: e.target.value,
                        })
                      }
                      placeholder={customFilter.placeholder}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                    />
                  )}
                </div>
              ))}
          </div>

          {/* أزرار الإجراءات */}
          <div className="flex justify-between mt-4 pt-4 border-t border-gray-200">
            <button
              onClick={resetFilters}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={18} />
              <span>إعادة تعيين</span>
            </button>

            <button
              onClick={applyFilters}
              className="flex items-center gap-2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
            >
              <Filter size={18} />
              <span>تطبيق الفلاتر</span>
            </button>
          </div>
        </div>
      )}

      {/* عرض الفلاتر النشطة */}
      {activeFiltersCount > 0 && !isOpen && (
        <div className="mt-3 flex flex-wrap gap-2">
          {searchTerm && (
            <FilterChip
              label={`البحث: ${searchTerm}`}
              onRemove={() => {
                setSearchTerm("");
                applyFilters();
              }}
            />
          )}
          {Object.entries(filters).map(([key, value]) => {
            if (!value) return null;

            let label = `${key}: ${value}`;

            // تخصيص العرض حسب نوع الفلتر
            if (key === "status") {
              const option = filterConfig.status?.find(
                (o) => o.value === value
              );
              label = `الحالة: ${option?.label || value}`;
            } else if (key === "category") {
              const option = filterConfig.category?.find(
                (o) => o.value === value
              );
              label = `الفئة: ${option?.label || value}`;
            } else if (key === "rating") {
              label = `التقييم: ${value}⭐`;
            }

            return (
              <FilterChip
                key={key}
                label={label}
                onRemove={() => {
                  const newFilters = { ...filters };
                  delete newFilters[key];
                  setFilters(newFilters);
                  applyFilters();
                }}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

/**
 * مكون Chip للفلتر النشط
 */
function FilterChip({ label, onRemove }) {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-100 text-purple-700 rounded-full text-sm">
      <span>{label}</span>
      <button
        onClick={onRemove}
        className="hover:bg-purple-200 rounded-full p-0.5 transition-colors"
      >
        <X size={14} />
      </button>
    </div>
  );
}

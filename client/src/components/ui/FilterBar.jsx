import { useState } from "react";
import { Search, Filter, X, RefreshCw } from "lucide-react";
import AnimatedSection from "./AnimatedSection";

export default function FilterBar({
  searchTerm = "",
  onSearchChange,
  filters = [],
  activeFilters = {},
  onFilterChange,
  onResetFilters,
  resultCount,
  totalCount,
  sortOptions = [],
  sortBy = "",
  onSortChange,
  className = "",
  showResults = true,
  placeholder = "البحث...",
  layout = "grid", // grid, inline
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  const hasActiveFilters = () => {
    return (
      Object.values(activeFilters).some(
        (value) =>
          value !== "" &&
          value !== "all" &&
          value !== null &&
          value !== undefined
      ) || searchTerm !== ""
    );
  };

  const getActiveFiltersCount = () => {
    return (
      Object.values(activeFilters).filter(
        (value) =>
          value !== "" &&
          value !== "all" &&
          value !== null &&
          value !== undefined
      ).length + (searchTerm ? 1 : 0)
    );
  };

  const FilterButton = ({ filter, value, onChange }) => {
    if (filter.type === "buttons") {
      return (
        <div className="flex gap-2 flex-wrap">
          {filter.options.map((option) => (
            <button
              key={option.value}
              onClick={() => onChange(option.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 cursor-pointer ${
                value === option.value
                  ? "bg-purple text-white shadow-lg transform scale-105"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {option.label}
              {option.count !== undefined && (
                <span className="ml-2 text-xs opacity-75">
                  ({option.count})
                </span>
              )}
            </button>
          ))}
        </div>
      );
    }

    return (
      <select
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple focus:border-transparent"
      >
        {filter.options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
            {option.count !== undefined && ` (${option.count})`}
          </option>
        ))}
      </select>
    );
  };

  const renderFilters = () => {
    if (layout === "inline") {
      return (
        <div className="flex flex-wrap items-center gap-4">
          {/* Search */}
          <div className="relative flex-1 min-w-64">
            <input
              type="text"
              placeholder={placeholder}
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-4 pr-10 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple focus:border-transparent"
            />
            <Search
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            {searchTerm && (
              <button
                onClick={() => onSearchChange("")}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Filters */}
          {filters.map((filter, index) => (
            <div key={filter.key} className="min-w-48">
              {filter.type === "buttons" ? (
                <FilterButton
                  filter={filter}
                  value={activeFilters[filter.key]}
                  onChange={(value) => onFilterChange(filter.key, value)}
                />
              ) : (
                <FilterButton
                  filter={filter}
                  value={activeFilters[filter.key]}
                  onChange={(value) => onFilterChange(filter.key, value)}
                />
              )}
            </div>
          ))}

          {/* Sort */}
          {sortOptions.length > 0 && (
            <div className="min-w-48">
              <select
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple focus:border-transparent"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Search Bar */}
        <div className="relative max-w-md mx-auto">
          <input
            type="text"
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-4 pr-10 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple focus:border-transparent"
          />
          <Search
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          {searchTerm && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Filter Toggle Button for Mobile */}
        <div className="flex items-center justify-between lg:hidden">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 px-4 py-2 bg-purple text-white rounded-lg"
          >
            <Filter size={20} />
            فلترة ({getActiveFiltersCount()})
          </button>
        </div>

        {/* Filters Grid */}
        <div
          className={`grid gap-4 ${isExpanded || "hidden lg:grid"} ${
            filters.length <= 2
              ? "md:grid-cols-2"
              : filters.length <= 4
              ? "md:grid-cols-2 lg:grid-cols-4"
              : "md:grid-cols-3 lg:grid-cols-5"
          }`}
        >
          {filters.map((filter) => (
            <div key={filter.key}>
              {filter.label && (
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {filter.label}
                </label>
              )}
              <FilterButton
                filter={filter}
                value={activeFilters[filter.key]}
                onChange={(value) => onFilterChange(filter.key, value)}
              />
            </div>
          ))}

          {/* Sort Options */}
          {sortOptions.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ترتيب
              </label>
              <select
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple focus:border-transparent"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <AnimatedSection
      className={`bg-white rounded-2xl shadow-lg p-6 ${className}`}
      direction="fade"
    >
      {renderFilters()}

      {/* Active Filters Display */}
      {hasActiveFilters() && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm text-gray-600">الفلاتر النشطة:</span>

              {searchTerm && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                  البحث: "{searchTerm}"
                  <button
                    onClick={() => onSearchChange("")}
                    className="ml-1 hover:bg-blue-200 rounded-full w-4 h-4 flex items-center justify-center"
                  >
                    <X size={12} />
                  </button>
                </span>
              )}

              {Object.entries(activeFilters).map(([key, value]) => {
                if (!value || value === "all" || value === "") return null;
                const filter = filters.find((f) => f.key === key);
                const option = filter?.options?.find((o) => o.value === value);
                if (!option) return null;

                return (
                  <span
                    key={key}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-purple text-white text-sm rounded-full"
                  >
                    {filter.label}: {option.label}
                    <button
                      onClick={() => onFilterChange(key, "all")}
                      className="ml-1 hover:bg-purple-600 rounded-full w-4 h-4 flex items-center justify-center"
                    >
                      <X size={12} />
                    </button>
                  </span>
                );
              })}
            </div>

            <button
              onClick={onResetFilters}
              className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm"
            >
              <RefreshCw size={16} />
              مسح الكل
            </button>
          </div>
        </div>
      )}

      {/* Results Count */}
      {showResults && resultCount !== undefined && totalCount !== undefined && (
        <div className="mt-4 text-center text-sm text-gray-600">
          عرض {resultCount} من أصل {totalCount} عنصر
          {resultCount !== totalCount && (
            <span className="text-purple font-medium"> (مفلتر)</span>
          )}
        </div>
      )}
    </AnimatedSection>
  );
}

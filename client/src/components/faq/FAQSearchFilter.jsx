/* eslint-disable no-unused-vars */
// client/src/components/faq/FAQSearchFilter.jsx
import { motion } from "framer-motion";
import {
  Search,
  HelpCircle,
  Clock,
  DollarSign,
  Truck,
  Palette,
  Ruler,
  Star,
  Shield,
  RefreshCw,
} from "lucide-react";

const FAQSearchFilter = ({
  searchTerm,
  setSearchTerm,
  activeCategory,
  setActiveCategory,
  filteredCount,
  totalCount,
  isVisible,
}) => {
  // فئات الأسئلة
  const categories = [
    { id: "all", name: "جميع الأسئلة", icon: HelpCircle },
    { id: "general", name: "عام", icon: HelpCircle },
    { id: "orders", name: "الطلبات", icon: Clock },
    { id: "pricing", name: "الأسعار", icon: DollarSign },
    { id: "shipping", name: "الشحن", icon: Truck },
    { id: "customization", name: "التخصيص", icon: Palette },
    { id: "sizing", name: "المقاسات", icon: Ruler },
    { id: "materials", name: "الخامات", icon: Star },
    { id: "care", name: "العناية", icon: Shield },
    { id: "returns", name: "الإرجاع", icon: RefreshCw },
  ];

  const resetFilters = () => {
    setSearchTerm("");
    setActiveCategory("all");
  };

  return (
    <>
      {/* أدوات البحث والفلترة */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl shadow-lg p-6 mb-8"
      >
        <div className="grid lg:grid-cols-4 gap-6">
          {/* مربع البحث */}
          <div className="lg:col-span-2">
            <div className="relative">
              <Search
                className="absolute right-3 top-3 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="ابحث في الأسئلة والإجابات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-12 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute left-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              )}
            </div>
          </div>

          {/* زر إعادة التعيين */}
          <div className="flex gap-2">
            <button
              onClick={resetFilters}
              className="flex-1 px-4 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm flex items-center justify-center gap-2"
            >
              <RefreshCw size={16} />
              إعادة تعيين
            </button>
          </div>

          {/* عدد النتائج */}
          <div className="flex items-center justify-center text-gray-600">
            <span className="text-sm">
              {filteredCount} سؤال من أصل {totalCount}
            </span>
          </div>
        </div>

        {/* عرض الفلاتر النشطة */}
        {(searchTerm || activeCategory !== "all") && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm text-gray-600">الفلاتر النشطة:</span>

              {activeCategory !== "all" && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple text-white text-sm rounded-full">
                  {categories.find((cat) => cat.id === activeCategory)?.name}
                  <button
                    onClick={() => setActiveCategory("all")}
                    className="ml-1 hover:bg-purple-600 rounded-full w-4 h-4 flex items-center justify-center"
                  >
                    ×
                  </button>
                </span>
              )}

              {searchTerm && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-500 text-white text-sm rounded-full">
                  البحث: "{searchTerm}"
                  <button
                    onClick={() => setSearchTerm("")}
                    className="ml-1 hover:bg-blue-600 rounded-full w-4 h-4 flex items-center justify-center"
                  >
                    ×
                  </button>
                </span>
              )}
            </div>
          </div>
        )}
      </motion.div>

      {/* فئات الأسئلة */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.3 }}
        className="mb-8"
      >
        <div className="flex flex-wrap gap-3 justify-center">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${
                activeCategory === category.id
                  ? "bg-purple text-white border-purple shadow-lg"
                  : "bg-white text-gray-700 border-gray-300 hover:border-purple hover:text-purple"
              }`}
            >
              <category.icon size={16} />
              <span className="text-sm font-medium">{category.name}</span>
            </button>
          ))}
        </div>
      </motion.div>
    </>
  );
};

export default FAQSearchFilter;

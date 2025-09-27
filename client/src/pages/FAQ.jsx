/* eslint-disable no-unused-vars */
// client/src/pages/FAQ.jsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

// استيراد المكونات الفرعية
import FAQSearchFilter from "../components/faq/FAQSearchFilter";
import FAQQuestions from "../components/faq/FAQQuestions";
import FAQSupportSection from "../components/faq/FAQSupportSection";
import FAQTipsSection from "../components/faq/FAQTipsSection";

const FAQ = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // بيانات الأسئلة للحصول على العدد (يمكن نقلها لملف منفصل أو context)
  const totalFAQsCount = 12;

  // حساب عدد النتائج المفلترة (سيتم تمريرها من FAQQuestions)
  const getFilteredCount = () => {
    // هذا مجرد مثال - في التطبيق الحقيقي ستحصل على هذا من FAQQuestions
    return totalFAQsCount;
  };

  return (
      <div className="min-h-screen bg-beige py-12">
        <div className="container mx-auto px-4 mb-12">
          {/* العنوان الرئيسي */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            className="text-center mb-16"
          >
            <h1 className="text-4xl lg:text-5xl font-bold text-purple mb-4">
              الأسئلة الشائعة
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              إجابات شاملة على جميع الأسئلة التي قد تخطر ببالك حول منتجاتنا
              وخدماتنا
            </p>
            <div className="w-24 h-1 bg-pink mx-auto mt-6 rounded-full"></div>
          </motion.div>

          {/* مكون البحث والفلترة */}
          <FAQSearchFilter
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            filteredCount={getFilteredCount()}
            totalCount={totalFAQsCount}
            isVisible={isVisible}
          />

          {/* مكون الأسئلة */}
          <FAQQuestions
            searchTerm={searchTerm}
            activeCategory={activeCategory}
          />
        </div>

        {/* قسم الاتصال للمساعدة */}
        <FAQSupportSection isVisible={isVisible} />

        {/* نصائح سريعة */}
        <FAQTipsSection isVisible={isVisible} />
      </div>
  );
};

export default FAQ;

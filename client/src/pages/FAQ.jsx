import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import FAQSearchFilter from "../components/faq/FAQSearchFilter";
import FAQQuestions from "../components/faq/FAQQuestions";
import FAQSupportSection from "../components/faq/FAQSupportSection";
import FAQTipsSection from "../components/faq/FAQTipsSection";

const FAQ = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [filteredCount, setFilteredCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleCountChange = (filtered, total) => {
    setFilteredCount(filtered);
    setTotalCount(total);
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
          filteredCount={filteredCount}
          totalCount={totalCount}
          isVisible={isVisible}
        />

        {/* مكون الأسئلة */}
        <FAQQuestions
          searchTerm={searchTerm}
          activeCategory={activeCategory}
          onCountChange={handleCountChange}
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

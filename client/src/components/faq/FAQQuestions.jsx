import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  ChevronUp,
  HelpCircle,
  DollarSign,
  Truck,
  Palette,
  Clock,
  Shield,
  RefreshCw,
  Star,
  Ruler,
} from "lucide-react";
import Button from "../common/Button";
import { settingsAPI } from "../../api/settings";
import Loading from "../../utils/Loading";

const FAQQuestions = ({ searchTerm, activeCategory, onCountChange }) => {
  const [openQuestions, setOpenQuestions] = useState(new Set());
  const [faqData, setFaqData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const categoryIcons = {
    general: HelpCircle,
    orders: Clock,
    pricing: DollarSign,
    shipping: Truck,
    customization: Palette,
    sizing: Ruler,
    materials: Star,
    care: Shield,
    returns: RefreshCw,
  };

  useEffect(() => {
    loadFAQData();
  }, []);

  useEffect(() => {
    if (onCountChange) {
      if (faqData.length === 0) {
        console.log("⚠️ No data yet, setting to 0");
        onCountChange(0, 0);
      } else {
        const filtered = faqData.filter((faq) => {
          const matchesCategory =
            activeCategory === "all" || faq.category === activeCategory;
          const matchesSearch =
            faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
          return matchesCategory && matchesSearch;
        });

        onCountChange(filtered.length, faqData.length);
      }
    } else {
      console.log("❌ No onCountChange callback provided!");
    }
  }, [faqData.length, activeCategory, searchTerm, onCountChange]);

  const loadFAQData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await settingsAPI.getFAQSettingsPublic();

      if (
        response?.success &&
        response?.data?.faqs &&
        response.data.faqs.length > 0
      ) {
        const faqs = response.data.faqs.map((faq) => ({
          ...faq,
          icon: categoryIcons[faq.category] || HelpCircle,
        }));
        setFaqData(faqs);

        if (onCountChange) {
          onCountChange(faqs.length, faqs.length);
        }
      } else {
        const defaultFaqs = getDefaultFAQs();
        setFaqData(defaultFaqs);

        if (onCountChange) {
          onCountChange(defaultFaqs.length, defaultFaqs.length);
        }
      }
    } catch (err) {
      console.error("Error loading FAQ data:", err);
      setError("فشل في تحميل الأسئلة الشائعة");

      const defaultFaqs = getDefaultFAQs();
      setFaqData(defaultFaqs);

      if (onCountChange) {
        onCountChange(defaultFaqs.length, defaultFaqs.length);
      }
    } finally {
      setLoading(false);
    }
  };

  const getDefaultFAQs = () => [
    {
      id: 1,
      category: "general",
      icon: HelpCircle,
      question: "ما هي المكرمية وما الذي يميزها؟",
      answer:
        "المكرمية هي فن قديم يعتمد على عقد الحبال والخيوط لإنشاء تصاميم جميلة ومتينة. ما يميز منتجاتنا:\n• صناعة يدوية 100% بعناية فائقة\n• استخدام خامات عالية الجودة ومستدامة\n• تصاميم فريدة ومبتكرة\n• إمكانية التخصيص حسب الطلب\n• قطع فنية عملية تجمع بين الجمال والوظيفة",
    },
    {
      id: 2,
      category: "orders",
      icon: Clock,
      question: "كم يستغرق تنفيذ الطلب؟",
      answer:
        "يعتمد وقت التنفيذ على نوع وحجم القطعة:\n• القطع البسيطة: 2-3 أيام\n• القطع المتوسطة: 4-7 أيام\n• القطع الكبيرة والمعقدة: 7-14 يوم\n• الطلبات المخصصة: نناقش المدة معك\n\nسنخبرك بالوقت المتوقع بالضبط عند تأكيد الطلب.",
    },
    {
      id: 3,
      category: "pricing",
      icon: DollarSign,
      question: "كيف يتم حساب أسعار المنتجات؟",
      answer:
        "تعتمد الأسعار على عدة عوامل:\n• حجم القطعة ومقاساتها\n• تعقيد التصميم والتفاصيل\n• نوع الخامات المستخدمة\n• الوقت المستغرق في التنفيذ\n• إضافة تخصيصات خاصة\n\nنضمن لك أسعار تنافسية مقابل جودة عالية وعمل فني متقن.",
    },
  ];

  const filteredFAQs = faqData.filter((faq) => {
    const matchesCategory =
      activeCategory === "all" || faq.category === activeCategory;
    const matchesSearch =
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const toggleQuestion = (questionId) => {
    const newOpenQuestions = new Set(openQuestions);
    if (newOpenQuestions.has(questionId)) {
      newOpenQuestions.delete(questionId);
    } else {
      newOpenQuestions.add(questionId);
    }
    setOpenQuestions(newOpenQuestions);
  };

  const openAllQuestions = () => {
    setOpenQuestions(new Set(filteredFAQs.map((faq) => faq.id)));
  };

  const closeAllQuestions = () => {
    setOpenQuestions(new Set());
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-12">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto py-12">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-600">{error}</p>
          <Button onClick={loadFAQData} variant="secondary" className="mt-4">
            إعادة المحاولة
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Quick control buttons */}
      <div className="flex justify-end gap-2 mb-6">
        <button
          onClick={openAllQuestions}
          className="px-4 py-2 bg-purple text-white rounded-lg hover:bg-purple-600 transition-colors text-sm"
          disabled={filteredFAQs.length === 0}
        >
          فتح الكل ({filteredFAQs.length})
        </button>
        <button
          onClick={closeAllQuestions}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm"
        >
          إغلاق الكل
        </button>
      </div>

      {/* FAQ List */}
      {filteredFAQs.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12 bg-white rounded-xl shadow-lg"
        >
          <HelpCircle className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            لا توجد أسئلة مطابقة
          </h3>
          <p className="text-gray-600 mb-6">
            جرب تغيير كلمات البحث أو اختيار فئة مختلفة
          </p>
        </motion.div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {filteredFAQs.map((faq, index) => (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                <button
                  onClick={() => toggleQuestion(faq.id)}
                  className="w-full px-6 py-4 text-right focus:outline-none group"
                  aria-expanded={openQuestions.has(faq.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="bg-purple bg-opacity-10 p-2 rounded-lg group-hover:bg-opacity-20 transition-colors">
                        <faq.icon className="text-purple" size={20} />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-purple transition-colors">
                        {faq.question}
                      </h3>
                    </div>
                    <div className="text-purple">
                      {openQuestions.has(faq.id) ? (
                        <ChevronUp size={24} />
                      ) : (
                        <ChevronDown size={24} />
                      )}
                    </div>
                  </div>
                </button>

                <AnimatePresence>
                  {openQuestions.has(faq.id) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 pt-2">
                        <div className="bg-gray-50 rounded-lg p-4 border-r-4 border-purple">
                          <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                            {faq.answer}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default FAQQuestions;

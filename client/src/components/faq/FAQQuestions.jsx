import { useEffect, useMemo, useState } from "react";
import { usePublicFAQs } from "../../hooks/queries/useFAQ";
// eslint-disable-next-line no-unused-vars
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
import Loading from "../../utils/Loading";
import Error from "../../utils/Error";

const FAQQuestions = ({ searchTerm, activeCategory, onCountChange }) => {
  const [openQuestions, setOpenQuestions] = useState(new Set());

  const { data: faqResponse, isLoading: loading, isError } = usePublicFAQs();

  const faqData = useMemo(() => faqResponse?.faqs || [], [faqResponse]);

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

  const filteredCount = useMemo(() => {
    if (faqData.length === 0) return 0;

    return faqData.filter((faq) => {
      const matchesCategory =
        activeCategory === "all" || faq.category === activeCategory;
      const matchesSearch =
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    }).length;
  }, [faqData, activeCategory, searchTerm]);

  useEffect(() => {
    if (onCountChange) {
      onCountChange(filteredCount, faqData.length);
    }
  }, [filteredCount, faqData.length, onCountChange]);

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

  if (isError) {
    return <Error />;
  }

  return (
    <div className="max-w-4xl mx-auto">
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
            {filteredFAQs.map((faq, index) => {
              const IconComponent = categoryIcons[faq.category] || HelpCircle;

              return (
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
                          <IconComponent className="text-white" size={20} />
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
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default FAQQuestions;

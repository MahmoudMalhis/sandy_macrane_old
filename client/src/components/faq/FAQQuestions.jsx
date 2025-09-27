/* eslint-disable no-unused-vars */
// client/src/components/faq/FAQQuestions.jsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Clock,
  DollarSign,
  Truck,
  Palette,
  Ruler,
  RefreshCw,
  Shield,
  MessageCircle,
  Star,
} from "lucide-react";
import Button from "../common/Button";

const FAQQuestions = ({ searchTerm, activeCategory }) => {
  const [openQuestions, setOpenQuestions] = useState(new Set());

  // بيانات الأسئلة الشائعة
  const faqData = [
    {
      id: 1,
      category: "general",
      icon: HelpCircle,
      question: "ما هي المكرمية وما الذي يميزها؟",
      answer:
        "المكرمية هي فن قديم يعتمد على عقد الحبال والخيوط لإنشاء تصاميم جميلة. ما يميز منتجاتنا هو الجمع بين التقنيات التقليدية والتصاميم العصرية، مع استخدام خامات عالية الجودة لضمان المتانة والجمال.",
    },
    {
      id: 2,
      category: "orders",
      icon: Clock,
      question: "كم يستغرق تنفيذ الطلب؟",
      answer:
        "يعتمد وقت التنفيذ على نوع وحجم القطعة:\n• القطع البسيطة: 2-3 أيام\n• القطع المتوسطة: 4-7 أيام\n• القطع المعقدة أو الكبيرة: 1-2 أسبوع\n• التصاميم المخصصة: 3-14 يوم حسب التعقيد\n\nسنخبرك بالوقت المحدد عند تأكيد الطلب.",
    },
    {
      id: 3,
      category: "pricing",
      icon: DollarSign,
      question: "كيف يتم حساب أسعار المنتجات؟",
      answer:
        "تعتمد الأسعار على عدة عوامل:\n• حجم القطعة ومقاساتها\n• تعقيد التصميم والتفاصيل\n• نوع الخامات المستخدمة\n• الوقت المطلوب للتنفيذ\n• إضافات خاصة (خرز، ألوان مميزة، إلخ)\n\nنقدم عروض أسعار مجانية لجميع الطلبات.",
    },
    {
      id: 4,
      category: "shipping",
      icon: Truck,
      question: "ما هي خيارات الشحن والتوصيل المتاحة؟",
      answer:
        "نوفر عدة خيارات للتوصيل:\n• التوصيل المحلي في نابلس: مجاني للطلبات فوق 100 شيكل\n• التوصيل داخل فلسطين: 20 شيكل\n• التوصيل للضفة الغربية: 70 شيكل\n• الشحن الدولي: متاح حسب الوجهة (نتحمل التكلفة للطلبات الكبيرة)\n\nنستخدم خدمات شحن موثوقة مع إمكانية تتبع الطلب.",
    },
    {
      id: 5,
      category: "customization",
      icon: Palette,
      question: "هل يمكنني طلب تصميم مخصص؟",
      answer:
        "بالطبع! نتخصص في التصاميم المخصصة:\n• ارسل لنا صورة أو وصف للفكرة\n• سنقوم بإنشاء تصميم أولي مجاني\n• يمكن التعديل حتى الوصول للنتيجة المطلوبة\n• نراعي ألوان الديكور ومقاسات المساحة\n• يمكن إضافة أسماء أو تواريخ مميزة\n\nكل قطعة مخصصة فريدة ولا تتكرر.",
    },
    {
      id: 6,
      category: "sizing",
      icon: Ruler,
      question: "ما هي الأحجام المتاحة للمنتجات؟",
      answer:
        "نصنع جميع الأحجام حسب الطلب:\n• قطع صغيرة: 20×20 سم للديكورات الصغيرة\n• قطع متوسطة: 40×60 سم للطاولات والرفوف\n• قطع كبيرة: 80×100 سم للجدران\n• قطع جدارية كبيرة: حتى 150×200 سم\n• مقاسات خاصة: حسب مساحتك ومتطلباتك\n\nيمكننا قياس المساحة عندك إذا كنت في نابلس.",
    },
    {
      id: 7,
      category: "materials",
      icon: Star,
      question: "ما نوع الخامات التي تستخدمونها؟",
      answer:
        "نستخدم خامات عالية الجودة فقط:\n• خيط قطني طبيعي 100% - قوي ومقاوم\n• خيط الجوت الطبيعي - للمظهر الريفي\n• خيط النايلون المقاوم - للاستخدام الخارجي\n• خرز طبيعي وخشبي - للزينة\n• أصباغ طبيعية آمنة - لا تسبب حساسية\n\nجميع خاماتنا صديقة للبيئة وآمنة للأطفال.",
    },
    {
      id: 8,
      category: "care",
      icon: Shield,
      question: "كيف أعتني بقطع المكرمية؟",
      answer:
        "العناية بسيطة جداً:\n• نفض الغبار بفرشاة ناعمة أسبوعياً\n• تجنب التعرض المباشر لأشعة الشمس\n• في حالة الاتساخ: غسيل يدوي بماء بارد وصابون لطيف\n• التجفيف في الهواء بعيداً عن الحرارة\n• يمكن استخدام البخار لإزالة التجاعيد\n\nمع العناية المناسبة تدوم قطع المكرمية لسنوات طويلة.",
    },
    {
      id: 9,
      category: "returns",
      icon: RefreshCw,
      question: "ما هي سياسة الإرجاع والاستبدال؟",
      answer:
        "نضمن رضاك التام:\n• ضمان 30 يوم على جودة الصنع\n• استبدال مجاني في حالة العيوب\n• إمكانية التعديل إذا لم يناسب المقاس\n• استرداد كامل للقطع غير المخصصة خلال 7 أيام\n• للقطع المخصصة: نعمل معك لحل أي مشكلة\n\nرضاك أهم من الربح بالنسبة لنا.",
    },
    {
      id: 10,
      category: "general",
      icon: MessageCircle,
      question: "كيف يمكنني التواصل معكم؟",
      answer:
        "نحن متاحون لخدمتك:\n• واتساب: 970599123456 (متاح 24/7)\n• اتصال مباشر: نفس الرقم\n• البريد الإلكتروني: sandy@example.com\n• رسائل الموقع: عبر صفحة 'اتصل بنا'\n• زيارة شخصية: نابلس (بموعد مسبق)\n\nنرد على الرسائل عادة خلال ساعة واحدة.",
    },
    {
      id: 11,
      category: "orders",
      icon: Clock,
      question: "هل يمكنني تتبع طلبي؟",
      answer:
        "نعم، نوفر خدمة تتبع شاملة:\n• رسالة تأكيد فورية عند الطلب\n• تحديثات مرحلية أثناء التنفيذ\n• صور للقطعة قبل الشحن\n• رقم تتبع للشحنة\n• تنبيه عند وصول الطلب\n\nيمكنك أيضاً السؤال عن حالة طلبك في أي وقت.",
    },
    {
      id: 12,
      category: "pricing",
      icon: DollarSign,
      question: "هل تقدمون خصومات أو عروض خاصة؟",
      answer:
        "نعم، لدينا عروض منتظمة:\n• خصم 10% للطلبات الثانية\n• خصم 15% للطلبات فوق 500 شيكل\n• عروض مواسم (رمضان، الأعياد، العودة للمدارس)\n• خصم خاص للكميات (3 قطع فأكثر)\n• برنامج الولاء للعملاء المميزين\n\nتابعنا على وسائل التواصل لآخر العروض.",
    },
  ];

  // فلترة الأسئلة
  const filteredFAQs = faqData.filter((faq) => {
    const matchesCategory =
      activeCategory === "all" || faq.category === activeCategory;
    const matchesSearch =
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  // فتح/إغلاق السؤال
  const toggleQuestion = (questionId) => {
    const newOpenQuestions = new Set(openQuestions);
    if (newOpenQuestions.has(questionId)) {
      newOpenQuestions.delete(questionId);
    } else {
      newOpenQuestions.add(questionId);
    }
    setOpenQuestions(newOpenQuestions);
  };

  // فتح جميع الأسئلة
  const openAllQuestions = () => {
    setOpenQuestions(new Set(filteredFAQs.map((faq) => faq.id)));
  };

  // إغلاق جميع الأسئلة
  const closeAllQuestions = () => {
    setOpenQuestions(new Set());
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* أزرار التحكم السريع */}
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

      {/* قائمة الأسئلة */}
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
          <Button variant="secondary">إعادة تعيين البحث</Button>
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
                      <div className="px-6 pb-6">
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

      {/* معلومات إضافية */}
      {filteredFAQs.length > 0 && (
        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <HelpCircle className="text-blue-600" size={20} />
            <span className="font-semibold text-blue-800">نصيحة:</span>
          </div>
          <p className="text-blue-700 text-sm">
            يمكنك فتح عدة أسئلة في نفس الوقت للمقارنة بين الإجابات. استخدم البحث
            للعثور على معلومات محددة بسرعة.
          </p>
        </div>
      )}
    </div>
  );
};

export default FAQQuestions;

/* eslint-disable no-unused-vars */
// client/src/components/faq/FAQTipsSection.jsx
import { motion } from "framer-motion";
import { Palette } from "lucide-react";
import ApplyNow from "../ApplyNow";

const FAQTipsSection = ({ isVisible }) => {
  const tips = [
    {
      id: 1,
      title: "كن واضحاً في الوصف",
      description: "قدم تفاصيل دقيقة عن المقاسات والألوان المطلوبة",
      color: "bg-green-500",
    },
    {
      id: 2,
      title: "أرفق صوراً مرجعية",
      description: "الصور تساعدنا في فهم رؤيتك بشكل أفضل",
      color: "bg-blue-500",
    },
    {
      id: 3,
      title: "احجز مبكراً",
      description: "خاصة في المواسم والأعياد لضمان التسليم في الوقت",
      color: "bg-purple",
    },
    {
      id: 4,
      title: "تواصل بانتظام",
      description: "لا تتردد في السؤال عن تطورات طلبك",
      color: "bg-orange-500",
    },
    {
      id: 5,
      title: "شارك تجربتك",
      description: "آراؤك تساعدنا في تحسين خدماتنا",
      color: "bg-pink",
    },
    {
      id: 6,
      title: "استفد من العروض",
      description: "تابع حساباتنا للحصول على خصومات حصرية",
      color: "bg-gray-500",
    },
  ];

  const handleBrowseProducts = () => {
    window.location.href = "/gallery";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: 0.8 }}
      className="container mx-auto px-4 mt-12"
    >
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-purple mb-6 text-center">
          نصائح للحصول على أفضل خدمة
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          {tips.map((tip, index) => (
            <motion.div
              key={tip.id}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              animate={isVisible ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.9 + index * 0.1 }}
              className="flex items-start gap-3"
            >
              <div
                className={`${tip.color} text-white p-2 rounded-full mt-1 min-w-[32px] flex items-center justify-center`}
              >
                <span className="text-sm font-bold">{tip.id}</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  {tip.title}
                </h3>
                <p className="text-gray-600 text-sm">{tip.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-8 pt-6 border-t border-gray-200">
          <p className="text-gray-600 mb-4">هل أعجبتك هذه النصائح؟</p>
          <div className="flex justify-center items-center">
            <ApplyNow className="rounded-lg ml-6 px-8 py-4 " />
            <button
              onClick={handleBrowseProducts}
              className="bg-transparent border-2 border-purple text-purple px-8 py-4 rounded-lg font-bold hover:bg-purple hover:text-white transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Palette size={18} />
              تصفح منتجاتنا الآن
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default FAQTipsSection;

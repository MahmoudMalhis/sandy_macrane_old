/* eslint-disable no-unused-vars */
// client/src/components/contact/CTASection.jsx
import { motion } from "framer-motion";
import {
  MessageCircle,
  ShoppingBag,
  Star,
  Users,
  Headphones,
  Timer,
} from "lucide-react";
import { openWhatsApp } from "../../utils/whatsapp";

const CTASection = ({ isVisible, contactInfo }) => {
   const handleWhatsAppClick = () => {
     const message = "مرحباً ساندي، أود التواصل معك بخصوص منتجاتكم الرائعة";
     openWhatsApp(contactInfo?.whatsapp, message);
   };


  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: 0.8 }}
      className="mt-20"
    >
      <div className="bg-gradient-to-r from-purple to-pink rounded-2xl shadow-2xl p-8 lg:p-12 text-white text-center">
        <h2 className="text-3xl lg:text-4xl font-bold mb-4">
          جاهزة لبدء رحلتك الإبداعية؟
        </h2>
        <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
          انضم لأكثر من 500 عميل سعيد واكتشف جمال المكرمية اليدوية
        </p>

        {/* إحصائيات سريعة */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Users className="text-white" size={24} />
              <span className="text-2xl font-bold">500+</span>
            </div>
            <p className="text-sm opacity-90">عميل سعيد</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Headphones className="text-white" size={24} />
              <span className="text-2xl font-bold">24/7</span>
            </div>
            <p className="text-sm opacity-90">دعم متواصل</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Timer className="text-white" size={24} />
              <span className="text-2xl font-bold">3</span>
            </div>
            <p className="text-sm opacity-90">أيام متوسط التنفيذ</p>
          </div>
        </div>

        {/* أزرار العمل */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={handleWhatsAppClick}
            className="bg-white text-purple px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors flex items-center gap-3 text-lg cursor-pointer"
          >
            <MessageCircle size={24} />
            ابدأ المحادثة الآن
          </button>
          <button
            onClick={() => (window.location.href = "/gallery")}
            className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-purple transition-colors flex items-center gap-3 text-lg cursor-pointer"
          >
            <ShoppingBag size={24} />
            تصفح أعمالنا
          </button>
        </div>

        {/* شهادات سريعة */}
        <div className="mt-8 flex items-center justify-center gap-2">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="text-yellow-300 fill-current"
                size={20}
              />
            ))}
          </div>
          <span className="text-sm opacity-90">تقييم 5 نجوم من عملائنا</span>
        </div>
      </div>
    </motion.div>
  );
};

export default CTASection;

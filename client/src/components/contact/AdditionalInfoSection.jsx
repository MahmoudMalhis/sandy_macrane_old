/* eslint-disable no-unused-vars */
// client/src/components/contact/AdditionalInfoSection.jsx
import { motion } from "framer-motion";
import { Palette, DollarSign, Truck } from "lucide-react";

const AdditionalInfoSection = ({ isVisible }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: 1.0 }}
      className="mt-16"
    >
      <div className="grid md:grid-cols-3 gap-8">
        {/* معلومات الطلبات المخصصة */}
        <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
          <div className="bg-purple text-white p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Palette size={32} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">تصاميم مخصصة</h3>
          <p className="text-gray-600 mb-4">
            نحول أفكارك إلى قطع فنية فريدة تعكس شخصيتك وذوقك الخاص
          </p>
          <ul className="text-sm text-gray-500 space-y-1">
            <li>• استشارة مجانية</li>
            <li>• تصميم حسب الطلب</li>
            <li>• مراجعات غير محدودة</li>
          </ul>
        </div>

        {/* معلومات الأسعار */}
        <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
          <div className="bg-green-500 text-white p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <DollarSign size={32} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">أسعار منافسة</h3>
          <p className="text-gray-600 mb-4">
            أسعار عادلة ومناسبة لجميع الفئات 
          </p>
          <ul className="text-sm text-gray-500 space-y-1">
            <li>• تقديرات مجانية</li>
            <li>• خصومات للكميات</li>
          </ul>
        </div>

        {/* معلومات التوصيل */}
        <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
          <div className="bg-orange-500 text-white p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Truck size={32} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">توصيل سريع</h3>
          <p className="text-gray-600 mb-4">
            خدمة توصيل موثوقة وسريعة إلى جميع أنحاء فلسطين 
          </p>
          <ul className="text-sm text-gray-500 space-y-1">
            <li>• تغليف احترافي</li>
            <li>• ضمان سلامة الوصول</li>
          </ul>
        </div>
      </div>
    </motion.div>
  );
};

export default AdditionalInfoSection;

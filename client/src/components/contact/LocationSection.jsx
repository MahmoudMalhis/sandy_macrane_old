/* eslint-disable no-unused-vars */
// client/src/components/contact/LocationSection.jsx
import { motion } from "framer-motion";
import { MapPin, MessageCircle } from "lucide-react";

const LocationSection = ({ isVisible, contactInfo }) => {
  const handleWhatsAppClick = () => {
    const message = "مرحباً، أود حجز موعد لزيارة المعرض";
    const whatsappUrl = `https://wa.me/${contactInfo.whatsapp}?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: 1.2 }}
      className="mt-16"
    >
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="flex items-center justify-center gap-3 mb-6">
          <MapPin className="text-purple" size={32} />
          <h3 className="text-2xl font-bold text-gray-900">موقعنا في نابلس</h3>
        </div>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          نتشرف بزيارتكم لمشاهدة منتجاتنا عن قرب والاستفادة من الاستشارة
          المباشرة مع فريقنا المختص
        </p>
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">
                معلومات الزيارة
              </h4>
              <ul className="text-gray-600 space-y-2">
                <li>📍 نابلس، فلسطين</li>
                <li>🕒 يُفضل تحديد موعد مسبق</li>
                <li>🚗 مواقف سيارات متاحة</li>
                <li>♿ مكان مناسب لذوي الاحتياجات الخاصة</li>
              </ul>
            </div>
            <button
              onClick={handleWhatsAppClick}
              className="w-full bg-purple text-white py-3 rounded-lg hover:bg-purple-600 transition-colors flex items-center justify-center gap-2"
            >
              <MessageCircle size={20} />
              احجز موعد زيارة
            </button>
          </div>
          <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <MapPin size={48} className="mx-auto mb-2" />
              <p>خريطة تفاعلية</p>
              <p className="text-sm">(يمكن إضافة خريطة Google Maps)</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default LocationSection;
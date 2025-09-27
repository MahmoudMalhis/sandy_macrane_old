/* eslint-disable no-unused-vars */
// client/src/components/contact/ContactInfoCards.jsx
import { motion } from "framer-motion";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  Facebook,
  Instagram,
} from "lucide-react";

const ContactInfoCards = ({ isVisible, contactInfo }) => {
  const handleWhatsAppClick = () => {
    const message = "مرحباً ساندي، أود التواصل معك بخصوص منتجاتكم الرائعة";
    const whatsappUrl = `https://wa.me/${
      contactInfo.whatsapp
    }?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleEmailClick = () => {
    window.location.href = `mailto:${contactInfo.email}?subject=استفسار من موقع ساندي مكرمية`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={isVisible ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="space-y-8"
    >
      <div>
        <h2 className="text-2xl font-bold text-purple mb-6">طرق التواصل</h2>

        {/* بطاقات التواصل */}
        <div className="space-y-6">
          {/* واتساب */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border-r-4 border-green-500">
            <div className="flex items-start gap-4">
              <div className="bg-green-500 text-white p-3 rounded-full">
                <MessageCircle size={24} />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 mb-2">
                  واتساب (الأسرع)
                </h3>
                <p className="text-gray-600 mb-3">
                  للاستفسارات السريعة والطلبات العاجلة
                </p>
                <button
                  onClick={handleWhatsAppClick}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <MessageCircle size={16} />
                  ابدأ المحادثة
                </button>
              </div>
            </div>
          </div>

          {/* الهاتف */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border-r-4 border-blue-500">
            <div className="flex items-start gap-4">
              <div className="bg-blue-500 text-white p-3 rounded-full">
                <Phone size={24} />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 mb-2">الهاتف</h3>
                <p className="text-gray-600 mb-3">{contactInfo.whatsapp}</p>
                <button
                  onClick={() =>
                    (window.location.href = `tel:${contactInfo.whatsapp}`)
                  }
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Phone size={16} />
                  اتصل الآن
                </button>
              </div>
            </div>
          </div>

          {/* البريد الإلكتروني */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border-r-4 border-purple">
            <div className="flex items-start gap-4">
              <div className="bg-purple text-white p-3 rounded-full">
                <Mail size={24} />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 mb-2">
                  البريد الإلكتروني
                </h3>
                <p className="text-gray-600 mb-3">{contactInfo.email}</p>
                <button
                  onClick={handleEmailClick}
                  className="bg-purple text-white px-4 py-2 rounded-lg hover:bg-purple-hover transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Mail size={16} />
                  إرسال إيميل
                </button>
              </div>
            </div>
          </div>

          {/* العنوان */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border-r-4 border-orange-500">
            <div className="flex items-start gap-4">
              <div className="bg-orange-500 text-white p-3 rounded-full">
                <MapPin size={24} />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 mb-2">العنوان</h3>
                <p className="text-gray-600">{contactInfo.address}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ساعات العمل */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Clock size={20} className="text-purple" />
          ساعات العمل
        </h3>
        <div className="space-y-2 text-gray-600">
          <p>{contactInfo.workingHours.weekdays}</p>
          <p>{contactInfo.workingHours.weekend}</p>
          <p className="text-sm text-green-500 font-medium">
            📱 واتساب متاح 24/7 للطوارئ
          </p>
        </div>
      </div>

      {/* وسائل التواصل الاجتماعي */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="font-bold text-gray-900 mb-4">تابعنا على</h3>
        <div className="flex gap-4">
          <a
            href={contactInfo.social.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition-colors"
          >
            <Facebook size={20} />
          </a>
          <a
            href={contactInfo.social.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-pink-600 text-white p-3 rounded-full hover:bg-pink-700 transition-colors"
          >
            <Instagram size={20} />
          </a>
        </div>
      </div>
    </motion.div>
  );
};

export default ContactInfoCards;

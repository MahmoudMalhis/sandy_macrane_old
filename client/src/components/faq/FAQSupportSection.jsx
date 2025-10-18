// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { MessageCircle, Clock, Star } from "lucide-react";
import { openWhatsApp } from "../../utils/whatsapp";
import { usePublicSettings } from "../../hooks/queries/useSettings";

const FAQSupportSection = ({ isVisible }) => {
  const { data: settings } = usePublicSettings();
  const contactInfo = {
    whatsapp: settings?.contact_info?.whatsapp || settings?.whatsapp_owner,
  };
  const handleWhatsAppClick = () => {
    const message = "مرحباً ساندي، أود التواصل معك بخصوص منتجاتكم الرائعة";
    openWhatsApp(contactInfo?.whatsapp, message);
  };

  const handleContactPage = () => {
    window.location.href = "/contact";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: 0.6 }}
      className="container mx-auto px-4"
    >
      <div className="bg-gradient-to-br from-purple to-pink rounded-xl shadow-2xl p-8 text-white text-center max-w-4xl mx-auto">
        <MessageCircle className="mx-auto h-16 w-16 mb-6 opacity-90" />
        <h2 className="text-3xl font-bold mb-4">لم تجد إجابة لسؤالك؟</h2>
        <p className="text-xl mb-8 opacity-90">
          فريق الدعم لدينا جاهز لمساعدتك في أي وقت
        </p>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white bg-opacity-20 rounded-lg p-4 backdrop-blur-sm text-purple">
            <MessageCircle className="mx-auto h-8 w-8 mb-2" />
            <h3 className="font-semibold mb-2">واتساب فوري</h3>
            <p className="text-sm opacity-90">رد خلال دقائق</p>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg p-4 backdrop-blur-sm text-purple">
            <Clock className="mx-auto h-8 w-8 mb-2" />
            <h3 className="font-semibold mb-2">متاح 24/7</h3>
            <p className="text-sm opacity-90">في خدمتك دائماً</p>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg p-4 backdrop-blur-sm text-purple">
            <Star className="mx-auto h-8 w-8 mb-2" />
            <h3 className="font-semibold mb-2">دعم مميز</h3>
            <p className="text-sm opacity-90">خبراء متخصصون</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleWhatsAppClick}
            className="bg-white text-purple px-8 py-4 rounded-lg font-bold hover:bg-gray-100 transition-colors shadow-lg flex items-center justify-center gap-2 cursor-pointer"
          >
            <MessageCircle size={20} />
            تواصل عبر واتساب
          </button>
          <button
            onClick={handleContactPage}
            className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-bold hover:bg-white hover:text-purple transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            صفحة الاتصال
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default FAQSupportSection;

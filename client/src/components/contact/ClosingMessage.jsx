/* eslint-disable no-unused-vars */
// client/src/components/contact/ClosingMessage.jsx
import { motion } from "framer-motion";

const ClosingMessage = ({ isVisible }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: 1.4 }}
      className="text-center mt-16 py-8"
    >
      <div className="max-w-3xl mx-auto">
        <h3 className="text-2xl font-bold text-purple mb-4">
          شكراً لثقتكم بنا
        </h3>
        <p className="text-gray-600 leading-relaxed">
          نتطلع للعمل معكم وتحويل منزلكم إلى مساحة فنية رائعة تعكس ذوقكم الرفيع.
          فريقنا جاهز دائماً لمساعدتكم في كل خطوة من رحلة الإبداع معنا.
        </p>
        <div className="flex items-center justify-center gap-4 mt-6">
          <div className="w-16 h-1 bg-purple rounded-full"></div>
          <span className="text-purple font-bold">ساندي مكرمية</span>
          <div className="w-16 h-1 bg-purple rounded-full"></div>
        </div>
      </div>
    </motion.div>
  );
};

export default ClosingMessage;

/* eslint-disable no-unused-vars */
// client/src/components/contact/ContactHeroSection.jsx
import { motion } from "framer-motion";

const ContactHeroSection = ({ isVisible }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      className="text-center mb-16"
    >
      <h1 className="text-4xl lg:text-5xl font-bold text-purple mb-4">
        تواصل معنا
      </h1>
      <p className="text-lg text-gray-600 max-w-2xl mx-auto">
        نحن هنا للإجابة على جميع أسئلتك ومساعدتك في الحصول على القطعة المثالية
      </p>
      <div className="w-24 h-1 bg-pink mx-auto mt-6 rounded-full"></div>
    </motion.div>
  );
};

export default ContactHeroSection;
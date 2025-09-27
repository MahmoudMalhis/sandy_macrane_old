/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Phone, Clock, CheckCircle } from "lucide-react";

const FloatingWhatsApp = ({ phoneNumber, businessHours }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  // الرقم الافتراضي
  const defaultPhone = phoneNumber || "970599123456";

  // ساعات العمل الافتراضية
  const defaultHours = businessHours || {
    start: "09:00",
    end: "21:00",
    timezone: "Palestine",
  };

  // تحقق من ساعات العمل
  useEffect(() => {
    const checkBusinessHours = () => {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      const currentTime = currentHour * 60 + currentMinute;

      const [startHour, startMinute] = defaultHours.start
        .split(":")
        .map(Number);
      const [endHour, endMinute] = defaultHours.end.split(":").map(Number);

      const startTime = startHour * 60 + startMinute;
      const endTime = endHour * 60 + endMinute;

      setIsOnline(currentTime >= startTime && currentTime <= endTime);
    };

    checkBusinessHours();
    const interval = setInterval(checkBusinessHours, 60000); // فحص كل دقيقة

    return () => clearInterval(interval);
  }, [defaultHours]);

  // إظهار الزر عند التمرير
  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent(
      `مرحباً ساندي 👋\n\nأود الاستفسار عن منتجاتكم.\n\nشكراً لكم 🌷`
    );
    const whatsappUrl = `https://wa.me/${defaultPhone}?text=${message}`;
    window.open(whatsappUrl, "_blank");
    setIsOpen(false);
  };

  const quickMessages = [
    {
      id: 1,
      text: "أريد طلب قطعة مكرمية",
      icon: "🕸️",
    },
    {
      id: 2,
      text: "أود طلب برواز مخصص",
      icon: "🖼️",
    },
    {
      id: 3,
      text: "استفسار عن الأسعار",
      icon: "💰",
    },
    {
      id: 4,
      text: "معلومات عن التوصيل",
      icon: "🚚",
    },
  ];

  const sendQuickMessage = (messageText) => {
    const message = encodeURIComponent(
      `مرحباً ساندي 👋\n\n${messageText}\n\nشكراً لكم 🌷`
    );
    const whatsappUrl = `https://wa.me/${defaultPhone}?text=${message}`;
    window.open(whatsappUrl, "_blank");
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* الخلفية المظلمة */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
                onClick={() => setIsOpen(false)}
              />
            )}
          </AnimatePresence>

          {/* نافذة الدردشة */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0, y: 20 }}
                className="fixed bottom-24 right-4 md:right-6 w-80 md:w-96 bg-white rounded-2xl shadow-2xl z-50 overflow-hidden"
                style={{ maxHeight: "70vh" }}
              >
                {/* رأس النافذة */}
                <div className="bg-green text-white p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src="/logo.jpg"
                        alt="Sandy Macrame"
                        className="w-12 h-12 rounded-full border-2 border-white"
                      />
                      <div
                        className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                          isOnline ? "bg-green-400" : "bg-gray-400"
                        }`}
                      ></div>
                    </div>
                    <div>
                      <h4 className="font-bold">ساندي مكرمية</h4>
                      <div className="flex items-center gap-1 text-sm opacity-90">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            isOnline ? "bg-green-400" : "bg-gray-400"
                          }`}
                        ></div>
                        <span>{isOnline ? "متاحة الآن" : "غير متاحة"}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-white hover:bg-white hover:text-green rounded-full p-1 transition-colors duration-200"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* محتوى النافذة */}
                <div className="p-4 max-h-96 overflow-y-auto">
                  {/* رسالة الترحيب */}
                  <div className="mb-4">
                    <div className="bg-gray-100 rounded-2xl rounded-tl-sm p-3 mb-2">
                      <p className="text-gray-800">
                        👋 مرحباً! كيف يمكنني مساعدتك اليوم؟
                      </p>
                    </div>
                    <div className="text-xs text-gray-500 text-right">
                      منذ دقائق قليلة
                    </div>
                  </div>

                  {/* ساعات العمل */}
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-4">
                    <div className="flex items-center gap-2 text-blue-800 mb-1">
                      <Clock size={16} />
                      <span className="font-semibold text-sm">ساعات العمل</span>
                    </div>
                    <p className="text-blue-700 text-sm">
                      من {defaultHours.start} صباحاً إلى {defaultHours.end}{" "}
                      مساءً
                    </p>
                    {!isOnline && (
                      <p className="text-blue-600 text-xs mt-1">
                        سنرد عليك في أقرب وقت ممكن
                      </p>
                    )}
                  </div>

                  {/* الرسائل السريعة */}
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-gray-700 mb-3">
                      اختر من الرسائل السريعة:
                    </p>
                    {quickMessages.map((msg) => (
                      <button
                        key={msg.id}
                        onClick={() => sendQuickMessage(msg.text)}
                        className="w-full text-right p-3 bg-gray-50 hover:bg-purple hover:text-white rounded-xl transition-all duration-200 border border-gray-200 hover:border-purple group"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-lg">{msg.icon}</span>
                          <span className="flex-1 text-sm">{msg.text}</span>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* زر الاتصال المباشر */}
                  <button
                    onClick={handleWhatsAppClick}
                    className="w-full mt-4 bg-green text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-green-600 transition-colors duration-200"
                  >
                    <MessageCircle size={20} />
                    <span>ابدأ المحادثة</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* الزر العائم */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-6 right-4 md:right-6 z-50"
          >
            {/* تأثير النبضة */}
            <div className="absolute inset-0 bg-green rounded-full animate-ping opacity-75"></div>

            {/* الزر الرئيسي */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="relative bg-green hover:bg-green-600 text-white p-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 group"
              aria-label="فتح واتساب"
            >
              <motion.div
                animate={isOpen ? { rotate: 45 } : { rotate: 0 }}
                transition={{ duration: 0.2 }}
              >
                {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
              </motion.div>

              {/* مؤشر الحالة */}
              <div
                className={`absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                  isOnline ? "bg-green-400" : "bg-gray-400"
                }`}
              ></div>

              {/* عداد الرسائل (اختياري) */}
              <div className="absolute -top-2 -left-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                1
              </div>
            </button>

            {/* نص التلميح */}
            {!isOpen && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="absolute right-full top-1/2 transform -translate-y-1/2 mr-3 bg-gray-800 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              >
                تحدث معنا
                <div className="absolute top-1/2 -right-1 transform -translate-y-1/2 w-2 h-2 bg-gray-800 rotate-45"></div>
              </motion.div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default FloatingWhatsApp;

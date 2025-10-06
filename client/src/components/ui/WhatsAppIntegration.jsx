// client/src/components/ui/WhatsAppIntegration.jsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle,
  X,
  Phone,
  Clock,
  Users,
  Headphones,
  Timer,
} from "lucide-react";

// Base WhatsApp Link Generator
export const generateWhatsAppLink = (phoneNumber, message) => {
  const cleanNumber = phoneNumber.replace(/[^\d]/g, "");
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${cleanNumber}?text=${encodedMessage}`;
};

// WhatsApp Button Component
export const WhatsAppButton = ({
  phoneNumber = "970599123456",
  message = "",
  customerName = "",
  inquiryId = null,
  variant = "default", // default, floating, inline, card
  size = "md", // sm, md, lg
  className = "",
  children = "تواصل عبر واتساب",
  icon = true,
  ...props
}) => {
  const generateMessage = () => {
    if (message) return message;

    if (customerName && inquiryId) {
      return `مرحباً ${customerName}،\n\nشكراً لك لتواصلك معنا عبر موقع ساندي مكرمية.\nرقم الطلب: ${inquiryId}\nنحن نعمل على طلبك وسنرد عليك قريباً.\n\nمع تحياتي،\nساندي مكرمية`;
    }

    if (customerName) {
      return `مرحباً ${customerName}،\n\nشكراً لتواصلك معنا عبر موقع ساندي مكرمية.\nنحن نعمل على طلبك وسنرد عليك قريباً.\n\nمع تحياتي،\nساندي مكرمية`;
    }

    return "مرحباً ساندي، أود التواصل معك بخصوص منتجاتكم الرائعة";
  };

  const handleClick = () => {
    const whatsappUrl = generateWhatsAppLink(phoneNumber, generateMessage());
    window.open(whatsappUrl, "_blank");
  };

  const getVariantClasses = () => {
    const variants = {
      default: "bg-green-600 text-white hover:bg-green-700",
      outline:
        "border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white",
      floating:
        "bg-green-600 text-white hover:bg-green-700 shadow-2xl rounded-full",
      inline: "bg-green-600 text-white hover:bg-green-700 rounded-lg",
      card: "bg-green-600 text-white hover:bg-green-700 rounded-xl shadow-lg",
    };
    return variants[variant] || variants.default;
  };

  const getSizeClasses = () => {
    const sizes = {
      sm: "px-3 py-2 text-sm",
      md: "px-4 py-3 text-base",
      lg: "px-6 py-4 text-lg",
    };
    return sizes[size] || sizes.md;
  };

  return (
    <button
      onClick={handleClick}
      className={`
        ${getVariantClasses()}
        ${getSizeClasses()}
        transition-all duration-300 font-semibold
        flex items-center justify-center gap-2 cursor-pointer
        ${
          variant === "floating"
            ? "transform hover:scale-110"
            : "hover:shadow-lg"
        }
        ${className}
      `}
      {...props}
    >
      {icon && (
        <MessageCircle size={size === "sm" ? 16 : size === "lg" ? 24 : 20} />
      )}
      {children}
    </button>
  );
};

// Quick Message Button
export const QuickMessageButton = ({
  phoneNumber,
  message,
  icon,
  children,
  className = "",
}) => {
  const handleClick = () => {
    const whatsappUrl = generateWhatsAppLink(
      phoneNumber,
      `مرحباً ساندي 👋\n\n${message}\n\nشكراً لكم 🌷`
    );
    window.open(whatsappUrl, "_blank");
  };

  return (
    <button
      onClick={handleClick}
      className={`w-full text-right p-3 bg-gray-50 hover:bg-purple hover:text-white rounded-xl transition-all duration-200 border border-gray-200 hover:border-purple group ${className}`}
    >
      <div className="flex items-center gap-3">
        <span className="text-lg">{icon}</span>
        <span className="flex-1 text-sm">{children}</span>
      </div>
    </button>
  );
};

// Floating WhatsApp Component
export const FloatingWhatsApp = ({
  phoneNumber = "970599123456",
  businessHours = { start: "09:00", end: "21:00", timezone: "Palestine" },
  showAfterScroll = 300,
  enabled = true,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  // Check business hours
  useEffect(() => {
    const checkBusinessHours = () => {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      const currentTime = currentHour * 60 + currentMinute;

      const [startHour, startMinute] = businessHours.start
        .split(":")
        .map(Number);
      const [endHour, endMinute] = businessHours.end.split(":").map(Number);

      const startTime = startHour * 60 + startMinute;
      const endTime = endHour * 60 + endMinute;

      setIsOnline(currentTime >= startTime && currentTime <= endTime);
    };

    checkBusinessHours();
    const interval = setInterval(checkBusinessHours, 60000);
    return () => clearInterval(interval);
  }, [businessHours]);

  // Show button after scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > showAfterScroll);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [showAfterScroll]);

  if (!enabled) return null;

  const quickMessages = [
    { id: 1, text: "أريد طلب قطعة مكرمية", icon: "🕸️" },
    { id: 2, text: "أود طلب برواز مخصص", icon: "🖼️" },
    { id: 3, text: "استفسار عن الأسعار", icon: "💰" },
    { id: 4, text: "معلومات عن التوصيل", icon: "🚚" },
  ];

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Background Overlay */}
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

          {/* Chat Window */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0, y: 20 }}
                className={`fixed bottom-24 right-4 md:right-6 w-80 md:w-96 bg-white rounded-2xl shadow-2xl z-50 overflow-hidden ${className}`}
                style={{ maxHeight: "70vh" }}
              >
                {/* Header */}
                <div className="bg-green text-white p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src="/logo.jpg"
                        alt="Sandy Macrame"
                        className="w-12 h-12 rounded-full border-2 border-white"
                        loading="lazy"
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

                {/* Content */}
                <div className="p-4 max-h-96 overflow-y-auto">
                  {/* Welcome Message */}
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

                  {/* Business Hours */}
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-4">
                    <div className="flex items-center gap-2 text-blue-800 mb-1">
                      <Clock size={16} />
                      <span className="font-semibold text-sm">ساعات العمل</span>
                    </div>
                    <p className="text-blue-700 text-sm">
                      من {businessHours.start} صباحاً إلى {businessHours.end}{" "}
                      مساءً
                    </p>
                    {!isOnline && (
                      <p className="text-blue-600 text-xs mt-1">
                        سنرد عليك في أقرب وقت ممكن
                      </p>
                    )}
                  </div>

                  {/* Quick Messages */}
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-gray-700 mb-3">
                      اختر من الرسائل السريعة:
                    </p>
                    {quickMessages.map((msg) => (
                      <QuickMessageButton
                        key={msg.id}
                        phoneNumber={phoneNumber}
                        message={msg.text}
                        icon={msg.icon}
                      >
                        {msg.text}
                      </QuickMessageButton>
                    ))}
                  </div>

                  {/* Direct Chat Button */}
                  <WhatsAppButton
                    phoneNumber={phoneNumber}
                    variant="inline"
                    className="w-full mt-4"
                    size="md"
                  >
                    ابدأ المحادثة
                  </WhatsAppButton>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Floating Button */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-6 right-4 md:right-6 z-50"
          >
            {/* Pulse Effect */}
            <div className="absolute inset-0 bg-green rounded-full animate-ping opacity-75"></div>

            {/* Main Button */}
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

              {/* Status Indicator */}
              <div
                className={`absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                  isOnline ? "bg-green-400" : "bg-gray-400"
                }`}
              ></div>

              {/* Message Count */}
              <div className="absolute -top-2 -left-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                1
              </div>
            </button>

            {/* Tooltip */}
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

// WhatsApp Contact Section
export const WhatsAppContactSection = ({
  phoneNumber = "970599123456",
  title = "تواصل معنا عبر الواتساب",
  description = "للاستفسارات السريعة والطلبات العاجلة",
  stats = [
    { value: "500+", label: "عميل سعيد", icon: Users },
    { value: "24/7", label: "دعم متواصل", icon: Headphones },
    { value: "3", label: "أيام متوسط التنفيذ", icon: Timer },
  ],
  quickActions = [
    "أريد طلب قطعة مكرمية",
    "أود طلب برواز مخصص",
    "استفسار عن الأسعار",
    "معلومات عن التوصيل",
  ],
  className = "",
}) => {
  return (
    <div
      className={`bg-gradient-to-r from-purple to-pink rounded-2xl shadow-2xl p-8 lg:p-12 text-white text-center ${className}`}
    >
      <h2 className="text-3xl lg:text-4xl font-bold mb-4">{title}</h2>
      <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">{description}</p>

      {/* Stats */}
      {stats.length > 0 && (
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-sm rounded-lg p-4"
            >
              <div className="flex items-center justify-center gap-2 mb-2">
                <stat.icon className="text-white" size={24} />
                <span className="text-2xl font-bold">{stat.value}</span>
              </div>
              <p className="text-sm opacity-90">{stat.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Quick Actions */}
      {quickActions.length > 0 && (
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          {quickActions.map((action, index) => (
            <QuickMessageButton
              key={index}
              phoneNumber={phoneNumber}
              message={action}
              icon="💬"
              className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white hover:text-purple"
            >
              {action}
            </QuickMessageButton>
          ))}
        </div>
      )}

      {/* Main Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <WhatsAppButton
          phoneNumber={phoneNumber}
          variant="card"
          size="lg"
          className="bg-white text-purple hover:bg-gray-100"
        >
          ابدأ المحادثة الآن
        </WhatsAppButton>

        <button
          onClick={() => (window.location.href = `tel:${phoneNumber}`)}
          className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-purple transition-colors duration-200 flex items-center gap-3 text-lg cursor-pointer"
        >
          <Phone size={24} />
          اتصال مباشر
        </button>
      </div>
    </div>
  );
};

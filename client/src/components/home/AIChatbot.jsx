/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle,
  X,
  Send,
  Bot,
  User,
  Loader,
  Sparkles,
  Phone,
  ShoppingBag,
  Info,
} from "lucide-react";

const AIChatbot = ({ enabled = true, phoneNumber }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // إظهار الزر عند التمرير
  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Auto-scroll للرسائل
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // رسالة الترحيب عند الفتح
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage = {
        id: Date.now(),
        type: "bot",
        text: "👋 مرحباً! أنا مساعد ساندي الذكي. كيف يمكنني مساعدتك اليوم؟",
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen]);

  // Focus on input when opened
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  // Quick actions
  const quickActions = [
    {
      id: 1,
      icon: <ShoppingBag size={16} />,
      text: "أريد طلب منتج",
      message: "أريد طلب منتج مكرمية أو برواز",
    },
    {
      id: 2,
      icon: <Info size={16} />,
      text: "معلومات عن المنتجات",
      message: "أخبرني عن منتجات ساندي مكرمية",
    },
    {
      id: 3,
      icon: <Phone size={16} />,
      text: "كيف أتواصل معكم؟",
      message: "كيف يمكنني التواصل معكم؟",
    },
  ];

  // معلومات عن الموقع (Context للـ AI)
  const websiteContext = `
أنت مساعد ذكي لموقع "ساندي مكرمية" - متجر متخصص في صناعة المكرمية والبراويز اليدوية في فلسطين.

معلومات الموقع:
- الاسم: ساندي مكرمية (Sandy Macrame)
- التخصص: صناعة المكرمية والبراويز اليدوية
- الموقع: فلسطين
- رقم الواتساب: ${phoneNumber}

المنتجات:
1. المكرمية: قطع مكرمية يدوية فريدة (معلقات حائط، سلال، ديكورات)
2. البراويز: براويز مخصصة بتصاميم مميزة

خدماتنا:
- تصميم مخصص حسب الطلب
- جودة عالية وصناعة يدوية
- توصيل لجميع أنحاء فلسطين
- أسعار مناسبة

تعليمات الرد:
- كن ودوداً ومحترفاً
- استخدم اللغة العربية الفصحى البسيطة
- اقترح التواصل عبر واتساب للطلبات
- إذا لم تعرف إجابة، اعترف وأرشد للتواصل معنا
- استخدم الإيموجي بشكل مناسب
- اجعل الردود قصيرة (2-3 جمل)
`;

  // إرسال رسالة للـ Gemini API
  const sendMessageToAI = async (userMessage) => {
    const GEMINI_API_KEY = "AIzaSyCgmqUKAPuuy787kDiVzhqHZi3fmgeEmB4"; // ضع API Key هنا
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${GEMINI_API_KEY}`;

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `${websiteContext}\n\nالسؤال: ${userMessage}\n\nالإجابة:`,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 200,
          },
        }),
      });

      const data = await response.json();

      if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
        return data.candidates[0].content.parts[0].text;
      } else {
        throw new Error("Invalid response from AI");
      }
    } catch (error) {
      console.error("AI Error:", error);
      return `عذراً، حدث خطأ في الاتصال. يمكنك التواصل معنا مباشرة عبر واتساب على الرقم: ${phoneNumber}`;
    }
  };

  // معالجة إرسال الرسالة
  const handleSendMessage = async (messageText = inputMessage) => {
    if (!messageText.trim()) return;

    // إضافة رسالة المستخدم
    const userMessage = {
      id: Date.now(),
      type: "user",
      text: messageText,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    // الحصول على رد من الـ AI
    const aiResponse = await sendMessageToAI(messageText);

    // إضافة رد الـ AI
    const botMessage = {
      id: Date.now() + 1,
      type: "bot",
      text: aiResponse,
      timestamp: new Date(),
    };

    setIsTyping(false);
    setMessages((prev) => [...prev, botMessage]);
  };

  // معالجة Quick Action
  const handleQuickAction = (action) => {
    handleSendMessage(action.message);
  };

  // فتح واتساب
  const openWhatsApp = () => {
    const phone = phoneNumber;
    const message = encodeURIComponent(
      "مرحباً ساندي 👋\n\nأود الاستفسار عن منتجاتكم.\n\nشكراً 🌷"
    );
    window.open(`https://wa.me/${phone}?text=${message}`, "_blank");
  };

  if (!enabled) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Overlay للموبايل */}
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

          {/* نافذة الشات */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0, y: 20 }}
                className="fixed bottom-24 right-4 md:right-6 w-[90vw] md:w-96 bg-white rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col"
                style={{ height: "600px", maxHeight: "80vh" }}
              >
                {/* Header */}
                <div className="bg-gradient-to-r from-purple to-pink text-white p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-white bg-opacity-20 p-2 rounded-full backdrop-blur-sm">
                      <Bot size={24} color="purple" />
                    </div>
                    <div>
                      <h4 className="font-bold">مساعد ساندي الذكي</h4>
                      <div className="flex items-center gap-1 text-sm opacity-90">
                        <Sparkles size={12} />
                        <span>مدعوم بالذكاء الاصطناعي</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors duration-200"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${
                        message.type === "user"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl p-3 ${
                          message.type === "user"
                            ? "bg-purple text-white rounded-br-sm"
                            : "bg-white text-gray-800 rounded-bl-sm shadow"
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          {message.type === "bot" && (
                            <Bot
                              size={16}
                              className="text-purple mt-1 flex-shrink-0"
                            />
                          )}
                          <p className="text-sm leading-relaxed whitespace-pre-line">
                            {message.text}
                          </p>
                          {message.type === "user" && (
                            <User
                              size={16}
                              className="text-white mt-1 flex-shrink-0"
                            />
                          )}
                        </div>
                        <span
                          className={`text-xs mt-1 block ${
                            message.type === "user"
                              ? "text-purple-200"
                              : "text-gray-400"
                          }`}
                        >
                          {message.timestamp.toLocaleTimeString("ar", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </motion.div>
                  ))}

                  {/* Typing Indicator */}
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex justify-start"
                    >
                      <div className="bg-white rounded-2xl rounded-bl-sm shadow p-3 flex items-center gap-2">
                        <Bot size={16} className="text-purple" />
                        <div className="flex gap-1">
                          <div
                            className="w-2 h-2 bg-purple rounded-full animate-bounce"
                            style={{ animationDelay: "0ms" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-purple rounded-full animate-bounce"
                            style={{ animationDelay: "150ms" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-purple rounded-full animate-bounce"
                            style={{ animationDelay: "300ms" }}
                          ></div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Quick Actions */}
                {messages.length === 1 && (
                  <div className="p-4 border-t bg-white">
                    <p className="text-xs text-gray-500 mb-2">
                      اختصارات سريعة:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {quickActions.map((action) => (
                        <button
                          key={action.id}
                          onClick={() => handleQuickAction(action)}
                          className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-purple hover:text-white rounded-lg text-sm transition-colors duration-200"
                        >
                          {action.icon}
                          <span>{action.text}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Input Area */}
                <div className="p-4 bg-white border-t">
                  <div className="flex gap-2">
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" && handleSendMessage()
                      }
                      placeholder="اكتب رسالتك هنا..."
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple focus:border-transparent outline-none"
                      disabled={isTyping}
                    />
                    <button
                      onClick={() => handleSendMessage()}
                      disabled={!inputMessage.trim() || isTyping}
                      className="bg-purple text-white px-4 py-3 rounded-xl hover:bg-purple-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send size={20} />
                    </button>
                  </div>

                  {/* WhatsApp Button */}
                  <button
                    onClick={openWhatsApp}
                    className="w-full mt-2 flex items-center justify-center gap-2 bg-green text-white py-2 rounded-xl hover:bg-green-600 transition-colors text-sm"
                  >
                    <MessageCircle size={16} />
                    <span>تواصل مباشر عبر واتساب</span>
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
            {/* Pulse Effect */}
            <div className="absolute inset-0 bg-purple rounded-full animate-ping opacity-75"></div>

            {/* Main Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="relative bg-gradient-to-r from-purple to-pink hover:from-purple-hover hover:to-pink-hover text-white p-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 group"
              aria-label="فتح المساعد الذكي"
            >
              <motion.div
                animate={isOpen ? { rotate: 45 } : { rotate: 0 }}
                transition={{ duration: 0.2 }}
              >
                {isOpen ? <X size={28} /> : <Bot size={28} />}
              </motion.div>

              {/* AI Badge */}
              <div className="absolute -top-1 -right-1 bg-green-400 text-white text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                <Sparkles size={10} />
                AI
              </div>
            </button>

            {/* Tooltip */}
            {!isOpen && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="absolute right-full top-1/2 transform -translate-y-1/2 mr-3 bg-gray-800 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              >
                💬 اسألني أي شيء
                <div className="absolute top-1/2 -right-1 transform -translate-y-1/2 w-2 h-2 bg-gray-800 rotate-45"></div>
              </motion.div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AIChatbot;

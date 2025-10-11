// client/src/components/layout/Footer/Footer.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Phone,
  Mail,
  MapPin,
  Instagram,
  Facebook,
  Heart,
  ExternalLink,
  Send,
  MessageCircle,
} from "lucide-react";
import { useSettings } from "../../../context/SettingsContext";

export default function Footer() {
  const { settings, loading } = useSettings();
  const [email, setEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);

  const cleanPhoneNumber = (phone) => {
    if (!phone) return "";
    return String(phone).replace(/\D/g, "");
  };

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    setIsSubscribing(true);
    setTimeout(() => {
      setEmail("");
      setIsSubscribing(false);
      alert("شكراً لاشتراكك! سنبقيك على اطلاع بآخر أعمالنا.");
    }, 1000);
  };

  const currentYear = new Date().getFullYear();

  if (loading) {
    return (
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-pulse">جاري التحميل...</div>
        </div>
      </footer>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-purple text-white">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12 lg:py-16">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          dir="rtl"
        >
          {/* Column 1: About & Brand */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h3 className="text-2xl font-bold text-pink mb-4 flex items-center gap-2">
              <Heart className="text-pink" size={24} fill="currentColor" />
              ساندي مكرمية
            </h3>
            <p className="text-gray-300 leading-relaxed text-sm">
              نحن متخصصون في صناعة أعمال المكرمية والبراويز اليدوية الفريدة. كل
              قطعة مصنوعة بحب وعناية لتضيف لمسة فنية خاصة لمنزلك.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <div className="h-1 w-12 bg-gradient-to-r from-pink to-purple rounded-full"></div>
              <span className="text-xs text-gray-400">صُنع بحب في فلسطين</span>
            </div>
          </motion.div>

          {/* Column 2: Quick Links */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h4 className="text-lg font-bold mb-4 text-pink">روابط سريعة</h4>
            <nav className="space-y-3">
              {[
                { to: "/", label: "الرئيسية" },
                { to: "/gallery", label: "معرض الأعمال" },
                { to: "/about", label: "من نحن" },
                { to: "/contact", label: "تواصل معنا" },
                { to: "/custom-design", label: "تصميم مخصص" },
              ].map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="block text-gray-300 hover:text-pink hover:translate-x-2 transition-all duration-300 text-sm group"
                >
                  <span className="flex items-center gap-2">
                    <ExternalLink
                      size={14}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                    {link.label}
                  </span>
                </Link>
              ))}
            </nav>
          </motion.div>

          {/* Column 3: Contact Info */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h4 className="text-lg font-bold mb-4 text-pink">تواصل معنا</h4>
            <div className="space-y-3">
              {settings?.whatsapp_owner && (
                <a
                  href={`https://wa.me/${cleanPhoneNumber(
                    settings.whatsapp_owner
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-gray-300 hover:text-green-400 transition-colors duration-300 text-sm group"
                >
                  <div className="bg-green-500 bg-opacity-20 p-2 rounded-lg group-hover:bg-opacity-30 transition-all">
                    <MessageCircle size={18} />
                  </div>
                  <span className="group-hover:translate-x-1 transition-transform">
                    {settings.whatsapp_owner}
                  </span>
                </a>
              )}
              {console.log(settings)}
              {settings?.email && (
                <a
                  href={`mailto:${settings.email}`}
                  className="flex items-center gap-3 text-gray-300 hover:text-blue-400 transition-colors duration-300 text-sm group"
                >
                  <div className="bg-blue-500 bg-opacity-20 p-2 rounded-lg group-hover:bg-opacity-30 transition-all">
                    <Mail size={18} />
                  </div>
                  <span className="group-hover:translate-x-1 transition-transform">
                    {settings.email}
                  </span>
                </a>
              )}

              {settings?.phone && (
                <a
                  href={`tel:${settings.phone}`}
                  className="flex items-center gap-3 text-gray-300 hover:text-purple-400 transition-colors duration-300 text-sm group"
                >
                  <div className="bg-purple bg-opacity-20 p-2 rounded-lg group-hover:bg-opacity-30 transition-all">
                    <Phone size={18} />
                  </div>
                  <span className="group-hover:translate-x-1 transition-transform">
                    {settings.phone}
                  </span>
                </a>
              )}

              {settings?.address && (
                <div className="flex items-center gap-3 text-gray-300 text-sm">
                  <div className="bg-pink bg-opacity-20 p-2 rounded-lg">
                    <MapPin size={18} />
                  </div>
                  <span>{settings.address}</span>
                </div>
              )}
            </div>
          </motion.div>

          {/* Column 4: Social Media & Newsletter */}
          <motion.div variants={itemVariants} className="space-y-6">
            <div>
              <h4 className="text-lg font-bold mb-4 text-pink">تابعنا</h4>
              <div className="flex items-center gap-3">
                {settings?.social_links?.instagram && (
                  <a
                    href={settings.social_links.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gradient-to-br from-purple-500 to-pink-500 p-3 rounded-lg hover:scale-110 transition-transform duration-300 shadow-lg hover:shadow-pink/50"
                    aria-label="Instagram"
                  >
                    <Instagram size={20} />
                  </a>
                )}

                {settings?.social_links?.facebook && (
                  <a
                    href={settings.social_links.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-600 p-3 rounded-lg hover:scale-110 transition-transform duration-300 shadow-lg hover:shadow-blue-500/50"
                    aria-label="Facebook"
                  >
                    <Facebook size={20} />
                  </a>
                )}
              </div>
            </div>

            {/* Newsletter Subscription */}
            <div>
              <h4 className="text-lg font-bold mb-3 text-pink">
                اشترك في النشرة البريدية
              </h4>
              <p className="text-gray-400 text-xs mb-3">
                احصل على آخر التحديثات والعروض الخاصة
              </p>
              <form onSubmit={handleNewsletterSubmit} className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="بريدك الإلكتروني"
                    required
                    className="flex-1 px-3 py-2 bg-gray-700 bg-opacity-50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink focus:border-transparent text-sm text-white placeholder-gray-400"
                    dir="rtl"
                  />
                  <button
                    type="submit"
                    disabled={isSubscribing}
                    className="bg-gradient-to-r from-pink to-purple px-4 py-2 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center"
                    aria-label="إرسال"
                  >
                    <Send size={18} />
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-700 border-opacity-50"></div>

      {/* Bottom Bar - Copyright & Developer Credit */}
      <motion.div
        className="container mx-auto px-4 py-6"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5, duration: 0.5 }}
        dir="rtl"
      >
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-400">
          {/* Copyright */}
          <div className="flex items-center gap-2">
            <Heart size={16} className="text-pink" fill="currentColor" />
            <span>© {currentYear} ساندي مكرمية. جميع الحقوق محفوظة.</span>
          </div>

          {/* Legal Links */}
          <div className="flex items-center gap-4 text-xs">
            <Link
              to="/privacy"
              className="hover:text-pink transition-colors duration-300"
            >
              سياسة الخصوصية
            </Link>
            <span className="text-gray-600">•</span>
            <Link
              to="/terms"
              className="hover:text-pink transition-colors duration-300"
            >
              الشروط والأحكام
            </Link>
          </div>

          {/* Developer Credit */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-gray-500">تطوير:</span>
            <a
              href="https://www.linkedin.com/in/your-profile"
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink hover:text-purple transition-colors duration-300 font-semibold flex items-center gap-1 group"
            >
              <span>محمد الطويل</span>
              <ExternalLink
                size={12}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              />
            </a>
          </div>
        </div>
      </motion.div>
    </footer>
  );
}

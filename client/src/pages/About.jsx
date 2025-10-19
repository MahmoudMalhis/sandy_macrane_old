import { useEffect, useState } from "react";
import { usePublicAboutPage } from "../hooks/queries/useAboutPage";
import { usePublicSettings } from "../hooks/queries/useSettings";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import {
  Heart,
  Award,
  Clock,
  Star,
  Target,
  Lightbulb,
  Sparkles,
  Calendar,
  ImageIcon,
} from "lucide-react";
import ApplyNow from "../components/ApplyNow";
import Loading from "../utils/LoadingSettings";
import { openWhatsApp } from "../utils/whatsapp";

export default function About() {
  const [isVisible, setIsVisible] = useState(true);

  const { data: aboutData, isLoading: loading } = usePublicAboutPage();

  const { data: publicSettings } = usePublicSettings();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const contactInfo = {
    whatsapp:
      publicSettings?.contact_info?.whatsapp || publicSettings?.whatsapp_owner,
  };

  const handleWhatsAppClick = () => {
    const message = "مرحباً ساندي، أود التواصل معك بخصوص منتجاتكم الرائعة";
    openWhatsApp(contactInfo?.whatsapp, message);
  };

  const getIconComponent = (iconName) => {
    const iconConfig = {
      heart: {
        Icon: Heart,
        color: "text-red-500",
        bgColor: "bg-red-50",
      },
      award: {
        Icon: Award,
        color: "text-yellow-500",
        bgColor: "bg-yellow-50",
      },
      target: {
        Icon: Target,
        color: "text-blue-500",
        bgColor: "bg-blue-50",
      },
      sparkles: {
        Icon: Sparkles,
        color: "text-purple-500",
        bgColor: "bg-purple-50",
      },
      lightbulb: {
        Icon: Lightbulb,
        color: "text-yellow-400",
        bgColor: "bg-yellow-50",
      },
      star: {
        Icon: Star,
        color: "text-yellow-500",
        bgColor: "bg-yellow-100",
      },
      calendar: {
        Icon: Calendar,
        color: "text-blue-600",
        bgColor: "bg-blue-50",
      },
      clock: {
        Icon: Clock,
        color: "text-gray-600",
        bgColor: "bg-gray-50",
      },
      default: {
        Icon: Heart,
        color: "text-purple-500",
        bgColor: "bg-purple-50",
      },
    };

    return iconConfig[iconName?.toLowerCase()] || iconConfig.default;
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <Helmet>
        <title>{aboutData?.about_seo?.title}</title>
        <meta name="description" content={aboutData?.about_seo?.description} />
        <meta name="keywords" content={aboutData?.about_seo?.keywords} />
      </Helmet>
      <div className="min-h-screen bg-beige">
        {/* قسم البطل */}
        <section className="relative py-20 lg:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple via-pink to-purple opacity-10"></div>

          <div className="container mx-auto px-4 relative">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* النص */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={isVisible ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8 }}
                className="space-y-6"
              >
                <h1 className="text-4xl lg:text-6xl font-bold text-purple leading-tight">
                  قصة
                  <span className="text-pink"> ساندي</span>
                  <br />
                  مع المكرمية
                </h1>

                <p className="text-xl text-pink font-medium mb-6">
                  {aboutData?.about_hero?.subtitle}
                </p>
                <p className="text-lg text-gray-600 leading-relaxed">
                  {aboutData?.about_hero?.description}
                </p>

                <div className="flex items-center gap-4">
                  <div className="w-16 h-1 bg-purple rounded-full"></div>
                  <div className="w-8 h-1 bg-pink rounded-full"></div>
                  <div className="w-4 h-1 bg-green rounded-full"></div>
                </div>
              </motion.div>

              {/* الصورة */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={isVisible ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative"
              >
                <div className="relative">
                  <img
                    src={aboutData?.about_hero?.background_image}
                    alt="ساندي - فنانة المكرمية"
                    className="w-full h-96 lg:h-[500px] object-cover rounded-2xl shadow-2xl"
                    loading="lazy"
                  />

                  {/* إطار تزييني */}
                  <div className="absolute -inset-4 border-2 border-purple border-opacity-20 rounded-2xl -z-10"></div>

                  {/* عناصر تزيينية */}
                  <div className="absolute -top-6 -right-6 w-24 h-24 bg-pink rounded-full opacity-20 animate-pulse"></div>
                  <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-green rounded-full opacity-30 animate-bounce"></div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* قسم الإحصائيات */}
        {/* Stats Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
            >
              {aboutData?.about_stats?.items?.map((stat, index) => {
                const { Icon } = getIconComponent(stat.icon);

                return (
                  <div key={index} className="text-center group">
                    <div className="bg-purple text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-pink transition-colors duration-300">
                      <Icon size={24} />
                    </div>
                    <div className="text-3xl lg:text-4xl font-bold text-purple mb-2">
                      {stat.number}
                    </div>
                    <div className="text-gray-600 font-medium">
                      {stat.label}
                    </div>
                  </div>
                );
              })}
            </motion.div>
          </div>
        </section>

        {/* قسم القصة */}
        <section className="py-20 bg-beige">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="text-center mb-16"
              >
                <h2 className="text-3xl lg:text-4xl font-bold text-purple mb-6">
                  {aboutData?.about_story?.title}
                </h2>
                <div className="w-24 h-1 bg-pink mx-auto rounded-full"></div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="bg-white rounded-2xl p-8 lg:p-12 shadow-lg space-y-6"
              >
                <pre className="text-lg text-gray-700 leading-relaxed">
                  {aboutData?.about_story?.content}
                </pre>
                {/* اقتباس */}
                {aboutData?.about_story?.highlights?.length > 0 && (
                  <div className="space-y-3">
                    {aboutData.about_story.highlights.map(
                      (highlight, index) => (
                        <div
                          key={index}
                          className="border-r-4 border-purple pr-6 py-4 bg-purple bg-opacity-5 rounded-r-lg"
                        >
                          <p className="text-xl italic text-white font-medium">
                            {highlight.text}
                          </p>
                          <div className="flex items-center gap-3 mt-4">
                            <img
                              src={aboutData.about_story.image}
                              alt="ساندي"
                              className="w-12 h-12 rounded-full border-2 border-purple"
                              loading="lazy"
                            />
                            <div>
                              <p className="font-bold text-gray-300">ساندي</p>
                              <p className="text-sm text-gray-400">
                                مؤسسة ساندي مكرمية
                              </p>
                            </div>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </section>

        {/* رحلة التطور */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 1 }}
                className="text-center mb-16"
              >
                <h2 className="text-3xl lg:text-4xl font-bold text-purple mb-6">
                  {aboutData?.about_timeline?.title}
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  من البداية البسيطة إلى النجاح الكبير، إليكم أهم المحطات في
                  رحلتنا
                </p>
                <div className="w-24 h-1 bg-pink mx-auto mt-6 rounded-full"></div>
              </motion.div>

              <div className="space-y-8">
                {aboutData?.about_timeline?.events?.map((event, index) => {
                  const { Icon, color, bgColor } = getIconComponent(event.icon);
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                      animate={isVisible ? { opacity: 1, x: 0 } : {}}
                      transition={{ duration: 0.8, delay: 1.2 + index * 0.2 }}
                      className={`flex items-center gap-8 ${
                        index % 2 === 1 ? "flex-row-reverse" : ""
                      }`}
                    >
                      {/* المحتوى */}
                      <div className="flex-1 bg-beige rounded-2xl p-6 shadow-lg">
                        <div className="flex items-center gap-4 mb-4">
                          <div
                            className={`${bgColor} text-white w-12 h-12 rounded-full flex items-center justify-center`}
                          >
                            <Icon size={20} className={color} />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-purple">
                              {event.title}
                            </h3>
                            <p className="text-purple text-sm font-medium">
                              {event.year}
                            </p>
                          </div>
                        </div>
                        <p className="text-gray-700 leading-relaxed">
                          {event.description}
                        </p>
                      </div>

                      {/* الخط الزمني */}
                      <div className="flex flex-col items-center">
                        <div className="w-4 h-4 bg-purple rounded-full"></div>
                        {/* {index < aboutData.event.length - 1 && (
                          <div className="w-0.5 h-16 bg-purple opacity-30 mt-2"></div>
                        )} */}
                      </div>

                      {/* مساحة فارغة للتوازن */}
                      <div className="flex-1"></div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* قيم العلامة */}
        <section className="py-20 bg-gradient-to-br from-purple via-pink to-green">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 1.4 }}
                className="text-center mb-16"
              >
                <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
                  {aboutData?.about_values?.title || "قيمنا الأساسية"}
                </h2>
                <p className="text-lg text-white opacity-90 max-w-2xl mx-auto">
                  المبادئ التي نؤمن بها وتوجه كل ما نقوم به
                </p>
                <div className="w-24 h-1 bg-white mx-auto mt-6 rounded-full"></div>
              </motion.div>

              <div className="grid md:grid-cols-3 gap-8">
                {aboutData?.about_values?.items?.map((value, index) => {
                  const { Icon, color, bgColor } = getIconComponent(value.icon);

                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 50 }}
                      animate={isVisible ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.8, delay: 1.6 + index * 0.2 }}
                      className="bg-white rounded-2xl p-8 shadow-2xl text-center hover:transform hover:scale-105 transition-all duration-300"
                    >
                      <div
                        className={`w-20 h-20 ${bgColor} rounded-full flex items-center justify-center mx-auto mb-6`}
                      >
                        <Icon size={32} className={color} />
                      </div>
                      <h3 className="text-2xl font-bold text-purple mb-4">
                        {value.title}
                      </h3>
                      <p className="text-gray-700 leading-relaxed">
                        {value.description}
                      </p>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ورشة العمل */}
        <section className="py-20 bg-beige">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 1.8 }}
                className="text-center mb-16"
              >
                <h2 className="text-3xl lg:text-4xl font-bold text-purple mb-6">
                  {aboutData?.about_workshop?.title || "داخل ورشة العمل"}
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  {aboutData?.about_workshop?.description ||
                    "نظرة على المكان الذي تولد فيه الأفكار وتتحول إلى قطع فنية رائعة"}
                </p>
                <div className="w-24 h-1 bg-pink mx-auto mt-6 rounded-full"></div>
              </motion.div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {aboutData?.about_workshop?.images?.map((image, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    animate={isVisible ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 2 + index * 0.1 }}
                    className="relative group overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300"
                  >
                    <img
                      src={image.src}
                      alt={image.alt || image.title}
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-80 transition-opacity duration-300"></div>
                    <div className="absolute bottom-4 left-4 right-4 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      <h3 className="font-bold text-lg">{image.title}</h3>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* إذا لم تكن هناك صور */}
              {(!aboutData?.about_workshop?.images ||
                aboutData.about_workshop.images.length === 0) && (
                <div className="text-center py-12 text-gray-500">
                  <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-30" />
                  <p>لا توجد صور من ورشة العمل بعد</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* دعوة للعمل */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 2.2 }}
              className="max-w-4xl mx-auto text-center"
            >
              <div className="bg-gradient-to-br from-purple to-pink rounded-3xl p-12 text-white shadow-2xl relative overflow-hidden">
                <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                  هل لديك فكرة خاصة؟
                </h2>
                <p className="text-xl mb-8 opacity-90">
                  دعنا نحولها إلى قطعة فنية فريدة تحمل بصمتك الشخصية
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <ApplyNow>اطلب تصميماً مخصصاً</ApplyNow>

                  <button
                    onClick={handleWhatsAppClick}
                    disabled={!contactInfo?.whatsapp}
                    className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-purple px-8 py-4 rounded-full font-bold transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    تحدث معنا مباشرة
                  </button>
                </div>

                {/* عناصر تزيينية */}
                <div className="absolute top-4 right-4 w-20 h-20 border border-white opacity-20 rounded-full"></div>
                <div className="absolute bottom-4 left-4 w-16 h-16 border border-white opacity-20 rounded-full"></div>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
}

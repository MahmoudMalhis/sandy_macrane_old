/* eslint-disable no-unused-vars */
// client/src/components/home/TestimonialsSlider.jsx - محدث لاستخدام البيانات الحقيقية
import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { motion } from "framer-motion";
import { Star, Quote, ArrowLeft } from "lucide-react";

// استيراد CSS الخاص بـ Swiper
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const TestimonialsSlider = ({ testimonials = [], settings }) => {
  const [isVisible, setIsVisible] = useState(false);

  // الإعدادات الافتراضية
  const defaultSettings = {
    section_title: "ماذا يقول عملاؤنا",
    section_description:
      "آراء حقيقية من عملائنا الكرام حول تجربتهم مع منتجاتنا",
    button_text: "شاهد جميع التقييمات",
    show_count: 4,
    min_rating: 4,
    autoplay: true,
    autoplay_delay: 6000,
  };

  const testimonialsSettings = { ...defaultSettings, ...settings };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById("testimonials-slider");
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        size={16}
        className={`${
          i < rating ? "text-yellow-500 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ar", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // تصفية التقييمات حسب الإعدادات
  const getFilteredTestimonials = () => {
    if (!testimonials || testimonials.length === 0) return [];

    let filtered = testimonials.filter(
      (testimonial) => testimonial.rating >= testimonialsSettings.min_rating
    );

    // تطبيق العدد المحدد
    return filtered.slice(0, testimonialsSettings.show_count);
  };

  const filteredTestimonials = getFilteredTestimonials();

  // إعدادات Swiper
  const swiperConfig = {
    modules: [
      Navigation,
      Pagination,
      ...(testimonialsSettings.autoplay ? [Autoplay] : []),
    ],
    spaceBetween: 30,
    slidesPerView: 1,
    loop: filteredTestimonials.length > 1,
    ...(testimonialsSettings.autoplay && {
      autoplay: {
        delay: testimonialsSettings.autoplay_delay,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      },
    }),
    navigation: {
      nextEl: ".testimonials-swiper-button-next",
      prevEl: ".testimonials-swiper-button-prev",
    },
    pagination: {
      el: ".testimonials-swiper-pagination",
      clickable: true,
      dynamicBullets: true,
    },
    speed: 800,
    breakpoints: {
      768: {
        slidesPerView: 1,
      },
      1024: {
        slidesPerView: 1,
      },
    },
  };

  // إذا لم توجد تقييمات، عرض رسالة
  if (!filteredTestimonials || filteredTestimonials.length === 0) {
    return (
      <section id="testimonials-slider" className="py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-purple mb-4">
              {testimonialsSettings.section_title}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
              {testimonialsSettings.section_description}
            </p>
            <div className="bg-beige p-8 rounded-lg shadow-lg max-w-md mx-auto">
              <div className="text-gray-400 text-6xl mb-4">💬</div>
              <p className="text-gray-600">لا توجد تقييمات متاحة حالياً</p>
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="testimonials-slider" className="py-16 lg:py-24 bg-white">
      <div className="container mx-auto px-4">
        {/* العنوان */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-purple mb-4">
            {testimonialsSettings.section_title}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {testimonialsSettings.section_description}
          </p>
          <div className="w-24 h-1 bg-pink mx-auto mt-6 rounded-full"></div>
        </motion.div>

        {/* السلايدر */}
        <div className="relative max-w-4xl mx-auto">
          <Swiper {...swiperConfig} className="testimonials-slider rounded-2xl">
            {filteredTestimonials.map((testimonial) => (
              <SwiperSlide key={testimonial.id}>
                <div className="bg-beige rounded-2xl p-8 lg:p-12 mx-4">
                  <div className="grid lg:grid-cols-3 gap-8 items-center">
                    {/* الصورة */}
                    <div className="lg:col-span-1">
                      <div className="relative">
                        <img
                          src={
                            testimonial.attached_image ||
                            "/images/default-review.jpg"
                          }
                          alt={`تقييم ${testimonial.author_name}`}
                          className="w-full h-64 lg:h-80 object-cover rounded-xl shadow-lg"
                          loading="lazy"
                          onError={(e) => {
                            e.target.src = "/images/default-review.jpg";
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-purple via-transparent to-transparent opacity-20 rounded-xl"></div>
                      </div>
                    </div>

                    {/* المحتوى */}
                    <div className="lg:col-span-2 space-y-6">
                      {/* أيقونة الاقتباس */}
                      <div className="text-purple opacity-30">
                        <Quote size={48} />
                      </div>

                      {/* النص */}
                      <blockquote className="text-gray-700 text-lg lg:text-xl leading-relaxed font-medium">
                        "{testimonial.text}"
                      </blockquote>

                      {/* التقييم */}
                      <div className="flex items-center gap-2">
                        {renderStars(testimonial.rating)}
                        <span className="text-sm text-gray-600 mr-2">
                          ({testimonial.rating}/5)
                        </span>
                      </div>

                      {/* معلومات الكاتب */}
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-bold text-purple text-lg">
                            {testimonial.author_name}
                          </h4>
                          {testimonial.album_title && (
                            <p className="text-gray-600 text-sm">
                              منتج: {testimonial.album_title}
                            </p>
                          )}
                        </div>
                        <div className="text-right text-sm text-gray-500">
                          {formatDate(testimonial.created_at)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}

            {/* أزرار التنقل المخصصة */}
            {filteredTestimonials.length > 1 && (
              <>
                <div className="testimonials-swiper-button-prev absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white hover:bg-purple hover:text-white text-purple p-3 rounded-full shadow-lg transition-all duration-300 cursor-pointer">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polyline points="9,18 15,12 9,6"></polyline>
                  </svg>
                </div>

                <div className="testimonials-swiper-button-next absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white hover:bg-purple hover:text-white text-purple p-3 rounded-full shadow-lg transition-all duration-300 cursor-pointer">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polyline points="15,18 9,12 15,6"></polyline>
                  </svg>
                </div>
              </>
            )}

            {/* مؤشرات النقاط المخصصة */}
            {filteredTestimonials.length > 1 && (
              <div className="testimonials-swiper-pagination mt-8 flex justify-center"></div>
            )}
          </Swiper>
        </div>

        {/* زر عرض المزيد */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <button
            className="bg-purple text-white px-8 py-4 rounded-full hover:bg-purple-hover transform hover:scale-105 transition-all duration-300 shadow-lg flex items-center gap-3 mx-auto cursor-pointer"
            onClick={() => {
              // يمكن إضافة منطق للانتقال لصفحة جميع التقييمات
              console.log("View all testimonials");
            }}
          >
            <span className="font-bold">
              {testimonialsSettings.button_text}
            </span>
            <ArrowLeft size={20} />
          </button>
        </motion.div>
      </div>

      <style>{`
        /* تخصيص مؤشرات النقاط */
        .testimonials-slider .swiper-pagination-bullet {
          width: 12px;
          height: 12px;
          background: #d1d5db;
          border-radius: 50%;
          transition: all 0.3s ease;
        }

        .testimonials-slider .swiper-pagination-bullet-active {
          background: #8b5f8c;
          transform: scale(1.3);
        }

        /* تخصيص الأزرار */
        .testimonials-swiper-button-prev:hover,
        .testimonials-swiper-button-next:hover {
          transform: translateY(-50%) scale(1.1);
        }

        /* تحسين الاستجابة */
        @media (max-width: 768px) {
          .testimonials-swiper-button-prev,
          .testimonials-swiper-button-next {
            display: none;
          }
        }
      `}</style>
    </section>
  );
};

export default TestimonialsSlider;

import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";
import ApplyNow from "../ApplyNow";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

const HeroSlider = ({ sliderData = [] }) => {
  const swiperRef = useRef(null);

  if (!sliderData || sliderData.length === 0) {
    return (
      <div className="h-96 md:h-[500px] lg:h-[600px] bg-gray-200 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 text-6xl mb-4">🖼️</div>
          <p className="text-gray-600">لا توجد شرائح متاحة</p>
        </div>
      </div>
    );
  }

  const swiperConfig = {
    modules: [Navigation, Pagination, Autoplay, EffectFade],
    spaceBetween: 0,
    slidesPerView: 1,
    loop: sliderData.length > 1,
    effect: "fade",
    fadeEffect: {
      crossFade: true,
    },
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
      pauseOnMouseEnter: true,
    },
    navigation: {
      nextEl: ".hero-swiper-button-next",
      prevEl: ".hero-swiper-button-prev",
    },
    pagination: {
      el: ".hero-swiper-pagination",
      clickable: true,
      dynamicBullets: true,
    },
    speed: 1000,
    on: {
      slideChange: () => {
        requestAnimationFrame(() => {
          const activeSlide = document.querySelector(".swiper-slide-active");
          if (activeSlide) {
            const elements = activeSlide.querySelectorAll(".slide-content > *");
            elements.forEach((el, index) => {
              el.style.animation = "none";
              el.offsetHeight;
              el.style.animation = `fadeUp 0.8s ease-out ${
                index * 0.2
              }s forwards`;
            });
          }
        });
      },
    },
  };

  return (
    <div className="relative h-96 md:h-[500px] lg:h-[600px] overflow-hidden">
      <Swiper
        ref={swiperRef}
        {...swiperConfig}
        className="h-full w-full hero-slider"
      >
        {sliderData.map((slide, index) => (
          <SwiperSlide key={slide.id} className="relative">
            <div className="absolute inset-0">
              <img
                src={slide.image || "/images/default-hero.jpg"}
                alt={slide.title}
                className="w-full h-full object-cover"
                loading={index === 0 ? "eager" : "lazy"}
                onError={(e) => {
                  e.target.src = "/images/default-hero.jpg";
                }}
              />
              <div
                className={`absolute inset-0 bg-gradient-to-br ${
                  slide.bgGradient || "from-purple to-pink"
                } opacity-50`}
              ></div>
              <div className="absolute inset-0 bg-black opacity-30"></div>
            </div>
            <div className="relative h-full flex items-center justify-center z-10">
              <div className="text-center text-white px-4 max-w-4xl mx-auto slide-content">
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 transform translate-y-8">
                  {slide.title}
                </h1>

                <p className="text-lg md:text-xl lg:text-2xl mb-8 opacity-90 transform translate-y-8">
                  {slide.subtitle}
                </p>

                <div className="transform translate-y-8">
                  <ApplyNow />
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}

        {sliderData.length > 1 && (
          <>
            <div className="hero-swiper-button-prev absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-opacity-20 hover:bg-opacity-30 text-white p-3 rounded-full transition-all duration-300 backdrop-blur-sm cursor-pointer">
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

            <div className="hero-swiper-button-next absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-opacity-20 hover:bg-opacity-30 text-white p-3 rounded-full transition-all duration-300 backdrop-blur-sm cursor-pointer">
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
            <div className="hero-swiper-pagination absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20"></div>
          </>
        )}
      </Swiper>

      <style>{`
        .hero-slider .swiper-pagination-bullet {
          width: 12px;
          height: 12px;
          background: rgba(255, 255, 255, 0.5);
          border-radius: 50%;
          transition: all 0.3s ease;
        }

        .hero-slider .swiper-pagination-bullet-active {
          background: white;
          transform: scale(1.3);
        }

        .hero-swiper-button-prev:hover,
        .hero-swiper-button-next:hover {
          transform: translateY(-50%) scale(1.1);
        }
          
        @media (max-width: 768px) {
          .hero-swiper-button-prev,
          .hero-swiper-button-next {
            display: none;
          }
        }

        .hero-slider {
          will-change: transform;
        }

        .hero-slider .swiper-slide {
          will-change: opacity;
        }
      `}</style>
    </div>
  );
};

export default HeroSlider;

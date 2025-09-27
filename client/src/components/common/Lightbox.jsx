/* eslint-disable no-unused-vars */
// client/src/components/common/Lightbox.jsx
import { useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Download,
  Share,
  Heart,
} from "lucide-react";
import useAppStore from "../../store/useAppStore";

const Lightbox = () => {
  const {
    isLightboxOpen,
    currentImages,
    currentImageIndex,
    closeLightbox,
    setCurrentImage,
  } = useAppStore();

  // التنقل بين الصور
  const goToNext = useCallback(() => {
    if (currentImages.length > 1) {
      const nextIndex = (currentImageIndex + 1) % currentImages.length;
      setCurrentImage(nextIndex);
    }
  }, [currentImageIndex, currentImages.length, setCurrentImage]);

  const goToPrevious = useCallback(() => {
    if (currentImages.length > 1) {
      const prevIndex =
        currentImageIndex === 0
          ? currentImages.length - 1
          : currentImageIndex - 1;
      setCurrentImage(prevIndex);
    }
  }, [currentImageIndex, currentImages.length, setCurrentImage]);

  // اختصارات لوحة المفاتيح
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!isLightboxOpen) return;

      switch (e.key) {
        case "Escape":
          closeLightbox();
          break;
        case "ArrowRight":
          goToPrevious(); // في RTL، السهم الأيمن يذهب للخلف
          break;
        case "ArrowLeft":
          goToNext(); // في RTL، السهم الأيسر يذهب للأمام
          break;
        default:
          break;
      }
    };

    if (isLightboxOpen) {
      document.addEventListener("keydown", handleKeyPress);
      document.body.style.overflow = "hidden"; // منع التمرير في الخلفية
    }

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
      document.body.style.overflow = "unset";
    };
  }, [isLightboxOpen, goToNext, goToPrevious, closeLightbox]);

  // التعامل مع اللمس للأجهزة المحمولة
  const handleTouchStart = useCallback(
    (e) => {
      const touch = e.touches[0];
      const startX = touch.clientX;

      const handleTouchEnd = (endE) => {
        const endTouch = endE.changedTouches[0];
        const endX = endTouch.clientX;
        const diff = startX - endX;

        // إذا كان الفرق أكبر من 50 بكسل
        if (Math.abs(diff) > 50) {
          if (diff > 0) {
            goToNext(); // السحب لليسار = التالي
          } else {
            goToPrevious(); // السحب لليمين = السابق
          }
        }
      };

      document.addEventListener("touchend", handleTouchEnd, { once: true });
    },
    [goToNext, goToPrevious]
  );

  const currentImage = currentImages[currentImageIndex];

  if (!isLightboxOpen || !currentImage) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-[#8b5f8c]/80 backdrop-blur-md z-50 flex items-center justify-center"
        onClick={closeLightbox}
      >
        {/* شريط الأدوات العلوي */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black to-transparent p-4 z-60"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between text-white">
            {/* معلومات الصورة */}
            <div className="flex items-center gap-4">
              <h3 className="text-lg font-semibold">
                {currentImage.title || "صورة"}
              </h3>
              <span className="text-sm opacity-75">
                {currentImageIndex + 1} من {currentImages.length}
              </span>
            </div>

            {/* أزرار الأدوات */}
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  // مشاركة الصورة
                  if (navigator.share) {
                    navigator.share({
                      title: currentImage.title || "صورة من ساندي مكرمية",
                      url: window.location.href,
                    });
                  }
                }}
                className="p-2 hover:bg-[#8b5f8c]/80 hover:backdrop-blur-md rounded-full transition-all duration-200"
                title="مشاركة"
              >
                <Share size={20} />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();

                  // إنشاء رابط مخفي للتحميل
                  const link = document.createElement("a");
                  link.href = currentImage.url;
                  link.download = `sandy-macrame-${
                    currentImage.title || "image"
                  }-${currentImageIndex + 1}.jpg`;
                  link.style.display = "none";

                  // إضافة crossorigin attribute إذا كان مطلوباً
                  link.crossOrigin = "anonymous";

                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
                className="p-2 hover:bg-[#8b5f8c]/80 hover:backdrop-blur-md rounded-full transition-all duration-200"
                title="تحميل"
              >
                <Download size={20} />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  closeLightbox();
                }}
                className="p-2 hover:bg-[#8b5f8c]/80 hover:backdrop-blur-md rounded-full transition-all duration-200"
                title="إغلاق"
              >
                <X size={24} />
              </button>
            </div>
          </div>
        </motion.div>

        {/* الصورة الرئيسية */}
        <motion.div
          key={currentImageIndex}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3 }}
          className="relative max-w-full max-h-full m-8"
          onClick={(e) => e.stopPropagation()}
          onTouchStart={handleTouchStart}
        >
          <img
            src={currentImage.url}
            alt={currentImage.alt || "صورة"}
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            loading="lazy"
          />

          {/* أزرار التنقل */}
          {currentImages.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrevious();
                }}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-[#8b5f8c]/80 hover:backdrop-blur-md text-white p-3 rounded-full transition-all duration-200 backdrop-blur-sm cursor-pointer"
                title="الصورة السابقة"
              >
                <ChevronRight size={24} />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToNext();
                }}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-[#8b5f8c]/80 hover:backdrop-blur-md text-white p-3 rounded-full transition-all duration-200 backdrop-blur-sm cursor-pointer"
                title="الصورة التالية"
              >
                <ChevronLeft size={24} />
              </button>
            </>
          )}
        </motion.div>

        {/* الصور المصغرة السفلية */}
        {currentImages.length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 backdrop-blur-sm rounded-full p-2"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex gap-2 max-w-sm overflow-x-auto scrollbar-hide">
              {currentImages.map((image, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImage(index);
                  }}
                  className={`flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                    index === currentImageIndex
                      ? "border-white scale-110"
                      : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  <img
                    src={image.url}
                    alt={`صورة مصغرة ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* مؤشر التحميل */}
        {/* <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-purple text-white px-4 py-2 rounded-full text-sm"
          >
            جاري التحميل...
          </motion.div>
        </div> */}

        {/* تعليمات لوحة المفاتيح */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 2 }}
          className="absolute bottom-16 left-4 text-white text-xs opacity-50"
        >
          <div>استخدم أسهم لوحة المفاتيح للتنقل</div>
          <div>ESC للإغلاق</div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Lightbox;

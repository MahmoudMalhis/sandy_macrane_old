import { useEffect, useCallback, useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Download,
  Share2,
  ZoomIn,
  ZoomOut,
  Heart,
  Info,
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

  const [isZoomed, setIsZoomed] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  const goToNext = useCallback(() => {
    if (currentImages.length > 1) {
      setImageLoading(true);
      const nextIndex = (currentImageIndex + 1) % currentImages.length;
      setCurrentImage(nextIndex);
    }
  }, [currentImageIndex, currentImages.length, setCurrentImage]);

  const goToPrevious = useCallback(() => {
    if (currentImages.length > 1) {
      setImageLoading(true);
      const prevIndex =
        currentImageIndex === 0
          ? currentImages.length - 1
          : currentImageIndex - 1;
      setCurrentImage(prevIndex);
    }
  }, [currentImageIndex, currentImages.length, setCurrentImage]);

  useEffect(() => {
    if (!isLightboxOpen) return;

    const handleKeyPress = (e) => {
      switch (e.key) {
        case "Escape":
          closeLightbox();
          break;
        case "ArrowRight":
          goToPrevious();
          break;
        case "ArrowLeft":
          goToNext();
          break;
        case "z":
        case "Z":
          setIsZoomed((prev) => !prev);
          break;
        case "i":
        case "I":
          setShowInfo((prev) => !prev);
          break;
        default:
          break;
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
      document.body.style.overflow = "unset";
    };
  }, [isLightboxOpen, goToNext, goToPrevious, closeLightbox]);

  const handleTouchStart = useCallback(
    (e) => {
      const touch = e.touches[0];
      const startX = touch.clientX;

      const handleTouchEnd = (endE) => {
        const endTouch = endE.changedTouches[0];
        const endX = endTouch.clientX;
        const diff = startX - endX;

        if (Math.abs(diff) > 80) {
          if (diff > 0) {
            goToNext();
          } else {
            goToPrevious();
          }
        }
      };

      document.addEventListener("touchend", handleTouchEnd, { once: true });
    },
    [goToNext, goToPrevious]
  );

  const handleDownload = async () => {
    try {
      const response = await fetch(currentImage.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `sandy-macrame-${currentImage.title || "image"}-${
        currentImageIndex + 1
      }.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: currentImage.title || "صورة من ساندي مكرمية",
          text: currentImage.alt || "شاهد هذه الصورة الجميلة",
          url: window.location.href,
        });
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Share failed:", error);
        }
      }
    }
  };

  const currentImage = currentImages[currentImageIndex];

  if (!isLightboxOpen || !currentImage) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-gradient-to-br from-purple/95 via-pink/90 to-purple/95 backdrop-blur-xl z-50 flex items-center justify-center"
        onClick={closeLightbox}
      >
        {/* ⬆️ Top Bar - Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ delay: 0.1 }}
          className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/60 via-black/40 to-transparent backdrop-blur-md p-4 lg:p-6 z-60"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="container mx-auto flex items-center justify-between text-white">
            {/* 📌 العنوان والعداد */}
            <div className="flex items-center gap-4">
              <motion.h3
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-lg lg:text-xl font-bold drop-shadow-lg"
              >
                {currentImage.title || "صورة"}
              </motion.h3>
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-sm lg:text-base bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full font-medium"
              >
                {currentImageIndex + 1} / {currentImages.length}
              </motion.span>
            </div>

            {/* 🎛️ أزرار التحكم */}
            <div className="flex items-center gap-2">
              {/* Favorite */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFavorite((prev) => !prev);
                }}
                className={`p-2 lg:p-3 rounded-full transition-all duration-300 ${
                  isFavorite
                    ? "bg-pink text-white"
                    : "bg-white/10 hover:bg-white/20"
                }`}
                title="إضافة للمفضلة"
                aria-label="Add to favorites"
              >
                <Heart size={20} className={isFavorite ? "fill-current" : ""} />
              </motion.button>

              {/* Info */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowInfo((prev) => !prev);
                }}
                className={`p-2 lg:p-3 rounded-full transition-all duration-300 ${
                  showInfo
                    ? "bg-green text-white"
                    : "bg-white/10 hover:bg-white/20"
                }`}
                title="معلومات الصورة"
                aria-label="Image information"
              >
                <Info size={20} />
              </motion.button>

              {/* Zoom */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsZoomed((prev) => !prev);
                }}
                className="hidden lg:flex p-2 lg:p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all duration-300"
                title={isZoomed ? "تصغير" : "تكبير"}
                aria-label={isZoomed ? "Zoom out" : "Zoom in"}
              >
                {isZoomed ? <ZoomOut size={20} /> : <ZoomIn size={20} />}
              </motion.button>

              {/* Share */}
              {navigator.share && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleShare();
                  }}
                  className="p-2 lg:p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all duration-300"
                  title="مشاركة"
                  aria-label="Share"
                >
                  <Share2 size={20} />
                </motion.button>
              )}

              {/* Download */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleDownload();
                }}
                className="p-2 lg:p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all duration-300"
                title="تحميل"
                aria-label="Download"
              >
                <Download size={20} />
              </motion.button>

              {/* Close */}
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.stopPropagation();
                  closeLightbox();
                }}
                className="p-2 lg:p-3 bg-red-500/80 hover:bg-red-600 rounded-full transition-all duration-300"
                title="إغلاق"
                aria-label="Close"
              >
                <X size={24} />
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* 🖼️ الصورة الرئيسية */}
        <motion.div
          key={currentImageIndex}
          initial={{ opacity: 0, scale: 0.9, rotateY: 10 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
          exit={{ opacity: 0, scale: 0.9, rotateY: -10 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className={`relative max-w-full max-h-[85vh] m-8 ${
            isZoomed ? "cursor-zoom-out" : "cursor-zoom-in"
          }`}
          onClick={(e) => {
            e.stopPropagation();
            setIsZoomed((prev) => !prev);
          }}
          onTouchStart={handleTouchStart}
        >
          {/* Loading Spinner */}
          {imageLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm rounded-2xl">
              <div className="w-16 h-16 border-4 border-white border-t-pink rounded-full animate-spin"></div>
            </div>
          )}

          <motion.img
            src={currentImage.url}
            alt={currentImage.alt || "صورة"}
            className={`max-w-full max-h-full object-contain rounded-2xl shadow-2xl transition-transform duration-300 ${
              isZoomed ? "scale-150" : "scale-100"
            }`}
            loading="lazy"
            onLoad={() => setImageLoading(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: imageLoading ? 0 : 1 }}
            transition={{ duration: 0.3 }}
          />

          {/* 🎨 Border Gradient Effect */}
          <div className="absolute inset-0 rounded-2xl border-2 border-white/20 pointer-events-none"></div>

          {/* ◀️▶️ أزرار التنقل */}
          {currentImages.length > 1 && !isZoomed && (
            <>
              <motion.button
                whileHover={{ scale: 1.1, x: 5 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrevious();
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-gradient-to-l from-purple to-pink hover:from-pink hover:to-purple text-white p-4 rounded-full shadow-2xl transition-all duration-300"
                title="الصورة السابقة"
                aria-label="Previous image"
              >
                <ChevronRight size={28} />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1, x: -5 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.stopPropagation();
                  goToNext();
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-gradient-to-r from-purple to-pink hover:from-pink hover:to-purple text-white p-4 rounded-full shadow-2xl transition-all duration-300"
                title="الصورة التالية"
                aria-label="Next image"
              >
                <ChevronLeft size={28} />
              </motion.button>
            </>
          )}
        </motion.div>

        {/* ℹ️ Info Panel */}
        <AnimatePresence>
          {showInfo && currentImage.alt && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute top-24 right-4 bg-white/10 backdrop-blur-xl rounded-2xl p-4 max-w-md shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h4 className="text-white font-semibold mb-2 text-lg">
                وصف الصورة
              </h4>
              <p className="text-white/90 text-sm leading-relaxed">
                {currentImage.alt}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 🖼️ الصور المصغرة */}
        {currentImages.length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ delay: 0.2 }}
            className="absolute bottom-4 flex justify-center left-1/2 w-full scrollbar-hide -translate-x-1/2 bg-black/40 backdrop-blur-xl rounded-full p-3 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex gap-3 max-w-xl overflow-x-auto scrollbar-hide px-2">
              {currentImages.map((image, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.15, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setImageLoading(true);
                    setCurrentImage(index);
                  }}
                  className={`flex-shrink-0 w-14 h-14 lg:w-16 lg:h-16 rounded-xl overflow-hidden border-3 transition-all duration-300 ${
                    index === currentImageIndex
                      ? "border-pink ring-4 ring-pink/50 scale-110"
                      : "border-white/30 opacity-60 hover:opacity-100 hover:border-white/60"
                  }`}
                >
                  <img
                    src={image.url}
                    alt={`صورة مصغرة ${index + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* ℹ️ نصائح الاستخدام */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 2 }}
          className="hidden lg:block absolute bottom-20 left-6 text-white text-xs space-y-1 bg-black/30 backdrop-blur-sm rounded-lg p-3"
        >
          <div className="flex items-center gap-2">
            <kbd className="bg-white/20 px-2 py-1 rounded">←</kbd>
            <kbd className="bg-white/20 px-2 py-1 rounded">→</kbd>
            <span>للتنقل</span>
          </div>
          <div className="flex items-center gap-2">
            <kbd className="bg-white/20 px-2 py-1 rounded">ESC</kbd>
            <span>للإغلاق</span>
          </div>
          <div className="flex items-center gap-2">
            <kbd className="bg-white/20 px-2 py-1 rounded">Z</kbd>
            <span>للتكبير</span>
          </div>
          <div className="flex items-center gap-2">
            <kbd className="bg-white/20 px-2 py-1 rounded">I</kbd>
            <span>المعلومات</span>
          </div>
        </motion.div>

        {/* 📱 Mobile Swipe Hint */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="lg:hidden absolute bottom-24 left-1/2 -translate-x-1/2 text-white text-xs bg-black/40 backdrop-blur-sm px-4 py-2 rounded-full"
        >
          ← اسحب للتنقل →
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Lightbox;

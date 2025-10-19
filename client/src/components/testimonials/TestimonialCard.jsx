import { Star, Quote, Calendar } from "lucide-react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import Badge from "./../common/Badge";
import { Link } from "react-router-dom";

export default function TestimonialCard({
  testimonial,
  variant = "grid",
  customStyles = {},
  index = 0,
}) {
  const variantStyles = {
    slider: {
      container: "bg-beige rounded-2xl p-8 lg:p-12",
      layout: "grid lg:grid-cols-3 gap-8 items-center",
      imageWrapper: "lg:col-span-1",
      imageClass: "w-full h-64 lg:h-80 object-cover rounded-xl shadow-lg",
      contentWrapper: "lg:col-span-2 space-y-6",
      showQuoteIcon: true,
      textSize: "text-lg lg:text-xl",
    },
    grid: {
      container:
        "bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:scale-105",
      layout: "flex flex-col",
      imageWrapper: "relative h-48 overflow-hidden",
      imageClass: "w-full h-full object-cover",
      contentWrapper: "p-6 space-y-4",
      showQuoteIcon: false,
      textSize: "text-base",
    },
    list: {
      container:
        "bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow",
      layout: "flex gap-6",
      imageWrapper: "flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden",
      imageClass: "w-full h-full object-cover",
      contentWrapper: "flex-1 space-y-3",
      showQuoteIcon: false,
      textSize: "text-sm",
    },
  };

  const styles = {
    ...variantStyles[variant],
    ...customStyles,
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        size={variant === "slider" ? 20 : 16}
        className={`${
          i < rating ? "text-yellow-500 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("ar", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getImageSrc = () => {
    return testimonial.album_cover || testimonial.attached_image || "logo.jpg";
  };

  const getImageAlt = () => {
    if (testimonial.album_cover) {
      return `غلاف ألبوم ${testimonial.album_title}`;
    }
    return `تقييم ${testimonial.author_name}`;
  };

  const getCategoryBadge = () => {
    if (!testimonial.album_title) return null;
    const isFrame =
      testimonial.album_title.includes("برواز") ||
      testimonial.album_title.includes("إطار");
    return isFrame ? "برواز" : "مكرمية";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className={styles.container}
    >
      <div className={styles.layout}>
        <div className={styles.imageWrapper}>
          <img
            src={getImageSrc()}
            alt={getImageAlt()}
            className={styles.imageClass}
            loading="lazy"
            onError={(e) => {
              e.target.src = "logo.jpg";
            }}
          />

          {variant === "grid" && (
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-30"></div>
          )}
          {variant === "grid" && testimonial.album_title && (
            <>
              <div className="absolute top-4 right-4">
                <Badge variant="category">{getCategoryBadge()}</Badge>
              </div>
            </>
          )}
        </div>

        <div className={styles.contentWrapper}>
          {styles.showQuoteIcon && (
            <div className="text-purple opacity-30">
              <Quote size={48} />
            </div>
          )}
          <div className="flex items-center gap-2">
            {renderStars(testimonial.rating)}
            <span className="text-sm text-gray-600 mr-2">
              ({testimonial.rating}/5)
            </span>
          </div>
          <blockquote
            className={`text-gray-700 ${
              styles.textSize
            } leading-relaxed font-medium ${
              variant === "grid" ? "line-clamp-3" : ""
            }`}
          >
            "{testimonial.text}"
          </blockquote>
          <div
            className={`flex items-center ${
              variant === "slider" ? "justify-between" : "gap-3"
            }`}
          >
            <div>
              <h4
                className={`font-bold text-purple ${
                  variant === "slider" ? "text-lg" : "text-base"
                }`}
              >
                {testimonial.author_name}
              </h4>
              {testimonial.album_title && (
                <p className="text-gray-600 text-sm">
                  <Link
                    to={`/album/${testimonial.album_slug}`}
                    className="hover:text-purple transition-colors"
                  >
                    منتج: {testimonial.album_title}
                  </Link>
                </p>
              )}
            </div>
            <div
              className={`text-sm text-gray-500 ${
                variant === "slider" ? "text-right" : ""
              }`}
            >
              {variant === "grid" ? (
                <div className="flex items-center gap-1 text-xs">
                  <Calendar size={14} />
                  {formatDate(testimonial.created_at)}
                </div>
              ) : (
                formatDate(testimonial.created_at)
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// client/src/components/common/AlbumCard.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, Heart } from "lucide-react";
import Badge from "./Badge";
import ApplyNow from "../ApplyNow";
import { getAlbumUtils } from "../../utils/albumUtils";
import { useLikes } from "../../hooks/useLikes";

export default function AlbumCard({
  album,
  index = 0,
  isVisible = true,
  onImageClick,
  onAlbumClick,
  variant = "featured",
}) {
  const [hoveredAlbum, setHoveredAlbum] = useState(null);
  const utils = getAlbumUtils();
  const { likesCount, isLiked, isLoading, toggleLike } = useLikes(
    album.id,
    album.likes_count || 0
  );
  const handleImageClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (onImageClick) {
      onImageClick(album, 0);
    }
  };

  const handleCardClick = () => {
    if (onAlbumClick) {
      onAlbumClick(album);
    }
  };

  const handleLikeClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    toggleLike();
  };

  // Animation variants based on display type
  const animationVariants = {
    featured: {
      initial: { opacity: 0, y: 50 },
      animate: isVisible ? { opacity: 1, y: 0 } : {},
      transition: { duration: 0.8, delay: index * 0.2 },
    },
    gallery: {
      initial: { opacity: 0, scale: 0.9 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.9 },
      transition: { duration: 0.3 },
    },
  };

  const currentVariant = animationVariants[variant];

  return (
    <motion.div
      className="group relative"
      initial={currentVariant.initial}
      animate={currentVariant.animate}
      exit={currentVariant.exit}
      transition={currentVariant.transition}
      onMouseEnter={() => setHoveredAlbum(album.id)}
      onMouseLeave={() => setHoveredAlbum(null)}
    >
      <div className="bg-white rounded-xl shadow-lg overflow-hidden transform group-hover:scale-105 group-hover:shadow-2xl transition-all duration-500">
        {/* صورة الألبوم */}
        <div className="relative h-64 overflow-hidden cursor-pointer">
          <img
            src={
              album.cover_image ||
              album.media?.[0]?.url ||
              album.cover_media?.url ||
              "/images/default-album.jpg"
            }
            alt={album.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            loading="lazy"
            onClick={handleCardClick}
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-60 transition-opacity duration-300" />

          {/* Badges - Top Right */}
          <div className="absolute top-4 right-4 flex gap-2">
            {album.status && album.status !== "published" && (
              <Badge variant={utils.getBadgeVariant(album.status)}>
                {utils.getBadgeText(album.status, album.view_count)}
              </Badge>
            )}
            <Badge variant="category">
              {utils.getCategoryText(album.category)}
            </Badge>
          </div>

          {/* عدد الصور - Bottom Left */}
          <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm flex items-center gap-1">
            <Eye size={14} />
            <span>{album.media?.length || 1} صور</span>
          </div>

          {/* معلومات عند التمرير - Bottom Right */}
          <div
            className={`absolute bottom-4 right-4 transform transition-all duration-300 
                      ${
                        hoveredAlbum === album.id
                          ? "translate-y-0 opacity-100"
                          : "translate-y-4 opacity-0"
                      }
                      md:translate-y-4 md:opacity-0 
                      md:group-hover:translate-y-0 md:group-hover:opacity-100
                      max-md:translate-y-0 max-md:opacity-100`}
          >
            <div className="flex items-center gap-2 text-white">
              <button
                onClick={handleImageClick}
                className="bg-black bg-opacity-20 backdrop-blur-sm p-2 rounded-full hover:bg-opacity-30 transition-all duration-200"
                aria-label="عرض الصور"
              >
                <Eye size={16} />
              </button>
              <button
                onClick={handleLikeClick}
                disabled={isLoading}
                className={`flex items-center gap-1 backdrop-blur-sm px-2 py-1 rounded-full transition-all duration-200 ${
                  isLiked
                    ? "bg-red-500 bg-opacity-80 hover:bg-opacity-100"
                    : "bg-black bg-opacity-20 hover:bg-opacity-30"
                } ${
                  isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                }`}
                aria-label={isLiked ? "إلغاء الإعجاب" : "إضافة إعجاب"}
              >
                <Heart
                  size={14}
                  className={`${isLiked ? "fill-current" : ""}`}
                />
                <span className="text-sm">{likesCount}</span>
              </button>
            </div>
          </div>
        </div>

        {/* محتوى الألبوم */}
        <div className="p-6">
          <h3
            className="text-xl font-bold text-purple mb-2 group-hover:text-pink transition-colors duration-300 line-clamp-2 cursor-pointer"
            onClick={handleCardClick}
          >
            {album.title}
          </h3>

          <p className="text-gray-600 mb-4 line-clamp-2 text-sm leading-relaxed">
            {album.description || "لا يوجد وصف متاح"}
          </p>

          {/* الإحصائيات */}
          <div className="flex items-center justify-between mb-4 text-sm text-gray-500">
            <span>{album.media?.length || 1} صورة</span>
            <span>{album.view_count || 0} مشاهدة</span>
          </div>

          {/* الأزرار */}
          <div className="flex gap-3">
            <ApplyNow album={album} className="flex-1 text-sm py-2">
              اطلب الآن
            </ApplyNow>

            <button
              onClick={handleCardClick}
              className="px-4 py-2 border-2 border-purple text-purple hover:bg-purple hover:text-white rounded-full transition-all duration-300 text-sm flex items-center gap-2"
            >
              <Eye size={16} />
              <span>عرض</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

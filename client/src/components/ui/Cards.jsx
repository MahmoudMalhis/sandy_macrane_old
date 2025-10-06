// client/src/components/ui/Cards.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Eye,
  Heart,
  Star,
  Quote,
  User,
  Calendar,
  ArrowLeft,
} from "lucide-react";
import Badge from "../common/Badge";
import ApplyNow from "../ApplyNow";

// Base Card Component
export const BaseCard = ({
  children,
  className = "",
  onClick,
  hover = true,
  shadow = "shadow-lg",
  rounded = "rounded-xl",
  ...props
}) => {
  return (
    <motion.div
      className={`
        bg-white ${rounded} ${shadow} overflow-hidden 
        ${
          hover
            ? "hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            : ""
        }
        ${onClick ? "cursor-pointer" : ""}
        ${className}
      `}
      onClick={onClick}
      whileHover={hover ? { y: -5 } : {}}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Image Card Component
export const ImageCard = ({
  src,
  alt,
  aspectRatio = "aspect-square",
  overlayContent,
  badges,
  stats,
  onClick,
  className = "",
}) => {
  return (
    <div
      className={`relative ${aspectRatio} overflow-hidden group ${className}`}
    >
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        loading="lazy"
        onClick={onClick}
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-60 transition-opacity duration-300"></div>

      {/* Badges */}
      {badges && (
        <div className="absolute top-4 right-4 flex gap-2">
          {badges.map((badge, index) => (
            <Badge key={index} variant={badge.variant}>
              {badge.text}
            </Badge>
          ))}
        </div>
      )}

      {/* Stats */}
      {stats && (
        <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm flex items-center gap-1">
          <Eye size={14} />
          <span>
            {stats.count} {stats.label}
          </span>
        </div>
      )}

      {/* Overlay Content */}
      {overlayContent && (
        <div className="absolute bottom-4 right-4 transform transition-all duration-300 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100">
          {overlayContent}
        </div>
      )}
    </div>
  );
};

// Album Card Component
export const AlbumCard = ({
  album,
  onImageClick,
  onCardClick,
  onApplyNow,
  showActions = true,
  showStats = true,
  className = "",
}) => {
  const [hoveredAlbum, setHoveredAlbum] = useState(null);

  const getBadgeVariant = (status, viewCount) => {
    if (viewCount > 200) return "featured";
    if (status === "new") return "new";
    return "category";
  };

  const getBadgeText = (status, viewCount) => {
    if (viewCount > 200) return "مميز";
    if (status === "new") return "جديد";
    return "";
  };

  const badges = [
    getBadgeText(album.status, album.view_count) && {
      variant: getBadgeVariant(album.status, album.view_count),
      text: getBadgeText(album.status, album.view_count),
    },
    {
      variant: "category",
      text: album.category === "macrame" ? "مكرمية" : "برواز",
    },
  ].filter(Boolean);

  const overlayContent = (
    <div className="flex items-center gap-2 text-white">
      <button
        onClick={(e) => {
          e.stopPropagation();
          onImageClick && onImageClick(album, 0);
        }}
        className="bg-black bg-opacity-20 backdrop-blur-sm p-2 rounded-full hover:bg-opacity-30 transition-all duration-200"
      >
        <Eye size={16} />
      </button>
      <div className="flex items-center gap-1 bg-black bg-opacity-20 backdrop-blur-sm px-2 py-1 rounded-full">
        <Heart size={14} />
        <span className="text-sm">
          {Math.floor((album.view_count || 0) / 10)}
        </span>
      </div>
    </div>
  );

  return (
    <BaseCard
      className={className}
      onMouseEnter={() => setHoveredAlbum(album.id)}
      onMouseLeave={() => setHoveredAlbum(null)}
    >
      <ImageCard
        src={
          album.cover_image ||
          album.cover_media?.url ||
          "/images/placeholder.jpg"
        }
        alt={album.title}
        aspectRatio="aspect-video md:aspect-square"
        badges={badges}
        stats={{ count: album.media?.length || 1, label: "صور" }}
        overlayContent={overlayContent}
        onClick={() => onCardClick && onCardClick(album)}
      />

      <div className="p-6">
        <h3
          className="text-xl font-bold text-purple mb-2 group-hover:text-pink transition-colors duration-300 line-clamp-2 cursor-pointer"
          onClick={() => onCardClick && onCardClick(album)}
        >
          {album.title}
        </h3>

        <p className="text-gray-600 mb-4 line-clamp-2 text-sm leading-relaxed">
          {album.description || "لا يوجد وصف متاح"}
        </p>

        {showStats && (
          <div className="flex items-center justify-between mb-4 text-sm text-gray-500">
            <span>{album.media?.length || 1} صورة</span>
            <span>{album.view_count || 0} مشاهدة</span>
          </div>
        )}

        {showActions && (
          <div className="flex gap-3">
            <ApplyNow album={album} className="flex-1 text-sm py-2">
              اطلب الآن
            </ApplyNow>

            <button
              onClick={() => onCardClick && onCardClick(album)}
              className="px-4 py-2 border-2 border-purple text-purple hover:bg-purple hover:text-white rounded-full transition-all duration-300 text-sm flex items-center gap-2"
            >
              <Eye size={16} />
              <span>عرض</span>
            </button>
          </div>
        )}
      </div>

      {/* Reflection Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white to-transparent opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none"></div>
    </BaseCard>
  );
};

// Review Card Component
export const ReviewCard = ({
  review,
  showImage = true,
  showProduct = true,
  onClick,
  className = "",
}) => {
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

  return (
    <BaseCard className={className} onClick={onClick}>
      {showImage && (review.album_cover || review.attached_image) && (
        <ImageCard
          src={review.album_cover || review.attached_image}
          alt={
            review.album_cover
              ? `كفر ألبوم ${review.album_title}`
              : `تقييم ${review.author_name}`
          }
          aspectRatio="aspect-video"
          badges={[
            {
              variant: "category",
              text:
                review.album_title?.includes("برواز") ||
                review.album_title?.includes("إطار")
                  ? "برواز"
                  : "مكرمية",
            },
          ]}
        />
      )}

      <div className="p-6">
        {/* Rating and Quote */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1">
            {renderStars(review.rating)}
          </div>
          <Quote className="text-purple opacity-30" size={24} />
        </div>

        {/* Review Text */}
        <p className="text-gray-700 leading-relaxed mb-4 line-clamp-4">
          "{review.text}"
        </p>

        {/* Author Info */}
        <div className="border-t border-gray-100 pt-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-bold text-purple flex items-center gap-2">
                <User size={16} />
                {review.author_name}
              </h4>
            </div>
            <div className="text-right text-xs text-gray-500">
              <div className="flex items-center gap-1 mb-1">
                <Calendar size={12} />
                {formatDate(review.created_at)}
              </div>
            </div>
          </div>

          {/* Product Info */}
          {showProduct && review.album_title && (
            <div className="mt-3 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3 hover:bg-gray-100 transition-colors rounded-lg p-2 -m-2">
                {review.album_cover && (
                  <img
                    src={review.album_cover}
                    alt={review.album_title}
                    className="w-10 h-10 rounded object-cover"
                    loading="lazy"
                  />
                )}
                <div className="flex-1">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">المنتج:</span>{" "}
                    <span className="text-purple hover:text-purple-hover font-medium">
                      {review.album_title}
                    </span>
                  </p>
                </div>
                <ArrowLeft className="text-purple" size={16} />
              </div>
            </div>
          )}
        </div>
      </div>
    </BaseCard>
  );
};

// Contact Info Card Component
export const ContactCard = ({
  icon: Icon,
  title,
  description,
  action,
  actionText,
  borderColor = "border-purple",
  iconBgColor = "bg-purple",
  className = "",
}) => {
  return (
    <BaseCard className={`border-r-4 ${borderColor} ${className}`}>
      <div className="flex items-start gap-4 p-6">
        <div className={`${iconBgColor} text-white p-3 rounded-full`}>
          <Icon size={24} />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-600 mb-3">{description}</p>
          {action && (
            <button
              onClick={action}
              className={`${iconBgColor.replace(
                "bg-",
                "bg-"
              )} text-white px-4 py-2 rounded-lg hover:opacity-90 transition-colors flex items-center gap-2 cursor-pointer`}
            >
              <Icon size={16} />
              {actionText}
            </button>
          )}
        </div>
      </div>
    </BaseCard>
  );
};

// Stats Card Component
export const StatsCard = ({
  title,
  value,
  subtext,
  icon: Icon,
  valueColor = "text-gray-800",
  iconBg = "bg-purple",
  className = "",
}) => {
  return (
    <BaseCard className={className}>
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className={`text-3xl font-bold ${valueColor}`}>{value}</p>
            {subtext && <p className="text-sm text-gray-500 mt-1">{subtext}</p>}
          </div>
          <div className={`${iconBg} p-3 rounded-full`}>
            <Icon size={24} className="text-white" />
          </div>
        </div>
      </div>
    </BaseCard>
  );
};

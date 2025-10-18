import { useState } from "react";
import { useAlbumBySlug, useRelatedAlbums } from "../hooks/queries/useAlbums";
import { useAlbumReviews } from "../hooks/queries/useReviews";
import { usePublicSettings } from "../hooks/queries/useSettings";
import { useParams, useNavigate } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import {
  ArrowRight,
  Eye,
  Heart,
  Share,
  Palette,
  MessageCircle,
  Star,
  Users,
} from "lucide-react";
import Badge from "../components/common/Badge";
import ApplyNow from "../components/ApplyNow";
import useAppStore from "../store/useAppStore";
import Loading from "../utils/Loading";
import { useLikes } from "../hooks/useLikes";
import AlbumCard from "../components/common/AlbumCard";
import { prepareAlbumImages } from "../utils/albumUtils";
import Error from "../utils/Error";

export default function AlbumDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const { data: settings } = usePublicSettings();

  const { data: album, isLoading: loading, error } = useAlbumBySlug(slug);

  const { data: relatedAlbums = [] } = useRelatedAlbums(
    album?.category,
    album?.id,
    3
  );

  const { data: reviews = [] } = useAlbumReviews(album?.id);

  const {
    likesCount,
    isLiked,
    isLoading: likesLoading,
    toggleLike,
  } = useLikes(album?.id, album?.likes_count || 0);

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const { openLightbox } = useAppStore();

  // ✅ فحص التحميل أولاً
  if (loading) {
    return <Loading />;
  }

  // ✅ فحص الخطأ ثانياً
  if (error) {
    return <Error />;
  }

  // ✅ فحص عدم وجود الألبوم ثالثاً
  if (!album) {
    return (
      <div className="min-h-screen bg-beige flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            الألبوم غير موجود
          </h2>
          <button
            onClick={() => navigate("/gallery")}
            className="px-6 py-2 bg-purple text-white rounded-full hover:bg-purple-hover transition-colors"
          >
            العودة للمعرض
          </button>
        </div>
      </div>
    );
  }

  // ✅ الآن فقط يمكننا استخدام album بأمان
  const albumMedia = album.media || [];

  const validMedia = albumMedia.filter((media) => {
    if (!media) {
      console.warn("Found null/undefined media item");
      return false;
    }
    if (!media.url || typeof media.url !== "string") {
      console.warn("Found media item without valid URL:", media);
      return false;
    }
    return true;
  });

  const albumTags = Array.isArray(album.tags)
    ? album.tags
    : typeof album.tags === "string"
    ? JSON.parse(album.tags)
    : [];

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;

  // ✅ Functions
  const handleImageClick = (imageIndex) => {
    if (!album?.media || album.media.length === 0) return;

    const images = album.media.map((media) => ({
      url: media.url,
      alt: media.alt || album.title,
      title: album.title,
    }));
    openLightbox(images, imageIndex);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: album.title,
        text: album.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("تم نسخ الرابط!");
    }
  };

  const handleWhatsAppContact = () => {
    const whatsappNumber = settings?.whatsapp_owner || "970599123456";

    const cleanPhone = whatsappNumber
      .replace(/\s+/g, "")
      .replace(/[\-\(\)\+]/g, "")
      .replace(/^00/, "");

    const message = `مرحباً ساندي 👋

أريد الاستفسار عن هذا المنتج:
📦 *${album.title}*

${album.description ? `الوصف: ${album.description.substring(0, 100)}...` : ""}

شكراً 🌷`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleRelatedAlbumClick = (relatedAlbum) => {
    if (!relatedAlbum.slug) {
      console.error("Related album missing slug:", relatedAlbum);
      return;
    }
    navigate(`/album/${relatedAlbum.slug}`);
  };

  const handleRelatedImageClick = (relatedAlbum, imageIndex = 0) => {
    const images = prepareAlbumImages(relatedAlbum);
    openLightbox(images, imageIndex);
  };

  // ✅ JSX
  return (
    <div className="min-h-screen bg-beige py-8">
      <div className="container mx-auto px-4 mb-6">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2 text-gray-600"
        >
          <button
            onClick={() => navigate("/gallery")}
            className="flex items-center gap-2 hover:text-purple transition-colors"
          >
            <ArrowRight size={20} />
            <span>العودة للمعرض</span>
          </button>
          <span>/</span>
          <span className="text-purple">{album.title}</span>
        </motion.div>
      </div>

      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* المعرض */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            {validMedia.length > 0 ? (
              <>
                <div className="mb-4">
                  <div className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl group cursor-pointer">
                    <img
                      src={
                        validMedia[selectedImageIndex]?.url ||
                        "/images/placeholder.jpg"
                      }
                      alt={validMedia[selectedImageIndex]?.alt || album.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onClick={() => handleImageClick(selectedImageIndex)}
                      loading="lazy"
                    />
                  </div>
                </div>
                {validMedia.length > 1 && (
                  <div className="grid grid-cols-4 gap-2">
                    {validMedia.map((media, index) => (
                      <button
                        key={media.id || `media-${index}`}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`aspect-square rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                          selectedImageIndex === index
                            ? "border-purple scale-105"
                            : "border-gray-200 hover:border-purple"
                        }`}
                      >
                        <img
                          src={media.url}
                          alt={media.alt || album.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="aspect-square rounded-2xl bg-gray-200 flex items-center justify-center">
                <p className="text-gray-500">لا توجد صور متاحة</p>
              </div>
            )}
          </motion.div>

          {/* التفاصيل */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6"
          >
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Badge variant="category">
                  {album.category === "macrame" ? "مكرمية" : "برواز"}
                </Badge>
              </div>

              <h1 className="text-3xl lg:text-4xl font-bold text-purple mb-4">
                {album.title}
              </h1>

              <div className="flex items-center gap-6 text-gray-600">
                <div className="flex items-center gap-1">
                  <Eye size={20} />
                  <span>{album.view_count || 0} مشاهدة</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleLike();
                  }}
                  disabled={likesLoading}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-200 ${
                    isLiked
                      ? "bg-red-500 text-white hover:bg-red-600"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  } ${
                    likesLoading
                      ? "opacity-50 cursor-not-allowed"
                      : "cursor-pointer"
                  }`}
                  aria-label={isLiked ? "إلغاء الإعجاب" : "إضافة إعجاب"}
                >
                  <Heart
                    size={20}
                    className={`${isLiked ? "fill-current" : ""}`}
                  />
                  <span>{likesCount} إعجاب</span>
                </button>
                {reviews.length > 0 && (
                  <div className="flex items-center gap-1">
                    <Star size={20} className="text-yellow-500" />
                    <span>
                      {averageRating.toFixed(1)} ({reviews.length} تقييم)
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-purple mb-3">وصف المنتج</h3>
              <p className="text-gray-700 leading-relaxed">
                {album.description || "لا يوجد وصف متاح"}
              </p>
            </div>

            {album.maker_note && (
              <div className="bg-gradient-to-br from-purple to-pink rounded-2xl p-6 text-white shadow-lg">
                <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                  <Palette size={20} />
                  كلمة من الصانعة
                </h3>
                <p className="leading-relaxed opacity-95">{album.maker_note}</p>
                <div className="mt-4 flex items-center gap-3">
                  <img
                    src="/logo.jpg"
                    alt="ساندي"
                    className="w-10 h-10 rounded-full border-2 border-white"
                    loading="lazy"
                  />
                  <div>
                    <p className="font-semibold">ساندي</p>
                    <p className="text-sm opacity-75">فنانة المكرمية</p>
                  </div>
                </div>
              </div>
            )}

            {albumTags.length > 0 && (
              <div>
                <h3 className="text-lg font-bold text-purple mb-3">
                  الكلمات المفتاحية
                </h3>
                <div className="flex flex-wrap gap-2">
                  {albumTags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-white text-purple px-3 py-2 rounded-full text-sm font-medium shadow-md hover:shadow-lg transition-shadow"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-4">
              <ApplyNow album={album} className="w-full py-4 text-lg">
                اطلب هذا المنتج الآن
              </ApplyNow>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={handleWhatsAppContact}
                  className="bg-green text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                >
                  <MessageCircle size={20} />
                  استفسر بالواتساب
                </button>
                <button
                  onClick={handleShare}
                  className="bg-white text-purple border-2 border-purple px-6 py-3 rounded-xl font-semibold hover:bg-purple hover:text-white transition-colors flex items-center justify-center gap-2"
                >
                  <Share size={20} />
                  مشاركة
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* التقييمات */}
        {reviews.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-16"
          >
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-purple mb-6 flex items-center gap-2">
                <Users size={24} />
                آراء العملاء ({reviews.length})
              </h3>
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className="border-b border-gray-100 pb-6 last:border-b-0"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-800">
                          {review.author_name}
                        </h4>
                        <div className="flex items-center gap-1 mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={16}
                              className={`${
                                i < review.rating
                                  ? "text-yellow-500 fill-current"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <span className="text-gray-500 text-sm">
                        {new Date(review.created_at).toLocaleDateString("ar")}
                      </span>
                    </div>
                    <p className="text-gray-700 leading-relaxed">
                      {review.text}
                    </p>
                    {review.attached_image && (
                      <div className="mt-3">
                        <img
                          src={review.attached_image}
                          alt="صورة التقييم"
                          className="w-24 h-24 object-cover rounded-lg"
                          loading="lazy"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* الألبومات المشابهة */}
        {relatedAlbums.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-16"
          >
            <h3 className="text-2xl font-bold text-purple mb-8 text-center">
              منتجات مشابهة
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedAlbums.map((relatedAlbum, index) => (
                <AlbumCard
                  key={relatedAlbum.id}
                  album={relatedAlbum}
                  index={index}
                  isVisible={true}
                  onImageClick={handleRelatedImageClick}
                  onAlbumClick={handleRelatedAlbumClick}
                  variant="gallery"
                />
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

/* eslint-disable no-unused-vars */
// client/src/pages/AlbumDetail.jsx - محدث للعمل مع API
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
import Lightbox from "../components/common/Lightbox";
import useAppStore from "../store/useAppStore";
import Loading from "../utils/Loading";
import { albumsAPI } from "../api/albums";
import { reviewsAPI } from "../api/reviews";
import Layout from "../components/layout/Layout";

export default function AlbumDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [relatedAlbums, setRelatedAlbums] = useState([]);
  const [reviews, setReviews] = useState([]);
  const { openLightbox } = useAppStore();
  const [imageLoadErrors, setImageLoadErrors] = useState(new Set());

  useEffect(() => {
    const fetchAlbumData = async () => {
      try {
        setLoading(true);
        setError(null);

        // جلب بيانات الألبوم
        const albumResponse = await albumsAPI.getBySlug(slug);
        if (!albumResponse.success) {
          throw new Error("Album not found");
        }

        const albumData = albumResponse.data;
        setAlbum(albumData);

        // جلب الألبومات المشابهة
        try {
          const relatedResponse = await albumsAPI.getAll({
            category: albumData.category,
            limit: 3,
            page: 1,
          });
          if (relatedResponse.success) {
            // فلترة الألبوم الحالي من النتائج
            const filtered = relatedResponse.data.filter(
              (item) => item.id !== albumData.id
            );
            setRelatedAlbums(filtered.slice(0, 3));
          }
        } catch (relatedError) {
          console.warn("Failed to load related albums:", relatedError);
        }

        // جلب التقييمات للألبوم
        try {
          const reviewsResponse = await reviewsAPI.getAll({
            linked_album_id: albumData.id,
            limit: 10,
          });
          if (reviewsResponse.success) {
            setReviews(reviewsResponse.data);
          }
        } catch (reviewsError) {
          console.warn("Failed to load reviews:", reviewsError);
        }
      } catch (err) {
        console.error("Error loading album:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchAlbumData();
    }
  }, [slug]);

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
    const message = `مرحباً ساندي، أريد الاستفسار عن: ${album.title}`;
    const whatsappUrl = `https://wa.me/970599123456?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleImageError = (imageUrl, index) => {
    console.warn(`Failed to load image at index ${index}:`, imageUrl);
    setImageLoadErrors((prev) => new Set(prev).add(index));
  };

  // معالجة حالات التحميل والأخطاء
  if (loading) {
    return <Loading />;
  }

  if (error || !album) {
    return (
      <Layout>
        <div className="min-h-screen bg-beige flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">😔</div>
            <h2 className="text-xl font-bold text-gray-700 mb-2">
              {error === "Album not found" ? "المنتج غير موجود" : "حدث خطأ"}
            </h2>
            <p className="text-gray-600 mb-4">
              {error === "Album not found"
                ? "لم نتمكن من العثور على المنتج المطلوب"
                : "حدث خطأ في تحميل البيانات"}
            </p>
            <button
              onClick={() => navigate("/gallery")}
              className="bg-purple text-white px-6 py-3 rounded-lg hover:bg-purple-hover transition-colors"
            >
              العودة للمعرض
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  // حساب متوسط التقييمات
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;

  // معالجة البيانات المفقودة
  // معالجة البيانات المفقودة وفلترة الصور الصالحة
  const albumMedia = album.media || [];

  // إضافة تحقق من صحة بيانات الصور
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

  const albumSpecs = album.specifications || {};
  const albumTags = Array.isArray(album.tags)
    ? album.tags
    : typeof album.tags === "string"
    ? JSON.parse(album.tags)
    : [];

  return (
    <div className="min-h-screen bg-beige py-8">
      {/* التنقل العلوي */}
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
          {/* قسم الصور */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            {albumMedia.length > 0 ? (
              <>
                {/* الصورة الرئيسية */}
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

                {/* الصور المصغرة */}
                {/* الصور المصغرة - إضافة تحقق إضافي */}
                {validMedia.length > 1 && (
                  <div className="grid grid-cols-4 gap-2">
                    {validMedia.map((media, index) => {
                      // تحقق إضافي من صحة البيانات
                      if (!media.url) {
                        console.warn("Media missing URL at index:", index);
                        return null;
                      }

                      return (
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
                      );
                    })}
                  </div>
                )}
              </>
            ) : (
              <div className="aspect-square rounded-2xl bg-gray-200 flex items-center justify-center">
                <p className="text-gray-500">لا توجد صور متاحة</p>
              </div>
            )}
          </motion.div>

          {/* قسم التفاصيل */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6"
          >
            {/* العنوان والشارات */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                {album.status === "published" && (
                  <Badge variant="featured">منشور</Badge>
                )}
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
                <div className="flex items-center gap-1">
                  <Heart size={20} />
                  <span>{Math.floor((album.view_count || 0) / 10)} إعجاب</span>
                </div>
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

            {/* الوصف */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-purple mb-3">وصف المنتج</h3>
              <p className="text-gray-700 leading-relaxed">
                {album.description || "لا يوجد وصف متاح"}
              </p>
            </div>

            {/* ملاحظة الصانعة */}
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

            {/* الكلمات المفتاحية */}
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

            {/* أزرار العمل */}
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

        {/* قسم التقييمات */}
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

        {/* منتجات مشابهة */}
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
              {relatedAlbums.map((relatedAlbum) => (
                <div
                  key={relatedAlbum.id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer"
                  onClick={() => navigate(`/album/${relatedAlbum.slug}`)}
                >
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={
                        relatedAlbum.cover_image ||
                        relatedAlbum.cover_media?.url
                      }
                      alt={relatedAlbum.title}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                    />
                  </div>
                  <div className="p-4">
                    <h4 className="font-bold text-purple mb-2">
                      {relatedAlbum.title}
                    </h4>
                    <div className="flex items-center justify-between text-gray-600 text-sm">
                      <span>{relatedAlbum.view_count || 0} مشاهدة</span>
                      <Badge variant="category">
                        {relatedAlbum.category === "macrame"
                          ? "مكرمية"
                          : "برواز"}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* مكون Lightbox */}
      <Lightbox />
    </div>
  );
}

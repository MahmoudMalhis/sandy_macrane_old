/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
// client/src/pages/Gallery.jsx - محدث للعمل مع API
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, Heart, Filter } from "lucide-react";
import Badge from "../components/common/Badge";
import ApplyNow from "../components/ApplyNow";
import Lightbox from "../components/common/Lightbox";
import useAppStore from "../store/useAppStore";
import Loading from "../utils/Loading";
import { albumsAPI } from "../api/albums";
import { toast } from "react-hot-toast";

export default function Gallery() {
  const navigate = useNavigate();
  const [albums, setAlbums] = useState([]);
  const [filteredAlbums, setFilteredAlbums] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0,
  });
  const [loadingMore, setLoadingMore] = useState(false);
  const { openLightbox } = useAppStore();

  // جلب الألبومات من API
  useEffect(() => {
    fetchAlbums(true);
  }, [activeFilter, searchTerm]);

  // البحث مع debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm !== "") {
        fetchAlbums(true); // إعادة تعيين البحث
      } else if (searchTerm === "" && albums.length === 0) {
        fetchAlbums();
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const fetchAlbums = useCallback(
    async (reset = false) => {
      try {
        if (reset) {
          setLoading(true);
          setPagination((prev) => ({ ...prev, page: 1 }));
        } else if (pagination.page > 1) {
          setLoadingMore(true);
        } else {
          setLoading(true);
        }

        const params = {
          page: reset ? 1 : pagination.page,
          limit: pagination.limit,
          category: activeFilter !== "all" ? activeFilter : undefined,
          search: searchTerm || undefined,
          sort: "created_at",
        };

        const response = await albumsAPI.getAll(params);

        if (response.success) {
          const newAlbums = reset
            ? response.data
            : [...albums, ...response.data];

          setAlbums(newAlbums);
          setFilteredAlbums(newAlbums);
          setPagination({
            page: response.pagination.page,
            limit: response.pagination.limit,
            total: response.pagination.total,
            pages: response.pagination.pages,
          });
        } else {
          toast.error("فشل في تحميل المعرض");
        }
      } catch (error) {
        console.error("Error fetching albums:", error);
        toast.error("حدث خطأ في تحميل البيانات");
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [activeFilter, pagination.page, pagination.limit]
  );

  // تحميل المزيد
  const loadMore = () => {
    if (pagination.page < pagination.pages && !loadingMore) {
      setPagination((prev) => ({ ...prev, page: prev.page + 1 }));
      setTimeout(fetchAlbums, 100);
    }
  };

  // حساب الإحصائيات للفلاتر
  const filters = [
    { key: "all", label: "الكل", count: pagination.total },
    {
      key: "macrame",
      label: "مكرمية",
      count: albums.filter((a) => a.category === "macrame").length,
    },
    {
      key: "frame",
      label: "براويز",
      count: albums.filter((a) => a.category === "frame").length,
    },
  ];

  const getBadgeVariant = (status) => {
    switch (status) {
      case "published":
        return "featured";
      case "draft":
        return "new";
      default:
        return "category";
    }
  };

  const getBadgeText = (status, viewCount) => {
    if (viewCount > 200) return "مميز";
    if (status === "published") return "";
    return "جديد";
  };

  const handleImageClick = (album, imageIndex = 0) => {
    if (!album.media || album.media.length === 0) {
      // إذا لم تكن هناك صور متعددة، اعرض الصورة الرئيسية
      const images = [
        {
          url: album.cover_image || album.cover_media?.url,
          alt: album.title,
          title: album.title,
        },
      ];
      openLightbox(images, 0);
      return;
    }

    const images = album.media.map((media) => ({
      url: media.url,
      alt: media.alt || album.title,
      title: album.title,
    }));
    openLightbox(images, imageIndex);
  };

  const handleAlbumClick = (album) => {
    if (!album.slug) {
      console.error("Album missing slug:", album);
      return;
    }
    navigate(`/album/${album.slug}`);
  };

  if (loading && albums.length === 0) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-beige py-8">
      {/* العنوان الرئيسي */}
      <div className="container mx-auto px-4 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl lg:text-5xl font-bold text-purple mb-4">
            معرض الأعمال
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            اكتشف مجموعتنا الكاملة من أعمال المكرمية والبراويز المصنوعة يدوياً
            بحب وإتقان
          </p>
          <div className="w-24 h-1 bg-pink mx-auto mt-6 rounded-full"></div>
        </motion.div>

        {/* أدوات الفلترة والبحث */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            {/* مربع البحث */}
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder="ابحث في المجموعات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-4 pr-10 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple focus:border-transparent"
              />
              <Filter
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
            </div>

            {/* أزرار الفلترة */}
            <div className="flex gap-2 flex-wrap">
              {filters.map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => setActiveFilter(filter.key)}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 cursor-pointer ${
                    activeFilter === filter.key
                      ? "bg-purple text-white shadow-lg transform scale-105"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {filter.label}
                  <span className="mr-2 text-sm opacity-75">
                    ({filter.count || 0})
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* معلومات النتائج */}
          {!loading && (
            <div className="mt-4 text-center text-sm text-gray-600">
              عرض {albums.length} من أصل {pagination.total} منتج
            </div>
          )}
        </motion.div>
      </div>

      {/* شبكة الألبومات */}
      <div className="container mx-auto px-4">
        <AnimatePresence mode="wait">
          {!loading && filteredAlbums.length === 0 ? (
            <motion.div
              key="no-results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-16"
            >
              <div className="text-gray-400 text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-gray-700 mb-2">
                لا توجد نتائج
              </h3>
              <p className="text-gray-600">
                {searchTerm
                  ? `لا توجد نتائج للبحث "${searchTerm}"`
                  : "لا توجد منتجات في هذا التصنيف حالياً"}
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
            >
              {filteredAlbums.map((album, index) => (
                <motion.div
                  key={album.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:scale-105"
                >
                  {/* الصورة */}
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={
                        album.cover_image ||
                        album.cover_media?.url ||
                        "/images/placeholder.jpg"
                      }
                      alt={album.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 cursor-pointer"
                      loading="lazy"
                      onClick={() => handleAlbumClick(album)}
                    />

                    {/* تدرج */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-60 transition-opacity duration-300"></div>

                    {/* الشارات */}
                    <div className="absolute top-4 right-4 flex gap-2">
                      {getBadgeText(album.status, album.view_count) && (
                        <Badge variant={getBadgeVariant(album.status)}>
                          {getBadgeText(album.status, album.view_count)}
                        </Badge>
                      )}
                      <Badge variant="category">
                        {album.category === "macrame" ? "مكرمية" : "برواز"}
                      </Badge>
                    </div>

                    {/* عدد الصور */}
                    <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm flex items-center gap-1">
                      <Eye size={14} />
                      <span>{album.media?.length || 1} صور</span>
                    </div>

                    {/* معلومات عند التمرير */}
                    <div className="absolute bottom-4 right-4 transform transition-all duration-300 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100">
                      <div className="flex items-center gap-2 text-white">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleImageClick(album, 0);
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
                    </div>
                  </div>

                  {/* المحتوى */}
                  <div className="p-6">
                    <h3
                      className="text-xl font-bold text-purple mb-2 group-hover:text-pink transition-colors duration-300 line-clamp-2 cursor-pointer"
                      onClick={() => handleAlbumClick(album)}
                    >
                      {album.title}
                    </h3>

                    <p className="text-gray-600 mb-4 line-clamp-2 text-sm leading-relaxed">
                      {album.description || "لا يوجد وصف متاح"}
                    </p>

                    {/* إحصائيات */}
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
                        onClick={() => handleAlbumClick(album)}
                        className="px-4 py-2 border-2 border-purple text-purple hover:bg-purple hover:text-white rounded-full transition-all duration-300 text-sm flex items-center gap-2"
                      >
                        <Eye size={16} />
                        <span>عرض</span>
                      </button>
                    </div>
                  </div>

                  {/* تأثير الانعكاس */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white to-transparent opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none"></div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* زر تحميل المزيد */}
        {!loading && pagination.page < pagination.pages && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mt-12"
          >
            <button
              onClick={loadMore}
              disabled={loadingMore}
              className={`bg-purple text-white px-8 py-4 rounded-xl font-semibold hover:bg-purple-hover transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 ${
                loadingMore ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loadingMore ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  جاري التحميل...
                </div>
              ) : (
                `تحميل المزيد (${pagination.total - albums.length} منتج متبقي)`
              )}
            </button>
          </motion.div>
        )}
      </div>

      {/* مكون Lightbox */}
      <Lightbox />
    </div>
  );
}

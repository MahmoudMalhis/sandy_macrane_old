import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Filter } from "lucide-react";
import AlbumCard from "../components/common/AlbumCard";
import ApplyNow from "../components/ApplyNow";
import useAppStore from "../store/useAppStore";
import Loading from "../utils/Loading";
import { albumsAPI } from "../api/albums";
import { toast } from "react-hot-toast";
import { prepareAlbumImages } from "../utils/albumUtils";

export default function Gallery() {
  const navigate = useNavigate();
  const [albums, setAlbums] = useState([]);
  const [filteredAlbums, setFilteredAlbums] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 6,
    total: 0,
    pages: 0,
  });
  const [loadingMore, setLoadingMore] = useState(false);
  const { openLightbox } = useAppStore();

  // ✅ دالة fetchAlbums بدون dependencies خطيرة
  const fetchAlbums = async (reset = false) => {
    try {
      if (reset) {
        setLoading(true);
      } else {
        setLoadingMore(true);
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
        if (reset) {
          setAlbums(response.data);
          setFilteredAlbums(response.data);
          setPagination({
            page: 1,
            limit: response.pagination.limit,
            total: response.pagination.total,
            pages: response.pagination.pages,
          });
        } else {
          setAlbums((prev) => [...prev, ...response.data]);
          setFilteredAlbums((prev) => [...prev, ...response.data]);
          setPagination((prev) => ({
            ...prev,
            page: response.pagination.page,
            total: response.pagination.total,
            pages: response.pagination.pages,
          }));
        }
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
  };

  // ✅ useEffect واحد فقط للتحميل الأولي وتغيير الفلاتر (مع debounce)
  useEffect(() => {
    const timeoutId = setTimeout(
      () => {
        fetchAlbums(true);
      },
      searchTerm ? 500 : 0
    ); // debounce فقط للبحث

    return () => clearTimeout(timeoutId);
  }, [activeFilter, searchTerm]);

  // ✅ useEffect منفصل للـ pagination فقط
  useEffect(() => {
    if (pagination.page > 1) {
      fetchAlbums(false);
    }
  }, [pagination.page]);

  // ✅ دالة loadMore بسيطة
  const loadMore = () => {
    if (pagination.page < pagination.pages && !loadingMore) {
      setPagination((prev) => ({ ...prev, page: prev.page + 1 }));
    }
  };

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

  const handleImageClick = (album, imageIndex = 0) => {
    const images = prepareAlbumImages(album);
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
          </p>
          <div className="w-24 h-1 bg-pink mx-auto mt-6 rounded-full"></div>
        </motion.div>

        {/* شريط البحث والفلترة */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* حقل البحث */}
            <div className="flex-1 w-full">
              <input
                type="text"
                placeholder="ابحث في المعرض..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple focus:outline-none transition-colors"
              />
            </div>

            {/* أزرار الفلترة */}
            <div className="flex gap-2 flex-wrap justify-center">
              <Filter className="text-purple my-auto" size={20} />
              {filters.map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => setActiveFilter(filter.key)}
                  className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                    activeFilter === filter.key
                      ? "bg-purple text-white shadow-lg"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {filter.label}
                  <span className="mr-2 text-sm">({filter.count})</span>
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* عدد النتائج */}
        <div className="text-center text-gray-600 mb-4">
          عرض {filteredAlbums.length} من أصل {pagination.total} منتج
        </div>
      </div>

      {/* شبكة الألبومات */}
      <div className="container mx-auto px-4">
        {filteredAlbums.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="bg-white rounded-xl shadow-lg p-12 max-w-md mx-auto">
              <div className="text-gray-300 text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                لا توجد نتائج
              </h3>
              <p className="text-gray-600">
                لم نتمكن من العثور على ألبومات تطابق بحثك
              </p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setActiveFilter("all");
                }}
                className="mt-4 px-6 py-2 bg-purple text-white rounded-lg hover:bg-purple-hover transition-colors"
              >
                إعادة تعيين البحث
              </button>
            </div>
          </motion.div>
        ) : (
          <AnimatePresence mode="wait">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredAlbums.map((album, index) => (
                <AlbumCard
                  key={album.id}
                  album={album}
                  index={index}
                  isVisible={true}
                  onImageClick={handleImageClick}
                  onAlbumClick={handleAlbumClick}
                  variant="gallery"
                />
              ))}
            </div>
          </AnimatePresence>
        )}

        {/* زر تحميل المزيد */}
        {pagination.page < pagination.pages && filteredAlbums.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mt-12"
          >
            <button
              onClick={loadMore}
              disabled={loadingMore}
              className="px-8 py-4 bg-purple text-white rounded-full hover:bg-purple-hover transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loadingMore ? "جاري التحميل..." : "تحميل المزيد"}
            </button>
          </motion.div>
        )}
      </div>

      {/* قسم الدعوة للعمل */}
      {filteredAlbums.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="container mx-auto px-4 mt-16"
        >
          <div className="bg-gradient-to-r from-purple to-pink rounded-2xl p-8 lg:p-12 text-center text-white shadow-2xl">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              لم تجد ما تبحث عنه؟
            </h2>
            <p className="text-lg mb-6 opacity-90">
              يمكننا تصميم قطعة خاصة لك بناءً على رغباتك
            </p>
            <ApplyNow className="inline-block">اطلب تصميم مخصص</ApplyNow>
          </div>
        </motion.div>
      )}
    </div>
  );
}

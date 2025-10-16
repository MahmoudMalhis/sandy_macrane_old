// client/src/pages/Gallery.jsx - نسخة محسّنة

import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { Filter, Loader } from "lucide-react";
import AlbumCard from "../components/common/AlbumCard";
import ApplyNow from "../components/ApplyNow";
import useAppStore from "../store/useAppStore";
import Loading from "../utils/Loading";
import { useInfiniteAlbums } from "../hooks/queries/useInfiniteAlbums";
import { prepareAlbumImages } from "../utils/albumUtils";
import Error from "../utils/Error";

export default function Gallery() {
  const navigate = useNavigate();
  const { openLightbox } = useAppStore();
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const loadMoreRef = useRef(null);

  // ✅ Debounce البحث (بدون useTransition - غير ضروري هنا)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearch(searchInput);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchInput]);

  // ✅ Memoize filters لمنع re-creation غير ضرورية
  const filters = useMemo(
    () => ({
      limit: 6,
      category: activeFilter !== "all" ? activeFilter : undefined,
      search: debouncedSearch || undefined,
      sort: "created_at",
    }),
    [activeFilter, debouncedSearch]
  );

  // ✅ استخدام Hook المُحسّن
  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    isError,
  } = useInfiniteAlbums(filters);

  // ✅ Memoize albums list
  const albums = useMemo(() => {
    if (!data?.pages) return [];
    return data.pages.flatMap((page) => page.data);
  }, [data]);

  const totalCount = data?.pages?.[0]?.pagination?.total || 0;

  // ✅ Intersection Observer لـ Infinite Scroll
  useEffect(() => {
    if (!loadMoreRef.current || !hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(loadMoreRef.current);

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // ✅ Memoized callbacks
  const handleFilterChange = useCallback((filter) => {
    setActiveFilter(filter);
  }, []);

  const handleImageClick = useCallback(
    (album, imageIndex = 0) => {
      const images = prepareAlbumImages(album);
      openLightbox(images, imageIndex);
    },
    [openLightbox]
  );

  const handleAlbumClick = useCallback(
    (album) => {
      if (!album.slug) {
        console.error("Album missing slug:", album);
        return;
      }
      navigate(`/album/${album.slug}`);
    },
    [navigate]
  );

  const handleResetFilters = useCallback(() => {
    setSearchInput("");
    setDebouncedSearch("");
    setActiveFilter("all");
  }, []);

  const categories = [
    { id: "all", label: "الكل", icon: "🎨" },
    { id: "macrame", label: "مكرمية", icon: "🧵" },
    { id: "frame", label: "براويز", icon: "🖼️" },
  ];

  // ✅ Loading state فقط للتحميل الأولي
  if (isLoading && albums.length === 0) {
    return <Loading />;
  }

  if (isError) {
    return <Error />;
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
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple focus:outline-none transition-colors"
              />
              {/* ✅ مؤشر البحث النشط */}
              {searchInput !== debouncedSearch && (
                <p className="text-sm text-gray-500 mt-2 flex items-center gap-2">
                  <Loader className="animate-spin" size={14} />
                  جاري البحث...
                </p>
              )}
            </div>

            {/* أزرار الفلترة */}
            <div className="flex gap-2 flex-wrap justify-center">
              <Filter className="text-purple my-auto" size={20} />
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleFilterChange(category.id)}
                  className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                    activeFilter === category.id
                      ? "bg-purple text-white shadow-lg"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <span className="mr-2 text-sm">{category.icon}</span>
                  {category.label}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* عدد النتائج */}
        <div className="text-center text-gray-600 mb-4">
          عرض {albums.length} من أصل {totalCount} منتج
        </div>
      </div>

      {/* شبكة الألبومات */}
      <div className="container mx-auto px-4">
        {albums.length === 0 ? (
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
              <p className="text-gray-600 mb-4">
                لم نتمكن من العثور على ألبومات تطابق بحثك
              </p>

              {/* ✅ عرض معلومات البحث الحالي */}
              {(debouncedSearch || activeFilter !== "all") && (
                <div className="bg-gray-50 rounded-lg p-4 mb-4 text-sm text-right">
                  <p className="text-gray-700">
                    {debouncedSearch && (
                      <span className="block mb-1">
                        🔍 البحث عن: <strong>{debouncedSearch}</strong>
                      </span>
                    )}
                    {activeFilter !== "all" && (
                      <span className="block">
                        📂 الفئة:{" "}
                        <strong>
                          {categories.find((c) => c.id === activeFilter)?.label}
                        </strong>
                      </span>
                    )}
                  </p>
                </div>
              )}

              <button
                onClick={handleResetFilters}
                className="px-6 py-2 bg-purple text-white rounded-lg hover:bg-purple-hover transition-colors"
              >
                إعادة تعيين البحث
              </button>
            </div>
          </motion.div>
        ) : (
          <LayoutGroup>
            <motion.div
              layout
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              <AnimatePresence mode="popLayout">
                {albums.map((album, index) => (
                  <motion.div
                    key={album.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{
                      duration: 0.3,
                      delay: index * 0.05,
                      layout: { duration: 0.3 },
                    }}
                  >
                    <AlbumCard
                      album={album}
                      index={index}
                      isVisible={true}
                      onImageClick={handleImageClick}
                      onAlbumClick={handleAlbumClick}
                      variant="gallery"
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {/* Infinite Scroll Trigger */}
            {hasNextPage && (
              <div
                ref={loadMoreRef}
                className="flex justify-center items-center py-8 mt-8"
              >
                {isFetchingNextPage ? (
                  <div className="flex items-center gap-3 text-purple">
                    <Loader className="animate-spin" size={24} />
                    <span className="text-lg font-medium">
                      جاري تحميل المزيد...
                    </span>
                  </div>
                ) : (
                  <div className="text-gray-400 text-sm">
                    مرر للأسفل لتحميل المزيد
                  </div>
                )}
              </div>
            )}

            {/* End of Results */}
            {!hasNextPage && albums.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-8 mt-8"
              >
                <div className="inline-block px-6 py-3 bg-gray-100 rounded-full text-gray-600">
                  ✨ تم عرض جميع المنتجات ({totalCount})
                </div>
              </motion.div>
            )}
          </LayoutGroup>
        )}
      </div>

      {/* قسم الدعوة للعمل */}
      {albums.length > 0 && (
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

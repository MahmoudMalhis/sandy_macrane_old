import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  Quote,
  Search,
  Calendar,
  User,
  MessageSquare,
} from "lucide-react";
import Badge from "../components/common/Badge";
import Loading from "../utils/Loading";
import { reviewsAPI } from "../api/reviews";
import ReviewForm from "../forms/ReviewForm";
import { Link } from "react-router-dom";
import ApplyNow from "../components/ApplyNow";

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [filteredTestimonials, setFilteredTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    rating: "all",
    category: "all",
    search: "",
  });
  const [sortBy, setSortBy] = useState("latest");
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setLoading(true);
        const response = await reviewsAPI.getAll({ status: "published" });
        if (response.success) {
          setTestimonials(response.data);
          setFilteredTestimonials(response.data);
        } else {
          console.error("فشل في جلب التقييمات:", response.message);
        }
      } catch (error) {
        console.error("API Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  useEffect(() => {
    let filtered = [...testimonials];

    if (filters.rating !== "all") {
      filtered = filtered.filter(
        (testimonial) => testimonial.rating >= parseInt(filters.rating)
      );
    }

    if (filters.category !== "all") {
      filtered = filtered.filter((testimonial) => {
        if (!testimonial.album_title) return false;
        const isFrame =
          testimonial.album_title.includes("برواز") ||
          testimonial.album_title.includes("إطار");
        return filters.category === "frame" ? isFrame : !isFrame;
      });
    }

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(
        (testimonial) =>
          testimonial.author_name.toLowerCase().includes(searchTerm) ||
          testimonial.text.toLowerCase().includes(searchTerm) ||
          testimonial.album_title.toLowerCase().includes(searchTerm)
      );
    }

    switch (sortBy) {
      case "latest":
        filtered.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        break;
      case "oldest":
        filtered.sort(
          (a, b) => new Date(a.created_at) - new Date(b.created_at)
        );
        break;
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }

    setFilteredTestimonials(filtered);
  }, [filters, sortBy, testimonials]);

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

  const getAverageRating = () => {
    if (testimonials.length === 0) return 0;
    const sum = testimonials.reduce(
      (acc, testimonial) => acc + testimonial.rating,
      0
    );
    return (sum / testimonials.length).toFixed(1);
  };

  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    testimonials.forEach((testimonial) => {
      distribution[testimonial.rating]++;
    });
    return distribution;
  };
  const getCustomerSatisfaction = () => {
    if (testimonials.length === 0) return 0;

    const positiveReviews = testimonials.filter(
      (testimonial) => testimonial.rating >= 4
    ).length;

    const satisfaction = (positiveReviews / testimonials.length) * 100;

    return Math.round(satisfaction);
  };

  const fetchTestimonials = async () => {
    try {
      const response = await reviewsAPI.getAll({ status: "published" });
      if (response.success) {
        setTestimonials(response.data);
        setFilteredTestimonials(response.data);
      }
    } catch (error) {
      console.error("خطأ في جلب التقييمات:", error);
    }
  };

  if (loading) {
    return <Loading />;
  }

  const averageRating = getAverageRating();
  const ratingDistribution = getRatingDistribution();
  const customerSatisfaction = getCustomerSatisfaction();

  return (
    <div className="min-h-screen bg-beige py-8">
      {/* العنوان الرئيسي */}
      <div className="container mx-auto px-4 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl lg:text-5xl font-bold text-purple mb-4">
            آراء عملائنا
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            تجارب حقيقية من عملائنا الكرام الذين اختاروا منتجاتنا وشاركونا
            آراءهم الصادقة
          </p>
          <div className="w-24 h-1 bg-pink mx-auto mt-6 rounded-full"></div>
        </motion.div>

        {/* ملخص التقييمات */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg p-8 mb-8 max-w-4xl mx-auto"
        >
          <div className="grid md:grid-cols-2 gap-8">
            {/* التقييم العام */}
            <div className="text-center">
              <div className="text-5xl font-bold text-purple mb-2">
                {averageRating}
              </div>
              <div className="flex justify-center mb-2">
                {renderStars(Math.round(averageRating))}
              </div>
              <p className="text-gray-600">
                من أصل {testimonials.length} تقييم
              </p>
            </div>

            {/* توزيع التقييمات */}
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = ratingDistribution[rating];
                const percentage =
                  testimonials.length > 0
                    ? (count / testimonials.length) * 100
                    : 0;
                return (
                  <div key={rating} className="flex items-center gap-3">
                    <span className="text-sm w-8">{rating} ⭐</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-yellow-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm w-8 text-gray-600">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* أدوات الفلترة والبحث */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-8"
        >
          <div className="grid md:grid-cols-4 gap-4">
            {/* البحث */}
            <div className="relative">
              <input
                type="text"
                placeholder="ابحث في التقييمات..."
                value={filters.search}
                onChange={(e) =>
                  setFilters({ ...filters, search: e.target.value })
                }
                className="w-full pl-4 pr-10 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple focus:border-transparent"
              />
              <Search
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
            </div>

            {/* فلتر التقييم */}
            <select
              value={filters.rating}
              onChange={(e) =>
                setFilters({ ...filters, rating: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple focus:border-transparent"
            >
              <option value="all">جميع التقييمات</option>
              <option value="5">5 نجوم فقط</option>
              <option value="4">4 نجوم فأكثر</option>
              <option value="3">3 نجوم فأكثر</option>
            </select>

            {/* فلتر التصنيف */}
            <select
              value={filters.category}
              onChange={(e) =>
                setFilters({ ...filters, category: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple focus:border-transparent"
            >
              <option value="all">جميع الفئات</option>
              <option value="macrame">مكرمية</option>
              <option value="frame">براويز</option>
            </select>

            {/* ترتيب */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple focus:border-transparent"
            >
              <option value="latest">الأحدث أولاً</option>
              <option value="oldest">الأقدم أولاً</option>
              <option value="rating">أعلى تقييم</option>
            </select>
          </div>

          {/* نتائج الفلترة */}
          <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
            <span>
              عرض {filteredTestimonials.length} من أصل {testimonials.length}{" "}
              تقييم
            </span>
            {(filters.search ||
              filters.rating !== "all" ||
              filters.category !== "all") && (
              <button
                onClick={() =>
                  setFilters({ rating: "all", category: "all", search: "" })
                }
                className="text-purple hover:text-purple-hover font-medium"
              >
                مسح الفلاتر
              </button>
            )}
          </div>
        </motion.div>
      </div>
      {/* شبكة التقييمات */}
      <div className="container mx-auto px-4">
        <AnimatePresence mode="wait">
          {filteredTestimonials.length === 0 ? (
            <motion.div
              key="no-results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-16"
            >
              <div className="text-gray-400 text-6xl mb-4">💬</div>
              <h3 className="text-xl font-bold text-gray-700 mb-2">
                لا توجد تقييمات مطابقة
              </h3>
              <p className="text-gray-600">جرب تغيير معايير البحث أو الفلترة</p>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredTestimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:scale-105"
                >
                  {/* صورة التقييم */}
                  {(testimonial.album_cover || testimonial.attached_image) && (
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={
                          testimonial.album_cover || testimonial.attached_image
                        }
                        alt={
                          testimonial.album_cover
                            ? `كفر ألبوم ${testimonial.album_title}`
                            : `تقييم ${testimonial.author_name}`
                        }
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-30"></div>

                      {/* شارة التصنيف */}
                      <div className="absolute top-4 right-4">
                        <Badge variant="category">
                          {testimonial.album_title?.includes("برواز") ||
                          testimonial.album_title?.includes("إطار")
                            ? "برواز"
                            : "مكرمية"}
                        </Badge>
                      </div>

                      {/* مؤشر نوع الصورة */}
                      <div className="absolute top-4 left-4">
                        <div className="bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                          {testimonial.album_cover
                            ? "صورة المنتج"
                            : "صورة التقييم"}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* محتوى التقييم */}
                  <div className="p-6">
                    {/* التقييم والاقتباس */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-1">
                        {renderStars(testimonial.rating)}
                      </div>
                      <Quote className="text-purple opacity-30" size={24} />
                    </div>

                    {/* نص التقييم */}
                    <p className="text-gray-700 leading-relaxed mb-4 line-clamp-4">
                      "{testimonial.text}"
                    </p>

                    {/* معلومات الكاتب */}
                    <div className="border-t border-gray-100 pt-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-bold text-purple flex items-center gap-2">
                            <User size={16} />
                            {testimonial.author_name}
                          </h4>
                        </div>
                        <div className="text-right text-xs text-gray-500">
                          <div className="flex items-center gap-1 mb-1">
                            <Calendar size={12} />
                            {formatDate(testimonial.created_at)}
                          </div>
                        </div>
                      </div>

                      {/* معلومات المنتج */}
                      {testimonial.album_title && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                          <Link
                            to={`/album/${testimonial.album_slug}`}
                            className="flex items-center gap-3 hover:bg-gray-100 transition-colors rounded-lg p-2 -m-2"
                          >
                            {/* صورة الكفر */}
                            {testimonial.album_cover && (
                              <img
                                src={testimonial.album_cover}
                                alt={testimonial.album_title}
                                className="w-10 h-10 rounded object-cover"
                                loading="lazy"
                              />
                            )}
                            <div className="flex-1">
                              <p className="text-sm text-gray-600">
                                <span className="font-medium">المنتج:</span>{" "}
                                <span className="text-purple hover:text-purple-hover font-medium">
                                  {testimonial.album_title}
                                </span>
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                اضغط لعرض تفاصيل المنتج
                              </p>
                            </div>
                            <div className="text-purple">
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 5l7 7-7 7"
                                />
                              </svg>
                            </div>
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {/* دعوة لترك تقييم */}
      <div className="container mx-auto px-4 mt-16">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-gradient-to-br from-purple to-pink rounded-3xl p-12 text-white text-center shadow-2xl"
        >
          <div className="max-w-3xl mx-auto">
            <MessageSquare className="w-16 h-16 mx-auto mb-6 opacity-80" />
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              شاركنا تجربتك
            </h2>
            <p className="text-xl mb-8 opacity-90">
              هل اشتريت منتجاً من ساندي مكرمية؟ نحن نحب أن نسمع رأيك ونشاركه مع
              عملائنا الآخرين
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-white text-purple hover:bg-light-gray px-8 py-4 rounded-full font-bold transition-all duration-300 transform hover:scale-105 cupsor-pointer"
              >
                اترك تقييمك الآن
              </button>

              <ApplyNow className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-purple px-8 py-4 rounded-full font-bold transition-all duration-300 cupsor-pointer">
                اطلب منتجاً جديداً
              </ApplyNow>
            </div>

            {/* إحصائيات سريعة */}
            <div className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-white border-opacity-20">
              <div>
                <div className="text-3xl font-bold mb-2">
                  {testimonials.length}+
                </div>
                <div className="text-sm opacity-80">تقييم إيجابي</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2">{averageRating}⭐</div>
                <div className="text-sm opacity-80">متوسط التقييم</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2">
                  {customerSatisfaction}%
                </div>
                <div className="text-sm opacity-80">رضا العملاء</div>
              </div>
            </div>
          </div>

          {/* عناصر تزيينية */}
          <div className="absolute top-6 right-6 w-20 h-20 border border-white opacity-20 rounded-full"></div>
          <div className="absolute bottom-6 left-6 w-16 h-16 border border-white opacity-20 rounded-full"></div>
        </motion.div>
      </div>

      <ReviewForm
        isOpen={showAddForm}
        onClose={() => setShowAddForm(false)}
        onSubmitSuccess={() => {
          fetchTestimonials();
          setShowAddForm(false);
        }}
      />
    </div>
  );
}

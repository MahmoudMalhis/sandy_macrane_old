/* eslint-disable no-unused-vars */
// client/src/pages/admin/TestimonialsAdmin.jsx - مربوطة مع Backend
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  Star,
  Search,
  Filter,
  Eye,
  EyeOff,
  Trash2,
  Calendar,
  User,
  CheckCircle,
  XCircle,
  Clock,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
  Download,
  Grid,
  List,
} from "lucide-react";
import { toast } from "react-hot-toast";
import Badge from "../../components/common/Badge";
import Loading from "../../utils/LoadingSettings";
import { reviewsAPI } from "../../api/reviews";

const TestimonialsAdmin = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterRating, setFilterRating] = useState("all");
  const [selectedTestimonial, setSelectedTestimonial] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [stats, setStats] = useState({});
  const [selectedTestimonials, setSelectedTestimonials] = useState([]);
  const [viewMode, setViewMode] = useState("table");

  // جلب التقييمات من الـ API
  const fetchTestimonials = async (page = 1, filters = {}) => {
    try {
      setLoading(true);

      // تحضير المعاملات للـ API
      const params = {
        page,
        limit: 20,
        ...filters,
      };

      // إضافة فلاتر البحث
      if (searchTerm.trim()) {
        params.search = searchTerm.trim();
      }

      if (filterStatus !== "all") {
        params.status = filterStatus;
      } else {
        params.status = "all"; // لازم نمررها للباك اند
      }

      if (filterRating !== "all") {
        params.min_rating = filterRating;
      }

      const response = await reviewsAPI.getAllAdmin(params);

      if (response.success) {
        setTestimonials(response.data);
        setPagination(response.pagination);
      } else {
        toast.error("فشل في جلب التقييمات");
      }
    } catch (error) {
      console.error("Error fetching testimonials:", error);
      toast.error("حدث خطأ في جلب التقييمات");
    } finally {
      setLoading(false);
    }
  };

  // جلب الإحصائيات
  const fetchStats = async () => {
    try {
      const response = await reviewsAPI.getStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  useEffect(() => {
    fetchTestimonials(currentPage, {
      status: filterStatus !== "all" ? filterStatus : undefined,
      min_rating: filterRating !== "all" ? filterRating : undefined,
      search: searchTerm.trim() || undefined,
    });
  }, [currentPage, filterStatus, filterRating]);

  useEffect(() => {
    fetchStats();
  }, []);

  // البحث مع تأخير
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCurrentPage(1);
      fetchTestimonials(1);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  // تغيير حالة التقييم
  const changeStatus = async (testimonialId, newStatus) => {
    try {
      const response = await reviewsAPI.changeStatus(testimonialId, newStatus);

      if (response.success) {
        // تحديث التقييم في القائمة المحلية
        setTestimonials((prevTestimonials) =>
          prevTestimonials.map((testimonial) =>
            testimonial.id === testimonialId
              ? { ...testimonial, status: newStatus }
              : testimonial
          )
        );

        // تحديث الإحصائيات
        await fetchStats();

        const statusText = {
          published: "نشر",
          hidden: "إخفاء",
          pending: "مراجعة",
        }[newStatus];

        toast.success(`تم ${statusText} التقييم بنجاح!`);
      } else {
        toast.error("فشل في تغيير حالة التقييم");
      }
    } catch (error) {
      console.error("Error changing testimonial status:", error);
      toast.error("حدث خطأ في تغيير حالة التقييم");
    }
  };

  // حذف التقييم
  const deleteTestimonial = async (testimonialId) => {
    if (!confirm("هل أنت متأكد من حذف هذا التقييم؟")) return;

    try {
      const response = await reviewsAPI.delete(testimonialId);

      if (response.success) {
        // إزالة التقييم من القائمة المحلية
        setTestimonials((prevTestimonials) =>
          prevTestimonials.filter((t) => t.id !== testimonialId)
        );

        // تحديث الإحصائيات
        await fetchStats();

        toast.success("تم حذف التقييم بنجاح!");

        // إعادة جلب البيانات إذا كانت الصفحة فارغة
        if (testimonials.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        } else {
          fetchTestimonials(currentPage);
        }
      } else {
        toast.error("فشل في حذف التقييم");
      }
    } catch (error) {
      console.error("Error deleting testimonial:", error);
      toast.error("حدث خطأ في حذف التقييم");
    }
  };

  // عرض تفاصيل التقييم
  const showDetails = async (testimonial) => {
    try {
      // جلب تفاصيل التقييم الكاملة
      const response = await reviewsAPI.getById(testimonial.id);
      if (response.success) {
        setSelectedTestimonial(response.data);
        setShowDetailModal(true);
      } else {
        toast.error("فشل في جلب تفاصيل التقييم");
      }
    } catch (error) {
      console.error("Error fetching testimonial details:", error);
      toast.error("حدث خطأ في جلب تفاصيل التقييم");
    }
  };

  // تحديث الصفحة
  const handleRefresh = () => {
    fetchTestimonials(currentPage);
    fetchStats();
    toast.success("تم تحديث البيانات");
  };

  // التنقل بين الصفحات
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

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
    return new Date(dateString).toLocaleDateString("ar", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status) => {
    const configs = {
      published: { variant: "featured", text: "منشور", icon: CheckCircle },
      pending: { variant: "new", text: "مراجعة", icon: Clock },
      hidden: { variant: "category", text: "مخفي", icon: EyeOff },
    };

    const config = configs[status];
    const IconComponent = config.icon;

    return (
      <div className="flex items-center gap-1">
        <IconComponent size={14} />
        <Badge variant={config.variant}>{config.text}</Badge>
      </div>
    );
  };

  const handleSelectAll = () => {
    if (selectedTestimonials.length === testimonials.length) {
      setSelectedTestimonials([]);
    } else {
      setSelectedTestimonials(testimonials.map((t) => t.id));
    }
  };

  const handleBulkStatusChange = async (status) => {
    if (selectedTestimonials.length === 0) return;

    try {
      const promises = selectedTestimonials.map((id) =>
        reviewsAPI.changeStatus(id, status)
      );
      await Promise.all(promises);

      toast.success(`تم تغيير حالة ${selectedTestimonials.length} تقييم`);
      setSelectedTestimonials([]);
      fetchTestimonials(currentPage);
    } catch (error) {
      toast.error("فشل في تغيير الحالة");
    }
  };

  const handleExport = async () => {
    try {
      const BOM = "\uFEFF"; // UTF-8 BOM for Arabic support
      const csvContent =
        BOM +
        "الاسم,التقييم,النص,الحالة,التاريخ,المنتج\n" +
        testimonials
          .map(
            (t) =>
              `"${t.author_name}",${t.rating},"${t.text.replace(/"/g, '""')}",${
                t.status
              },"${formatDate(t.created_at)}","${t.album_title || "غير محدد"}"`
          )
          .join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `testimonials-${
        new Date().toISOString().split("T")[0]
      }.csv`;
      link.click();

      toast.success("تم تصدير البيانات");
    } catch (error) {
      toast.error("فشل في التصدير");
    }
  };

  const CardsView = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {testimonials.map((testimonial) => (
        <div
          key={testimonial.id}
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-start justify-between mb-4">
            <input
              type="checkbox"
              checked={selectedTestimonials.includes(testimonial.id)}
              onChange={() => {
                if (selectedTestimonials.includes(testimonial.id)) {
                  setSelectedTestimonials((prev) =>
                    prev.filter((id) => id !== testimonial.id)
                  );
                } else {
                  setSelectedTestimonials((prev) => [...prev, testimonial.id]);
                }
              }}
              className="w-4 h-4 text-purple focus:ring-purple rounded"
            />
            {getStatusBadge(testimonial.status)}
          </div>

          <div className="flex items-center gap-3 mb-3">
            {testimonial.attached_image && (
              <img
                src={testimonial.attached_image}
                alt="تقييم"
                className="w-12 h-12 rounded-lg object-cover cursor-pointer"
                onClick={() => showDetails(testimonial)}
              />
            )}
            <div>
              <h3 className="font-medium text-gray-900">
                {testimonial.author_name}
              </h3>
              <div className="flex">{renderStars(testimonial.rating)}</div>
            </div>
          </div>

          <p className="text-gray-700 mb-4 line-clamp-3">{testimonial.text}</p>

          {testimonial.album_title && (
            <p className="text-sm text-purple mb-3 bg-purple bg-opacity-10 px-2 py-1 rounded">
              {testimonial.album_title}
            </p>
          )}

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">
              {formatDate(testimonial.created_at)}
            </span>
            <div className="flex gap-1">
              <button
                onClick={() => showDetails(testimonial)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                title="عرض"
              >
                <Eye size={16} />
              </button>

              {testimonial.status !== "published" && (
                <button
                  onClick={() => changeStatus(testimonial.id, "published")}
                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                  title="نشر"
                >
                  <ThumbsUp size={16} />
                </button>
              )}

              {testimonial.status !== "hidden" && (
                <button
                  onClick={() => changeStatus(testimonial.id, "hidden")}
                  className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg"
                  title="إخفاء"
                >
                  <ThumbsDown size={16} />
                </button>
              )}

              <button
                onClick={() => deleteTestimonial(testimonial.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                title="حذف"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="p-6">
      {/* العنوان والإحصائيات */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              إدارة التقييمات
            </h1>
            <p className="text-gray-600 mt-2">
              مراجعة وإدارة آراء العملاء والتقييمات
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() =>
                setViewMode(viewMode === "table" ? "cards" : "table")
              }
              className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              {viewMode === "table" ? <Grid size={16} /> : <List size={16} />}
              {viewMode === "table" ? "عرض كاردات" : "عرض جدول"}
            </button>

            <button
              onClick={handleExport}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download size={16} />
              تصدير
            </button>

            <button
              onClick={handleRefresh}
              className="flex items-center gap-2 bg-purple text-white px-4 py-2 rounded-lg hover:bg-purple-hover transition-colors"
            >
              <RefreshCw size={16} />
              تحديث
            </button>
          </div>
        </div>

        {/* الإحصائيات السريعة */}
        <div className="grid max-sm:grid-cols-1 max-md:grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  إجمالي التقييمات
                </p>
                <p className="text-3xl font-bold text-gray-800">
                  {stats.total || 0}
                </p>
              </div>
              <div className="bg-blue-500 p-3 rounded-full">
                <MessageSquare size={24} className="text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">منشور</p>
                <p className="text-3xl font-bold text-green-600">
                  {stats.published || 0}
                </p>
              </div>
              <div className="bg-green-500 p-3 rounded-full">
                <CheckCircle size={24} className="text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">في المراجعة</p>
                <p className="text-3xl font-bold text-orange-600">
                  {stats.pending || 0}
                </p>
              </div>
              <div className="bg-orange-500 p-3 rounded-full">
                <Clock size={24} className="text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">مخفي</p>
                <p className="text-3xl font-bold text-red-600">
                  {stats.hidden || 0}
                </p>
              </div>
              <div className="bg-red-500 p-3 rounded-full">
                <EyeOff size={24} className="text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  متوسط التقييم
                </p>
                <p className="text-3xl font-bold text-purple">
                  {stats.averageRating || 0}⭐
                </p>
              </div>
              <div className="bg-purple p-3 rounded-full">
                <Star size={24} className="text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* أدوات البحث والفلترة */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="البحث في التقييمات..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
            />
            <Search
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
          >
            <option value="all">جميع الحالات</option>
            <option value="published">منشور</option>
            <option value="pending">مراجعة</option>
            <option value="hidden">مخفي</option>
          </select>

          <select
            value={filterRating}
            onChange={(e) => setFilterRating(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
          >
            <option value="all">جميع التقييمات</option>
            <option value="5">5 نجوم فقط</option>
            <option value="4">4 نجوم فأكثر</option>
            <option value="3">3 نجوم فأكثر</option>
            <option value="2">2 نجوم فأكثر</option>
          </select>

          <div className="text-sm text-gray-600 flex items-center">
            عرض {testimonials.length} من أصل {pagination.total || 0}
          </div>
        </div>
      </div>
      {selectedTestimonials.length > 0 && (
        <div className="mb-4 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-blue-800 font-medium">
              تم اختيار {selectedTestimonials.length} تقييم
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => handleBulkStatusChange("published")}
                className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
              >
                نشر الكل
              </button>
              <button
                onClick={() => handleBulkStatusChange("hidden")}
                className="bg-orange-600 text-white px-3 py-1 rounded text-sm hover:bg-orange-700"
              >
                إخفاء الكل
              </button>
            </div>
          </div>
        </div>
      )}
      {/* قائمة التقييمات */}

      {viewMode === "table" ? (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right">
                    <input
                      type="checkbox"
                      checked={
                        selectedTestimonials.length === testimonials.length &&
                        testimonials.length > 0
                      }
                      onChange={handleSelectAll}
                      className="w-4 h-4 text-purple focus:ring-purple rounded"
                    />
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    العميل والتقييم
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    المنتج
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الحالة
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    التاريخ
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الإجراءات
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <AnimatePresence>
                  {testimonials.map((testimonial, index) => (
                    <motion.tr
                      key={testimonial.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedTestimonials.includes(
                            testimonial.id
                          )}
                          onChange={() => {
                            if (selectedTestimonials.includes(testimonial.id)) {
                              setSelectedTestimonials((prev) =>
                                prev.filter((id) => id !== testimonial.id)
                              );
                            } else {
                              setSelectedTestimonials((prev) => [
                                ...prev,
                                testimonial.id,
                              ]);
                            }
                          }}
                          className="w-4 h-4 text-purple focus:ring-purple rounded"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-start gap-4">
                          {testimonial.attached_image && (
                            <div className="flex-shrink-0">
                              <img
                                className="h-12 w-12 rounded-lg object-cover cursor-pointer"
                                src={testimonial.attached_image}
                                alt="تقييم"
                                onClick={() => showDetails(testimonial)}
                              />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="text-sm font-medium text-gray-900">
                                {testimonial.author_name}
                              </p>
                              <div className="flex items-center">
                                {renderStars(testimonial.rating)}
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 line-clamp-2">
                              {testimonial.text}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {testimonial.album_title || "غير محدد"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(testimonial.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar size={16} className="text-gray-400" />
                          {formatDate(testimonial.created_at)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => showDetails(testimonial)}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded"
                            title="عرض التفاصيل"
                          >
                            <Eye size={16} />
                          </button>

                          {testimonial.status !== "published" && (
                            <button
                              onClick={() =>
                                changeStatus(testimonial.id, "published")
                              }
                              className="text-green-600 hover:text-green-900 p-1 rounded"
                              title="نشر"
                            >
                              <ThumbsUp size={16} />
                            </button>
                          )}

                          {testimonial.status !== "hidden" && (
                            <button
                              onClick={() =>
                                changeStatus(testimonial.id, "hidden")
                              }
                              className="text-orange-600 hover:text-orange-900 p-1 rounded"
                              title="إخفاء"
                            >
                              <ThumbsDown size={16} />
                            </button>
                          )}

                          <button
                            onClick={() => deleteTestimonial(testimonial.id)}
                            className="text-red-600 hover:text-red-900 p-1 rounded"
                            title="حذف"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {testimonials.length === 0 && (
            <div className="text-center py-12">
              <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                لا توجد تقييمات
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || filterStatus !== "all" || filterRating !== "all"
                  ? "لا توجد نتائج مطابقة للبحث"
                  : "لم يتم تلقي أي تقييمات بعد"}
              </p>
            </div>
          )}
        </div>
      ) : (
        <CardsView />
      )}

      {/* شريط التنقل بين الصفحات */}
      {pagination.pages > 1 && (
        <div className="flex justify-center mt-6">
          <div className="flex gap-2">
            {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(
              (page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    currentPage === page
                      ? "bg-purple text-white"
                      : "bg-white text-purple hover:bg-purple hover:text-white border border-purple"
                  }`}
                >
                  {page}
                </button>
              )
            )}
          </div>
        </div>
      )}
      {/* مودال تفاصيل التقييم */}
      <AnimatePresence>
        {showDetailModal && selectedTestimonial && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowDetailModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    تفاصيل التقييم
                  </h2>
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="text-gray-400 hover:text-gray-600 text-2xl"
                  >
                    ×
                  </button>
                </div>

                <div className="space-y-6">
                  {/* معلومات العميل */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <User size={20} className="text-gray-600" />
                      <h3 className="font-semibold text-gray-800">
                        معلومات العميل
                      </h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm text-gray-600">الاسم:</span>
                        <p className="font-medium">
                          {selectedTestimonial.author_name}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">التاريخ:</span>
                        <p className="font-medium">
                          {formatDate(selectedTestimonial.created_at)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* التقييم */}
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <Star size={20} className="text-yellow-500" />
                      <h3 className="font-semibold text-gray-800">التقييم</h3>
                    </div>
                    <div className="flex items-center gap-2 mb-4">
                      {renderStars(selectedTestimonial.rating)}
                      <span className="text-lg font-bold text-gray-800">
                        {selectedTestimonial.rating}/5
                      </span>
                    </div>
                  </div>

                  {/* النص */}
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-3">
                      نص التقييم
                    </h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-700 leading-relaxed">
                        "{selectedTestimonial.text}"
                      </p>
                    </div>
                  </div>

                  {/* المنتج المرتبط */}
                  {selectedTestimonial.album_title && (
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-3">
                        المنتج المرتبط
                      </h3>
                      <div className="bg-purple bg-opacity-10 rounded-lg p-4">
                        <p className="text-purple font-medium">
                          {selectedTestimonial.album_title}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* الصورة المرفقة */}
                  {selectedTestimonial.attached_image && (
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-3">
                        الصورة المرفقة
                      </h3>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <img
                          src={selectedTestimonial.attached_image}
                          alt="صورة التقييم"
                          className="w-full max-w-md mx-auto rounded-lg shadow-md"
                        />
                      </div>
                    </div>
                  )}

                  {/* الحالة الحالية */}
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-3">
                      الحالة الحالية
                    </h3>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(selectedTestimonial.status)}
                    </div>
                  </div>

                  {/* أزرار الإجراءات */}
                  <div className="flex gap-3 pt-4 border-t">
                    {selectedTestimonial.status !== "published" && (
                      <button
                        onClick={() => {
                          changeStatus(selectedTestimonial.id, "published");
                          setShowDetailModal(false);
                        }}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                      >
                        <CheckCircle size={16} />
                        نشر التقييم
                      </button>
                    )}

                    {selectedTestimonial.status === "published" && (
                      <button
                        onClick={() => {
                          changeStatus(selectedTestimonial.id, "hidden");
                          setShowDetailModal(false);
                        }}
                        className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-2"
                      >
                        <EyeOff size={16} />
                        إخفاء التقييم
                      </button>
                    )}

                    <button
                      onClick={() => {
                        deleteTestimonial(selectedTestimonial.id);
                        setShowDetailModal(false);
                      }}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                    >
                      <Trash2 size={16} />
                      حذف التقييم
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TestimonialsAdmin;

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  Eye,
  Phone,
  Mail,
  Calendar,
  User,
  Image as ImageIcon,
  Search,
  CheckCircle,
  Clock,
  AlertTriangle,
  X,
  FileText,
  ExternalLink,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { inquiriesAPI } from "../../api/inquiries.js";
import Badge from "../../components/common/Badge";
import Loading from "../../utils/LoadingSettings";

export default function InquiriesAdmin() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    new: 0,
    in_progress: 0,
    completed: 0,
  });

  // Load inquiries from API
  useEffect(() => {
    loadInquiries();
    loadStats();
  }, [filterStatus, filterType, searchTerm]);

  const loadInquiries = async () => {
    try {
      setLoading(true);
      const params = {
        page: 1,
        limit: 50,
        ...(filterStatus !== "all" && { status: filterStatus }),
        ...(filterType !== "all" && { product_type: filterType }),
        ...(searchTerm && { search: searchTerm }),
      };

      const response = await inquiriesAPI.getAll(params);

      if (response.success) {
        setInquiries(response.data);
      } else {
        toast.error("فشل في تحميل الطلبات");
      }
    } catch (error) {
      console.error("Error loading inquiries:", error);
      toast.error("خطأ في الاتصال بالخادم");
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await inquiriesAPI.getStats();

      if (response.success) {
        setStats({
          total: response.data.total,
          new: response.data.byStatus.new,
          in_progress:
            response.data.byStatus.in_review + response.data.byStatus.contacted,
          completed: response.data.byStatus.closed,
        });
      }
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };

  // Filter inquiries based on search and filters
  const filteredInquiries = inquiries.filter((inquiry) => {
    const matchesSearch =
      inquiry.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.notes?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (inquiry.album_title &&
        inquiry.album_title.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus =
      filterStatus === "all" || inquiry.status === filterStatus;
    const matchesType =
      filterType === "all" || inquiry.product_type === filterType;

    return matchesSearch && matchesStatus && matchesType;
  });

  // Change inquiry status
  const changeStatus = async (inquiryId, newStatus) => {
    try {
      const response = await inquiriesAPI.updateStatus(inquiryId, newStatus);

      if (response.success) {
        // Update local state
        setInquiries((prev) =>
          prev.map((inquiry) =>
            inquiry.id === inquiryId
              ? { ...inquiry, status: newStatus }
              : inquiry
          )
        );

        const statusText = {
          new: "جديد",
          in_review: "قيد المراجعة",
          contacted: "تم التواصل",
          closed: "مكتمل",
        }[newStatus];

        toast.success(`تم تغيير حالة الطلب إلى: ${statusText}`);

        // Reload stats
        loadStats();
      } else {
        toast.error("فشل في تغيير حالة الطلب");
      }
    } catch (error) {
      console.error("Error changing status:", error);
      toast.error("خطأ في تغيير حالة الطلب");
    }
  };

  // Generate WhatsApp link
  const openWhatsApp = async (inquiryId, customerName) => {
    try {
      const response = await inquiriesAPI.generateWhatsAppLink(inquiryId);

      if (response.success) {
        window.open(response.data.whatsappLink, "_blank");
      } else {
        // Fallback to manual WhatsApp link
        const message = `مرحباً ${customerName}،\n\nشكراً لك لتواصلك معنا عبر موقع ساندي مكرمية.\nرقم الطلب: ${inquiryId}\n\nنحن نعمل على طلبك وسنرد عليك قريباً.\n\nمع تحياتي،\nساندي مكرمية`;
        const whatsappUrl = `https://wa.me/970599123456?text=${encodeURIComponent(
          message
        )}`;
        window.open(whatsappUrl, "_blank");
      }
    } catch (error) {
      console.error("Error generating WhatsApp link:", error);
      // Fallback to manual WhatsApp link
      const message = `مرحباً ${customerName}،\n\nشكراً لك لتواصلك معنا عبر موقع ساندي مكرمية.\nرقم الطلب: ${inquiryId}\n\nنحن نعمل على طلبك وسنرد عليك قريباً.\n\nمع تحياتي،\nساندي مكرمية`;
      const whatsappUrl = `https://wa.me/970599123456?text=${encodeURIComponent(
        message
      )}`;
      window.open(whatsappUrl, "_blank");
    }
  };

  // Show inquiry details
  const showDetails = (inquiry) => {
    setSelectedInquiry(inquiry);
    setShowDetailModal(true);
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
      new: {
        variant: "new",
        text: "جديد",
        icon: AlertTriangle,
        color: "text-orange-600",
      },
      in_review: {
        variant: "featured",
        text: "قيد المراجعة",
        icon: Clock,
        color: "text-blue-600",
      },
      contacted: {
        variant: "featured",
        text: "تم التواصل",
        icon: Phone,
        color: "text-purple-600",
      },
      closed: {
        variant: "featured",
        text: "مكتمل",
        icon: CheckCircle,
        color: "text-green-600",
      },
    };

    const config = configs[status] || configs.new;
    const IconComponent = config.icon;

    return (
      <div className={`flex items-center gap-1 ${config.color}`}>
        <IconComponent size={14} />
        <Badge variant={config.variant}>{config.text}</Badge>
      </div>
    );
  };

  const getProductTypeBadge = (type) => {
    const configs = {
      macrame: { text: "مكرمية", color: "bg-purple-100 text-purple-800" },
      frame: { text: "برواز", color: "bg-blue-100 text-blue-800" },
    };

    const config = configs[type];
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}
      >
        {config.text}
      </span>
    );
  };

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
              إدارة الطلبات والاستعلامات
            </h1>
            <p className="text-gray-600 mt-2">متابعة ومعالجة طلبات العملاء</p>
          </div>
        </div>

        {/* الإحصائيات السريعة */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  إجمالي الطلبات
                </p>
                <p className="text-3xl font-bold text-gray-800">
                  {stats.total}
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
                <p className="text-sm font-medium text-gray-600">جديد</p>
                <p className="text-3xl font-bold text-orange-600">
                  {stats.new}
                </p>
              </div>
              <div className="bg-orange-500 p-3 rounded-full">
                <AlertTriangle size={24} className="text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  قيد المعالجة
                </p>
                <p className="text-3xl font-bold text-blue-600">
                  {stats.in_progress}
                </p>
              </div>
              <div className="bg-blue-500 p-3 rounded-full">
                <Clock size={24} className="text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">مكتمل</p>
                <p className="text-3xl font-bold text-green-600">
                  {stats.completed}
                </p>
              </div>
              <div className="bg-green-500 p-3 rounded-full">
                <CheckCircle size={24} className="text-white" />
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
              placeholder="البحث في الطلبات..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
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
            <option value="new">جديد</option>
            <option value="in_review">قيد المراجعة</option>
            <option value="contacted">تم التواصل</option>
            <option value="closed">مكتمل</option>
          </select>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
          >
            <option value="all">جميع الأنواع</option>
            <option value="macrame">مكرمية</option>
            <option value="frame">برواز</option>
          </select>

          <div className="text-sm text-gray-600 flex items-center">
            عرض {filteredInquiries.length} من أصل {inquiries.length}
          </div>
        </div>
      </div>

      {/* قائمة الطلبات */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  العميل والطلب
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  النوع
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
                {filteredInquiries.map((inquiry, index) => (
                  <motion.tr
                    key={inquiry.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-start gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <User size={16} className="text-gray-400" />
                            <p className="text-sm font-medium text-gray-900">
                              {inquiry.customer_name}
                            </p>
                          </div>
                          <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                            {inquiry.notes || "لا توجد ملاحظات إضافية"}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                              <Phone size={12} />
                              {inquiry.phone_whatsapp}
                            </div>
                            {inquiry.album_title && (
                              <div className="flex items-center gap-1">
                                <FileText size={12} />
                                {inquiry.album_title}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getProductTypeBadge(inquiry.product_type)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(inquiry.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar size={16} className="text-gray-400" />
                        {formatDate(inquiry.created_at)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => showDetails(inquiry)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded"
                          title="عرض التفاصيل"
                        >
                          <Eye size={16} />
                        </button>

                        <button
                          onClick={() =>
                            openWhatsApp(inquiry.id, inquiry.customer_name)
                          }
                          className="text-green-600 hover:text-green-900 p-1 rounded"
                          title="فتح واتساب"
                        >
                          <Phone size={16} />
                        </button>

                        {inquiry.status === "new" && (
                          <button
                            onClick={() =>
                              changeStatus(inquiry.id, "in_review")
                            }
                            className="text-orange-600 hover:text-orange-900 p-1 rounded"
                            title="بدء المراجعة"
                          >
                            <Clock size={16} />
                          </button>
                        )}

                        {inquiry.status === "in_review" && (
                          <button
                            onClick={() =>
                              changeStatus(inquiry.id, "contacted")
                            }
                            className="text-purple-600 hover:text-purple-900 p-1 rounded"
                            title="تم التواصل"
                          >
                            <Phone size={16} />
                          </button>
                        )}

                        {inquiry.status === "contacted" && (
                          <button
                            onClick={() => changeStatus(inquiry.id, "closed")}
                            className="text-green-600 hover:text-green-900 p-1 rounded"
                            title="إنهاء الطلب"
                          >
                            <CheckCircle size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {filteredInquiries.length === 0 && (
          <div className="text-center py-12">
            <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              لا توجد طلبات
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || filterStatus !== "all" || filterType !== "all"
                ? "لا توجد نتائج مطابقة للبحث"
                : "لم يتم تلقي أي طلبات بعد"}
            </p>
          </div>
        )}
      </div>

      {/* مودال تفاصيل الطلب */}
      <AnimatePresence>
        {showDetailModal && selectedInquiry && (
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
              className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    تفاصيل الطلب #{selectedInquiry.id}
                  </h2>
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                  {/* معلومات العميل */}
                  <div className="space-y-6">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <User size={20} />
                        معلومات العميل
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <span className="text-sm text-gray-600">الاسم:</span>
                          <p className="font-medium">
                            {selectedInquiry.customer_name}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600">واتساب:</span>
                          <p className="font-medium">
                            {selectedInquiry.phone_whatsapp}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600">
                            تاريخ الطلب:
                          </span>
                          <p className="font-medium">
                            {formatDate(selectedInquiry.created_at)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* تفاصيل الطلب */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <FileText size={20} />
                        تفاصيل الطلب
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <span className="text-sm text-gray-600">
                            نوع المنتج:
                          </span>
                          <div className="mt-1">
                            {getProductTypeBadge(selectedInquiry.product_type)}
                          </div>
                        </div>
                        {selectedInquiry.album_title && (
                          <div>
                            <span className="text-sm text-gray-600">
                              الألبوم المرجعي:
                            </span>
                            <p className="font-medium">
                              {selectedInquiry.album_title}
                            </p>
                          </div>
                        )}
                        <div>
                          <span className="text-sm text-gray-600">
                            ملاحظات العميل:
                          </span>
                          <p className="font-medium leading-relaxed">
                            {selectedInquiry.notes || "لا توجد ملاحظات إضافية"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* حالة الطلب */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-800 mb-4">
                        حالة الطلب
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <span className="text-sm text-gray-600">
                            الحالة الحالية:
                          </span>
                          <div className="mt-1">
                            {getStatusBadge(selectedInquiry.status)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* الإجراءات */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-4">
                        إجراءات سريعة
                      </h3>
                      <div className="space-y-4">
                        <button
                          onClick={() =>
                            openWhatsApp(
                              selectedInquiry.id,
                              selectedInquiry.customer_name
                            )
                          }
                          className="w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                        >
                          <Phone size={16} />
                          تواصل عبر واتساب
                        </button>

                        <div className="grid grid-cols-2 gap-4">
                          {selectedInquiry.status === "new" && (
                            <button
                              onClick={() => {
                                changeStatus(selectedInquiry.id, "in_review");
                                setShowDetailModal(false);
                              }}
                              className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-2"
                            >
                              <Clock size={16} />
                              بدء المراجعة
                            </button>
                          )}

                          {selectedInquiry.status === "in_review" && (
                            <button
                              onClick={() => {
                                changeStatus(selectedInquiry.id, "contacted");
                                setShowDetailModal(false);
                              }}
                              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
                            >
                              <Phone size={16} />
                              تم التواصل
                            </button>
                          )}

                          {selectedInquiry.status === "contacted" && (
                            <button
                              onClick={() => {
                                changeStatus(selectedInquiry.id, "closed");
                                setShowDetailModal(false);
                              }}
                              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                            >
                              <CheckCircle size={16} />
                              إنهاء الطلب
                            </button>
                          )}

                          <button
                            onClick={() => setShowDetailModal(false)}
                            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                          >
                            إغلاق
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

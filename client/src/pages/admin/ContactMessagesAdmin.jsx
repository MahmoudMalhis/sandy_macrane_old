import { useState } from "react";
import {
  useContactMessages,
  useContactStats,
  useMarkAsRead,
  useUpdateContactStatus,
  useUpdateContactPriority,
  useDeleteMessage,
} from "../../hooks/queries/useContactMessages";
import { toast } from "react-hot-toast";
import {
  Mail,
  Search,
  Eye,
  Trash2,
  MessageCircle,
  AlertCircle,
  CheckCircle,
  Clock,
  Archive,
  BarChart3,
  RefreshCw,
} from "lucide-react";
import { contactAPI } from "../../api/contact";
import Button from "../../components/common/Button";
import Loading from "../../utils/LoadingSettings";
import Error from "../../utils/Error";

export default function ContactMessagesAdmin() {
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [filters, setFilters] = useState({
    status: "",
    priority: "",
    search: "",
    page: 1,
    limit: 20,
  });

  const {
    data: messagesData,
    isLoading: loading,
    error,
  } = useContactMessages(filters);

  const { data: stats } = useContactStats();

  const markAsReadMutation = useMarkAsRead();
  const updateStatusMutation = useUpdateContactStatus();
  const updatePriorityMutation = useUpdateContactPriority();
  const deleteMessageMutation = useDeleteMessage();

  const messages = messagesData?.data || [];
  const pagination = messagesData?.pagination || {};

  const handleViewMessage = async (message) => {
    setSelectedMessage(message);
    setShowModal(true);

    if (message.status === "new") {
      markAsReadMutation.mutate(message.id);
    }
  };

  const handleStatusUpdate = (messageId, newStatus) => {
    updateStatusMutation.mutate(
      { messageId, status: newStatus },
      {
        onSuccess: () => {
          setShowModal(false);
        },
      }
    );
  };

  const handlePriorityUpdate = (messageId, newPriority) => {
    updatePriorityMutation.mutate({ messageId, priority: newPriority });
  };
  const handleDelete = (messageId) => {
    if (!window.confirm("هل أنت متأكد من حذف هذه الرسالة؟")) return;

    deleteMessageMutation.mutate(messageId, {
      onSuccess: () => {
        setShowModal(false);
      },
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      new: {
        label: "جديد",
        color: "bg-blue-100 text-blue-800",
        icon: AlertCircle,
      },
      read: { label: "مقروء", color: "bg-gray-100 text-gray-800", icon: Eye },
      in_progress: {
        label: "قيد المعالجة",
        color: "bg-yellow-100 text-yellow-800",
        icon: Clock,
      },
      replied: {
        label: "تم الرد",
        color: "bg-green-100 text-green-800",
        icon: CheckCircle,
      },
      archived: {
        label: "مؤرشف",
        color: "bg-purple-100 text-purple-800",
        icon: Archive,
      },
    };

    const config = statusConfig[status] || statusConfig.new;
    const Icon = config.icon;

    return (
      <span
        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${config.color}`}
      >
        <Icon size={14} />
        {config.label}
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    const priorityConfig = {
      low: { label: "منخفض", color: "bg-gray-100 text-gray-600" },
      normal: { label: "عادي", color: "bg-blue-100 text-blue-600" },
      high: { label: "مرتفع", color: "bg-orange-100 text-orange-600" },
      urgent: { label: "عاجل", color: "bg-red-100 text-red-600" },
    };

    const config = priorityConfig[priority] || priorityConfig.normal;

    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("ar-EG", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error />;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center">
            <Mail className="w-8 h-8 text-purple mr-2" />
            إدارة رسائل التواصل
          </h1>
          <p className="text-gray-600">إدارة ومتابعة رسائل العملاء الواردة</p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">إجمالي الرسائل</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <BarChart3 className="text-purple" size={32} />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">رسائل جديدة</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {stats.unread}
                  </p>
                </div>
                <AlertCircle className="text-blue-600" size={32} />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">هذا الأسبوع</p>
                  <p className="text-2xl font-bold text-green-600">
                    {stats.recent}
                  </p>
                </div>
                <Clock className="text-green-600" size={32} />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">معدل الرد</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {stats.responseRate}%
                  </p>
                </div>
                <CheckCircle className="text-orange-600" size={32} />
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search
                className="absolute right-3 top-3 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="بحث..."
                value={filters.search}
                onChange={(e) =>
                  setFilters({ ...filters, search: e.target.value, page: 1 })
                }
                className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
              />
            </div>

            <select
              value={filters.status}
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value, page: 1 })
              }
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
            >
              <option value="">كل الحالات</option>
              <option value="new">جديد</option>
              <option value="read">مقروء</option>
              <option value="in_progress">قيد المعالجة</option>
              <option value="replied">تم الرد</option>
              <option value="archived">مؤرشف</option>
            </select>

            <select
              value={filters.priority}
              onChange={(e) =>
                setFilters({ ...filters, priority: e.target.value, page: 1 })
              }
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
            >
              <option value="">كل الأولويات</option>
              <option value="low">منخفض</option>
              <option value="normal">عادي</option>
              <option value="high">مرتفع</option>
              <option value="urgent">عاجل</option>
            </select>

            <Button
              onClick={() => {
                setFilters({
                  status: "",
                  priority: "",
                  search: "",
                  page: 1,
                  limit: 20,
                });
              }}
              variant="outline"
              className="flex items-center justify-center gap-2"
            >
              <RefreshCw size={18} />
              تحديث
            </Button>
          </div>
        </div>

        {/* Messages Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    الاسم
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    البريد الإلكتروني
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    الموضوع
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    الحالة
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    الأولوية
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    التاريخ
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    إجراءات
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {messages.map((message) => (
                  <tr
                    key={message.id}
                    className={`hover:bg-gray-50 transition-colors ${
                      message.status === "new" ? "bg-blue-50" : ""
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="text-sm font-medium text-gray-900">
                          {message.name}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {message.email}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 truncate max-w-xs">
                        {message.subject}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(message.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getPriorityBadge(message.priority)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(message.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleViewMessage(message)}
                        className="text-purple hover:text-purple-hover"
                      >
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="px-6 py-4 border-t flex items-center justify-between">
              <div className="text-sm text-gray-700">
                صفحة {pagination.page} من {pagination.totalPages}
                {" - "}إجمالي {pagination.total} رسالة
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() =>
                    setFilters({ ...filters, page: filters.page - 1 })
                  }
                  disabled={filters.page === 1}
                  variant="outline"
                  size="sm"
                >
                  السابق
                </Button>
                <Button
                  onClick={() =>
                    setFilters({ ...filters, page: filters.page + 1 })
                  }
                  disabled={!pagination.hasMore}
                  variant="outline"
                  size="sm"
                >
                  التالي
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Message Details Modal */}
        {showModal && selectedMessage && (
          <MessageModal
            message={selectedMessage}
            onClose={() => setShowModal(false)}
            onStatusUpdate={handleStatusUpdate}
            onPriorityUpdate={handlePriorityUpdate}
            onDelete={handleDelete}
            getStatusBadge={getStatusBadge}
            getPriorityBadge={getPriorityBadge}
            formatDate={formatDate}
          />
        )}
      </div>
    </div>
  );
}

function MessageModal({
  message,
  onClose,
  onStatusUpdate,
  onPriorityUpdate,
  onDelete,
  getStatusBadge,
  getPriorityBadge,
  formatDate,
}) {
  const [notes, setNotes] = useState(message.admin_notes || "");

  const handleSaveNotes = async () => {
    try {
      await contactAPI.updateNotes(message.id, notes);
      toast.success("تم حفظ الملاحظات");
    } catch {
      toast.error("فشل في حفظ الملاحظات");
    }
  };

  const handleEmailClick = () => {
    window.location.href = `mailto:${message.email}?subject=رد على: ${message.subject}`;
  };

  const handleWhatsAppClick = () => {
    if (message.phone) {
      const phone = message.phone.replace(/[^0-9]/g, "");
      window.open(`https://wa.me/${phone}`, "_blank");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="border-b p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold">تفاصيل الرسالة</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {getStatusBadge(message.status)}
            {getPriorityBadge(message.priority)}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Customer Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600">الاسم</label>
              <p className="font-medium">{message.name}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600">البريد الإلكتروني</label>
              <p className="font-medium">{message.email}</p>
            </div>
            {message.phone && (
              <div>
                <label className="text-sm text-gray-600">رقم الهاتف</label>
                <p className="font-medium">{message.phone}</p>
              </div>
            )}
            <div>
              <label className="text-sm text-gray-600">التاريخ</label>
              <p className="font-medium">{formatDate(message.created_at)}</p>
            </div>
          </div>

          {/* Subject */}
          <div>
            <label className="text-sm text-gray-600">الموضوع</label>
            <p className="font-medium text-lg">{message.subject}</p>
          </div>

          {/* Message */}
          <div>
            <label className="text-sm text-gray-600">الرسالة</label>
            <div className="mt-2 p-4 bg-gray-50 rounded-lg">
              <p className="whitespace-pre-wrap">{message.message}</p>
            </div>
          </div>

          {/* Status & Priority Controls */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-2">الحالة</label>
              <select
                value={message.status}
                onChange={(e) => onStatusUpdate(message.id, e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple"
              >
                <option value="new">جديد</option>
                <option value="read">مقروء</option>
                <option value="in_progress">قيد المعالجة</option>
                <option value="replied">تم الرد</option>
                <option value="archived">مؤرشف</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-2">
                الأولوية
              </label>
              <select
                value={message.priority}
                onChange={(e) => onPriorityUpdate(message.id, e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple"
              >
                <option value="low">منخفض</option>
                <option value="normal">عادي</option>
                <option value="high">مرتفع</option>
                <option value="urgent">عاجل</option>
              </select>
            </div>
          </div>

          {/* Admin Notes */}
          <div>
            <label className="block text-sm text-gray-600 mb-2">
              ملاحظات إدارية
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple"
              placeholder="أضف ملاحظاتك هنا..."
            />
            <Button onClick={handleSaveNotes} size="sm" className="mt-2">
              حفظ الملاحظات
            </Button>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t p-6 flex flex-wrap gap-3">
          <Button
            onClick={handleEmailClick}
            className="flex items-center gap-2"
          >
            <Mail size={18} />
            رد عبر الإيميل
          </Button>

          {message.phone && (
            <Button
              onClick={handleWhatsAppClick}
              className="flex items-center gap-2 bg-green-500 hover:bg-green-600"
            >
              <MessageCircle size={18} />
              رد عبر واتساب
            </Button>
          )}

          <Button
            onClick={() => onDelete(message.id)}
            variant="outline"
            className="flex items-center gap-2 text-red-600 border-red-600 hover:bg-red-50 mr-auto"
          >
            <Trash2 size={18} />
            حذف
          </Button>
        </div>
      </div>
    </div>
  );
}

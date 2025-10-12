// client/src/components/NotificationCenter.jsx
import { useEffect, useState } from "react";
import { Bell, X, Check, AlertCircle, Info, CheckCircle } from "lucide-react";

export default function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // جلب الإشعارات من الباك اند
  useEffect(() => {
    fetchNotifications();
    // تحديث الإشعارات كل 30 ثانية
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/notifications", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch notifications");

      const data = await response.json();
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  // تحديد نوع الأيقونة حسب نوع الإشعار
  const getNotificationIcon = (type) => {
    switch (type) {
      case "success":
        return <CheckCircle className="text-green-500" size={20} />;
      case "warning":
        return <AlertCircle className="text-orange-500" size={20} />;
      case "error":
        return <AlertCircle className="text-red-500" size={20} />;
      default:
        return <Info className="text-blue-500" size={20} />;
    }
  };

  // تحديد لون الخلفية حسب نوع الإشعار
  const getNotificationBg = (type) => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-200";
      case "warning":
        return "bg-orange-50 border-orange-200";
      case "error":
        return "bg-red-50 border-red-200";
      default:
        return "bg-blue-50 border-blue-200";
    }
  };

  // وضع علامة مقروء على إشعار
  const markAsRead = async (notificationId) => {
    try {
      await fetch(`/api/admin/notifications/${notificationId}/read`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === notificationId ? { ...notif, read: true } : notif
        )
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  // وضع علامة مقروء على جميع الإشعارات
  const markAllAsRead = async () => {
    try {
      await fetch("/api/admin/notifications/read-all", {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, read: true }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  // حذف إشعار
  const deleteNotification = async (notificationId) => {
    try {
      await fetch(`/api/admin/notifications/${notificationId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      setNotifications((prev) =>
        prev.filter((notif) => notif.id !== notificationId)
      );
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  // تنسيق الوقت
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / 60000);

    if (diffInMinutes < 1) return "الآن";
    if (diffInMinutes < 60) return `منذ ${diffInMinutes} دقيقة`;
    if (diffInMinutes < 1440)
      return `منذ ${Math.floor(diffInMinutes / 60)} ساعة`;
    return `منذ ${Math.floor(diffInMinutes / 1440)} يوم`;
  };

  return (
    <div className="relative">
      {/* زر الإشعارات */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
      >
        <Bell size={24} className="text-gray-700" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* قائمة الإشعارات */}
      {isOpen && (
        <>
          {/* خلفية شفافة للإغلاق */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          ></div>

          {/* نافذة الإشعارات */}
          <div className="absolute left-0 mt-2 w-96 bg-white rounded-lg shadow-2xl z-50 border border-gray-200 max-h-[600px] overflow-hidden">
            {/* رأس الإشعارات */}
            <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-purple to-pink">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">الإشعارات</h3>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-xs text-white hover:underline flex items-center gap-1"
                    >
                      <Check size={14} />
                      وضع علامة مقروء للكل
                    </button>
                  )}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-white hover:bg-white/20 rounded p-1"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
            </div>

            {/* قائمة الإشعارات */}
            <div className="overflow-y-auto max-h-[500px]">
              {loading ? (
                <div className="p-8 text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-purple border-t-transparent"></div>
                  <p className="mt-2 text-gray-600">جاري التحميل...</p>
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <Bell size={48} className="mx-auto mb-3 text-gray-300" />
                  <p>لا توجد إشعارات جديدة</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-gray-50 transition-colors duration-200 ${
                        !notification.read ? "bg-blue-50" : ""
                      }`}
                    >
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 mt-1">
                          {getNotificationIcon(notification.type)}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <p
                                className={`text-sm ${
                                  !notification.read
                                    ? "font-semibold text-gray-900"
                                    : "text-gray-700"
                                }`}
                              >
                                {notification.title}
                              </p>
                              <p className="text-xs text-gray-600 mt-1">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-500 mt-2">
                                {formatTime(notification.createdAt)}
                              </p>
                            </div>

                            <div className="flex flex-col gap-1">
                              {!notification.read && (
                                <button
                                  onClick={() => markAsRead(notification.id)}
                                  className="text-purple hover:text-pink transition-colors"
                                  title="وضع علامة مقروء"
                                >
                                  <Check size={16} />
                                </button>
                              )}
                              <button
                                onClick={() =>
                                  deleteNotification(notification.id)
                                }
                                className="text-gray-400 hover:text-red-500 transition-colors"
                                title="حذف"
                              >
                                <X size={16} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* تذييل الإشعارات */}
            {notifications.length > 0 && (
              <div className="p-3 border-t border-gray-200 bg-gray-50">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    // يمكن إضافة navigation إلى صفحة الإشعارات الكاملة
                  }}
                  className="w-full text-center text-sm text-purple hover:text-pink font-medium transition-colors"
                >
                  عرض جميع الإشعارات
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// client/src/pages/admin/Dashboard.jsx
import React, { useState, useEffect } from "react";
import { Image, MessageSquare, Users, Eye } from "lucide-react";
import NotificationCenter from "../../components/NotificationCenter";
import ExportReports from "../../components/ExportReports";
import Loading from "../../utils/LoadingSettings";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("30"); // 7, 30, 90 days
  const [chartData, setChartData] = useState({
    monthlyViews: [],
    monthlyStats: [],
    categoryDistribution: [],
    ratingDistribution: [],
  });

  // جلب البيانات من الباك اند
  useEffect(() => {
    fetchDashboardData();
  }, [activeTab]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/stats?days=${activeTab}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch stats");

      const data = await response.json();
      setStats(data);

      // تحضير بيانات الرسوم البيانية
      prepareChartData(data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const prepareChartData = (data) => {
    // بيانات المشاهدات الشهرية
    const monthlyViews = data.monthlyStats || [];

    // توزيع الفئات
    const categoryDistribution = data.categoriesStats || [];

    // توزيع التقييمات
    const ratingDistribution = data.ratingDistribution || [];

    setChartData({
      monthlyViews,
      monthlyStats: monthlyViews,
      categoryDistribution,
      ratingDistribution,
    });
  };

  // تنسيق الأرقام
  const formatNumber = (num) => {
    if (!num) return "0";
    return num.toLocaleString("ar-EG");
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      {/* رأس الصفحة */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">لوحة التحكم</h1>
          <p className="text-gray-600 mt-2">
            مرحباً بك في لوحة إدارة ساندي مكرمية
          </p>
        </div>

        <div className="flex items-center gap-3">
          <NotificationCenter />
          <ExportReports
            dataType="dashboard"
            onExport={(format) => console.log(`Exported as ${format}`)}
          />
        </div>
      </div>

      {/* أزرار الفلتر */}
      <div className="flex gap-3">
        <button
          onClick={() => setActiveTab("7")}
          className={`px-6 py-2 rounded-lg transition-colors ${
            activeTab === "7"
              ? "bg-gradient-to-r from-purple to-pink text-white"
              : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
          }`}
        >
          آخر 7 أيام
        </button>
        <button
          onClick={() => setActiveTab("30")}
          className={`px-6 py-2 rounded-lg transition-colors ${
            activeTab === "30"
              ? "bg-gradient-to-r from-purple to-pink text-white"
              : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
          }`}
        >
          آخر 30 يوم
        </button>
        <button
          onClick={() => setActiveTab("90")}
          className={`px-6 py-2 rounded-lg transition-colors ${
            activeTab === "90"
              ? "bg-gradient-to-r from-purple to-pink text-white"
              : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
          }`}
        >
          آخر 90 يوم
        </button>
      </div>

      {/* بطاقات الإحصائيات */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* المشاهدات */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green-100 p-3 rounded-full">
              <Eye size={24} className="text-green-600" />
            </div>
            <span className="text-sm text-gray-600">المشاهدات</span>
          </div>
          <div className="text-3xl font-bold text-gray-800 mb-2">
            {formatNumber(stats?.views?.total || 0)}
          </div>
          <div className="text-sm text-gray-600 mb-3">إجمالي المشاهدات</div>
          <div className="flex items-center gap-2">
            <span
              className={`text-sm font-medium ${
                stats?.views?.trend >= 0 ? "text-green-500" : "text-red-500"
              }`}
            >
              {stats?.views?.trend >= 0 ? "↑" : "↓"}{" "}
              {Math.abs(stats?.views?.trend || 0)}%
            </span>
            <span className="text-xs text-gray-500">مقارنة بالشهر الماضي</span>
          </div>
        </div>

        {/* الاستعلامات */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <MessageSquare size={24} className="text-blue-600" />
            </div>
            <span className="text-sm text-gray-600">الاستعلامات</span>
          </div>
          <div className="text-3xl font-bold text-gray-800 mb-2">
            {formatNumber(stats?.inquiries?.total || 0)}
          </div>
          <div className="text-sm text-gray-600 mb-3">
            {formatNumber(stats?.inquiries?.new || 0)} جديد
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`text-sm font-medium ${
                stats?.inquiries?.trend >= 0 ? "text-green-500" : "text-red-500"
              }`}
            >
              {stats?.inquiries?.trend >= 0 ? "↑" : "↓"}{" "}
              {Math.abs(stats?.inquiries?.trend || 0)}%
            </span>
            <span className="text-xs text-gray-500">مقارنة بالشهر الماضي</span>
          </div>
        </div>

        {/* التقييمات */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-yellow-100 p-3 rounded-full">
              <span className="text-2xl">⭐</span>
            </div>
            <span className="text-sm text-gray-600">التقييمات</span>
          </div>
          <div className="text-3xl font-bold text-gray-800 mb-2">
            {formatNumber(stats?.reviews?.total || 0)}
          </div>
          <div className="text-sm text-gray-600 mb-3">
            ⭐ متوسط {stats?.reviews?.avgRating || 0}
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`text-sm font-medium ${
                stats?.reviews?.trend >= 0 ? "text-green-500" : "text-red-500"
              }`}
            >
              {stats?.reviews?.trend >= 0 ? "↑" : "↓"}{" "}
              {Math.abs(stats?.reviews?.trend || 0)}%
            </span>
            <span className="text-xs text-gray-500">مقارنة بالشهر الماضي</span>
          </div>
        </div>

        {/* إجمالي الألبومات */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-purple-100 p-3 rounded-full">
              <Image size={24} className="text-purple" />
            </div>
            <span className="text-sm text-gray-600">إجمالي الألبومات</span>
          </div>
          <div className="text-3xl font-bold text-gray-800 mb-2">
            {formatNumber(stats?.albums?.total || 0)}
          </div>
          <div className="text-sm text-gray-600 mb-3">
            {formatNumber(stats?.albums?.published || 0)} منشور
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`text-sm font-medium ${
                stats?.albums?.trend >= 0 ? "text-green-500" : "text-red-500"
              }`}
            >
              {stats?.albums?.trend >= 0 ? "↑" : "↓"}{" "}
              {Math.abs(stats?.albums?.trend || 0)}%
            </span>
            <span className="text-xs text-gray-500">مقارنة بالشهر الماضي</span>
          </div>
        </div>
      </div>

      {/* إجراءات سريعة */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span>📊</span>
          إجراءات سريعة
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <button
            onClick={() => (window.location.href = "/admin/inquiries")}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border-2 border-dashed border-orange-400"
          >
            <div className="text-4xl mb-3">📦</div>
            <h3 className="text-lg font-semibold text-gray-800">
              الطلبات المعلقة
            </h3>
          </button>

          <button
            onClick={() => (window.location.href = "/admin/inquiries")}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border-2 border-dashed border-blue-400"
          >
            <div className="text-4xl mb-3">💬</div>
            <h3 className="text-lg font-semibold text-gray-800">
              الرد على الاستعلامات
            </h3>
          </button>

          <button
            onClick={() => (window.location.href = "/admin/reviews")}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border-2 border-dashed border-green-400"
          >
            <div className="text-4xl mb-3">✅</div>
            <h3 className="text-lg font-semibold text-gray-800">
              الموافقة على التقييمات
            </h3>
          </button>

          <button
            onClick={() => (window.location.href = "/admin/albums/new")}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border-2 border-dashed border-purple"
          >
            <div className="text-4xl mb-3">➕</div>
            <h3 className="text-lg font-semibold text-gray-800">ألبوم جديد</h3>
          </button>
        </div>
      </div>

      {/* الرسوم البيانية */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* الاتجاهات الشهرية */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            الاتجاهات الشهرية
          </h3>
          <div className="h-64 flex items-end justify-between gap-2">
            {chartData.monthlyViews.map((item, index) => {
              const maxValue = Math.max(
                ...chartData.monthlyViews.map((i) => i.albums + i.reviews)
              );
              const albumsHeight = (item.albums / maxValue) * 100;
              const reviewsHeight = (item.reviews / maxValue) * 100;

              return (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div className="w-full flex flex-col-reverse gap-1">
                    <div
                      className="w-full bg-purple rounded-t"
                      style={{ height: `${albumsHeight}%`, minHeight: "4px" }}
                      title={`ألبومات: ${item.albums}`}
                    ></div>
                    <div
                      className="w-full bg-blue-500 rounded-t"
                      style={{ height: `${reviewsHeight}%`, minHeight: "4px" }}
                      title={`تقييمات: ${item.reviews}`}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-600 mt-2">
                    {item.month}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="flex items-center justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded"></div>
              <span className="text-sm text-gray-600">التقييمات</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-purple rounded"></div>
              <span className="text-sm text-gray-600">الألبومات</span>
            </div>
          </div>
        </div>

        {/* تحليل المشاهدات */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            تحليل المشاهدات
          </h3>
          <div className="h-64 flex items-end justify-between gap-3">
            {chartData.monthlyViews.map((item, index) => {
              const maxViews = Math.max(
                ...chartData.monthlyViews.map((i) => i.views)
              );
              const height = (item.views / maxViews) * 100;

              return (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-gradient-to-t from-green-500 to-green-400 rounded-t hover:opacity-80 transition-opacity cursor-pointer"
                    style={{ height: `${height}%`, minHeight: "8px" }}
                    title={`${item.views} مشاهدة`}
                  ></div>
                  <span className="text-xs text-gray-600 mt-2">
                    {item.month}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="mt-4 flex items-center justify-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span className="text-sm text-gray-600">المشاهدات</span>
          </div>
        </div>
      </div>

      {/* توزيع التقييمات والفئات */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* توزيع التقييمات */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            توزيع التقييمات
          </h3>
          <div className="space-y-3">
            {chartData.ratingDistribution.map((item, index) => {
              const maxCount = Math.max(
                ...chartData.ratingDistribution.map((i) => i.count)
              );
              const percentage = (item.count / maxCount) * 100;
              const colors = [
                "bg-purple",
                "bg-blue-500",
                "bg-green-500",
                "bg-yellow-500",
                "bg-orange-500",
              ];

              return (
                <div key={index}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-700">
                      {"⭐".repeat(item.rating)}
                    </span>
                    <span className="text-sm font-semibold text-gray-800">
                      {item.count}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className={`${
                        colors[index % colors.length]
                      } h-full rounded-full transition-all duration-500`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* توزيع الفئات */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            توزيع الفئات
          </h3>
          <div className="flex items-center justify-center h-64">
            {chartData.categoryDistribution.length > 0 ? (
              <div className="relative w-64 h-64">
                <svg viewBox="0 0 200 200" className="transform -rotate-90">
                  {(() => {
                    const total = chartData.categoryDistribution.reduce(
                      (sum, cat) => sum + cat.count,
                      0
                    );
                    let currentAngle = 0;
                    const colors = [
                      "#9333ea",
                      "#3b82f6",
                      "#10b981",
                      "#f59e0b",
                      "#ef4444",
                    ];

                    return chartData.categoryDistribution.map((cat, index) => {
                      const percentage = (cat.count / total) * 100;
                      const angle = (percentage / 100) * 360;
                      const radius = 80;
                      const circumference = 2 * Math.PI * radius;
                      const offset =
                        circumference - (percentage / 100) * circumference;

                      const element = (
                        <circle
                          key={index}
                          cx="100"
                          cy="100"
                          r={radius}
                          fill="none"
                          stroke={colors[index % colors.length]}
                          strokeWidth="40"
                          strokeDasharray={circumference}
                          strokeDashoffset={offset}
                          style={{
                            transform: `rotate(${currentAngle}deg)`,
                            transformOrigin: "center",
                          }}
                        />
                      );

                      currentAngle += angle;
                      return element;
                    });
                  })()}
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-800">
                      {chartData.categoryDistribution.reduce(
                        (sum, cat) => sum + cat.count,
                        0
                      )}
                    </div>
                    <div className="text-sm text-gray-600">ألبوم</div>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">لا توجد بيانات</p>
            )}
          </div>
          <div className="mt-4 space-y-2">
            {chartData.categoryDistribution.map((cat, index) => {
              const colors = [
                "bg-purple",
                "bg-blue-500",
                "bg-green-500",
                "bg-yellow-500",
                "bg-red-500",
              ];
              const total = chartData.categoryDistribution.reduce(
                (sum, c) => sum + c.count,
                0
              );
              const percentage = ((cat.count / total) * 100).toFixed(1);

              return (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-4 h-4 ${
                        colors[index % colors.length]
                      } rounded`}
                    ></div>
                    <span className="text-sm text-gray-700">{cat.label}</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-800">
                    {percentage}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

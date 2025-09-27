// client/src/pages/admin/Dashboard.jsx - مُصحح
import { useState, useEffect } from "react";
import { Image, MessageSquare, Users, Eye, Settings } from "lucide-react";
import { adminAPI } from "../../api/auth";
import Loading from "../../utils/LoadingSettings";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await adminAPI.getStats();
        // تعديل للتعامل مع structure الصحيح
        setStats(response.data || response);
      } catch (error) {
        console.error("Error fetching stats:", error);
        setError("فشل في تحميل الإحصائيات");
        // إعداد stats افتراضية في حالة الخطأ
        setStats({
          albums: { total: 0, published: 0 },
          reviews: { total: 0, pending: 0 },
          inquiries: { total: 0, new: 0 },
          views: { total: 0 },
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <div className="text-red-500 mb-4">{error}</div>
        <button
          onClick={() => window.location.reload()}
          className="bg-purple text-white px-4 py-2 rounded-lg hover:bg-purple-hover"
        >
          إعادة المحاولة
        </button>
      </div>
    );
  }

  const statCards = [
    {
      icon: Image,
      title: "إجمالي الألبومات",
      value: stats?.albums?.total || 0,
      color: "bg-blue-500",
      subtext: `${stats?.albums?.published || 0} منشور`,
    },
    {
      icon: MessageSquare,
      title: "آراء العملاء",
      value: stats?.reviews?.total || 0,
      color: "bg-green-500",
      subtext: `${stats?.reviews?.pending || 0} في الانتظار`,
    },
    {
      icon: Users,
      title: "الاستعلامات",
      value: stats?.inquiries?.total || 0,
      color: "bg-purple",
      subtext: `${stats?.inquiries?.new || 0} جديد`,
    },
    {
      icon: Eye,
      title: "المشاهدات",
      value: stats?.views?.total || 0,
      color: "bg-orange-500",
      subtext: "إجمالي المشاهدات",
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">لوحة التحكم</h1>
        <p className="text-gray-600 mt-2">
          مرحباً بك في لوحة إدارة ساندي مكرمية
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {card.title}
                </p>
                <p className="text-3xl font-bold text-gray-800 mt-2">
                  {card.value}
                </p>
                <p className="text-sm text-gray-500 mt-1">{card.subtext}</p>
              </div>
              <div className={`${card.color} p-3 rounded-full`}>
                <card.icon size={24} className="text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">إجراءات سريعة</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple hover:bg-purple-50 transition-colors">
            <Image size={32} className="mx-auto mb-2 text-gray-400" />
            <p className="font-medium">إضافة ألبوم جديد</p>
          </button>

          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple hover:bg-purple-50 transition-colors">
            <Settings size={32} className="mx-auto mb-2 text-gray-400" />
            <p className="font-medium">تعديل الإعدادات</p>
          </button>

          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple hover:bg-purple-50 transition-colors">
            <MessageSquare size={32} className="mx-auto mb-2 text-gray-400" />
            <p className="font-medium">مراجعة الآراء</p>
          </button>
        </div>
      </div>
    </div>
  );
}

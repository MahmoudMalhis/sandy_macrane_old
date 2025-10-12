import { useState, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  Image,
  MessageSquare,
  Users,
  Star,
  Eye,
  Package,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  ArrowUpRight,
  Activity,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// الألوان
const COLORS = {
  primary: "#9333ea",
  success: "#10b981",
  warning: "#f59e0b",
  danger: "#ef4444",
  info: "#3b82f6",
  purple: "#9333ea",
  blue: "#3b82f6",
  green: "#10b981",
  orange: "#f59e0b",
  red: "#ef4444",
};

const CHART_COLORS = [
  "#9333ea",
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
];

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("30"); // 7, 30, 90 days

  useEffect(() => {
    fetchDashboardData();
  }, [timeRange]);

  const fetchDashboardData = async () => {
    try {
      // في التطبيق الحقيقي، استبدل هذا بـ API call
      // const response = await fetch('/api/admin/stats');
      // const data = await response.json();

      // بيانات تجريبية محسّنة
      const mockData = {
        overview: {
          totalAlbums: 42,
          publishedAlbums: 38,
          totalReviews: 156,
          publishedReviews: 142,
          totalInquiries: 89,
          newInquiries: 12,
          totalViews: 5847,
          averageRating: 4.8,
          totalRevenue: 45600,
          pendingOrders: 8,
        },
        trends: {
          albumsChange: 12.5,
          reviewsChange: 8.3,
          inquiriesChange: -3.2,
          viewsChange: 23.5,
        },
        monthlyData: [
          { month: "يناير", albums: 5, reviews: 18, inquiries: 12, views: 450 },
          {
            month: "فبراير",
            albums: 7,
            reviews: 22,
            inquiries: 15,
            views: 520,
          },
          { month: "مارس", albums: 6, reviews: 25, inquiries: 18, views: 680 },
          { month: "أبريل", albums: 8, reviews: 28, inquiries: 14, views: 750 },
          { month: "مايو", albums: 9, reviews: 32, inquiries: 16, views: 890 },
          { month: "يونيو", albums: 7, reviews: 31, inquiries: 14, views: 920 },
        ],
        categoryDistribution: [
          { name: "مكرمية", value: 28, percentage: 67 },
          { name: "براويز", value: 14, percentage: 33 },
        ],
        ratingDistribution: [
          { rating: "5⭐", count: 98, percentage: 63 },
          { rating: "4⭐", count: 38, percentage: 24 },
          { rating: "3⭐", count: 15, percentage: 10 },
          { rating: "2⭐", count: 4, percentage: 2 },
          { rating: "1⭐", count: 1, percentage: 1 },
        ],
        recentActivity: [
          {
            type: "review",
            text: "تقييم جديد من سارة أحمد",
            time: "منذ 5 دقائق",
            icon: Star,
            color: "text-yellow-500",
          },
          {
            type: "inquiry",
            text: "استعلام جديد من محمد خالد",
            time: "منذ 12 دقيقة",
            icon: MessageSquare,
            color: "text-blue-500",
          },
          {
            type: "album",
            text: 'تم نشر ألبوم "مكرمية جدارية"',
            time: "منذ ساعة",
            icon: Image,
            color: "text-purple-500",
          },
          {
            type: "order",
            text: "طلب جديد بقيمة 250 ريال",
            time: "منذ ساعتين",
            icon: Package,
            color: "text-green-500",
          },
        ],
        topAlbums: [
          { title: "مكرمية جدارية فاخرة", views: 1250, rating: 4.9 },
          { title: "براويز خشبية مزخرفة", views: 980, rating: 4.8 },
          { title: "معلقات نباتات", views: 750, rating: 4.7 },
        ],
      };

      setStats(mockData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-purple-600"></div>
      </div>
    );
  }

  const StatCard = ({
    icon: Icon,
    title,
    value,
    subtitle,
    trend,
    color,
    bgColor,
  }) => (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 text-gray-600 text-sm mb-2">
            <Icon size={18} />
            <span>{title}</span>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>
          {subtitle && <div className="text-sm text-gray-500">{subtitle}</div>}
        </div>
        <div className={`${bgColor} p-3 rounded-lg`}>
          <Icon className={color} size={28} />
        </div>
      </div>
      {trend !== undefined && (
        <div className="mt-4 flex items-center gap-2">
          {trend >= 0 ? (
            <TrendingUp className="text-green-500" size={18} />
          ) : (
            <TrendingDown className="text-red-500" size={18} />
          )}
          <span
            className={`text-sm font-semibold ${
              trend >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {Math.abs(trend)}%
          </span>
          <span className="text-xs text-gray-500">مقارنة بالشهر الماضي</span>
        </div>
      )}
    </div>
  );

  const QuickAction = ({ icon: Icon, label, color, onClick }) => (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center p-6 rounded-xl border-2 border-dashed ${color} hover:bg-opacity-10 transition-all duration-300 hover:scale-105`}
    >
      <Icon className={color.replace("border-", "text-")} size={32} />
      <span className="mt-2 font-medium text-gray-700">{label}</span>
    </button>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen" dir="rtl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">لوحة التحكم</h1>
        <p className="text-gray-600">مرحباً بك في لوحة إدارة ساندي مكرمية</p>
      </div>

      {/* Time Range Selector */}
      <div className="mb-6 flex gap-2">
        {[
          { value: "7", label: "آخر 7 أيام" },
          { value: "30", label: "آخر 30 يوم" },
          { value: "90", label: "آخر 90 يوم" },
        ].map((option) => (
          <button
            key={option.value}
            onClick={() => setTimeRange(option.value)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              timeRange === option.value
                ? "bg-purple-600 text-white shadow-lg"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={Image}
          title="إجمالي الألبومات"
          value={stats.overview.totalAlbums}
          subtitle={`${stats.overview.publishedAlbums} منشور`}
          trend={stats.trends.albumsChange}
          color="text-purple-600"
          bgColor="bg-purple-100"
        />
        <StatCard
          icon={Star}
          title="التقييمات"
          value={stats.overview.totalReviews}
          subtitle={`متوسط ${stats.overview.averageRating}⭐`}
          trend={stats.trends.reviewsChange}
          color="text-yellow-600"
          bgColor="bg-yellow-100"
        />
        <StatCard
          icon={MessageSquare}
          title="الاستعلامات"
          value={stats.overview.totalInquiries}
          subtitle={`${stats.overview.newInquiries} جديد`}
          trend={stats.trends.inquiriesChange}
          color="text-blue-600"
          bgColor="bg-blue-100"
        />
        <StatCard
          icon={Eye}
          title="المشاهدات"
          value={stats.overview.totalViews.toLocaleString()}
          subtitle="إجمالي المشاهدات"
          trend={stats.trends.viewsChange}
          color="text-green-600"
          bgColor="bg-green-100"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Activity size={24} />
          إجراءات سريعة
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <QuickAction
            icon={Plus}
            label="ألبوم جديد"
            color="border-purple-500"
          />
          <QuickAction
            icon={CheckCircle}
            label="الموافقة على التقييمات"
            color="border-green-500"
          />
          <QuickAction
            icon={MessageSquare}
            label="الرد على الاستعلامات"
            color="border-blue-500"
          />
          <QuickAction
            icon={Package}
            label="الطلبات المعلقة"
            color="border-orange-500"
          />
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Monthly Trends */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            الاتجاهات الشهرية
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={stats.monthlyData}>
              <defs>
                <linearGradient id="colorAlbums" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={COLORS.purple}
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor={COLORS.purple}
                    stopOpacity={0}
                  />
                </linearGradient>
                <linearGradient id="colorReviews" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS.blue} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={COLORS.blue} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area
                type="monotone"
                dataKey="albums"
                stroke={COLORS.purple}
                fillOpacity={1}
                fill="url(#colorAlbums)"
                name="الألبومات"
              />
              <Area
                type="monotone"
                dataKey="reviews"
                stroke={COLORS.blue}
                fillOpacity={1}
                fill="url(#colorReviews)"
                name="التقييمات"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Views Comparison */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            تحليل المشاهدات
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="views"
                fill={COLORS.green}
                name="المشاهدات"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Category Distribution */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">توزيع الفئات</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={stats.categoryDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percentage }) => `${name} ${percentage}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {stats.categoryDistribution.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={CHART_COLORS[index % CHART_COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Rating Distribution */}
        <div className="bg-white rounded-xl shadow-lg p-6 col-span-2">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            توزيع التقييمات
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={stats.ratingDistribution} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="rating" type="category" />
              <Tooltip />
              <Bar
                dataKey="count"
                fill={COLORS.warning}
                name="العدد"
                radius={[0, 8, 8, 0]}
              >
                {stats.ratingDistribution.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={CHART_COLORS[index % CHART_COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Clock size={24} />
            النشاط الأخير
          </h2>
          <div className="space-y-4">
            {stats.recentActivity.map((activity, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div
                  className={`p-2 rounded-lg ${activity.color
                    .replace("text-", "bg-")
                    .replace("-500", "-100")}`}
                >
                  <activity.icon className={activity.color} size={20} />
                </div>
                <div className="flex-1">
                  <p className="text-gray-900 font-medium">{activity.text}</p>
                  <p className="text-gray-500 text-sm">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Albums */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp size={24} />
            الألبومات الأكثر مشاهدة
          </h2>
          <div className="space-y-4">
            {stats.topAlbums.map((album, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="text-gray-900 font-medium">{album.title}</p>
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Eye size={14} />
                        {album.views}
                      </span>
                      <span className="flex items-center gap-1">
                        <Star size={14} className="text-yellow-500" />
                        {album.rating}
                      </span>
                    </div>
                  </div>
                </div>
                <ArrowUpRight className="text-gray-400" size={20} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

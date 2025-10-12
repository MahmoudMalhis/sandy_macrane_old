// client/src/components/ChartComponents.jsx
import { TrendingUp, Activity, BarChart3 } from "lucide-react";

// مكون الرسم البياني الخطي
export const LineChart = ({ data, title, height = "300px" }) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
        <div className="flex items-center justify-center h-64 text-gray-400">
          <p>لا توجد بيانات لعرضها</p>
        </div>
      </div>
    );
  }

  const maxValue = Math.max(...data.map((item) => item.value));

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <TrendingUp className="text-purple" size={20} />
      </div>

      <div className="relative" style={{ height }}>
        <div className="flex items-end justify-between h-full gap-2">
          {data.map((item, index) => (
            <div
              key={index}
              className="flex-1 flex flex-col items-center gap-2"
            >
              <div className="relative w-full">
                <div
                  className="bg-gradient-to-t from-purple to-pink rounded-t transition-all duration-500 hover:opacity-80"
                  style={{
                    height: `${(item.value / maxValue) * 100}%`,
                    minHeight: "20px",
                  }}
                >
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-semibold text-gray-700">
                    {item.value}
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-600 mt-2">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// مكون الرسم البياني الدائري
export const PieChart = ({ data, title }) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
        <div className="flex items-center justify-center h-64 text-gray-400">
          <p>لا توجد بيانات لعرضها</p>
        </div>
      </div>
    );
  }

  const total = data.reduce((sum, item) => sum + item.value, 0);
  const colors = [
    "bg-purple",
    "bg-pink",
    "bg-blue-500",
    "bg-green-500",
    "bg-orange-500",
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <Activity className="text-purple" size={20} />
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        {/* الدائرة */}
        <div className="relative w-48 h-48">
          <svg className="transform -rotate-90 w-full h-full">
            <circle
              cx="96"
              cy="96"
              r="80"
              fill="none"
              stroke="#f3f4f6"
              strokeWidth="16"
            />
            {data.map((item, index) => {
              const percentage = (item.value / total) * 100;
              const circumference = 2 * Math.PI * 80;
              const offset = circumference - (percentage / 100) * circumference;
              const prevPercentages = data
                .slice(0, index)
                .reduce((sum, d) => sum + (d.value / total) * 100, 0);
              const rotation = (prevPercentages / 100) * 360;

              return (
                <circle
                  key={index}
                  cx="96"
                  cy="96"
                  r="80"
                  fill="none"
                  stroke={getColorHex(colors[index % colors.length])}
                  strokeWidth="16"
                  strokeDasharray={circumference}
                  strokeDashoffset={offset}
                  style={{
                    transform: `rotate(${rotation}deg)`,
                    transformOrigin: "center",
                    transition: "all 0.5s ease-in-out",
                  }}
                />
              );
            })}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-3xl font-bold text-gray-800">{total}</p>
            <p className="text-sm text-gray-600">الإجمالي</p>
          </div>
        </div>

        {/* المفتاح */}
        <div className="flex-1 space-y-3">
          {data.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`w-4 h-4 rounded ${colors[index % colors.length]}`}
                ></div>
                <span className="text-sm text-gray-700">{item.label}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-gray-800">
                  {item.value}
                </span>
                <span className="text-xs text-gray-500">
                  ({((item.value / total) * 100).toFixed(1)}%)
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// مكون الرسم البياني الشريطي
export const BarChart = ({ data, title }) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
        <div className="flex items-center justify-center h-64 text-gray-400">
          <p>لا توجد بيانات لعرضها</p>
        </div>
      </div>
    );
  }

  const maxValue = Math.max(...data.map((item) => item.value));

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <BarChart3 className="text-purple" size={20} />
      </div>

      <div className="space-y-4">
        {data.map((item, index) => (
          <div key={index}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-700">{item.label}</span>
              <span className="text-sm font-semibold text-gray-800">
                {item.value}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-purple to-pink h-full rounded-full transition-all duration-500"
                style={{ width: `${(item.value / maxValue) * 100}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// دالة مساعدة لتحويل أسماء الألوان إلى HEX
function getColorHex(colorClass) {
  const colorMap = {
    "bg-purple": "#9333ea",
    "bg-pink": "#ec4899",
    "bg-blue-500": "#3b82f6",
    "bg-green-500": "#22c55e",
    "bg-orange-500": "#f97316",
  };
  return colorMap[colorClass] || "#9333ea";
}

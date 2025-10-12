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

// الألوان الثابتة
const COLORS = [
  "#9333ea",
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
];

/**
 * مكون Tooltip مخصص مع تصميم أفضل
 */
export const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload) return null;

  return (
    <div className="bg-white p-4 rounded-lg shadow-xl border border-gray-200">
      <p className="font-bold text-gray-900 mb-2">{label}</p>
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center gap-2 text-sm">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-gray-600">{entry.name}:</span>
          <span className="font-semibold text-gray-900">{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

/**
 * مكون رسم بياني خطي مع gradients
 */
export const TrendLineChart = ({
  data,
  dataKeys = [],
  title = "",
  height = 300,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      {title && (
        <h2 className="text-xl font-bold text-gray-900 mb-4">{title}</h2>
      )}
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={data}>
          <defs>
            {dataKeys.map((key, index) => (
              <linearGradient
                key={key}
                id={`gradient-${key}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="5%" stopColor={COLORS[index]} stopOpacity={0.8} />
                <stop offset="95%" stopColor={COLORS[index]} stopOpacity={0} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="month" stroke="#6b7280" />
          <YAxis stroke="#6b7280" />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          {dataKeys.map((key, index) => (
            <Area
              key={key}
              type="monotone"
              dataKey={key.value || key}
              stroke={COLORS[index]}
              fillOpacity={1}
              fill={`url(#gradient-${key.value || key})`}
              name={key.name || key}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

/**
 * مكون رسم بياني عمودي محسّن
 */
export const EnhancedBarChart = ({
  data,
  dataKeys = [],
  title = "",
  height = 300,
  layout = "vertical",
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      {title && (
        <h2 className="text-xl font-bold text-gray-900 mb-4">{title}</h2>
      )}
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} layout={layout}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          {layout === "vertical" ? (
            <>
              <XAxis type="number" stroke="#6b7280" />
              <YAxis dataKey="name" type="category" stroke="#6b7280" />
            </>
          ) : (
            <>
              <XAxis dataKey="name" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
            </>
          )}
          <Tooltip content={<CustomTooltip />} />
          {dataKeys.length > 1 && <Legend />}
          {dataKeys.map((key, index) => (
            <Bar
              key={key.value || key}
              dataKey={key.value || key}
              fill={COLORS[index]}
              name={key.name || key}
              radius={layout === "vertical" ? [0, 8, 8, 0] : [8, 8, 0, 0]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

/**
 * مكون رسم دائري محسّن مع labels
 */
export const EnhancedPieChart = ({
  data,
  title = "",
  height = 300,
  showPercentage = true,
}) => {
  const RADIAN = Math.PI / 180;

  const renderCustomLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    name,
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        className="font-bold text-sm"
      >
        {showPercentage ? `${(percent * 100).toFixed(0)}%` : name}
      </text>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      {title && (
        <h2 className="text-xl font-bold text-gray-900 mb-4">{title}</h2>
      )}
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomLabel}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>

      {/* Legend مخصصة أسفل الرسم */}
      <div className="grid grid-cols-2 gap-3 mt-4">
        {data.map((entry, index) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">{entry.name}</p>
              <p className="text-xs text-gray-500">
                {entry.value} ({entry.percentage}%)
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * مكون رسم خطي بسيط للاتجاهات
 */
export const SimpleTrendChart = ({
  data,
  dataKey = "value",
  color = "#9333ea",
  height = 60,
}) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data}>
        <Line
          type="monotone"
          dataKey={dataKey}
          stroke={color}
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

/**
 * مكون Sparkline للإحصائيات السريعة
 */
export const Sparkline = ({ data, color = "#9333ea" }) => {
  return (
    <div className="w-20 h-8">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient
              id={`sparkline-${color}`}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="5%" stopColor={color} stopOpacity={0.8} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            fill={`url(#sparkline-${color})`}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

/**
 * مكون مقارنة متعدد المحاور
 */
export const MultiAxisChart = ({
  data,
  leftDataKey,
  rightDataKey,
  title = "",
  height = 300,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      {title && (
        <h2 className="text-xl font-bold text-gray-900 mb-4">{title}</h2>
      )}
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="month" stroke="#6b7280" />
          <YAxis yAxisId="left" stroke="#6b7280" />
          <YAxis yAxisId="right" orientation="right" stroke="#6b7280" />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey={leftDataKey.value}
            stroke={COLORS[0]}
            name={leftDataKey.name}
            strokeWidth={2}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey={rightDataKey.value}
            stroke={COLORS[1]}
            name={rightDataKey.name}
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

/**
 * مكون جدول بيانات مع Sparklines
 */
export const DataTableWithSparklines = ({ data, title = "" }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      {title && (
        <h2 className="text-xl font-bold text-gray-900 mb-4">{title}</h2>
      )}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                الاسم
              </th>
              <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                القيمة
              </th>
              <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                التغيير
              </th>
              <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                الاتجاه
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr
                key={index}
                className="border-b border-gray-100 hover:bg-gray-50"
              >
                <td className="py-3 px-4 text-sm text-gray-900">{row.name}</td>
                <td className="py-3 px-4 text-sm font-semibold text-gray-900">
                  {row.value}
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`text-sm font-medium ${
                      row.change >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {row.change >= 0 ? "+" : ""}
                    {row.change}%
                  </span>
                </td>
                <td className="py-3 px-4">
                  {row.trend && (
                    <Sparkline
                      data={row.trend}
                      color={row.change >= 0 ? "#10b981" : "#ef4444"}
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// تصدير جميع المكونات
export default {
  TrendLineChart,
  EnhancedBarChart,
  EnhancedPieChart,
  SimpleTrendChart,
  Sparkline,
  MultiAxisChart,
  DataTableWithSparklines,
  CustomTooltip,
};

// client/src/components/DataTable.jsx
import { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
  Eye,
  Edit,
  Trash2,
  MoreVertical,
} from "lucide-react";

export default function DataTable({
  columns = [],
  dataEndpoint,
  onEdit,
  onDelete,
  onView,
  actions = true,
  searchable = true,
  pageSize = 10,
}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [activeMenu, setActiveMenu] = useState(null);

  // جلب البيانات من الباك اند
  useEffect(() => {
    fetchData();
  }, [currentPage, searchTerm, sortColumn, sortDirection]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage,
        limit: pageSize,
        search: searchTerm,
        sortBy: sortColumn || "",
        sortDir: sortDirection,
      });

      const response = await fetch(`${dataEndpoint}?${params}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      if (!response.ok) throw new Error("فشل في جلب البيانات");

      const result = await response.json();
      setData(result.data || []);
      setTotalPages(result.totalPages || 1);
    } catch (error) {
      console.error("Error fetching data:", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  // ترتيب الأعمدة
  const handleSort = (columnKey) => {
    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(columnKey);
      setSortDirection("asc");
    }
  };

  // البحث
  const handleSearch = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  // التنقل بين الصفحات
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // تنسيق القيمة حسب النوع
  const formatValue = (value, type) => {
    if (value === null || value === undefined) return "-";

    switch (type) {
      case "date":
        return new Date(value).toLocaleDateString("ar-EG");
      case "datetime":
        return new Date(value).toLocaleString("ar-EG");
      case "status":
        return (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
              value
            )}`}
          >
            {value}
          </span>
        );
      case "boolean":
        return value ? "✓" : "✗";
      case "image":
        return (
          <img src={value} alt="" className="w-10 h-10 object-cover rounded" />
        );
      default:
        return value;
    }
  };

  // ألوان الحالة
  const getStatusColor = (status) => {
    const colors = {
      نشط: "bg-green-100 text-green-800",
      معلق: "bg-yellow-100 text-yellow-800",
      محذوف: "bg-red-100 text-red-800",
      منشور: "bg-blue-100 text-blue-800",
      مسودة: "bg-gray-100 text-gray-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-gray-200 rounded"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-100 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* شريط البحث */}
      {searchable && (
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="بحث..."
              className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
            />
          </div>
        </div>
      )}

      {/* الجدول */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  onClick={() => column.sortable && handleSort(column.key)}
                  className={`px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider ${
                    column.sortable ? "cursor-pointer hover:bg-gray-100" : ""
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {column.label}
                    {column.sortable && sortColumn === column.key && (
                      <span className="text-purple">
                        {sortDirection === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </th>
              ))}
              {actions && (
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  إجراءات
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (actions ? 1 : 0)}
                  className="px-6 py-12 text-center text-gray-500"
                >
                  لا توجد بيانات
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-700"
                    >
                      {formatValue(row[column.key], column.type)}
                    </td>
                  ))}
                  {actions && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      <div className="relative">
                        <button
                          onClick={() =>
                            setActiveMenu(
                              activeMenu === rowIndex ? null : rowIndex
                            )
                          }
                          className="p-1 hover:bg-gray-100 rounded transition-colors duration-200"
                        >
                          <MoreVertical size={18} className="text-gray-600" />
                        </button>

                        {activeMenu === rowIndex && (
                          <>
                            <div
                              className="fixed inset-0 z-10"
                              onClick={() => setActiveMenu(null)}
                            ></div>
                            <div className="absolute left-0 mt-1 w-48 bg-white rounded-lg shadow-xl z-20 border border-gray-200 py-1">
                              {onView && (
                                <button
                                  onClick={() => {
                                    onView(row);
                                    setActiveMenu(null);
                                  }}
                                  className="w-full flex items-center gap-2 px-4 py-2 text-right hover:bg-gray-50 transition-colors"
                                >
                                  <Eye size={16} className="text-blue-500" />
                                  <span className="text-gray-700">عرض</span>
                                </button>
                              )}
                              {onEdit && (
                                <button
                                  onClick={() => {
                                    onEdit(row);
                                    setActiveMenu(null);
                                  }}
                                  className="w-full flex items-center gap-2 px-4 py-2 text-right hover:bg-gray-50 transition-colors"
                                >
                                  <Edit size={16} className="text-purple" />
                                  <span className="text-gray-700">تعديل</span>
                                </button>
                              )}
                              {onDelete && (
                                <button
                                  onClick={() => {
                                    if (
                                      window.confirm("هل أنت متأكد من الحذف؟")
                                    ) {
                                      onDelete(row);
                                    }
                                    setActiveMenu(null);
                                  }}
                                  className="w-full flex items-center gap-2 px-4 py-2 text-right hover:bg-gray-50 transition-colors"
                                >
                                  <Trash2 size={16} className="text-red-500" />
                                  <span className="text-gray-700">حذف</span>
                                </button>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* التنقل بين الصفحات */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              صفحة {currentPage} من {totalPages}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => goToPage(1)}
                disabled={currentPage === 1}
                className="p-2 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronsRight size={18} />
              </button>
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={18} />
              </button>
              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={() => goToPage(totalPages)}
                disabled={currentPage === totalPages}
                className="p-2 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronsLeft size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// client/src/components/ExportReports.jsx
import { useState } from "react";
import {
  Download,
  FileText,
  FileSpreadsheet,
  File,
  CheckCircle,
} from "lucide-react";

export default function ExportReports({
  dataType = "general",
  onExport,
  customFileName,
}) {
  const [isExporting, setIsExporting] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  // خيارات التصدير
  const exportFormats = [
    {
      id: "pdf",
      name: "PDF",
      icon: FileText,
      color: "text-red-500",
      description: "ملف PDF للطباعة والعرض",
    },
    {
      id: "excel",
      name: "Excel",
      icon: FileSpreadsheet,
      color: "text-green-500",
      description: "جدول بيانات Excel",
    },
    {
      id: "csv",
      name: "CSV",
      icon: File,
      color: "text-blue-500",
      description: "ملف CSV للتحليل",
    },
    {
      id: "json",
      name: "JSON",
      icon: File,
      color: "text-purple",
      description: "بيانات JSON للمطورين",
    },
  ];

  // التصدير
  const handleExport = async (format) => {
    setIsExporting(true);
    setShowOptions(false);

    try {
      const token = localStorage.getItem("authToken");
      const fileName = customFileName || `report_${dataType}_${Date.now()}`;

      // استدعاء API التصدير
      const response = await fetch(
        `/api/admin/export/${dataType}?format=${format}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("فشل التصدير");

      // تحميل الملف
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${fileName}.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      // استدعاء callback إذا كان موجوداً
      if (onExport) {
        onExport(format);
      }

      // عرض رسالة نجاح
      showSuccessMessage();
    } catch (error) {
      console.error("Error exporting:", error);
      alert("حدث خطأ أثناء التصدير. حاول مرة أخرى.");
    } finally {
      setIsExporting(false);
    }
  };

  // عرض رسالة نجاح
  const showSuccessMessage = () => {
    const message = document.createElement("div");
    message.className =
      "fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2 animate-fade-in";
    message.innerHTML = `
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
      </svg>
      <span>تم التصدير بنجاح!</span>
    `;
    document.body.appendChild(message);

    setTimeout(() => {
      message.remove();
    }, 3000);
  };

  return (
    <div className="relative">
      {/* زر التصدير */}
      <button
        onClick={() => setShowOptions(!showOptions)}
        disabled={isExporting}
        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple to-pink text-white rounded-lg hover:opacity-90 transition-opacity duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isExporting ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
            <span>جاري التصدير...</span>
          </>
        ) : (
          <>
            <Download size={20} />
            <span>تصدير التقرير</span>
          </>
        )}
      </button>

      {/* خيارات التصدير */}
      {showOptions && !isExporting && (
        <>
          {/* خلفية شفافة للإغلاق */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowOptions(false)}
          ></div>

          {/* قائمة الخيارات */}
          <div className="absolute left-0 mt-2 w-72 bg-white rounded-lg shadow-2xl z-50 border border-gray-200 overflow-hidden">
            <div className="p-3 bg-gradient-to-r from-purple to-pink border-b">
              <h4 className="text-white font-semibold">اختر صيغة التصدير</h4>
            </div>

            <div className="p-2">
              {exportFormats.map((format) => (
                <button
                  key={format.id}
                  onClick={() => handleExport(format.id)}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-right"
                >
                  <div className={`${format.color} bg-gray-100 p-2 rounded-lg`}>
                    <format.icon size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{format.name}</p>
                    <p className="text-xs text-gray-500">
                      {format.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// مكون تصدير سريع (بدون خيارات)
export function QuickExport({
  dataType = "general",
  format = "excel",
  buttonText = "تصدير",
  onExport,
  className = "",
}) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);

    try {
      const token = localStorage.getItem("authToken");
      const fileName = `report_${dataType}_${Date.now()}`;

      const response = await fetch(
        `/api/admin/export/${dataType}?format=${format}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("فشل التصدير");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${fileName}.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      if (onExport) onExport(format);
    } catch (error) {
      console.error("Error exporting:", error);
      alert("حدث خطأ أثناء التصدير");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={isExporting}
      className={`flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {isExporting ? (
        <div className="animate-spin rounded-full h-4 w-4 border-2 border-purple border-t-transparent"></div>
      ) : (
        <Download size={18} className="text-gray-600" />
      )}
      <span className="text-gray-700">
        {isExporting ? "جاري التصدير..." : buttonText}
      </span>
    </button>
  );
}

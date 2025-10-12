import { useState } from "react";
import {
  Download,
  FileText,
  FileSpreadsheet,
  Loader2,
  Check,
  X,
} from "lucide-react";

/**
 * مكون تصدير التقارير بصيغ متعددة
 */
export default function ExportReports({
  data,
  filename = "report",
  title = "تقرير",
}) {
  const [exporting, setExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState(null);

  /**
   * تصدير إلى CSV
   */
  const exportToCSV = () => {
    setExporting(true);
    setExportStatus(null);

    try {
      if (!data || data.length === 0) {
        throw new Error("لا توجد بيانات للتصدير");
      }

      // استخراج العناوين
      const headers = Object.keys(data[0]);

      // تحويل البيانات إلى CSV
      const csvContent = [
        // إضافة BOM للدعم العربي
        "\uFEFF",
        // العناوين
        headers.join(","),
        // الصفوف
        ...data.map((row) =>
          headers
            .map((header) => {
              let value = row[header];
              // معالجة القيم التي تحتوي على فواصل أو علامات اقتباس
              if (
                typeof value === "string" &&
                (value.includes(",") || value.includes('"'))
              ) {
                value = `"${value.replace(/"/g, '""')}"`;
              }
              return value || "";
            })
            .join(",")
        ),
      ].join("\n");

      // تحميل الملف
      downloadFile(csvContent, `${filename}.csv`, "text/csv;charset=utf-8;");

      setExportStatus("success");
      setTimeout(() => setExportStatus(null), 3000);
    } catch (error) {
      console.error("Export error:", error);
      setExportStatus("error");
      setTimeout(() => setExportStatus(null), 3000);
    } finally {
      setExporting(false);
    }
  };

  /**
   * تصدير إلى JSON
   */
  const exportToJSON = () => {
    setExporting(true);
    setExportStatus(null);

    try {
      if (!data || data.length === 0) {
        throw new Error("لا توجد بيانات للتصدير");
      }

      const jsonContent = JSON.stringify(data, null, 2);
      downloadFile(
        jsonContent,
        `${filename}.json`,
        "application/json;charset=utf-8;"
      );

      setExportStatus("success");
      setTimeout(() => setExportStatus(null), 3000);
    } catch (error) {
      console.error("Export error:", error);
      setExportStatus("error");
      setTimeout(() => setExportStatus(null), 3000);
    } finally {
      setExporting(false);
    }
  };

  /**
   * تصدير إلى HTML (للطباعة)
   */
  const exportToHTML = () => {
    setExporting(true);
    setExportStatus(null);

    try {
      if (!data || data.length === 0) {
        throw new Error("لا توجد بيانات للتصدير");
      }

      const headers = Object.keys(data[0]);

      const htmlContent = `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 20px;
            direction: rtl;
            background: #f5f5f5;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        h1 {
            color: #9333ea;
            text-align: center;
            margin-bottom: 10px;
        }
        .meta {
            text-align: center;
            color: #666;
            margin-bottom: 30px;
            font-size: 14px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        th {
            background: #9333ea;
            color: white;
            padding: 12px;
            text-align: right;
            font-weight: 600;
        }
        td {
            padding: 10px 12px;
            border-bottom: 1px solid #e5e5e5;
            text-align: right;
        }
        tr:hover {
            background: #f9f9f9;
        }
        tr:nth-child(even) {
            background: #fafafa;
        }
        .footer {
            margin-top: 30px;
            text-align: center;
            color: #999;
            font-size: 12px;
            padding-top: 20px;
            border-top: 1px solid #e5e5e5;
        }
        @media print {
            body { background: white; }
            .container { box-shadow: none; }
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>${title}</h1>
        <div class="meta">
            <p>تاريخ التقرير: ${new Date().toLocaleDateString("ar-SA")}</p>
            <p>عدد السجلات: ${data.length}</p>
        </div>
        
        <table>
            <thead>
                <tr>
                    ${headers.map((h) => `<th>${h}</th>`).join("")}
                </tr>
            </thead>
            <tbody>
                ${data
                  .map(
                    (row) => `
                    <tr>
                        ${headers
                          .map((h) => `<td>${row[h] || "-"}</td>`)
                          .join("")}
                    </tr>
                `
                  )
                  .join("")}
            </tbody>
        </table>
        
        <div class="footer">
            <p>تم إنشاء هذا التقرير بواسطة نظام ساندي مكرمية</p>
        </div>
    </div>
</body>
</html>
      `;

      downloadFile(htmlContent, `${filename}.html`, "text/html;charset=utf-8;");

      setExportStatus("success");
      setTimeout(() => setExportStatus(null), 3000);
    } catch (error) {
      console.error("Export error:", error);
      setExportStatus("error");
      setTimeout(() => setExportStatus(null), 3000);
    } finally {
      setExporting(false);
    }
  };

  /**
   * تصدير إلى Excel (باستخدام HTML table)
   */
  const exportToExcel = () => {
    setExporting(true);
    setExportStatus(null);

    try {
      if (!data || data.length === 0) {
        throw new Error("لا توجد بيانات للتصدير");
      }

      const headers = Object.keys(data[0]);

      const excelContent = `
        <html xmlns:o="urn:schemas-microsoft-com:office:office" 
              xmlns:x="urn:schemas-microsoft-com:office:excel" 
              xmlns="http://www.w3.org/TR/REC-html40">
        <head>
          <meta charset="utf-8">
          <style>
            table { border-collapse: collapse; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: right; }
            th { background-color: #9333ea; color: white; font-weight: bold; }
          </style>
        </head>
        <body dir="rtl">
          <table>
            <thead>
              <tr>${headers.map((h) => `<th>${h}</th>`).join("")}</tr>
            </thead>
            <tbody>
              ${data
                .map(
                  (row) => `
                <tr>${headers
                  .map((h) => `<td>${row[h] || ""}</td>`)
                  .join("")}</tr>
              `
                )
                .join("")}
            </tbody>
          </table>
        </body>
        </html>
      `;

      downloadFile(
        excelContent,
        `${filename}.xls`,
        "application/vnd.ms-excel;charset=utf-8;"
      );

      setExportStatus("success");
      setTimeout(() => setExportStatus(null), 3000);
    } catch (error) {
      console.error("Export error:", error);
      setExportStatus("error");
      setTimeout(() => setExportStatus(null), 3000);
    } finally {
      setExporting(false);
    }
  };

  /**
   * دالة مساعدة لتحميل الملف
   */
  const downloadFile = (content, filename, mimeType) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  /**
   * طباعة التقرير
   */
  const printReport = () => {
    exportToHTML();
    // بعد ثانية، فتح نافذة الطباعة
    setTimeout(() => {
      window.print();
    }, 1000);
  };

  return (
    <div className="flex flex-wrap gap-2" dir="rtl">
      {/* زر CSV */}
      <button
        onClick={exportToCSV}
        disabled={exporting || !data || data.length === 0}
        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {exporting ? (
          <Loader2 className="animate-spin" size={18} />
        ) : (
          <FileSpreadsheet size={18} />
        )}
        <span>تصدير CSV</span>
      </button>

      {/* زر Excel */}
      <button
        onClick={exportToExcel}
        disabled={exporting || !data || data.length === 0}
        className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {exporting ? (
          <Loader2 className="animate-spin" size={18} />
        ) : (
          <FileSpreadsheet size={18} />
        )}
        <span>تصدير Excel</span>
      </button>

      {/* زر JSON */}
      <button
        onClick={exportToJSON}
        disabled={exporting || !data || data.length === 0}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {exporting ? (
          <Loader2 className="animate-spin" size={18} />
        ) : (
          <FileText size={18} />
        )}
        <span>تصدير JSON</span>
      </button>

      {/* زر HTML/طباعة */}
      <button
        onClick={exportToHTML}
        disabled={exporting || !data || data.length === 0}
        className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {exporting ? (
          <Loader2 className="animate-spin" size={18} />
        ) : (
          <Download size={18} />
        )}
        <span>تصدير HTML</span>
      </button>

      {/* حالة التصدير */}
      {exportStatus === "success" && (
        <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg animate-fadeIn">
          <Check size={18} />
          <span>تم التصدير بنجاح!</span>
        </div>
      )}

      {exportStatus === "error" && (
        <div className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg animate-fadeIn">
          <X size={18} />
          <span>فشل التصدير</span>
        </div>
      )}
    </div>
  );
}

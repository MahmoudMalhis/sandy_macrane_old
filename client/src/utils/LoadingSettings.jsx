export default function Loading() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple mx-auto mb-4"></div>
        <div className="text-gray-500">جاري تحميل الإعدادات...</div>
      </div>
    </div>
  );
}

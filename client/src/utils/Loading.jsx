import Layout from "../components/layout/Layout";

export default function Loading() {
  return (
      <div className="min-h-screen bg-beige flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple mx-auto mb-4"></div>
          <h2 className="text-xl font-bold text-purple mb-2">
            جاري التحميل...
          </h2>
          <p className="text-gray-600">نحضر لك أجمل المجموعات</p>
        </div>
      </div>
  );
}

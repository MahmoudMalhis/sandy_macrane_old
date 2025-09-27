export default function Error({ error }) {
  return (
    <div className="min-h-screen bg-beige flex items-center justify-center">
      <div className="text-center max-w-md mx-auto p-6">
        <div className="text-red-500 text-6xl mb-4">⚠️</div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">عذراً، حدث خطأ</h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-purple text-white px-6 py-3 rounded-lg hover:bg-purple-hover transition-colors"
        >
          إعادة المحاولة
        </button>
      </div>
    </div>
  );
}

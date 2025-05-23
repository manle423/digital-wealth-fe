export default function Loading() {
  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg shadow-xl flex items-center space-x-4">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-700">Đang tải...</p>
      </div>
    </div>
  );
} 
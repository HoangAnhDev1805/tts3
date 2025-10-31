import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
      <div className="text-center text-white space-y-8 p-8">
        <h1 className="text-6xl font-bold">🎰 3DAIXS.COM</h1>
        <p className="text-2xl">Hệ thống quản lý lô đề chuyên nghiệp</p>
        
        <div className="flex gap-4 justify-center mt-8">
          <Link 
            href="/login"
            className="px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Đăng nhập
          </Link>
          <Link 
            href="/api-docs"
            className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition"
          >
            API Docs
          </Link>
        </div>

        <div className="mt-12 space-y-4 text-sm opacity-80">
          <p>✅ Backend API: Running at port 5000</p>
          <p>✅ 50+ Endpoints | 12 Models | Real-time Socket.IO</p>
          <p>⚠️ Frontend: Basic structure - UI components in progress</p>
        </div>

        <div className="mt-8 p-6 bg-white/10 rounded-lg backdrop-blur">
          <h3 className="text-xl font-semibold mb-4">🚀 Quick Start</h3>
          <div className="text-left space-y-2 text-sm">
            <p>1. Start Backend: <code className="bg-black/30 px-2 py-1 rounded">cd backend && npm run dev</code></p>
            <p>2. Test API: <code className="bg-black/30 px-2 py-1 rounded">curl http://localhost:5000/api/health</code></p>
            <p>3. Login: <code className="bg-black/30 px-2 py-1 rounded">admin / admin123</code></p>
          </div>
        </div>
      </div>
    </div>
  );
}

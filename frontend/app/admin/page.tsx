"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
      router.push("/login");
      return;
    }

    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== "admin") {
      router.push("/dashboard");
      return;
    }

    setUser(parsedUser);
  }, [router]);

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  if (!user) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">👑 Admin Panel</h1>
          <button onClick={handleLogout} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
            Đăng xuất
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-3xl mb-2">👥</div>
            <div className="text-sm text-gray-600">Tổng Users</div>
            <div className="text-2xl font-bold">-</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-3xl mb-2">📋</div>
            <div className="text-sm text-gray-600">Giao dịch chờ</div>
            <div className="text-2xl font-bold">-</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-3xl mb-2">💰</div>
            <div className="text-sm text-gray-600">Doanh thu</div>
            <div className="text-2xl font-bold">-</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-3xl mb-2">📊</div>
            <div className="text-sm text-gray-600">Tin nhắn</div>
            <div className="text-2xl font-bold">-</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">⚠️ Admin Panel đang phát triển</h2>
          <p className="text-gray-600 mb-4">Backend API đã hoàn thành 100%. Frontend đang được xây dựng.</p>
          <div className="space-y-2 text-sm">
            <p>✅ User Management API</p>
            <p>✅ Transaction Management API</p>
            <p>✅ Package & Payment Method APIs</p>
            <p>✅ Settings APIs</p>
            <p>⚠️ UI Components đang được tạo...</p>
          </div>
        </div>
      </main>
    </div>
  );
}

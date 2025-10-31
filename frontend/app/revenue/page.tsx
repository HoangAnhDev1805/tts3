"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Layout/Sidebar";
import Header from "@/components/Layout/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { User } from "@/types";
import api from "@/lib/api";

export default function RevenuePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    contactId: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
      router.push("/login");
      return;
    }

    const parsedUser = JSON.parse(userData);
    if (parsedUser.role === 'trial') {
      alert("Tính năng này không khả dụng cho tài khoản dùng thử");
      router.push("/dashboard");
      return;
    }

    setUser(parsedUser);
    fetchStats();
  }, [router, filter]);

  const fetchStats = async () => {
    try {
      const params = new URLSearchParams();
      if (filter.startDate) params.append('startDate', filter.startDate);
      if (filter.endDate) params.append('endDate', filter.endDate);
      if (filter.contactId) params.append('contactId', filter.contactId);

      const response = await api.get(`/messages/stats?${params.toString()}`);
      setStats(response.data.data);
    } catch (error) {
      console.error("Fetch stats error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role={user.role} />
      
      <div className="flex-1">
        <Header user={user} />
        
        <main className="p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800">💰 Báo cáo doanh thu</h2>
            <p className="text-sm text-gray-600">Thống kê thu chi và lợi nhuận</p>
          </div>

          <div className="mb-6 bg-white rounded-lg shadow p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Từ ngày</label>
                <input
                  type="date"
                  value={filter.startDate}
                  onChange={(e) => setFilter({ ...filter, startDate: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Đến ngày</label>
                <input
                  type="date"
                  value={filter.endDate}
                  onChange={(e) => setFilter({ ...filter, endDate: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Khách hàng</label>
                <Select
                  value={filter.contactId}
                  onChange={(e) => setFilter({ ...filter, contactId: e.target.value })}
                >
                  <option value="">Tất cả</option>
                  {/* Contact list will be loaded here */}
                </Select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardHeader>
                <CardDescription>Tổng cược</CardDescription>
                <CardTitle className="text-2xl">
                  {stats?.totalBet?.toLocaleString('vi-VN') || 0}đ
                </CardTitle>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CardDescription>Tổng trả</CardDescription>
                <CardTitle className="text-2xl text-red-600">
                  {stats?.totalWin?.toLocaleString('vi-VN') || 0}đ
                </CardTitle>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CardDescription>Lợi nhuận</CardDescription>
                <CardTitle className={`text-2xl ${(stats?.totalProfit || 0) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {stats?.totalProfit?.toLocaleString('vi-VN') || 0}đ
                </CardTitle>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CardDescription>Số tin nhắn</CardDescription>
                <CardTitle className="text-2xl">
                  {stats?.messageCount || 0}
                </CardTitle>
              </CardHeader>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>📊 Biểu đồ doanh thu</CardTitle>
              <CardDescription>Biểu đồ theo thời gian</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <div className="text-4xl mb-2">📈</div>
                  <p>Biểu đồ sẽ được hiển thị ở đây</p>
                  <p className="text-sm">(Cần cài đặt Recharts)</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}

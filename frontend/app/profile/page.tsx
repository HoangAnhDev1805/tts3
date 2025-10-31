"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Layout/Sidebar";
import Header from "@/components/Layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User } from "@/types";
import api from "@/lib/api";
import { formatDate } from "@/lib/utils";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
  });
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
      router.push("/login");
      return;
    }

    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    setFormData({
      fullName: parsedUser.fullName || "",
      email: parsedUser.email || "",
      phone: parsedUser.phone || "",
    });
  }, [router]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.patch(`/users/${user?._id}`, formData);
      const updatedUser = { ...user, ...formData };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser as User);
      alert("Cập nhật thành công!");
    } catch (error) {
      console.error("Update error:", error);
      alert("Cập nhật thất bại!");
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("Mật khẩu xác nhận không khớp!");
      return;
    }

    try {
      await api.patch(`/users/${user?._id}/password`, {
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      });
      setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
      alert("Đổi mật khẩu thành công!");
    } catch (error: any) {
      console.error("Change password error:", error);
      alert(error.response?.data?.message || "Đổi mật khẩu thất bại!");
    }
  };

  if (!user) return null;

  const daysLeft = Math.ceil(
    (new Date(user.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role={user.role} />
      
      <div className="flex-1">
        <Header user={user} />
        
        <main className="p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800">👤 Thông tin tài khoản</h2>
            <p className="text-sm text-gray-600">Quản lý thông tin cá nhân và mật khẩu</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Account Info */}
            <Card>
              <CardHeader>
                <CardTitle>📋 Thông tin tài khoản</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Username</p>
                  <p className="font-semibold">{user.username}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Vai trò</p>
                  <p className="font-semibold capitalize">{user.role}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Trạng thái</p>
                  <span className={`inline-block px-2 py-1 rounded text-sm font-semibold ${
                    user.status === 'active' ? 'bg-green-100 text-green-800' :
                    user.status === 'expired' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {user.status}
                  </span>
                </div>
                {user.role !== 'admin' && (
                  <>
                    <div>
                      <p className="text-sm text-gray-600">Ngày bắt đầu</p>
                      <p className="font-semibold">{formatDate(user.startDate)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Ngày hết hạn</p>
                      <p className={`font-semibold ${daysLeft < 7 ? 'text-red-600' : ''}`}>
                        {formatDate(user.expiryDate)} ({daysLeft} ngày còn lại)
                      </p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Update Profile */}
            <Card>
              <CardHeader>
                <CardTitle>✏️ Cập nhật thông tin</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Họ tên</label>
                    <Input
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Số điện thoại</label>
                    <Input
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    💾 Cập nhật
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Change Password */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>🔐 Đổi mật khẩu</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleChangePassword} className="max-w-md space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Mật khẩu hiện tại</label>
                    <Input
                      type="password"
                      value={passwordData.oldPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Mật khẩu mới</label>
                    <Input
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Xác nhận mật khẩu mới</label>
                    <Input
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      required
                    />
                  </div>
                  <Button type="submit">
                    🔐 Đổi mật khẩu
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Layout/Sidebar";
import Header from "@/components/Layout/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "@/types";
import api from "@/lib/api";

export default function AdminSettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [websiteSettings, setWebsiteSettings] = useState<any>(null);
  const [telegramSettings, setTelegramSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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
    fetchSettings();
  }, [router]);

  const fetchSettings = async () => {
    try {
      const [websiteRes, telegramRes] = await Promise.all([
        api.get("/settings/website"),
        api.get("/settings/telegram"),
      ]);
      setWebsiteSettings(websiteRes.data.data);
      setTelegramSettings(telegramRes.data.data);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveWebsite = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.patch("/settings/website", websiteSettings);
      alert("Lưu thành công!");
    } catch (error) {
      console.error("Save error:", error);
      alert("Lưu thất bại!");
    }
  };

  const handleSaveTelegram = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.patch("/settings/telegram", telegramSettings);
      alert("Lưu thành công!");
    } catch (error) {
      console.error("Save error:", error);
      alert("Lưu thất bại!");
    }
  };

  if (!user || loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role={user.role} />
      
      <div className="flex-1">
        <Header user={user} />
        
        <main className="p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800">⚙️ Cài đặt hệ thống</h2>
            <p className="text-sm text-gray-600">Quản lý cấu hình website và Telegram bot</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Website Settings */}
            <Card>
              <CardHeader>
                <CardTitle>🌐 Cài đặt Website</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSaveWebsite} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Tiêu đề</label>
                    <Input
                      value={websiteSettings?.title || ""}
                      onChange={(e) => setWebsiteSettings({ ...websiteSettings, title: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Mô tả</label>
                    <Textarea
                      value={websiteSettings?.description || ""}
                      onChange={(e) => setWebsiteSettings({ ...websiteSettings, description: e.target.value })}
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Keywords (phân cách bởi dấu phẩy)</label>
                    <Input
                      value={websiteSettings?.keywords?.join(", ") || ""}
                      onChange={(e) => setWebsiteSettings({ 
                        ...websiteSettings, 
                        keywords: e.target.value.split(",").map((k: string) => k.trim())
                      })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Logo URL</label>
                    <Input
                      value={websiteSettings?.logoUrl || ""}
                      onChange={(e) => setWebsiteSettings({ ...websiteSettings, logoUrl: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Google Analytics ID</label>
                    <Input
                      value={websiteSettings?.googleAnalyticsId || ""}
                      onChange={(e) => setWebsiteSettings({ ...websiteSettings, googleAnalyticsId: e.target.value })}
                      placeholder="G-XXXXXXXXXX"
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    💾 Lưu cài đặt Website
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Telegram Settings */}
            <Card>
              <CardHeader>
                <CardTitle>💬 Cài đặt Telegram Bot</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSaveTelegram} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Bot Token</label>
                    <Input
                      type="password"
                      value={telegramSettings?.botToken || ""}
                      onChange={(e) => setTelegramSettings({ ...telegramSettings, botToken: e.target.value })}
                      placeholder="123456:ABC-DEF..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Bot Username</label>
                    <Input
                      value={telegramSettings?.botUsername || ""}
                      onChange={(e) => setTelegramSettings({ ...telegramSettings, botUsername: e.target.value })}
                      placeholder="@your_bot"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Webhook URL</label>
                    <Input
                      value={telegramSettings?.webhookUrl || ""}
                      onChange={(e) => setTelegramSettings({ ...telegramSettings, webhookUrl: e.target.value })}
                      placeholder="https://your-domain.com/webhook"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={telegramSettings?.isActive || false}
                        onChange={(e) => setTelegramSettings({ ...telegramSettings, isActive: e.target.checked })}
                        className="w-4 h-4"
                      />
                      <span className="text-sm font-medium">Kích hoạt Telegram Bot</span>
                    </label>
                  </div>

                  <Button type="submit" className="w-full">
                    💾 Lưu cài đặt Telegram
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

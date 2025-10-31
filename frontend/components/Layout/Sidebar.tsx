"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface SidebarProps {
  role: 'admin' | 'user' | 'trial';
}

export default function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();

  const userLinks = [
    { href: "/dashboard", label: "📊 Trang chủ", icon: "📊" },
    { href: "/contacts", label: "📇 Danh bạ", icon: "📇" },
    { href: "/messages", label: "💬 Tin nhắn", icon: "💬" },
    { href: "/revenue", label: "💰 Doanh thu", icon: "💰" },
    { href: "/profile", label: "👤 Tài khoản", icon: "👤" },
  ];

  const adminLinks = [
    { href: "/admin", label: "📊 Dashboard", icon: "📊" },
    { href: "/admin/users", label: "👥 Users", icon: "👥" },
    { href: "/admin/transactions", label: "💳 Giao dịch", icon: "💳" },
    { href: "/admin/packages", label: "📦 Gói dịch vụ", icon: "📦" },
    { href: "/admin/payment-methods", label: "💰 Thanh toán", icon: "💰" },
    { href: "/admin/settings", label: "⚙️ Cài đặt", icon: "⚙️" },
  ];

  const links = role === 'admin' ? adminLinks : userLinks;

  return (
    <aside className="w-64 bg-white border-r min-h-screen">
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold text-gray-800">🎰 3DAIXS</h2>
        <p className="text-xs text-gray-500">{role === 'admin' ? 'Admin Panel' : 'User Panel'}</p>
      </div>
      
      <nav className="p-4">
        <ul className="space-y-2">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-2 rounded-lg transition-colors",
                  pathname === link.href
                    ? "bg-blue-50 text-blue-600 font-medium"
                    : "text-gray-700 hover:bg-gray-100"
                )}
              >
                <span>{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}

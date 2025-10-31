"use client";

import { useRouter } from "next/navigation";
import { User } from "@/types";
import { formatDate } from "@/lib/utils";

interface HeaderProps {
  user: User;
}

export default function Header({ user }: HeaderProps) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  const daysLeft = Math.ceil(
    (new Date(user.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <header className="bg-white border-b">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">
            Xin chào, {user.fullName || user.username}!
          </h1>
          <p className="text-sm text-gray-500">
            {user.role === 'trial' ? '🎁 Tài khoản dùng thử' : '✨ Tài khoản chính thức'}
          </p>
        </div>

        <div className="flex items-center gap-4">
          {user.role !== 'admin' && (
            <div className="text-right">
              <p className="text-sm text-gray-600">Hết hạn: {formatDate(user.expiryDate)}</p>
              <p className={`text-xs ${daysLeft < 7 ? 'text-red-600 font-semibold' : 'text-gray-500'}`}>
                Còn {daysLeft} ngày
              </p>
            </div>
          )}
          
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Đăng xuất
          </button>
        </div>
      </div>
    </header>
  );
}

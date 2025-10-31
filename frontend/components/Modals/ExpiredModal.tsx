"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface ExpiredModalProps {
  open: boolean;
  contactInfo?: {
    email: string;
    phone: string;
    telegram: string;
  };
}

export default function ExpiredModal({ open, contactInfo }: ExpiredModalProps) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  const handleRenew = () => {
    router.push("/login"); // Sẽ mở modal gia hạn
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-red-600">⚠️ Tài khoản đã hết hạn</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-gray-700">
            Tài khoản của bạn đã hết hạn sử dụng. Vui lòng gia hạn để tiếp tục sử dụng dịch vụ.
          </p>

          {contactInfo && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold mb-2">📞 Liên hệ hỗ trợ:</h4>
              <div className="space-y-1 text-sm">
                <p>📧 Email: <strong>{contactInfo.email}</strong></p>
                <p>📱 SĐT: <strong>{contactInfo.phone}</strong></p>
                <p>💬 Telegram: <strong>{contactInfo.telegram}</strong></p>
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <Button variant="outline" onClick={handleLogout} className="flex-1">
              Đăng xuất
            </Button>
            <Button onClick={handleRenew} className="flex-1">
              🔄 Gia hạn ngay
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

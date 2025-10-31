"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Layout/Sidebar";
import Header from "@/components/Layout/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { PaymentMethod, User } from "@/types";
import api from "@/lib/api";

export default function AdminPaymentMethodsPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingMethod, setEditingMethod] = useState<PaymentMethod | null>(null);

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
    fetchMethods();
  }, [router]);

  const fetchMethods = async () => {
    try {
      const response = await api.get("/payment-methods");
      setMethods(response.data.data);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingMethod(null);
    setShowModal(true);
  };

  const handleEdit = (method: PaymentMethod) => {
    setEditingMethod(method);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa phương thức này?")) return;

    try {
      await api.delete(`/payment-methods/${id}`);
      fetchMethods();
    } catch (error) {
      console.error("Delete error:", error);
      alert("Xóa thất bại!");
    }
  };

  const handleSave = async (data: any) => {
    try {
      if (editingMethod) {
        await api.patch(`/payment-methods/${editingMethod._id}`, data);
      } else {
        await api.post("/payment-methods", data);
      }
      setShowModal(false);
      fetchMethods();
    } catch (error) {
      console.error("Save error:", error);
      alert("Lưu thất bại!");
    }
  };

  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role={user.role} />
      
      <div className="flex-1">
        <Header user={user} />
        
        <main className="p-6">
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">💰 Phương thức thanh toán</h2>
              <p className="text-sm text-gray-600">Quản lý tài khoản ngân hàng, Momo, ZaloPay</p>
            </div>
            
            <Button onClick={handleCreate}>
              ➕ Thêm phương thức
            </Button>
          </div>

          <div className="bg-white rounded-lg shadow">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Loại</TableHead>
                  <TableHead>Tên</TableHead>
                  <TableHead>Số TK/SĐT</TableHead>
                  <TableHead>Chủ TK</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">Đang tải...</TableCell>
                  </TableRow>
                ) : methods.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">Chưa có phương thức nào</TableCell>
                  </TableRow>
                ) : (
                  methods.map((method) => (
                    <TableRow key={method._id}>
                      <TableCell>
                        <Badge>
                          {method.type === 'bank' ? '🏦 Bank' : 
                           method.type === 'momo' ? '💰 Momo' : '💳 ZaloPay'}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">{method.bankName || method.type}</TableCell>
                      <TableCell>{method.accountNumber || method.momoPhone || method.zaloPayPhone}</TableCell>
                      <TableCell>{method.accountName || '-'}</TableCell>
                      <TableCell>
                        <Badge variant={method.isActive ? 'success' : 'secondary'}>
                          {method.isActive ? 'Hoạt động' : 'Tắt'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(method)} className="mr-2">
                          ✏️ Sửa
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDelete(method._id)}>
                          🗑️ Xóa
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </main>
      </div>

      {showModal && (
        <PaymentMethodFormModal
          method={editingMethod}
          onSave={handleSave}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}

function PaymentMethodFormModal({ 
  method, 
  onSave, 
  onClose 
}: { 
  method: PaymentMethod | null;
  onSave: (data: any) => void;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState({
    type: method?.type || 'bank',
    bankName: method?.bankName || "",
    accountNumber: method?.accountNumber || "",
    accountName: method?.accountName || "",
    momoPhone: method?.momoPhone || "",
    zaloPayPhone: method?.zaloPayPhone || "",
    transferContentTemplate: method?.transferContentTemplate || "THANHTOAN {username}",
    qrCode: method?.qrCode || "",
    isActive: method?.isActive ?? true,
    order: method?.order || 1,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{method ? '✏️ Sửa phương thức' : '➕ Thêm phương thức'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Loại *</label>
            <Select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
            >
              <option value="bank">🏦 Ngân hàng</option>
              <option value="momo">💰 Momo</option>
              <option value="zalopay">💳 ZaloPay</option>
            </Select>
          </div>

          {formData.type === 'bank' && (
            <>
              <div>
                <label className="block text-sm font-medium mb-1">Tên ngân hàng *</label>
                <Input
                  value={formData.bankName}
                  onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Số tài khoản *</label>
                  <Input
                    value={formData.accountNumber}
                    onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Chủ tài khoản *</label>
                  <Input
                    value={formData.accountName}
                    onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
                    required
                  />
                </div>
              </div>
            </>
          )}

          {formData.type === 'momo' && (
            <div>
              <label className="block text-sm font-medium mb-1">Số điện thoại Momo *</label>
              <Input
                value={formData.momoPhone}
                onChange={(e) => setFormData({ ...formData, momoPhone: e.target.value })}
                required
              />
            </div>
          )}

          {formData.type === 'zalopay' && (
            <div>
              <label className="block text-sm font-medium mb-1">Số điện thoại ZaloPay *</label>
              <Input
                value={formData.zaloPayPhone}
                onChange={(e) => setFormData({ ...formData, zaloPayPhone: e.target.value })}
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1">Template nội dung CK</label>
            <Input
              value={formData.transferContentTemplate}
              onChange={(e) => setFormData({ ...formData, transferContentTemplate: e.target.value })}
              placeholder="THANHTOAN {username}"
            />
            <p className="text-xs text-gray-500 mt-1">Dùng {"{username}"} để auto-fill username</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">URL QR Code (optional)</label>
            <Input
              value={formData.qrCode}
              onChange={(e) => setFormData({ ...formData, qrCode: e.target.value })}
              placeholder="https://..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Thứ tự</label>
              <Input
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Trạng thái</label>
              <label className="flex items-center gap-2 mt-2">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4"
                />
                <span className="text-sm">Kích hoạt</span>
              </label>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Hủy</Button>
            <Button type="submit">💾 Lưu</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

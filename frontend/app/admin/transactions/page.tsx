"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Layout/Sidebar";
import Header from "@/components/Layout/Header";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Transaction, User } from "@/types";
import api from "@/lib/api";
import { formatDateTime, formatCurrency } from "@/lib/utils";

export default function AdminTransactionsPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [notes, setNotes] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");

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
    fetchTransactions();
  }, [router]);

  const fetchTransactions = async () => {
    try {
      const response = await api.get("/transactions");
      setTransactions(response.data.data);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    if (!selectedTransaction) return;

    try {
      await api.patch(`/transactions/${selectedTransaction._id}/confirm`, { notes });
      setShowConfirmModal(false);
      setNotes("");
      setSelectedTransaction(null);
      fetchTransactions();
      alert("Xác nhận thành công!");
    } catch (error) {
      console.error("Confirm error:", error);
      alert("Xác nhận thất bại!");
    }
  };

  const handleReject = async () => {
    if (!selectedTransaction || !rejectionReason) {
      alert("Vui lòng nhập lý do từ chối!");
      return;
    }

    try {
      await api.patch(`/transactions/${selectedTransaction._id}/reject`, { rejectionReason });
      setShowRejectModal(false);
      setRejectionReason("");
      setSelectedTransaction(null);
      fetchTransactions();
      alert("Đã từ chối giao dịch!");
    } catch (error) {
      console.error("Reject error:", error);
      alert("Từ chối thất bại!");
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
            <h2 className="text-2xl font-bold text-gray-800">💳 Quản lý giao dịch</h2>
            <p className="text-sm text-gray-600">Duyệt yêu cầu mua và gia hạn tài khoản</p>
          </div>

          <div className="bg-white rounded-lg shadow">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Loại</TableHead>
                  <TableHead>Gói</TableHead>
                  <TableHead>Số tiền</TableHead>
                  <TableHead>SĐT</TableHead>
                  <TableHead>Nội dung CK</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Hết hạn</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center">Đang tải...</TableCell>
                  </TableRow>
                ) : transactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center">Chưa có giao dịch</TableCell>
                  </TableRow>
                ) : (
                  transactions.map((tx) => (
                    <TableRow key={tx._id}>
                      <TableCell>
                        <Badge variant={tx.type === 'purchase' ? 'default' : 'secondary'}>
                          {tx.type === 'purchase' ? '🛒 Mua mới' : '🔄 Gia hạn'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {typeof tx.packageId === 'object' ? tx.packageId.name : tx.packageId}
                      </TableCell>
                      <TableCell className="font-semibold">
                        {formatCurrency(tx.amount)}
                      </TableCell>
                      <TableCell>{tx.phone}</TableCell>
                      <TableCell className="max-w-xs truncate">{tx.transferContent}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            tx.status === 'confirmed' ? 'success' :
                            tx.status === 'rejected' ? 'danger' :
                            tx.status === 'expired' ? 'secondary' :
                            'warning'
                          }
                        >
                          {tx.status === 'confirmed' ? '✅ Đã duyệt' :
                           tx.status === 'rejected' ? '❌ Từ chối' :
                           tx.status === 'expired' ? '⏰ Hết hạn' :
                           '⏳ Chờ duyệt'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {tx.status === 'pending' ? formatDateTime(tx.expiresAt) : '-'}
                      </TableCell>
                      <TableCell className="text-right">
                        {tx.status === 'pending' && (
                          <div className="flex gap-2 justify-end">
                            <Button 
                              variant="default" 
                              size="sm"
                              onClick={() => {
                                setSelectedTransaction(tx);
                                setShowConfirmModal(true);
                              }}
                            >
                              ✅ Duyệt
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => {
                                setSelectedTransaction(tx);
                                setShowRejectModal(true);
                              }}
                            >
                              ❌ Từ chối
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </main>
      </div>

      {/* Confirm Modal */}
      {showConfirmModal && selectedTransaction && (
        <Dialog open={true} onOpenChange={() => setShowConfirmModal(false)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>✅ Xác nhận giao dịch</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded">
                <p className="text-sm mb-2">
                  <strong>Loại:</strong> {selectedTransaction.type === 'purchase' ? 'Mua mới' : 'Gia hạn'}
                </p>
                <p className="text-sm mb-2">
                  <strong>Gói:</strong> {typeof selectedTransaction.packageId === 'object' ? selectedTransaction.packageId.name : ''}
                </p>
                <p className="text-sm mb-2">
                  <strong>Số tiền:</strong> {formatCurrency(selectedTransaction.amount)}
                </p>
                <p className="text-sm">
                  <strong>SĐT:</strong> {selectedTransaction.phone}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Ghi chú (tùy chọn)</label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Thêm ghi chú nếu cần..."
                  rows={3}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowConfirmModal(false)}>
                Hủy
              </Button>
              <Button onClick={handleConfirm}>
                ✅ Xác nhận
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Reject Modal */}
      {showRejectModal && selectedTransaction && (
        <Dialog open={true} onOpenChange={() => setShowRejectModal(false)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>❌ Từ chối giao dịch</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="bg-red-50 p-4 rounded">
                <p className="text-sm mb-2">
                  <strong>SĐT:</strong> {selectedTransaction.phone}
                </p>
                <p className="text-sm">
                  <strong>Số tiền:</strong> {formatCurrency(selectedTransaction.amount)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Lý do từ chối *</label>
                <Textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="VD: Sai nội dung chuyển khoản, số tiền không đúng..."
                  rows={3}
                  required
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowRejectModal(false)}>
                Hủy
              </Button>
              <Button variant="destructive" onClick={handleReject}>
                ❌ Từ chối
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

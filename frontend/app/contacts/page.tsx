"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Layout/Sidebar";
import Header from "@/components/Layout/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Contact, User } from "@/types";
import api from "@/lib/api";

export default function ContactsPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);

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
    fetchContacts();
  }, [router]);

  const fetchContacts = async () => {
    try {
      const response = await api.get("/contacts");
      setContacts(response.data.data);
    } catch (error: any) {
      console.error("Fetch contacts error:", error);
      if (error.response?.data?.errorCode === 'ACCOUNT_EXPIRED') {
        alert("Tài khoản đã hết hạn. Vui lòng gia hạn!");
        router.push("/dashboard");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingContact(null);
    setShowModal(true);
  };

  const handleEdit = (contact: Contact) => {
    setEditingContact(contact);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa danh bạ này?")) return;

    try {
      await api.delete(`/contacts/${id}`);
      fetchContacts();
    } catch (error) {
      console.error("Delete error:", error);
      alert("Xóa thất bại!");
    }
  };

  const handleSave = async (data: any) => {
    try {
      if (editingContact) {
        await api.patch(`/contacts/${editingContact._id}`, data);
      } else {
        await api.post("/contacts", data);
      }
      setShowModal(false);
      fetchContacts();
    } catch (error) {
      console.error("Save error:", error);
      alert("Lưu thất bại!");
    }
  };

  const filteredContacts = contacts.filter(c =>
    c.fullName.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search)
  );

  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role={user.role} />
      
      <div className="flex-1">
        <Header user={user} />
        
        <main className="p-6">
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">📇 Quản lý danh bạ</h2>
              <p className="text-sm text-gray-600">Quản lý danh sách khách hàng</p>
            </div>
            
            <Button onClick={handleCreate}>
              ➕ Thêm danh bạ
            </Button>
          </div>

          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b">
              <Input
                placeholder="🔍 Tìm theo tên hoặc số điện thoại..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="max-w-md"
              />
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên</TableHead>
                  <TableHead>Điện thoại</TableHead>
                  <TableHead>Địa chỉ</TableHead>
                  <TableHead>Nợ</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">Đang tải...</TableCell>
                  </TableRow>
                ) : filteredContacts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">Chưa có danh bạ nào</TableCell>
                  </TableRow>
                ) : (
                  filteredContacts.map((contact) => (
                    <TableRow key={contact._id}>
                      <TableCell className="font-medium">{contact.fullName}</TableCell>
                      <TableCell>{contact.phone}</TableCell>
                      <TableCell>{contact.address || '-'}</TableCell>
                      <TableCell className={contact.debt > 0 ? 'text-red-600 font-semibold' : ''}>
                        {contact.debt.toLocaleString('vi-VN')}đ
                      </TableCell>
                      <TableCell>
                        <Badge variant={contact.status === 'active' ? 'success' : 'secondary'}>
                          {contact.status === 'active' ? 'Hoạt động' : 'Tạm dừng'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(contact)} className="mr-2">
                          ✏️ Sửa
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDelete(contact._id)}>
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
        <ContactFormModal
          contact={editingContact}
          onSave={handleSave}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}

// Contact Form Modal Component
function ContactFormModal({ 
  contact, 
  onSave, 
  onClose 
}: { 
  contact: Contact | null;
  onSave: (data: any) => void;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState({
    fullName: contact?.fullName || "",
    phone: contact?.phone || "",
    address: contact?.address || "",
    notes: contact?.notes || "",
    status: contact?.status || "active",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{contact ? '✏️ Sửa danh bạ' : '➕ Thêm danh bạ'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Tên *</label>
            <Input
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Số điện thoại *</label>
            <Input
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Địa chỉ</label>
            <Input
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Ghi chú</label>
            <Input
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button type="submit">
              💾 Lưu
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

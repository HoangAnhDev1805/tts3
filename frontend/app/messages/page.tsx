"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Layout/Sidebar";
import Header from "@/components/Layout/Header";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Message, Contact, User } from "@/types";
import api from "@/lib/api";
import { formatDate } from "@/lib/utils";

export default function MessagesPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

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
    fetchData();
  }, [router]);

  const fetchData = async () => {
    try {
      const [messagesRes, contactsRes] = await Promise.all([
        api.get("/messages"),
        api.get("/contacts"),
      ]);
      setMessages(messagesRes.data.data);
      setContacts(contactsRes.data.data);
    } catch (error: any) {
      console.error("Fetch error:", error);
      if (error.response?.data?.errorCode === 'ACCOUNT_EXPIRED') {
        alert("Tài khoản đã hết hạn!");
        router.push("/dashboard");
      }
    } finally {
      setLoading(false);
    }
  };

  const getContactName = (contactId: string | Contact) => {
    if (typeof contactId === 'string') {
      const contact = contacts.find(c => c._id === contactId);
      return contact?.fullName || 'Unknown';
    }
    return contactId.fullName;
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
              <h2 className="text-2xl font-bold text-gray-800">💬 Tin nhắn cược</h2>
              <p className="text-sm text-gray-600">Parse và quản lý tin nhắn</p>
            </div>
            
            <Button onClick={() => setShowModal(true)}>
              ➕ Parse tin nhắn mới
            </Button>
          </div>

          <div className="bg-white rounded-lg shadow">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Khách hàng</TableHead>
                  <TableHead>Ngày</TableHead>
                  <TableHead>Vùng</TableHead>
                  <TableHead>Số dòng</TableHead>
                  <TableHead>Tổng tiền</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">Đang tải...</TableCell>
                  </TableRow>
                ) : messages.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">Chưa có tin nhắn nào</TableCell>
                  </TableRow>
                ) : (
                  messages.map((message) => (
                    <TableRow key={message._id}>
                      <TableCell className="font-medium">
                        {getContactName(message.contactId)}
                      </TableCell>
                      <TableCell>{formatDate(message.date)}</TableCell>
                      <TableCell>
                        {message.regions.map(r => r.toUpperCase()).join(', ')}
                      </TableCell>
                      <TableCell>{message.parsed?.lines?.length || 0}</TableCell>
                      <TableCell className="font-semibold">
                        {message.parsed?.totalAmount?.toLocaleString('vi-VN') || 0}đ
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            message.status === 'won' ? 'success' :
                            message.status === 'lost' ? 'danger' :
                            'secondary'
                          }
                        >
                          {message.status === 'won' ? '🎉 Thắng' :
                           message.status === 'lost' ? '❌ Thua' :
                           '⏳ Chờ'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm">
                          👁️ Xem
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
        <MessageParseModal
          contacts={contacts}
          onClose={() => setShowModal(false)}
          onSaved={() => {
            setShowModal(false);
            fetchData();
          }}
        />
      )}
    </div>
  );
}

// Message Parse Modal
function MessageParseModal({ 
  contacts, 
  onClose, 
  onSaved 
}: { 
  contacts: Contact[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const [formData, setFormData] = useState({
    contactId: "",
    content: "",
    date: new Date().toISOString().split('T')[0],
    regions: ["mb"],
  });
  const [parsed, setParsed] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleParse = async () => {
    if (!formData.contactId || !formData.content) {
      alert("Vui lòng chọn khách hàng và nhập nội dung!");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/messages/parse", formData);
      setParsed(response.data.data);
    } catch (error) {
      console.error("Parse error:", error);
      alert("Parse thất bại!");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!parsed) return;

    try {
      await api.post("/messages", {
        ...formData,
        parsed,
      });
      onSaved();
    } catch (error) {
      console.error("Save error:", error);
      alert("Lưu thất bại!");
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>💬 Parse tin nhắn cược</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Khách hàng *</label>
            <Select
              value={formData.contactId}
              onChange={(e) => setFormData({ ...formData, contactId: e.target.value })}
            >
              <option value="">-- Chọn khách hàng --</option>
              {contacts.map(c => (
                <option key={c._id} value={c._id}>{c.fullName} - {c.phone}</option>
              ))}
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Ngày *</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Vùng *</label>
            <Select
              value={formData.regions[0]}
              onChange={(e) => setFormData({ ...formData, regions: [e.target.value] })}
            >
              <option value="mb">Miền Bắc</option>
              <option value="mt">Miền Trung</option>
              <option value="mn">Miền Nam</option>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Nội dung tin nhắn *</label>
            <Textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Ví dụ: dc 12 34 56 lo10&#10;de 78 90 50k"
              rows={6}
            />
          </div>

          <Button onClick={handleParse} disabled={loading} className="w-full">
            {loading ? '⏳ Đang parse...' : '🔍 Parse'}
          </Button>

          {parsed && (
            <div className="border rounded-lg p-4 bg-green-50">
              <h4 className="font-semibold mb-2">✅ Kết quả parse:</h4>
              <div className="space-y-2 text-sm">
                <p>Số dòng: <strong>{parsed.lines?.length || 0}</strong></p>
                <p>Tổng tiền: <strong>{parsed.totalAmount?.toLocaleString('vi-VN')}đ</strong></p>
                <div className="mt-2 max-h-40 overflow-y-auto">
                  {parsed.lines?.map((line: any, idx: number) => (
                    <div key={idx} className="bg-white p-2 rounded mb-1">
                      {line.type}: {line.numbers.join(', ')} - {line.amount.toLocaleString('vi-VN')}đ
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Hủy
            </Button>
            {parsed && (
              <Button onClick={handleSave}>
                💾 Lưu tin nhắn
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

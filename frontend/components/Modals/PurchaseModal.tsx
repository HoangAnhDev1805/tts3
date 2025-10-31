"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { PaymentPackage, PaymentMethod } from "@/types";
import api from "@/lib/api";
import { formatCurrency } from "@/lib/utils";

interface PurchaseModalProps {
  open: boolean;
  onClose: () => void;
}

export default function PurchaseModal({ open, onClose }: PurchaseModalProps) {
  const [step, setStep] = useState(1);
  const [packages, setPackages] = useState<PaymentPackage[]>([]);
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<PaymentPackage | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [phone, setPhone] = useState("");
  const [transaction, setTransaction] = useState<any>(null);
  const [countdown, setCountdown] = useState(600); // 10 minutes

  useEffect(() => {
    if (open) {
      fetchData();
    }
  }, [open]);

  useEffect(() => {
    if (step === 3 && countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [step, countdown]);

  const fetchData = async () => {
    try {
      const [pkgRes, methodRes] = await Promise.all([
        api.get("/packages"),
        api.get("/payment-methods"),
      ]);
      setPackages(pkgRes.data.data.filter((p: PaymentPackage) => p.isActive));
      setMethods(methodRes.data.data.filter((m: PaymentMethod) => m.isActive));
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  const handleNext = async () => {
    if (step === 1) {
      if (!selectedPackage) {
        alert("Vui lòng chọn gói!");
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!selectedMethod || !phone) {
        alert("Vui lòng chọn phương thức thanh toán và nhập SĐT!");
        return;
      }
      
      try {
        const response = await api.post("/transactions", {
          type: "purchase",
          packageId: selectedPackage!._id,
          paymentMethodId: selectedMethod._id,
          phone,
        });
        setTransaction(response.data.data);
        setStep(3);
      } catch (error) {
        console.error("Create transaction error:", error);
        alert("Tạo giao dịch thất bại!");
      }
    }
  };

  const handleConfirmed = () => {
    alert("Đã gửi yêu cầu! Admin sẽ kiểm tra và duyệt trong thời gian sớm nhất.");
    onClose();
    resetModal();
  };

  const handleCancel = () => {
    onClose();
    resetModal();
  };

  const resetModal = () => {
    setStep(1);
    setSelectedPackage(null);
    setSelectedMethod(null);
    setPhone("");
    setTransaction(null);
    setCountdown(600);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>🛒 Mua tài khoản mới</DialogTitle>
        </DialogHeader>

        {/* Step 1: Choose Package */}
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="font-semibold">Bước 1/3: Chọn gói dịch vụ</h3>
            <div className="grid grid-cols-2 gap-4">
              {packages.map((pkg) => (
                <div
                  key={pkg._id}
                  className={`border rounded-lg p-4 cursor-pointer transition ${
                    selectedPackage?._id === pkg._id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-blue-300'
                  }`}
                  onClick={() => setSelectedPackage(pkg)}
                >
                  <h4 className="font-semibold text-lg">{pkg.name}</h4>
                  <p className="text-2xl font-bold text-blue-600 my-2">
                    {formatCurrency(pkg.price)}
                  </p>
                  <p className="text-sm text-gray-600">{pkg.description}</p>
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={handleCancel}>Hủy</Button>
              <Button onClick={handleNext}>Tiếp theo →</Button>
            </div>
          </div>
        )}

        {/* Step 2: Choose Payment Method */}
        {step === 2 && (
          <div className="space-y-4">
            <h3 className="font-semibold">Bước 2/3: Chọn phương thức thanh toán</h3>
            
            <div className="space-y-3">
              {methods.map((method) => (
                <div
                  key={method._id}
                  className={`border rounded-lg p-4 cursor-pointer transition ${
                    selectedMethod?._id === method._id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-blue-300'
                  }`}
                  onClick={() => setSelectedMethod(method)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">
                        {method.type === 'bank' ? '🏦 ' : method.type === 'momo' ? '💰 ' : '💳 '}
                        {method.bankName || method.type.toUpperCase()}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {method.accountNumber || method.momoPhone || method.zaloPayPhone}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Số điện thoại *</label>
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Nhập SĐT để liên hệ"
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setStep(1)}>← Quay lại</Button>
              <Button onClick={handleNext}>Tiếp theo →</Button>
            </div>
          </div>
        )}

        {/* Step 3: Payment Info & Countdown */}
        {step === 3 && transaction && (
          <div className="space-y-4">
            <h3 className="font-semibold">Bước 3/3: Thông tin chuyển khoản</h3>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="text-center mb-4">
                <div className="text-4xl font-bold text-red-600">{formatTime(countdown)}</div>
                <p className="text-sm text-gray-600">Thời gian còn lại</p>
              </div>

              <div className="bg-white rounded p-4 space-y-2">
                <p><strong>Ngân hàng:</strong> {selectedMethod?.bankName}</p>
                <p><strong>Số tài khoản:</strong> {selectedMethod?.accountNumber}</p>
                <p><strong>Chủ tài khoản:</strong> {selectedMethod?.accountName}</p>
                <p><strong>Số tiền:</strong> <span className="text-red-600 font-bold">{formatCurrency(transaction.amount)}</span></p>
                <p><strong>Nội dung:</strong> <code className="bg-gray-100 px-2 py-1 rounded">{transaction.transferContent}</code></p>
              </div>

              {selectedMethod?.qrCode && (
                <div className="mt-4 text-center">
                  <img src={selectedMethod.qrCode} alt="QR Code" className="max-w-xs mx-auto" />
                  <p className="text-sm text-gray-600 mt-2">Quét mã QR để chuyển khoản</p>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={handleCancel}>Hủy</Button>
              <Button onClick={handleConfirmed}>✅ Đã chuyển khoản</Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

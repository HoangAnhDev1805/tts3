# CHI TIẾT CHỨC NĂNG NGƯỜI DÙNG

> Chi tiết các trang và chức năng phần người dùng

---

## 1. 🔐 TRANG ĐĂNG NHẬP

### Giao diện & chức năng
- **Form đăng nhập**: Username + Password
- **Nút "Dùng thử miễn phí"**: Tạo trial account (24h, read-only)
- **Nút "Mua tài khoản"**: Modal chọn gói → chọn phương thức thanh toán
- **Nút "Gia hạn tài khoản"**: Kiểm tra username → chọn gói → thanh toán

### Modal Tài khoản hết hạn
Khi user hết hạn đăng nhập vào hệ thống:
```
┌─────────────────────────────────────────────────────────┐
│  ⚠️ TÀI KHOẢN ĐÃ HẾT HẠN                           [×] │
│─────────────────────────────────────────────────────────│
│                                                          │
│  Tài khoản của bạn đã hết hạn sử dụng.                  │
│  Vui lòng liên hệ Admin để gia hạn tài khoản.           │
│                                                          │
│  📧 Email: support@3daixs.com                            │
│  📱 Hotline: 0123456789                                  │
│  💬 Telegram: @admin3daixs                               │
│                                                          │
│  Hoặc bạn có thể gia hạn ngay:                          │
│                                                          │
│              [Gia hạn ngay]    [Đăng xuất]             │
└─────────────────────────────────────────────────────────┘
```
- **Chặn hoàn toàn**: Không cho phép truy cập bất kỳ trang nào
- **Nút "Gia hạn ngay"**: Mở modal gia hạn tài khoản
- **Nút "Đăng xuất"**: Logout và quay về trang login

### Modal Mua tài khoản (3 bước)
**Bước 1:** Chọn gói (3/6/9/12 tháng với giá từ admin)

**Bước 2:** Chọn phương thức (Vietcombank, Techcombank, Momo, ZaloPay với QR code)

**Bước 3:** Thông tin thanh toán + Countdown
```
┌─────────────────────────────────────────────────────────┐
│  💳 THÔNG TIN THANH TOÁN                           [×] │
│─────────────────────────────────────────────────────────│
│  Gói: 6 tháng - 900,000đ                                │
│  Phương thức: Vietcombank                               │
│                                                          │
│  ⏱️ Thời gian còn lại: 09:45                            │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │ 🏦 THÔNG TIN CHUYỂN KHOẢN                        │  │
│  │                                                   │  │
│  │ Ngân hàng: VIETCOMBANK                           │  │
│  │ Số TK: 1234567890                                │  │
│  │ Chủ TK: NGUYEN VAN A                             │  │
│  │ Số tiền: 900,000đ                                │  │
│  │ Nội dung: MUA_0901234567                         │  │
│  │                                                   │  │
│  │         [QR CODE IMAGE]                          │  │
│  │                                                   │  │
│  │ ⚠️ Lưu ý:                                        │  │
│  │ - Chuyển khoản ĐÚNG nội dung                    │  │
│  │ - Thời gian xử lý: 5-15 phút                    │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
│          [Hủy bỏ]         [✓ Đã chuyển tiền]          │
└─────────────────────────────────────────────────────────┘
```

**Countdown 10 phút:**
- Đếm ngược từ 10:00
- Hết thời gian → Tự động đóng modal
- User phải tạo lại yêu cầu mới

**Nút "Đã chuyển tiền":**
- Gửi yêu cầu lên server
- Hiển thị thông báo: "Đã gửi yêu cầu. Vui lòng đợi Admin duyệt (5-15 phút)"
- Đóng modal
- Lưu vào DB với status: 'pending'

### Modal Gia hạn tài khoản (4 bước)
**Bước 1:** Nhập username → Kiểm tra → Hiển thị thông tin (ngày hết hạn, còn bao nhiêu ngày)
**Bước 2, 3, 4:** Giống modal Mua tài khoản (chọn gói → chọn phương thức → thanh toán + countdown)

---

## 2. 📊 DASHBOARD

### Hiển thị
- Tab 3 miền: MB, MT, MN
- Bảng kết quả xổ số (crawl từ az24.vn)
- Auto refresh 5 phút
- Socket.IO realtime push

### API
`GET /api/lottery/results?date=DD-MM-YYYY&region=mb|mt|mn`

---

## 3. 📇 DANH BẠ

### Danh sách
- Card thống kê: Tổng/Hoạt động/Khóa
- Tìm kiếm, lọc, phân trang
- Nút: Thêm, Sửa, Xóa, Xuất Excel

### Modal Thêm/Sửa
**Thông tin cơ bản:**
- Họ tên, SĐT, Địa chỉ, Ghi chú, Trạng thái

**Cấu hình tính tiền (40 loại cược × 3 miền):**
- Tab MB/MT/MN
- Mỗi loại cược: Giá bán, Tiền thắng
- Nút: Copy từ mặc định, Copy sang miền khác

**Danh sách 40 loại cược:** (xem file tinhtien.md)
Đề, Đầu, Đuôi, Đầu-Đuôi, Bao lô, Xỉu chủ, Xỉu chủ đầu/đuôi, Đá, Đá xiên, Bảy lô, Tám lô, Bảy lô đảo, Tám lô đảo, Xỉu chủ đảo đầu/đuôi, Kéo, Chẵn, Lẻ, Chẵn chẵn, Lẻ lẻ, Chẵn lẻ, Lẻ chẵn, Giáp, 2/3/4 Đài, Đề đầu ĐB, Đề đầu G1, Đề G1, Xiên 2/3/4, Đề giáp, Đề dàn, Đề tổng, Đề đầu đuôi, Đề chẵn lẻ, Đề hệ, Đề có số, Đề kép

---

## 4. 💬 TIN NHẮN

### Danh sách
- Card thống kê: Tổng/Hợp lệ/Sai, Thu/Trả/Lãi
- Tab filter: MB/MT/MN/Sai cú pháp
- Tìm kiếm, lọc (ngày, người), phân trang
- Nút: Thêm, Sửa, Xóa, Xuất

### Modal Thêm/Sửa
- Chọn người chơi, ngày, miền
- Textarea nội dung tin nhắn
- Nút "Parse & Preview"
- Bảng kết quả parse: STT/Đài/Kiểu/Số/Điểm/Giá/Tiền thu/Trúng MB/MT/MN
- Hiển thị: Tổng tiền thu, Tiền trúng tối đa

### Parse cú pháp
Service `MessageParserService` theo file `dac-ta-cu-phap-day-du_v2.md`

**Ví dụ:**
```
Input: "dc 12 34 lo10"
Output: 2 dòng (12, 34) × 10 điểm × 0.75 giá = 75k mỗi dòng
```

---

## 5. 💰 DOANH THU

- Chọn khoảng ngày, người chơi
- Card thống kê: Tổng thu/Tổng trả/Lãi/Nợ
- Biểu đồ: Doanh thu theo ngày (line chart)
- Bảng chi tiết: Ngày/Người/Tin nhắn/Thu/Trả/Lãi
- Xuất Excel/PDF

---

## 6. ⚙️ CẤU HÌNH DOANH THU

- % Ăn theo loại cược
- % Thuế
- Làm tròn
- Áp dụng cho: Tất cả/Danh bạ cụ thể

---

## 7. 📖 HƯỚNG DẪN SỬ DỤNG

- Danh sách bài viết (title, excerpt)
- Chi tiết bài viết (markdown render)
- Tìm kiếm

---

## 8. 🎯 TÍNH NĂNG MỚI

- Timeline release notes
- Mỗi release: Version, ngày, changelog

---

## 9. 🤖 BOT TELEGRAM

- Hiển thị thông tin bot đã cấu hình
- Hướng dẫn kết nối
- Test gửi tin

---

## 10. 📱 TẢI ỨNG DỤNG

- Nút tải iOS (App Store)
- Nút tải Android (Play Store/APK)
- QR code

---

## 11. 👤 TRANG CÁ NHÂN

### Thông tin
- Avatar (upload kéo thả, crop, progress %)
- Username (disabled)
- Họ tên, Email, SĐT
- Ngày đăng ký
- Hạn sử dụng (label màu: xanh >30 ngày, vàng 7-30, đỏ <7)

### Đổi mật khẩu
- Mật khẩu cũ
- Mật khẩu mới
- Xác nhận mật khẩu mới

---

## 12. DROPDOWN AVATAR (Header)

- Trang cá nhân
- Đổi mật khẩu
- Đăng xuất

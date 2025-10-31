# CHI TIẾT CHỨC NĂNG ADMIN

> Chi tiết các trang quản trị

---

## 1. 📊 TỔNG QUAN (Dashboard Admin)

### Card thống kê
- Tổng người dùng (hoạt động/khóa/hết hạn/trial)
- Doanh thu tháng này
- Giao dịch chờ xác nhận
- Người dùng sắp hết hạn (<7 ngày)

### Biểu đồ
- Người dùng mới theo tháng (12 tháng)
- Doanh thu theo tháng (12 tháng)

### Danh sách hoạt động gần đây
- User đăng nhập
- User đăng ký/gia hạn
- User hết hạn

---

## 2. 💳 QUẢN LÝ THANH TOÁN

### Tab 1: Gói thanh toán

#### Danh sách (Card layout)
```
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  3 THÁNG     │  │  6 THÁNG     │  │  9 THÁNG     │
│  500,000đ    │  │  900,000đ    │  │  1,200,000đ  │
│  Mô tả...    │  │  Mô tả...    │  │  Mô tả...    │
│  ✏️ Sửa 🗑 Xóa │  │  ✏️ Sửa 🗑 Xóa │  │  ✏️ Sửa 🗑 Xóa │
└──────────────┘  └──────────────┘  └──────────────┘
[➕ Thêm gói mới]
```

#### Modal Thêm/Sửa gói
- Tên gói (vd: "3 tháng")
- Số tháng (number)
- Giá (number)
- Mô tả (textarea)
- Trạng thái (Hiển thị/Ẩn)
- Thứ tự hiển thị

### Tab 2: Phương thức thanh toán

#### Danh sách (Card layout)
```
┌─────────────────────────────────┐
│ 🏦 Vietcombank                   │
│ STK: 1234567890                  │
│ Chủ TK: NGUYEN VAN A             │
│ Nội dung: MUA_[PHONE]            │
│ [QR CODE IMAGE]                  │
│ ✏️ Sửa 🗑 Xóa                     │
└─────────────────────────────────┘
[➕ Thêm phương thức]
```

#### Modal Thêm/Sửa phương thức
- Loại (Ngân hàng/Momo/ZaloPay)
- Ngân hàng (dropdown danh sách 50+ ngân hàng VN)
- Chủ tài khoản
- Số tài khoản
- Nội dung chuyển khoản (template: MUA_[PHONE])
- QR Code:
  - Option 1: Nhập link QR
  - Option 2: Upload ảnh (drag & drop, progress %)
- Trạng thái (Hiển thị/Ẩn)
- Thứ tự

### Tab 3: Quản lý yêu cầu thanh toán

#### Card thống kê
```
┌──────────────────────────────────────────────────────────┐
│ 📊 Tổng: 150  │ ⏳ Chờ duyệt: 25  │ ✅ Đã duyệt: 120  │
│ ❌ Từ chối: 5 │ 💰 Tổng tiền: 135tr                    │
└──────────────────────────────────────────────────────────┘
```

#### Bộ lọc
- Loại: Tất cả / Mua tài khoản / Gia hạn
- Trạng thái: Tất cả / Chờ duyệt / Đã duyệt / Từ chối
- Phương thức: Tất cả / Vietcombank / Techcombank / Momo / ZaloPay
- Khoảng ngày

#### Danh sách (Table)
```
┌────┬──────────┬────────┬──────────┬──────────┬───────────┬────────────┬──────────┐
│STT │ Ngày     │ Loại   │ SĐT      │ Gói      │ Phương thức│ Trạng thái │ Hành động│
├────┼──────────┼────────┼──────────┼──────────┼───────────┼────────────┼──────────┤
│ 1  │30/10/2025│ Mua    │0901234567│ 6 tháng  │ VietcomBank│ ⏳ Chờ     │ ✅❌ℹ️   │
│ 2  │30/10/2025│ Gia hạn│0987654321│ 12 tháng │ Momo       │ ✅ Duyệt   │ ℹ️       │
│ 3  │29/10/2025│ Mua    │0912345678│ 3 tháng  │ Techcombank│ ❌ Từ chối │ ℹ️       │
└────┴──────────┴────────┴──────────┴──────────┴───────────┴────────────┴──────────┘
```

#### Modal Chi tiết yêu cầu
```
┌─────────────────────────────────────────────────────────┐
│  ℹ️ CHI TIẾT YÊU CẦU THANH TOÁN                    [×] │
│─────────────────────────────────────────────────────────│
│  Mã giao dịch: #TX20251030001                           │
│  Ngày tạo: 30/10/2025 14:30:25                          │
│                                                          │
│  📋 Thông tin giao dịch:                                │
│  • Loại: Mua tài khoản mới                              │
│  • Số điện thoại: 0901234567                            │
│  • Gói: 6 tháng                                         │
│  • Số tiền: 900,000đ                                    │
│                                                          │
│  💳 Thông tin thanh toán:                               │
│  • Phương thức: Vietcombank                             │
│  • Số TK: 1234567890                                    │
│  • Chủ TK: NGUYEN VAN A                                 │
│  • Nội dung: MUA_0901234567                             │
│                                                          │
│  📝 Trạng thái: ⏳ Chờ duyệt                            │
│                                                          │
│  [Từ chối]              [Duyệt]             [Đóng]     │
└─────────────────────────────────────────────────────────┘
```

**Nút "Duyệt":**
- Nếu là "Mua tài khoản":
  - Tạo user mới
  - Set expiryDate = startDate + months
  - Gửi email/sms thông báo (username + password)
- Nếu là "Gia hạn":
  - Tìm user theo username
  - Cộng thêm months vào expiryDate
  - Gửi thông báo gia hạn thành công
- Update transaction status = 'confirmed'
- Gửi notification cho user (nếu đang online)

**Nút "Từ chối":**
- Mở modal nhập lý do từ chối
- Update transaction status = 'rejected'
- Gửi notification cho user (nếu đang online)

#### Phân trang
- 20 items/page
- Tổng số trang
- Jump to page

---

## 3. 🤖 CẤU HÌNH BOT TELEGRAM

### Form cấu hình
- Bot Token
- Bot Username
- Webhook URL
- Test bot (nút gửi tin test)

### Hướng dẫn
- Cách tạo bot với BotFather
- Cách lấy token
- Cách cấu hình webhook

---

## 4. 👥 QUẢN LÝ NGƯỜI DÙNG

### Card thống kê
- Tổng users
- Hoạt động
- Khóa
- Hết hạn
- Trial

### Bộ lọc
- Trạng thái (Tất cả/Hoạt động/Khóa/Hết hạn/Trial)
- Ngày đăng ký
- Ngày hết hạn

### Danh sách (Table)
```
┌────┬──────────┬──────────┬────────────┬────────────┬────────────┐
│STT │ Username │ Họ tên   │ Đăng ký    │ Hết hạn    │ Hành động  │
├────┼──────────┼──────────┼────────────┼────────────┼────────────┤
│ 1  │ user001  │ Nguyễn A │ 01/10/2025 │ 01/04/2026 │ 🔒✏️🗑     │
│ 2  │ user002  │ Trần B   │ 15/09/2025 │ 15/11/2025 │ 🔓✏️🗑     │
└────┴──────────┴──────────┴────────────┴────────────┴────────────┘
```

### Modal Thêm/Sửa user
- Username (unique, không thể sửa)
- Password (hash bcrypt)
- Họ tên
- Email
- Số điện thoại
- Ngày bắt đầu
- Ngày hết hạn
- Trạng thái (Hoạt động/Khóa)
- Ghi chú

### Nút hành động
- 🔒 Khóa tài khoản
- 🔓 Mở khóa
- ✏️ Sửa
- 🗑 Xóa (xác nhận)

---

## 5. ⚙️ CẤU HÌNH WEBSITE

### Tab SEO
- **Thông tin cơ bản:**
  - Title
  - Description
  - Keywords (tags input)
  
- **Upload media:**
  - Logo (kéo thả, crop, preview)
  - Favicon
  - OG Image (Facebook share)
  - Twitter Card Image

- **Preview:**
  - Google Search Result
  - Facebook Share
  - Twitter Share

### Tab Nâng cao
- Google Analytics ID
- Facebook Pixel ID
- Custom CSS
- Custom JS
- Header scripts
- Footer scripts

### Tab SMTP (Email)
- Host
- Port
- Username
- Password
- From email
- From name
- Test gửi email

---

## 6. SIDEBAR ADMIN

```
📊 Tổng quan
💳 Quản lý thanh toán
   ├─ Gói thanh toán
   ├─ Phương thức thanh toán
   └─ Yêu cầu thanh toán
🤖 Cấu hình Bot Telegram
👥 Quản lý người dùng
⚙️ Cấu hình website
   ├─ SEO & Meta
   ├─ Nâng cao
   └─ SMTP
🚪 Về trang User
```

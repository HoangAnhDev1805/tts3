# SƠ ĐỒ LUỒNG NGHIỆP VỤ

> Các luồng hoạt động chính của hệ thống

---

## 1. LUỒNG ĐĂNG NHẬP

```
┌──────────┐
│  User    │
└────┬─────┘
     │
     ├─ Nhập username + password
     │
     ▼
┌──────────────────┐
│  Frontend        │
│  Validate form   │
└────┬─────────────┘
     │
     ├─ POST /api/auth/login
     │
     ▼
┌──────────────────────────────┐
│  Backend                     │
│  1. Tìm user by username     │
│  2. Compare password (bcrypt)│
│  3. Check status & expiry    │
│  4. Generate JWT tokens      │
└────┬─────────────────────────┘
     │
     ├─ Return: user + tokens
     │
     ▼
┌──────────────────────────────┐
│  Frontend                    │
│  1. Lưu tokens (cookie)      │
│  2. Update Zustand store     │
│  3. Redirect:                │
│     - Admin → /admin/dashboard│
│     - User → /dashboard      │
│     - Trial → /dashboard     │
└──────────────────────────────┘
```

---

## 2. LUỒNG DÙNG THỬ

```
┌──────────┐
│  User    │
└────┬─────┘
     │
     ├─ Click "Dùng thử miễn phí"
     │
     ▼
┌──────────────────────────────┐
│  Frontend                    │
│  POST /api/auth/trial        │
└────┬─────────────────────────┘
     │
     ▼
┌──────────────────────────────┐
│  Backend                     │
│  1. Generate trial username  │
│     trial_[timestamp]        │
│  2. Generate random password │
│  3. Set expiryDate: +24h     │
│  4. Create demo contacts (5) │
│  5. Create demo messages (15)│
│  6. Generate JWT tokens      │
└────┬─────────────────────────┘
     │
     ├─ Return: credentials + tokens
     │
     ▼
┌──────────────────────────────┐
│  Frontend                    │
│  1. Auto login               │
│  2. Show banner: Trial mode  │
│  3. Disable write actions    │
│  4. Redirect /dashboard      │
└──────────────────────────────┘
```

---

## 3. LUỒNG MUA TÀI KHOẢN

```
┌──────────┐
│  User    │
└────┬─────┘
     │
     ├─ Click "Mua tài khoản"
     │
     ▼
┌──────────────────────────────┐
│  Frontend                    │
│  Modal Bước 1:               │
│  GET /api/packages           │
│  Display packages            │
└────┬─────────────────────────┘
     │
     ├─ User chọn gói
     │
     ▼
┌──────────────────────────────┐
│  Modal Bước 2:               │
│  GET /api/payment-methods    │
│  Display methods with QR     │
└────┬─────────────────────────┘
     │
     ├─ User chọn method + nhập SĐT
     │
     ▼
┌──────────────────────────────┐
│  POST /api/transactions      │
│  {                           │
│    type: 'purchase',         │
│    packageId,                │
│    paymentMethodId,          │
│    phone                     │
│  }                           │
└────┬─────────────────────────┘
     │
     ▼
┌──────────────────────────────┐
│  Backend                     │
│  1. Create transaction       │
│     status: 'pending'        │
│  2. Return transaction info  │
└────┬─────────────────────────┘
     │
     ├─ User chuyển khoản offline
     │
     ▼
┌──────────────────────────────┐
│  Admin                       │
│  1. Check bank account       │
│  2. Confirm transaction      │
│  PATCH /api/transactions/:id/│
│        confirm               │
└────┬─────────────────────────┘
     │
     ▼
┌──────────────────────────────┐
│  Backend                     │
│  1. Create new user          │
│  2. Set expiryDate based on  │
│     package months           │
│  3. Send email/notification  │
└──────────────────────────────┘
```

---

## 4. LUỒNG THÊM TIN NHẮN

```
┌──────────┐
│  User    │
└────┬─────┘
     │
     ├─ Vào trang Tin nhắn
     ├─ Click "Thêm tin nhắn"
     │
     ▼
┌──────────────────────────────┐
│  Modal Thêm:                 │
│  1. Chọn người chơi          │
│  2. Chọn ngày                │
│  3. Chọn miền (MB/MT/MN)     │
│  4. Nhập nội dung            │
└────┬─────────────────────────┘
     │
     ├─ Click "Parse & Preview"
     │
     ▼
┌──────────────────────────────┐
│  POST /api/messages/parse    │
│  {                           │
│    contactId,                │
│    content,                  │
│    date,                     │
│    regions                   │
│  }                           │
└────┬─────────────────────────┘
     │
     ▼
┌──────────────────────────────────────┐
│  Backend - MessageParserService      │
│  1. Load contact pricing config      │
│  2. Parse content line by line       │
│     - Detect province/region         │
│     - Detect bet type                │
│     - Extract numbers                │
│     - Calculate bet amount           │
│     - Calculate payout               │
│  3. Return parsed data + stats       │
└────┬─────────────────────────────────┘
     │
     ├─ Display parsed table
     │
     ▼
┌──────────────────────────────┐
│  Frontend                    │
│  Show preview table:         │
│  - STT, Đài, Kiểu, Số,...    │
│  - Tổng tiền thu             │
│  - Tiền trúng dự kiến        │
└────┬─────────────────────────┘
     │
     ├─ User xác nhận → Click "Lưu"
     │
     ▼
┌──────────────────────────────┐
│  POST /api/messages          │
│  {                           │
│    contactId,                │
│    date,                     │
│    content,                  │
│    regions,                  │
│    parsed: { /* data */ }    │
│  }                           │
└────┬─────────────────────────┘
     │
     ▼
┌──────────────────────────────┐
│  Backend                     │
│  1. Save message to DB       │
│  2. Update contact debt      │
│  3. Return success           │
└────┬─────────────────────────┘
     │
     ▼
┌──────────────────────────────┐
│  Frontend                    │
│  1. Close modal              │
│  2. Refresh messages list    │
│  3. Show success toast       │
└──────────────────────────────┘
```

---

## 5. LUỒNG CẬP NHẬT KẾT QUẢ XỔ SỐ

```
┌──────────────────────────────┐
│  Cron Job                    │
│  Chạy mỗi ngày 18:00         │
└────┬─────────────────────────┘
     │
     ▼
┌──────────────────────────────┐
│  LotteryService              │
│  1. Crawl az24.vn            │
│     - Miền Bắc               │
│     - Miền Trung             │
│     - Miền Nam               │
│  2. Parse HTML results       │
└────┬─────────────────────────┘
     │
     ▼
┌──────────────────────────────┐
│  Database                    │
│  Save to lottery_results     │
│  collection                  │
└────┬─────────────────────────┘
     │
     ▼
┌──────────────────────────────┐
│  Socket.IO                   │
│  Broadcast event:            │
│  'lottery-result-updated'    │
│  {                           │
│    date,                     │
│    region,                   │
│    data                      │
│  }                           │
└────┬─────────────────────────┘
     │
     ▼
┌──────────────────────────────┐
│  Connected Clients           │
│  1. Receive socket event     │
│  2. Update dashboard UI      │
│  3. Show notification        │
└──────────────────────────────┘
     │
     ▼
┌──────────────────────────────┐
│  Auto Process Messages       │
│  1. Find messages for date   │
│  2. Check win/lose           │
│  3. Calculate actual payout  │
│  4. Update message.result    │
│  5. Send notifications       │
└──────────────────────────────┘
```

---

## 6. LUỒNG XỬ LÝ THẮNG/THUA

```
┌──────────────────────────────┐
│  Message                     │
│  status: 'pending'           │
└────┬─────────────────────────┘
     │
     ├─ Có kết quả xổ số cho ngày
     │
     ▼
┌──────────────────────────────┐
│  POST /api/messages/:id/     │
│        process               │
│  hoặc Auto trigger           │
└────┬─────────────────────────┘
     │
     ▼
┌──────────────────────────────────────┐
│  Backend - CalculationService        │
│  For each parsed line:               │
│  1. Get lottery result for date      │
│  2. Check if number exists in result │
│     - Check correct region           │
│     - Check correct prize level      │
│  3. If won:                          │
│     - Calculate win amount           │
│     - Update line.won = true         │
│  4. Sum total win/lose               │
│  5. Calculate profit                 │
└────┬─────────────────────────────────┘
     │
     ▼
┌──────────────────────────────┐
│  Update Message              │
│  {                           │
│    result: {                 │
│      processed: true,        │
│      totalWin: X,            │
│      totalLose: Y,           │
│      profit: Z,              │
│      details: [...]          │
│    },                        │
│    status: 'won'|'lost'      │
│  }                           │
└────┬─────────────────────────┘
     │
     ▼
┌──────────────────────────────┐
│  Update Contact              │
│  Adjust debt if needed       │
└────┬─────────────────────────┘
     │
     ▼
┌──────────────────────────────┐
│  Notification                │
│  - Socket.IO to user         │
│  - Telegram bot (if enabled) │
└──────────────────────────────┘
```

---

## 7. MIDDLEWARE FLOW

```
┌─────────────────┐
│  Client Request │
└────┬────────────┘
     │
     ▼
┌─────────────────────┐
│  CORS Middleware    │
└────┬────────────────┘
     │
     ▼
┌─────────────────────┐
│  Rate Limit         │
│  100 req/15min      │
└────┬────────────────┘
     │
     ▼
┌─────────────────────┐
│  Body Parser        │
│  (JSON/FormData)    │
└────┬────────────────┘
     │
     ▼
┌─────────────────────┐
│  Auth Middleware    │
│  1. Check JWT token │
│  2. Verify token    │
│  3. Load user       │
│  4. Attach to req   │
└────┬────────────────┘
     │
     ▼
┌─────────────────────┐
│  Role Middleware    │
│  Check user.role    │
│  vs required role   │
└────┬────────────────┘
     │
     ▼
┌─────────────────────┐
│  Expiry Middleware  │
│  Check expiryDate   │
│  (skip for admin)   │
└────┬────────────────┘
     │
     ▼
┌─────────────────────┐
│  Controller         │
│  Handle business    │
└────┬────────────────┘
     │
     ▼
┌─────────────────────┐
│  Error Handler      │
│  Catch & format err │
└────┬────────────────┘
     │
     ▼
┌─────────────────────┐
│  Response           │
└─────────────────────┘
```

---

## 8. SOCKET.IO EVENTS

### Client → Server
- `connection`: Kết nối
- `disconnect`: Ngắt kết nối
- `join-room`: Join room theo userId
- `leave-room`: Leave room

### Server → Client
- `lottery-result-updated`: Kết quả xổ số mới
  ```json
  {
    "date": "30-10-2025",
    "region": "mb",
    "data": { /* lottery data */ }
  }
  ```

- `message-processed`: Tin nhắn đã xử lý
  ```json
  {
    "messageId": "...",
    "result": { /* win/lose data */ }
  }
  ```

- `notification`: Thông báo chung
  ```json
  {
    "type": "info|success|warning|error",
    "title": "...",
    "message": "..."
  }
  ```

---

## 9. CRON JOBS

### 1. Update Lottery Results
- **Schedule**: Mỗi ngày 18:00
- **Task**: Crawl và lưu kết quả xổ số 3 miền

### 2. Check Expired Users
- **Schedule**: Mỗi ngày 00:00
- **Task**: Update status = 'expired' cho users hết hạn

### 3. Auto Process Messages
- **Schedule**: Mỗi ngày 18:30
- **Task**: Tự động xử lý tin nhắn chưa xử lý

### 4. Send Expiry Notifications
- **Schedule**: Mỗi ngày 09:00
- **Task**: Gửi email/telegram cho users sắp hết hạn (<7 ngày)

### 5. Cleanup Trial Users
- **Schedule**: Mỗi ngày 00:00
- **Task**: Xóa trial users đã hết hạn >7 ngày

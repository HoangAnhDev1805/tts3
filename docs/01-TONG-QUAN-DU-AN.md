# TỔNG QUAN DỰ ÁN HỆ THỐNG QUẢN LÝ LÔ ĐỀ 3DAIXS.COM

> **Ngày tạo**: 30/10/2025  
> **Công nghệ**: Node.js (Express + Socket.IO + MongoDB) + Next.js  
> **Mục đích**: Hệ thống quản lý tính tiền lô đề với giao diện hiện đại

---

## 📋 MỤC LỤC TÀI LIỆU

1. **01-TONG-QUAN-DU-AN.md** (file này) - Tổng quan và kiến trúc
2. **02-CHUC-NANG-USER.md** - Chi tiết các chức năng người dùng
3. **03-CHUC-NANG-ADMIN.md** - Chi tiết trang quản trị
4. **04-DATABASE-SCHEMA.md** - Cấu trúc database MongoDB
5. **05-API-ENDPOINTS.md** - Danh sách API endpoints
6. **06-LUONG-NGHIEP-VU.md** - Sơ đồ luồng nghiệp vụ

---

## 1. MÔ TẢ TỔNG QUÁT

### 1.1. Giới thiệu
Hệ thống quản lý và tính tiền lô đề 3DAIXS.COM cho phép:
- **Người dùng** (khách hàng): Quản lý danh bạ người chơi, tin nhắn cược, theo dõi doanh thu
- **Admin**: Quản lý toàn bộ hệ thống, người dùng, thanh toán, cấu hình

### 1.2. Đặc điểm nổi bật
- ✅ **Không có đăng ký** - Chỉ admin tạo tài khoản
- ✅ **Dùng thử miễn phí** - Xem demo danh bạ và tin nhắn (chỉ đọc)
- ✅ **Hệ thống gói tài khoản** - 3, 6, 9, 12 tháng
- ✅ **Realtime** - Socket.IO cập nhật kết quả xổ số
- ✅ **Tính tiền tự động** - Parse cú pháp tin nhắn và tính toán
- ✅ **Giao diện đẹp** - Next.js + TailwindCSS + Shadcn/UI
- ✅ **SEO friendly** - Dynamic meta tags từ database

### 1.3. Vai trò người dùng

| Vai trò | Mô tả | Quyền hạn |
|---------|-------|-----------|
| **Trial User** | Người dùng dùng thử | Chỉ xem (read-only) danh bạ và tin nhắn mẫu |
| **User** | Khách hàng đã mua tài khoản | Toàn quyền quản lý danh bạ, tin nhắn, doanh thu của mình |
| **Admin** | Quản trị viên | Toàn quyền hệ thống, quản lý users, cấu hình |

---

## 2. KIẾN TRÚC HỆ THỐNG

### 2.1. Sơ đồ tổng quan

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT SIDE                              │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │              Next.js Frontend (Port 3000)                   │ │
│  │  - App Router + TypeScript                                  │ │
│  │  - TailwindCSS + Shadcn/UI + Lucide Icons                   │ │
│  │  - React Query (data fetching)                              │ │
│  │  - Socket.IO Client (realtime)                              │ │
│  │  - Zustand (state management)                               │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 │ HTTP/WebSocket
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                         SERVER SIDE                              │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │         Node.js Backend (Express) (Port 5000)               │ │
│  │  ┌──────────────────────────────────────────────────────┐  │ │
│  │  │  Express REST API                                      │  │ │
│  │  │  - Authentication (JWT)                                │  │ │
│  │  │  - Authorization Middleware                            │  │ │
│  │  │  - Business Logic                                      │  │ │
│  │  └──────────────────────────────────────────────────────┘  │ │
│  │  ┌──────────────────────────────────────────────────────┐  │ │
│  │  │  Socket.IO Server                                      │  │ │
│  │  │  - Realtime lottery results                            │  │ │
│  │  │  - Notifications                                        │  │ │
│  │  └──────────────────────────────────────────────────────┘  │ │
│  │  ┌──────────────────────────────────────────────────────┐  │ │
│  │  │  Services Layer                                        │  │ │
│  │  │  - LotteryService (crawl kết quả)                      │  │ │
│  │  │  - MessageParserService (parse cú pháp)                │  │ │
│  │  │  - CalculationService (tính tiền)                      │  │ │
│  │  │  - TelegramBotService                                  │  │ │
│  │  └──────────────────────────────────────────────────────┘  │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 │ MongoDB Driver
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                    MongoDB Database (Port 27017)                 │
│  Collections:                                                    │
│  - users, contacts, messages, revenues                           │
│  - payment_packages, payment_methods                             │
│  - telegram_settings, website_settings                           │
│  - lottery_results, guides, releases                             │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2. Tech Stack

#### **Backend**
- **Runtime**: Node.js v20+
- **Framework**: Express.js v4.18+
- **Realtime**: Socket.IO v4.7+
- **Database**: MongoDB v7+ (Mongoose ODM)
- **Authentication**: JWT (jsonwebtoken)
- **Validation**: Joi / Zod
- **File Upload**: Multer + Sharp
- **Crawler**: Axios + Cheerio (crawl kết quả xổ số)
- **Cron Jobs**: node-cron (auto update lottery)

#### **Frontend**
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS v3+
- **UI Components**: Shadcn/UI
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod
- **Data Fetching**: TanStack Query (React Query)
- **State Management**: Zustand
- **Realtime**: Socket.IO Client
- **Charts**: Recharts
- **Date**: date-fns

---

## 3. CẤU TRÚC THƯ MỤC

### Backend (Node.js)
```
backend/
├── src/
│   ├── config/          # Cấu hình (database, jwt, etc)
│   ├── models/          # Mongoose models
│   ├── controllers/     # Controllers xử lý request
│   ├── services/        # Business logic
│   │   ├── lottery.service.js
│   │   ├── message-parser.service.js
│   │   ├── calculation.service.js
│   │   └── telegram-bot.service.js
│   ├── middlewares/     # Middlewares (auth, validate)
│   ├── routes/          # API routes
│   ├── utils/           # Helpers, constants
│   ├── socket/          # Socket.IO handlers
│   └── app.js           # Express app
├── uploads/             # Upload files
├── .env
├── package.json
└── server.js            # Entry point
```

### Frontend (Next.js)
```
frontend/
├── app/                 # App Router
│   ├── (auth)/         # Auth pages group
│   │   └── login/
│   ├── (user)/         # User pages group
│   │   ├── dashboard/
│   │   ├── contacts/
│   │   ├── messages/
│   │   ├── revenue/
│   │   └── ...
│   ├── (admin)/        # Admin pages group
│   │   ├── dashboard/
│   │   ├── users/
│   │   ├── payments/
│   │   └── ...
│   ├── layout.tsx
│   └── page.tsx
├── components/          # React components
│   ├── ui/             # Shadcn/UI components
│   ├── layouts/
│   ├── modals/
│   └── ...
├── lib/                # Utilities
│   ├── api.ts          # API client
│   ├── socket.ts       # Socket.IO client
│   └── utils.ts
├── hooks/              # Custom hooks
├── store/              # Zustand stores
├── types/              # TypeScript types
├── public/
├── .env.local
├── package.json
├── tailwind.config.js
└── next.config.js
```

---

## 4. TÍNH NĂNG CHÍNH

### 4.1. Phần người dùng (User)
1. **Dashboard** - Xem kết quả xổ số realtime
2. **Danh bạ** - Quản lý người chơi, cấu hình giá
3. **Tin nhắn** - Parse và tính tiền tin nhắn cược
4. **Doanh thu** - Báo cáo, thống kê chi tiết
5. **Cấu hình doanh thu** - Tùy chỉnh % ăn, thuế
6. **Hướng dẫn sử dụng** - Docs hệ thống
7. **Tính năng mới** - Release notes
8. **Bot Telegram** - Nhận tin qua Telegram
9. **Tải ứng dụng** - Download mobile app
10. **Trang cá nhân** - Quản lý profile, đổi mật khẩu

### 4.2. Phần quản trị (Admin)
1. **Tổng quan** - Dashboard thống kê tổng
2. **Quản lý thanh toán**
   - Tab 1: Gói thanh toán (packages)
   - Tab 2: Phương thức thanh toán (methods)
3. **Cấu hình Bot Telegram** - Settings bot
4. **Quản lý người dùng** - CRUD users, lock/unlock
5. **Cấu hình website** - SEO, meta tags, logo

---

## 5. LUỒNG HOẠT ĐỘNG CHÍNH

### 5.1. Đăng nhập
```
User → Nhập username/password → Backend xác thực
→ Trả JWT token → Lưu token → Redirect dashboard
```

### 5.2. Dùng thử
```
User → Click "Dùng thử" → Backend tạo trial account tạm
→ Auto login → Redirect dashboard (read-only mode)
```

### 5.3. Mua tài khoản
```
User → Click "Mua tài khoản" → Chọn gói → Chọn phương thức
→ Xem QR/thông tin chuyển khoản → User chuyển khoản
→ Admin xác nhận → Active tài khoản
```

### 5.4. Thêm tin nhắn
```
User → Nhập nội dung → Click "Parse"
→ Backend parse cú pháp → Tính tiền
→ Hiển thị preview → User xác nhận → Lưu DB
```

### 5.5. Cập nhật kết quả xổ số
```
Cron job (18:00 daily) → Crawl az24.vn
→ Lưu DB → Socket.IO broadcast
→ Client nhận update → Hiển thị realtime
```

---

## 6. BẢO MẬT & PHÂN QUYỀN

### 6.1. Authentication
- JWT token (Access + Refresh)
- Access token: expires 1h
- Refresh token: expires 7 days
- Lưu token: httpOnly cookie (secure)

### 6.2. Authorization
- Middleware kiểm tra role
- Trial user: chỉ GET endpoints cụ thể
- User: full CRUD own data
- Admin: full access all

### 6.3. Data Security
- Password: bcrypt hash (salt rounds: 10)
- Input validation: Joi/Zod schemas
- MongoDB injection: sanitize input
- File upload: validate type, size, virus scan
- Rate limiting: express-rate-limit

---

## 7. TIẾP THEO

Đọc tiếp các file tài liệu:
- **02-CHUC-NANG-USER.md** - Chi tiết giao diện và chức năng user
- **03-CHUC-NANG-ADMIN.md** - Chi tiết trang admin
- **04-DATABASE-SCHEMA.md** - Schema MongoDB collections
- **05-API-ENDPOINTS.md** - Danh sách đầy đủ API
- **06-LUONG-NGHIEP-VU.md** - Sơ đồ luồng chi tiết

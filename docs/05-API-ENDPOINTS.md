# DANH SÁCH API ENDPOINTS

> REST API endpoints chi tiết

---

## BASE URL
- Development: `http://localhost:5000/api`
- Production: `https://api.3daixs.com/api`

---

## AUTHENTICATION

### POST /auth/login
Đăng nhập

**Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": { ...user object },
    "accessToken": "jwt_token",
    "refreshToken": "refresh_token"
  }
}
```

### POST /auth/logout
Đăng xuất (requires auth)

### POST /auth/refresh
Refresh access token

**Body:**
```json
{
  "refreshToken": "string"
}
```

### GET /auth/me
Lấy thông tin user hiện tại (requires auth)

### POST /auth/trial
Tạo trial account

**Response:**
```json
{
  "success": true,
  "data": {
    "username": "trial_1234567890",
    "password": "generated_password",
    "accessToken": "jwt_token"
  }
}
```

---

## USERS (Admin only)

### GET /users
Danh sách users

**Query:**
- `page`: number (default: 1)
- `limit`: number (default: 20)
- `status`: 'active'|'locked'|'expired'|'trial'
- `search`: string

### GET /users/:id
Chi tiết user

### POST /users
Tạo user mới

**Body:**
```json
{
  "username": "string",
  "password": "string",
  "email": "string",
  "phone": "string",
  "fullName": "string",
  "startDate": "date",
  "expiryDate": "date",
  "status": "active"
}
```

### PUT /users/:id
Cập nhật user

### DELETE /users/:id
Xóa user

### PATCH /users/:id/lock
Khóa user

### PATCH /users/:id/unlock
Mở khóa user

---

## CONTACTS

### GET /contacts
Danh sách contacts (của user hiện tại)

**Query:**
- `page`, `limit`
- `status`: 'active'|'locked'
- `search`: string

### GET /contacts/:id
Chi tiết contact

### POST /contacts
Tạo contact

**Body:**
```json
{
  "fullName": "string",
  "phone": "string",
  "address": "string",
  "notes": "string",
  "status": "active",
  "pricingConfig": {
    "mb": { /* 40 loại cược */ },
    "mt": { /* 40 loại cược */ },
    "mn": { /* 40 loại cược */ }
  }
}
```

### PUT /contacts/:id
Cập nhật contact

### DELETE /contacts/:id
Xóa contact

### GET /contacts/default-pricing
Lấy cấu hình giá mặc định

---

## MESSAGES

### GET /messages
Danh sách messages

**Query:**
- `page`, `limit`
- `contactId`: ObjectId
- `date`: 'YYYY-MM-DD'
- `region`: 'mb'|'mt'|'mn'
- `status`: 'pending'|'won'|'lost'|'error'

### GET /messages/:id
Chi tiết message

### POST /messages/parse
Parse nội dung tin nhắn (preview trước khi lưu)

**Body:**
```json
{
  "contactId": "ObjectId",
  "content": "string",
  "date": "date",
  "regions": ["mb", "mt", "mn"]
}
```

**Response:**
```json
{
  "success": true,
  "parsed": {
    "lines": [ /* parsed lines */ ],
    "stats": { /* statistics */ }
  }
}
```

### POST /messages
Tạo message (sau khi parse)

### PUT /messages/:id
Cập nhật message

### DELETE /messages/:id
Xóa message

### POST /messages/:id/process
Xử lý kết quả (check trúng/thua)

---

## LOTTERY RESULTS

### GET /lottery/results
Lấy kết quả xổ số

**Query:**
- `date`: 'DD-MM-YYYY' (default: hôm nay)
- `region`: 'mb'|'mt'|'mn'

**Response:**
```json
{
  "success": true,
  "data": {
    "mb": { /* kết quả Miền Bắc */ },
    "mt": { /* kết quả Miền Trung */ },
    "mn": { /* kết quả Miền Nam */ }
  }
}
```

### POST /lottery/crawl (Admin only)
Trigger crawl thủ công

---

## REVENUE

### GET /revenue/stats
Thống kê doanh thu

**Query:**
- `startDate`: 'YYYY-MM-DD'
- `endDate`: 'YYYY-MM-DD'
- `contactId`: ObjectId (optional)

**Response:**
```json
{
  "success": true,
  "data": {
    "totalBet": 15000000,
    "totalWin": 12000000,
    "profit": 3000000,
    "debt": 500000,
    "chartData": [
      { date: '2025-10-01', bet: 500000, win: 400000, profit: 100000 }
    ],
    "details": [ /* detailed list */ ]
  }
}
```

### GET /revenue/export
Xuất báo cáo Excel

---

## PAYMENT PACKAGES (Admin)

### GET /packages
Danh sách gói (public)

### GET /packages/:id
Chi tiết gói

### POST /packages
Tạo gói (Admin)

**Body:**
```json
{
  "name": "3 tháng",
  "months": 3,
  "price": 500000,
  "description": "Gói 3 tháng",
  "isActive": true,
  "order": 1
}
```

### PUT /packages/:id
Cập nhật gói (Admin)

### DELETE /packages/:id
Xóa gói (Admin)

---

## PAYMENT METHODS (Admin)

### GET /payment-methods
Danh sách phương thức (public)

### GET /payment-methods/:id
Chi tiết

### POST /payment-methods
Tạo phương thức (Admin)

**Body:**
```json
{
  "type": "bank",
  "bankName": "Vietcombank",
  "bankCode": "VCB",
  "accountNumber": "1234567890",
  "accountName": "NGUYEN VAN A",
  "transferContent": "MUA_[PHONE]",
  "qrCode": "url_or_path",
  "isActive": true,
  "order": 1
}
```

### PUT /payment-methods/:id
Cập nhật (Admin)

### DELETE /payment-methods/:id
Xóa (Admin)

---

## TRANSACTIONS

### GET /transactions
Danh sách giao dịch (Admin)

**Query:**
- `page`, `limit`
- `status`: 'pending'|'confirmed'|'rejected'
- `type`: 'purchase'|'renewal'

### GET /transactions/:id
Chi tiết

### POST /transactions
Tạo giao dịch mới (public)

**Body:**
```json
{
  "type": "purchase",
  "packageId": "ObjectId",
  "paymentMethodId": "ObjectId",
  "phone": "0901234567"
}
```

### PATCH /transactions/:id/confirm
Xác nhận giao dịch (Admin)

### PATCH /transactions/:id/reject
Từ chối giao dịch (Admin)

---

## PROFILE

### GET /profile
Thông tin cá nhân

### PUT /profile
Cập nhật thông tin

### PUT /profile/avatar
Upload avatar

**FormData:**
- `avatar`: file

### POST /profile/change-password
Đổi mật khẩu

**Body:**
```json
{
  "oldPassword": "string",
  "newPassword": "string"
}
```

---

## TELEGRAM SETTINGS (Admin)

### GET /telegram/settings
Lấy cấu hình

### PUT /telegram/settings
Cập nhật cấu hình

**Body:**
```json
{
  "botToken": "string",
  "botUsername": "string",
  "webhookUrl": "string",
  "isActive": true
}
```

### POST /telegram/test
Test gửi tin

---

## WEBSITE SETTINGS (Admin)

### GET /settings
Lấy cấu hình website (public cho SEO)

### PUT /settings
Cập nhật cấu hình (Admin)

---

## GUIDES

### GET /guides
Danh sách hướng dẫn

### GET /guides/:slug
Chi tiết hướng dẫn

### POST /guides (Admin)
Tạo hướng dẫn

### PUT /guides/:id (Admin)
Cập nhật

### DELETE /guides/:id (Admin)
Xóa

---

## RELEASES

### GET /releases
Danh sách tính năng mới

### GET /releases/:id
Chi tiết

### POST /releases (Admin)
Tạo release

### PUT /releases/:id (Admin)
Cập nhật

### DELETE /releases/:id (Admin)
Xóa

---

## APP DOWNLOADS

### GET /app-downloads
Danh sách links tải app

### GET /app-downloads/:id
Chi tiết

### POST /app-downloads (Admin)
Tạo link

### PUT /app-downloads/:id (Admin)
Cập nhật

### DELETE /app-downloads/:id (Admin)
Xóa

---

## FILE UPLOAD

### POST /upload
Upload file (avatar, qr code, logo, etc)

**FormData:**
- `file`: file
- `type`: 'avatar'|'qrcode'|'logo'|'image'

**Response:**
```json
{
  "success": true,
  "data": {
    "url": "/uploads/avatar/123.jpg",
    "filename": "123.jpg"
  }
}
```

---

## ERROR RESPONSES

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation error",
  "errors": {
    "username": "Username is required"
  }
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Unauthorized"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Access denied"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal server error"
}
```

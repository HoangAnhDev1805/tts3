# 🚀 QUICK START - 3DAIXS.COM

## Chạy hệ thống trong 5 phút!

### Bước 1: Cài đặt MongoDB

**Ubuntu/Debian:**
```bash
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
```

**MacOS:**
```bash
brew install mongodb-community
brew services start mongodb-community
```

**Kiểm tra:**
```bash
mongosh  # Nếu connect OK → MongoDB đã chạy!
```

---

### Bước 2: Chạy Backend

```bash
# Terminal 1: Backend
cd /opt/3daixs.com/backend
npm install
npm run seed   # Tạo admin: admin/admin123
npm run dev    # http://localhost:5000
```

**✅ Test Backend:**
```bash
curl http://localhost:5000/api/health
# {"success":true,"message":"API is running"}
```

---

### Bước 3: Chạy Frontend

```bash
# Terminal 2: Frontend
cd /opt/3daixs.com/frontend
npm install
npm run dev    # http://localhost:3000
```

---

### Bước 4: Đăng nhập

1. Mở trình duyệt: **http://localhost:3000**
2. Click **"Đăng nhập"**
3. Dùng credentials:
   - **Username:** `admin`
   - **Password:** `admin123`

Hoặc click **"Dùng thử miễn phí"** để tạo trial account tự động!

---

## 🎯 Demo Flows

### Flow 1: Login Admin
```
1. http://localhost:3000/login
2. Username: admin, Password: admin123
3. Click "Đăng nhập"
4. → Redirect to /admin (Admin Dashboard)
```

### Flow 2: Trial Account
```
1. http://localhost:3000/login
2. Click "Dùng thử miễn phí"
3. → Hệ thống tự tạo trial account (24h)
4. → Auto login và redirect to /dashboard
```

### Flow 3: Test API với cURL
```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Lưu token
export TOKEN="your_token_here"

# Get users
curl http://localhost:5000/api/users \
  -H "Authorization: Bearer $TOKEN"

# Get lottery today
curl http://localhost:5000/api/lottery/today
```

---

## 📊 Tính năng đã hoàn thành

### ✅ Backend (100%)
- [x] Authentication (Login, Trial, JWT)
- [x] User Management (CRUD, extend expiry)
- [x] Contact Management (CRUD, pricing config)
- [x] Message Parser (40 bet types)
- [x] Lottery Crawler (az24.vn, 3 regions)
- [x] Transaction Management (confirm/reject)
- [x] Real-time (Socket.IO)
- [x] Cron jobs (auto update, cleanup)

### ✅ Frontend (30%)
- [x] Login page với trial button
- [x] Dashboard page (basic)
- [x] Admin page (basic)
- [x] API client với auto-refresh token
- [x] UI Components (Button, Input, Card)
- [ ] Contacts page (TODO)
- [ ] Messages page (TODO)
- [ ] Revenue page (TODO)
- [ ] Modals (Purchase, Renewal, Expired)

---

## 🔥 Next Steps

### Để phát triển tiếp Frontend:

**1. Tạo thêm pages:**
```bash
cd /opt/3daixs.com/frontend
mkdir -p app/contacts app/messages app/revenue
```

**2. Install thêm dependencies (nếu cần):**
```bash
npm install @tanstack/react-query zustand recharts react-hook-form zod
```

**3. Setup Shadcn/UI (optional):**
```bash
npx shadcn-ui@latest init
npx shadcn-ui@latest add dialog table select badge
```

**4. Tham khảo docs:**
- `/opt/3daixs.com/docs/02-CHUC-NANG-USER.md` - Specs cho user pages
- `/opt/3daixs.com/docs/03-CHUC-NANG-ADMIN.md` - Specs cho admin pages
- `/opt/3daixs.com/TEST_API.md` - API endpoints

---

## 🐛 Troubleshooting

### Backend không start?
```bash
# Check MongoDB
sudo systemctl status mongod

# Check port 5000
lsof -i :5000

# Reset database
mongosh
use 3daixs
db.dropDatabase()
exit
npm run seed
```

### Frontend không build?
```bash
# Clear cache
rm -rf .next node_modules
npm install
npm run dev
```

### CORS Error?
Kiểm tra backend `.env`:
```env
CORS_ORIGIN=http://localhost:3000
```

---

## 📚 Documentation

- **INSTALLATION.md** - Hướng dẫn chi tiết
- **TEST_API.md** - Test 50+ API endpoints
- **FINAL_SUMMARY.md** - Tổng kết dự án
- **STATUS.md** - Chi tiết tiến độ

---

## ✅ Checklist

- [ ] MongoDB installed & running
- [ ] Backend `npm install` done
- [ ] Backend seeded (admin created)
- [ ] Backend running on port 5000
- [ ] Frontend `npm install` done
- [ ] Frontend running on port 3000
- [ ] Can login with admin/admin123
- [ ] Can create trial account

---

**🎉 Chúc mừng! Hệ thống đã chạy!**

**Support:**
- 📧 Email: support@3daixs.com
- 📖 Docs: `/opt/3daixs.com/docs/`

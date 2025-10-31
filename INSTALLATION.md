# HƯỚNG DẪN CÀI ĐẶT & CHẠY HỆ THỐNG 3DAIXS.COM

## YÊU CẦU HỆ THỐNG

- **Node.js**: >= 20.0.0
- **MongoDB**: >= 7.0
- **npm**: >= 10.0.0

---

## BƯỚC 1: CÀI ĐẶT MONGODB

### Ubuntu/Debian:
```bash
# Import MongoDB public key
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -

# Add MongoDB repository
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu $(lsb_release -cs)/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Update & Install
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
```

### MacOS:
```bash
brew tap mongodb/brew
brew install mongodb-community@7.0
brew services start mongodb-community@7.0
```

### Kiểm tra MongoDB:
```bash
mongosh
# Nếu kết nối thành công, MongoDB đã chạy!
```

---

## BƯỚC 2: SETUP BACKEND

```bash
cd /opt/3daixs.com/backend

# Install dependencies
npm install

# Copy .env
cp .env.example .env

# Edit .env file
nano .env
```

### Cấu hình .env (quan trọng):
```env
NODE_ENV=development
PORT=5000

# MongoDB (giữ nguyên nếu MongoDB chạy local)
MONGODB_URI=mongodb://localhost:27017/3daixs

# JWT (Thay đổi trong production!)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this

# CORS
CORS_ORIGIN=http://localhost:3000
```

### Seed database (tạo admin & dữ liệu mặc định):
```bash
npm run seed
```

✅ **Thông tin đăng nhập admin:**
- Username: `admin`
- Password: `admin123`

### Chạy Backend:
```bash
# Development mode (auto-reload)
npm run dev

# Production mode
npm start
```

Backend sẽ chạy tại: **http://localhost:5000**

---

## BƯỚC 3: SETUP FRONTEND

```bash
cd /opt/3daixs.com/frontend

# Install dependencies
npm install

# Copy .env.local
cp .env.local.example .env.local

# Edit .env.local
nano .env.local
```

### Cấu hình .env.local:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

### Chạy Frontend:
```bash
# Development mode
npm run dev

# Build production
npm run build
npm start
```

Frontend sẽ chạy tại: **http://localhost:3000**

---

## BƯỚC 4: TRUY CẬP HỆ THỐNG

### 1. Mở trình duyệt:
```
http://localhost:3000
```

### 2. Đăng nhập Admin:
- Username: `admin`
- Password: `admin123`

### 3. Hoặc dùng thử miễn phí:
- Click nút **"Dùng thử miễn phí"** trên trang login
- Hệ thống tự tạo tài khoản trial 24h

---

## KIỂM TRA HỆ THỐNG

### Backend API Health Check:
```bash
curl http://localhost:5000/api/health
# Response: {"success":true,"message":"API is running"}
```

### Kiểm tra MongoDB:
```bash
mongosh
use 3daixs
show collections
# Phải thấy: users, contacts, messages, etc.
```

### Logs:
- Backend logs: Terminal chạy `npm run dev`
- Frontend logs: Browser console (F12)

---

## CẤU TRÚC THƯ MỤC

```
/opt/3daixs.com/
├── backend/              # Node.js API
│   ├── src/
│   │   ├── models/       # MongoDB models
│   │   ├── controllers/  # Controllers
│   │   ├── services/     # Business logic
│   │   ├── routes/       # API routes
│   │   └── ...
│   ├── uploads/          # Uploaded files
│   ├── .env              # Backend config
│   └── server.js         # Entry point
│
├── frontend/             # Next.js UI
│   ├── app/              # Pages (App Router)
│   ├── components/       # React components
│   ├── lib/              # Utilities
│   ├── .env.local        # Frontend config
│   └── ...
│
└── docs/                 # Documentation
    ├── 01-TONG-QUAN-DU-AN.md
    ├── 02-CHUC-NANG-USER.md
    └── ...
```

---

## TÍNH NĂNG CHÍNH

### ✅ Đã hoàn thành:

**Backend:**
- ✅ Authentication (JWT) + Trial account
- ✅ User management (Admin)
- ✅ Contact management (CRUD + pricing config)
- ✅ Message parser (40 loại cược)
- ✅ Lottery crawler (az24.vn)
- ✅ Transaction management (countdown 10 phút)
- ✅ Socket.IO realtime
- ✅ Cron jobs (auto update lottery, cleanup)
- ✅ Payment packages & methods

**Frontend:**
- ⏳ Đang triển khai...

---

## TROUBLESHOOTING

### 1. MongoDB không chạy:
```bash
sudo systemctl status mongod
sudo systemctl start mongod
```

### 2. Port đã được sử dụng:
```bash
# Kiểm tra port 5000
lsof -i :5000
# Kill process
kill -9 <PID>
```

### 3. Backend không kết nối được MongoDB:
- Kiểm tra `MONGODB_URI` trong `.env`
- Đảm bảo MongoDB đang chạy
- Kiểm tra firewall

### 4. CORS Error trên Frontend:
- Kiểm tra `CORS_ORIGIN` trong backend `.env`
- Phải match với URL frontend

### 5. Cần reset database:
```bash
mongosh
use 3daixs
db.dropDatabase()
exit

cd /opt/3daixs.com/backend
npm run seed
```

---

## LIÊN HỆ & HỖ TRỢ

- **Email**: support@3daixs.com
- **Documentation**: `/opt/3daixs.com/docs/`

---

## PRODUCTION DEPLOYMENT

### Thay đổi cần thiết:

1. **Backend .env:**
   - Đổi `JWT_SECRET` và `JWT_REFRESH_SECRET`
   - Đổi `NODE_ENV=production`
   - Cấu hình SMTP cho email
   - Cấu hình domain thật

2. **Frontend .env.local:**
   - Đổi `NEXT_PUBLIC_API_URL` thành domain thật
   - Đổi `NEXT_PUBLIC_SOCKET_URL` thành domain thật

3. **MongoDB:**
   - Setup MongoDB cluster (MongoDB Atlas)
   - Hoặc cài đặt MongoDB trên server riêng
   - Enable authentication

4. **Nginx/Apache:**
   - Setup reverse proxy
   - SSL certificate (Let's Encrypt)

5. **PM2 (Process manager):**
```bash
npm install -g pm2
cd /opt/3daixs.com/backend
pm2 start server.js --name "3daixs-backend"
pm2 save
pm2 startup
```

---

**Chúc bạn triển khai thành công! 🚀**

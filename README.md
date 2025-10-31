# 🎰 3DAIXS.COM - Lottery Management System

Hệ thống quản lý xổ số tự động với Next.js + Node.js + MongoDB

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black)](https://nextjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20+-green)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.0-green)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## 📋 MỤC LỤC

- [Tính năng](#-tính-năng)
- [Tech Stack](#-tech-stack)
- [Yêu cầu hệ thống](#-yêu-cầu-hệ-thống)
- [Cài đặt](#-cài-đặt)
- [Chạy ứng dụng](#-chạy-ứng-dụng)
- [Deploy Production](#-deploy-production)
- [API Documentation](#-api-documentation)
- [Cấu trúc project](#-cấu-trúc-project)

---

## ✨ TÍNH NĂNG

### User Features
- ✅ Đăng nhập/đăng ký, Trial account
- ✅ Dashboard với thống kê
- ✅ Quản lý danh bạ (CRUD)
- ✅ Parse tin nhắn cược (40+ loại cược)
- ✅ Tính toán doanh thu tự động
- ✅ Xem kết quả xổ số real-time
- ✅ Upload avatar
- ✅ Đổi mật khẩu

### Admin Features
- ✅ Quản lý users (CRUD, block/unblock)
- ✅ Quản lý gói thanh toán
- ✅ Quản lý phương thức thanh toán (Bank, Momo, ZaloPay)
- ✅ Xác nhận/từ chối giao dịch
- ✅ Cấu hình Telegram bot
- ✅ Cấu hình website

### System Features
- ✅ Auto crawl kết quả từ az24.vn
- ✅ Socket.IO real-time updates
- ✅ Cron jobs tự động
- ✅ JWT authentication
- ✅ Role-based access control
- ✅ File upload (avatars, QR codes)
- ✅ MongoDB indexing

---

## 🛠️ TECH STACK

### Backend
- **Node.js** v20+ & Express.js
- **MongoDB** v7.0 (Mongoose ODM)
- **Socket.IO** - Real-time communication
- **JWT** - Authentication
- **Multer** - File upload
- **Node-cron** - Scheduled tasks
- **Axios + Cheerio** - Web scraping

### Frontend
- **Next.js** v14.2 (App Router)
- **TypeScript**
- **TailwindCSS** - Styling
- **Shadcn/UI** - UI components
- **TanStack Query** - Data fetching
- **Zustand** - State management
- **Socket.IO Client** - Real-time
- **Recharts** - Data visualization

### DevOps
- **Nginx** - Reverse proxy
- **PM2** - Process manager
- **Let's Encrypt** - SSL certificates

---

## 💻 YÊU CẦU HỆ THỐNG

- **OS**: Ubuntu 20.04+ / Linux
- **Node.js**: >= 20.0.0
- **NPM**: >= 10.0.0
- **MongoDB**: >= 7.0
- **Nginx**: >= 1.18 (production)
- **RAM**: >= 2GB
- **Disk**: >= 20GB

---

## 📦 CÀI ĐẶT

### 1. Clone Repository

```bash
git clone https://github.com/HoangAnhDev1805/tts3.git
cd tts3
```

### 2. Cài đặt MongoDB

```bash
# Import MongoDB public key
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -

# Add repository
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Install
sudo apt update
sudo apt install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
```

### 3. Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env file
nano .env
```

**File `.env` cần config:**
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/3daixs
JWT_SECRET=your-super-secret-key-change-this
JWT_REFRESH_SECRET=your-refresh-secret-key-change-this
CORS_ORIGIN=http://localhost:3000
```

**Seed database (tạo admin account):**
```bash
npm run seed
# Admin: admin / admin123
```

### 4. Setup Frontend

```bash
cd ../frontend

# Install dependencies
npm install

# Copy environment file
cp .env.local.example .env.local

# Edit .env.local
nano .env.local
```

**File `.env.local`:**
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

---

## 🚀 CHẠY ỨNG DỤNG

### Development Mode

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
# Chạy trên http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
# Chạy trên http://localhost:3000
```

### Hoặc dùng scripts có sẵn:

```bash
# Start tất cả
./start.sh

# Check status
./status.sh

# Stop tất cả
./stop.sh
```

### Truy cập

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **API Health**: http://localhost:5000/api/health

### Login Credentials

```
Username: admin
Password: admin123
```

---

## 🌐 DEPLOY PRODUCTION

### 1. Cài đặt Nginx

```bash
sudo apt install -y nginx
```

### 2. Setup SSL Certificate

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Generate SSL (domain phải trỏ về server)
sudo certbot certonly --standalone -d 3daixs.com -d www.3daixs.com
```

### 3. Config Nginx

```bash
# Copy config
sudo cp nginx.conf /etc/nginx/sites-available/3daixs.com

# Enable site
sudo ln -s /etc/nginx/sites-available/3daixs.com /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default

# Test config
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

### 4. Build Frontend

```bash
cd frontend
npm install --production
npm run build
```

### 5. Start với PM2

```bash
# Install PM2
sudo npm install -g pm2

# Start Backend
cd backend
pm2 start ecosystem.config.js

# Start Frontend
cd ../frontend
pm2 start npm --name "3daixs-frontend" -- start

# Save PM2
pm2 save
pm2 startup
```

### 6. Auto SSL Renewal

```bash
# Add to crontab
sudo crontab -e

# Add this line:
0 0 * * * certbot renew --quiet && systemctl reload nginx
```

### Chi tiết đầy đủ xem: [DEPLOYMENT.md](./DEPLOYMENT.md)

---

## 📚 API DOCUMENTATION

### Authentication

```bash
# Login
POST /api/auth/login
Body: { "username": "admin", "password": "admin123" }

# Register Trial
POST /api/auth/register-trial
Body: { "username": "demo", "password": "123456", "fullName": "Demo User" }

# Refresh Token
POST /api/auth/refresh
Body: { "refreshToken": "..." }
```

### Lottery

```bash
# Get today's lottery
GET /api/lottery/today

# Get by date
GET /api/lottery/date/:date

# Get by region
GET /api/lottery/region/:region
```

### Users (Auth required)

```bash
# Get profile
GET /api/users/me
Headers: { "Authorization": "Bearer <token>" }

# Update profile
PUT /api/users/me
Headers: { "Authorization": "Bearer <token>" }
Body: { "fullName": "New Name" }

# Upload avatar
POST /api/users/avatar
Headers: { "Authorization": "Bearer <token>" }
Body: FormData with "avatar" field
```

### Messages (Auth required)

```bash
# Parse message
POST /api/messages/parse
Headers: { "Authorization": "Bearer <token>" }
Body: { "content": "đầu 5 con 100" }

# Get parsed messages
GET /api/messages
Headers: { "Authorization": "Bearer <token>" }
```

### Chi tiết 50+ endpoints xem: [docs/05-API-ENDPOINTS.md](./docs/05-API-ENDPOINTS.md)

---

## 📁 CẤU TRÚC PROJECT

```
3daixs.com/
├── backend/                 # Node.js + Express API
│   ├── config/             # Database config
│   ├── controllers/        # Route controllers (8 files)
│   ├── middlewares/        # Auth, Role, Upload... (5 files)
│   ├── models/             # MongoDB models (12 files)
│   ├── routes/             # API routes (9 files)
│   ├── services/           # Business logic (3 files)
│   ├── uploads/            # User uploads
│   ├── utils/              # Helpers
│   ├── server.js           # Entry point
│   └── package.json
│
├── frontend/               # Next.js App
│   ├── app/               # Pages (App Router)
│   │   ├── login/         # Login page
│   │   ├── dashboard/     # User dashboard
│   │   ├── contacts/      # Contacts CRUD
│   │   ├── messages/      # Message parser
│   │   ├── revenue/       # Revenue stats
│   │   ├── profile/       # User profile
│   │   └── admin/         # Admin pages
│   │       ├── users/
│   │       ├── transactions/
│   │       ├── packages/
│   │       ├── payment-methods/
│   │       └── settings/
│   ├── components/        # Reusable components
│   │   ├── ui/           # Shadcn components (8)
│   │   ├── Layout/       # Sidebar, Header
│   │   └── Modals/       # Purchase, Renewal, Expired
│   ├── lib/              # Utils, API client
│   ├── types/            # TypeScript types
│   └── package.json
│
├── docs/                  # Documentation
│   ├── 01-TONG-QUAN-DU-AN.md
│   ├── 02-CHUC-NANG-USER.md
│   ├── 03-CHUC-NANG-ADMIN.md
│   ├── 04-DATABASE-SCHEMA.md
│   ├── 05-API-ENDPOINTS.md
│   └── 06-SO-DO-LUONG.md
│
├── ssl/                   # SSL certificates guide
│   └── README.md
│
├── nginx.conf             # Nginx configuration
├── start.sh               # Start script
├── stop.sh                # Stop script
├── status.sh              # Status check
├── DEPLOYMENT.md          # Deploy guide
└── README.md              # This file
```

---

## 🐛 TROUBLESHOOTING

### Frontend lỗi 500

```bash
# Check logs
pm2 logs 3daixs-frontend

# Rebuild
cd frontend
npm run build
pm2 restart 3daixs-frontend
```

### Backend không connect MongoDB

```bash
# Check MongoDB status
sudo systemctl status mongod

# Restart MongoDB
sudo systemctl restart mongod

# Check connection string trong .env
```

### Nginx lỗi 502

```bash
# Check backend có chạy không
curl http://localhost:5000/api/health

# Check frontend có chạy không
curl http://localhost:3000

# Restart services
pm2 restart all
```

### Upload ảnh lỗi 404

```bash
# Check permissions
ls -la /opt/3daixs.com/backend/uploads/
sudo chown -R $USER:$USER /opt/3daixs.com/backend/uploads
chmod -R 755 /opt/3daixs.com/backend/uploads
```

---

## 📖 DOCUMENTATION

- [Tổng quan dự án](./docs/01-TONG-QUAN-DU-AN.md)
- [Chức năng User](./docs/02-CHUC-NANG-USER.md)
- [Chức năng Admin](./docs/03-CHUC-NANG-ADMIN.md)
- [Database Schema](./docs/04-DATABASE-SCHEMA.md)
- [API Endpoints](./docs/05-API-ENDPOINTS.md)
- [Sơ đồ luồng](./docs/06-SO-DO-LUONG.md)
- [Deployment Guide](./DEPLOYMENT.md)

---

## 🤝 CONTRIBUTING

Pull requests are welcome! For major changes, please open an issue first.

---

## 📝 LICENSE

MIT License - see [LICENSE](LICENSE) file

---

## 📧 CONTACT

- **Author**: HoangAnhDev1805
- **GitHub**: https://github.com/HoangAnhDev1805
- **Email**: support@3daixs.com

---

## 🎉 CREDITS

- [Next.js](https://nextjs.org/)
- [Express.js](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Shadcn/UI](https://ui.shadcn.com/)
- [TailwindCSS](https://tailwindcss.com/)

---

**Made with ❤️ in Vietnam**

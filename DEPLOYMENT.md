# 🚀 DEPLOYMENT GUIDE - 3DAIXS.COM

Hướng dẫn deploy production với Nginx, SSL, và PM2.

---

## 📋 YÊU CẦU HỆ THỐNG

### Server Requirements
- Ubuntu 20.04 LTS hoặc cao hơn
- Node.js >= 20.0.0
- MongoDB >= 7.0
- Nginx >= 1.18
- Domain name (3daixs.com)
- RAM >= 2GB
- Disk >= 20GB

---

## 🔧 BƯỚC 1: CÀI ĐẶT CƠ BẢN

### 1.1. Update hệ thống
```bash
sudo apt update && sudo apt upgrade -y
```

### 1.2. Cài Node.js 20
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
node --version  # Should be v20.x.x
npm --version   # Should be v10.x.x
```

### 1.3. Cài MongoDB
```bash
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt update
sudo apt install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod
sudo systemctl status mongod
```

### 1.4. Cài Nginx
```bash
sudo apt install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx
sudo systemctl status nginx
```

### 1.5. Cài PM2 (Process Manager)
```bash
sudo npm install -g pm2
pm2 startup
# Copy và chạy command mà PM2 suggest
```

---

## 📁 BƯỚC 2: SETUP PROJECT

### 2.1. Clone/Upload code
```bash
# Nếu code đã có sẵn tại /opt/3daixs.com thì skip bước này
# Nếu cần clone từ Git:
cd /opt
git clone <your-repo-url> 3daixs.com
cd 3daixs.com
```

### 2.2. Tạo thư mục uploads
```bash
cd /opt/3daixs.com/backend
mkdir -p uploads/avatars
mkdir -p uploads/qrcodes
mkdir -p logs

# Set permissions
sudo chown -R $USER:$USER /opt/3daixs.com
chmod -R 755 /opt/3daixs.com/backend/uploads
```

### 2.3. Setup Backend
```bash
cd /opt/3daixs.com/backend
npm install --production

# Copy và config .env
cp .env.example .env
nano .env
```

**File `.env` production:**
```env
# Server
NODE_ENV=production
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/3daixs

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-in-production
JWT_EXPIRES_IN=1d
JWT_REFRESH_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=https://3daixs.com

# Upload
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=5242880

# API
API_URL=https://az24.vn

# Optional: SMTP for emails
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Optional: Telegram
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=
```

### 2.4. Seed Database
```bash
npm run seed
```

### 2.5. Setup Frontend
```bash
cd /opt/3daixs.com/frontend
npm install --production

# Copy và config .env.local
cp .env.local.example .env.local
nano .env.local
```

**File `.env.local` production:**
```env
NEXT_PUBLIC_API_URL=https://3daixs.com/api
NEXT_PUBLIC_SOCKET_URL=https://3daixs.com
```

### 2.6. Build Frontend
```bash
npm run build
```

---

## 🔐 BƯỚC 3: SETUP SSL (Let's Encrypt)

### 3.1. Cài Certbot
```bash
sudo apt install -y certbot python3-certbot-nginx
```

### 3.2. Stop Nginx tạm thời
```bash
sudo systemctl stop nginx
```

### 3.3. Generate SSL Certificate
```bash
sudo certbot certonly --standalone -d 3daixs.com -d www.3daixs.com
```

**Lưu ý:** Bạn cần:
- Nhập email
- Agree terms
- Domain phải trỏ đúng về IP server

Certificates sẽ được lưu tại:
- `/etc/letsencrypt/live/3daixs.com/fullchain.pem`
- `/etc/letsencrypt/live/3daixs.com/privkey.pem`

### 3.4. Auto-renew SSL
```bash
sudo certbot renew --dry-run

# Setup cron job
sudo crontab -e
# Add dòng này:
0 0 * * * certbot renew --quiet && systemctl reload nginx
```

---

## 🌐 BƯỚC 4: SETUP NGINX

### 4.1. Copy config file
```bash
sudo cp /opt/3daixs.com/nginx.conf /etc/nginx/sites-available/3daixs.com
sudo ln -s /etc/nginx/sites-available/3daixs.com /etc/nginx/sites-enabled/
```

### 4.2. Remove default config
```bash
sudo rm /etc/nginx/sites-enabled/default
```

### 4.3. Test Nginx config
```bash
sudo nginx -t
```

Nếu OK, sẽ hiện:
```
nginx: configuration file /etc/nginx/nginx.conf test is successful
```

### 4.4. Restart Nginx
```bash
sudo systemctl restart nginx
```

---

## ⚡ BƯỚC 5: START SERVICES VỚI PM2

### 5.1. Start Backend
```bash
cd /opt/3daixs.com/backend
pm2 start ecosystem.config.js
pm2 save
```

### 5.2. Start Frontend
```bash
cd /opt/3daixs.com/frontend
pm2 start npm --name "3daixs-frontend" -- start
pm2 save
```

### 5.3. Check status
```bash
pm2 list
pm2 logs
```

---

## 🔍 BƯỚC 6: VERIFY DEPLOYMENT

### 6.1. Check services
```bash
# MongoDB
sudo systemctl status mongod

# Nginx
sudo systemctl status nginx

# PM2 processes
pm2 status
```

### 6.2. Test URLs
```bash
# Health check
curl https://3daixs.com/health

# API
curl https://3daixs.com/api/lottery/today

# Frontend
curl -I https://3daixs.com
```

### 6.3. Test trong browser
- https://3daixs.com - Frontend
- https://3daixs.com/api/health - API health
- https://3daixs.com/login - Login page

---

## 📤 UPLOAD & HIỂN THỊ ẢNH

### Cấu trúc thư mục uploads
```
/opt/3daixs.com/backend/uploads/
├── avatars/           # User avatars
└── qrcodes/           # Payment QR codes
```

### Upload API Endpoint
```javascript
// Backend đã có sẵn middleware upload
// POST /api/users/avatar
// POST /api/payment-methods/:id/qr
```

### Frontend upload example
```javascript
const handleUploadAvatar = async (file) => {
  const formData = new FormData();
  formData.append('avatar', file);
  
  const response = await api.post('/users/avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  
  return response.data.data.avatar; // URL: /uploads/avatars/xxx.jpg
};
```

### Hiển thị ảnh
```jsx
// Trong component
<img 
  src={`https://3daixs.com${user.avatar}`} 
  alt="Avatar" 
/>

// Hoặc
<img 
  src={`https://3daixs.com/uploads/avatars/${filename}`} 
  alt="Avatar" 
/>
```

### Test upload
```bash
# Upload avatar
curl -X POST https://3daixs.com/api/users/avatar \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "avatar=@/path/to/image.jpg"

# Access image
curl -I https://3daixs.com/uploads/avatars/xxx.jpg
```

---

## 🔒 SECURITY CHECKLIST

- [x] SSL/TLS enabled (HTTPS)
- [x] File upload size limit (10MB)
- [x] Only allow image files in uploads
- [x] Deny access to hidden files
- [x] Security headers (HSTS, X-Frame-Options, etc.)
- [x] MongoDB authentication (nên enable)
- [x] Firewall setup (UFW)
- [x] Regular backups
- [x] Strong JWT secrets
- [x] CORS properly configured

### Setup Firewall (Optional)
```bash
sudo ufw allow 22/tcp      # SSH
sudo ufw allow 80/tcp      # HTTP
sudo ufw allow 443/tcp     # HTTPS
sudo ufw enable
sudo ufw status
```

### Enable MongoDB Authentication (Recommended)
```bash
mongosh
use admin
db.createUser({
  user: "admin",
  pwd: "strong-password",
  roles: ["root"]
})

use 3daixs
db.createUser({
  user: "3daixs_user",
  pwd: "strong-password",
  roles: [{role: "readWrite", db: "3daixs"}]
})
exit

# Edit MongoDB config
sudo nano /etc/mongod.conf
# Uncomment security section:
security:
  authorization: enabled

# Restart MongoDB
sudo systemctl restart mongod

# Update .env
MONGODB_URI=mongodb://3daixs_user:strong-password@localhost:27017/3daixs
```

---

## 📊 MONITORING & LOGS

### PM2 Monitoring
```bash
# Real-time monitoring
pm2 monit

# Logs
pm2 logs
pm2 logs 3daixs-backend
pm2 logs 3daixs-frontend

# Flush logs
pm2 flush
```

### Nginx Logs
```bash
# Access logs
sudo tail -f /var/log/nginx/3daixs_access.log

# Error logs
sudo tail -f /var/log/nginx/3daixs_error.log
```

### Application Logs
```bash
# Backend logs
tail -f /opt/3daixs.com/backend/logs/combined.log

# MongoDB logs
sudo tail -f /var/log/mongodb/mongod.log
```

---

## 🔄 UPDATE & MAINTENANCE

### Update code
```bash
cd /opt/3daixs.com
git pull  # Hoặc upload code mới

# Update backend
cd backend
npm install --production
pm2 restart 3daixs-backend

# Update frontend
cd ../frontend
npm install --production
npm run build
pm2 restart 3daixs-frontend
```

### Backup Database
```bash
# Backup
mongodump --db 3daixs --out /backup/$(date +%Y%m%d)

# Restore
mongorestore --db 3daixs /backup/20251030/3daixs
```

### PM2 Auto-start after reboot
```bash
pm2 startup
pm2 save
```

---

## 🆘 TROUBLESHOOTING

### Frontend không load
```bash
pm2 logs 3daixs-frontend
pm2 restart 3daixs-frontend
```

### API không hoạt động
```bash
pm2 logs 3daixs-backend
# Check MongoDB
sudo systemctl status mongod
# Check Nginx
sudo nginx -t
sudo systemctl restart nginx
```

### Upload ảnh lỗi 404
```bash
# Check permissions
ls -la /opt/3daixs.com/backend/uploads/
sudo chown -R $USER:$USER /opt/3daixs.com/backend/uploads
chmod -R 755 /opt/3daixs.com/backend/uploads
```

### SSL certificate lỗi
```bash
sudo certbot renew --force-renewal
sudo systemctl reload nginx
```

### Out of memory
```bash
# Increase PM2 memory limit
pm2 delete 3daixs-backend
# Edit ecosystem.config.js, increase max_memory_restart
pm2 start ecosystem.config.js
```

---

## 📝 USEFUL COMMANDS

```bash
# PM2
pm2 list                    # List all processes
pm2 restart all             # Restart all
pm2 stop all                # Stop all
pm2 delete all              # Delete all
pm2 logs --lines 100        # View logs

# Nginx
sudo systemctl restart nginx
sudo systemctl reload nginx
sudo nginx -t

# MongoDB
sudo systemctl restart mongod
mongosh

# System
df -h                       # Disk usage
free -h                     # Memory usage
htop                        # Resource monitor
```

---

## 🎉 DEPLOYMENT COMPLETE!

Sau khi hoàn thành các bước trên:

✅ Website chạy tại: **https://3daixs.com**  
✅ API endpoint: **https://3daixs.com/api**  
✅ Upload ảnh: **https://3daixs.com/uploads/**  
✅ SSL enabled (HTTPS)  
✅ Auto-restart on crash  
✅ Auto-start on reboot  
✅ Nginx reverse proxy  
✅ Production-ready  

---

**Chúc mừng! Hệ thống đã sẵn sàng phục vụ!** 🚀

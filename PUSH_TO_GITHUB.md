# 📤 Hướng dẫn Push Code lên GitHub

## Bước 1: Chuẩn bị

```bash
cd /opt/3daixs.com

# Kiểm tra Git đã cài chưa
git --version

# Nếu chưa có, cài Git
sudo apt install -y git
```

## Bước 2: Cấu hình Git (lần đầu)

```bash
# Set username
git config --global user.name "HoangAnhDev1805"

# Set email
git config --global user.email "your-email@gmail.com"

# Check config
git config --list
```

## Bước 3: Khởi tạo Git Repository

```bash
cd /opt/3daixs.com

# Initialize git
git init

# Add remote repository
git remote add origin https://github.com/HoangAnhDev1805/tts3.git

# Check remote
git remote -v
```

## Bước 4: Xóa file không cần thiết

```bash
# Xóa node_modules
rm -rf backend/node_modules
rm -rf frontend/node_modules

# Xóa build files
rm -rf frontend/.next
rm -rf frontend/out

# Xóa .env (giữ .env.example)
rm -f backend/.env
rm -f frontend/.env.local

# Xóa logs
rm -rf backend/logs/*.log
rm -f /tmp/*.log

# Xóa uploads (giữ folder structure)
rm -rf backend/uploads/avatars/*
rm -rf backend/uploads/qrcodes/*

# Keep .gitkeep files
touch backend/uploads/avatars/.gitkeep
touch backend/uploads/qrcodes/.gitkeep
```

## Bước 5: Add files

```bash
# Add all files (Git sẽ ignore theo .gitignore)
git add .

# Check status
git status

# Check những file sẽ được commit
git status --short
```

## Bước 6: Commit

```bash
# First commit
git commit -m "Initial commit: 3DAIXS Lottery System

- ✅ Backend: Node.js + Express + MongoDB (90+ files)
- ✅ Frontend: Next.js 14 + TypeScript + TailwindCSS (45+ files)
- ✅ Full CRUD operations
- ✅ Real-time Socket.IO
- ✅ JWT Authentication
- ✅ Admin Panel
- ✅ Deployment configs (Nginx + PM2)
- ✅ Complete documentation
"
```

## Bước 7: Push lên GitHub

### Nếu repository TRỐNG (lần đầu):

```bash
# Push to main branch
git branch -M main
git push -u origin main
```

### Nếu repository ĐÃ CÓ CODE:

```bash
# Pull trước
git pull origin main --allow-unrelated-histories

# Nếu có conflict, resolve rồi:
git add .
git commit -m "Merge with existing code"

# Push
git push origin main
```

## Bước 8: Verify

```bash
# Check branch
git branch

# Check log
git log --oneline

# Check remote
git remote show origin
```

Sau đó truy cập: https://github.com/HoangAnhDev1805/tts3

---

## 🔐 Authentication

### Option 1: HTTPS với Personal Access Token

1. Vào GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token với quyền `repo`
3. Copy token
4. Khi push, dùng token làm password:
   - Username: HoangAnhDev1805
   - Password: ghp_xxxxxxxxxxxxx (token)

### Option 2: SSH Key

```bash
# Generate SSH key
ssh-keygen -t ed25519 -C "your-email@gmail.com"

# Copy public key
cat ~/.ssh/id_ed25519.pub

# Add vào GitHub → Settings → SSH Keys

# Change remote to SSH
git remote set-url origin git@github.com:HoangAnhDev1805/tts3.git

# Push
git push -u origin main
```

---

## ⚠️ LƯU Ý QUAN TRỌNG

### ❌ KHÔNG push những file sau:

- `node_modules/` - Quá lớn, có thể cài lại
- `.env` - Chứa secrets
- `backend/uploads/*` - Files người dùng upload
- `frontend/.next/` - Build files
- `*.log` - Log files
- SSL certificates (`.pem`, `.key`)

### ✅ NÊN push:

- Source code (`.js`, `.ts`, `.tsx`)
- Config files (`.json`, `.config.js`)
- Documentation (`.md`)
- `.gitignore`
- `.env.example` (template không có secrets)

---

## 🔄 Update Code sau này

```bash
# Pull changes từ GitHub
git pull origin main

# Make changes...

# Add changes
git add .

# Commit
git commit -m "Update: Your description here"

# Push
git push origin main
```

---

## 🆘 Troubleshooting

### Lỗi: Permission denied

```bash
# Check remote URL
git remote -v

# Đảm bảo dùng HTTPS hoặc SSH đúng
```

### Lỗi: Repository not found

```bash
# Check repository tồn tại chưa
# Nếu chưa, tạo repository trên GitHub trước

# Update remote URL
git remote set-url origin https://github.com/HoangAnhDev1805/tts3.git
```

### Lỗi: Large files

```bash
# Check file size
du -sh backend/node_modules

# Xóa và add vào .gitignore
rm -rf backend/node_modules
echo "node_modules/" >> .gitignore
git add .gitignore
git commit -m "Add node_modules to gitignore"
```

### Lỗi: Merge conflict

```bash
# Xem conflict files
git status

# Edit files để resolve conflict
# Sau đó:
git add .
git commit -m "Resolve merge conflicts"
git push origin main
```

---

## 📋 Quick Commands Checklist

```bash
# 1. Chuẩn bị
cd /opt/3daixs.com
git init
git remote add origin https://github.com/HoangAnhDev1805/tts3.git

# 2. Cleanup
rm -rf backend/node_modules frontend/node_modules
rm -rf frontend/.next
rm -f backend/.env frontend/.env.local

# 3. Add & Commit
git add .
git commit -m "Initial commit"

# 4. Push
git branch -M main
git push -u origin main
```

---

**Done! Code đã được push lên GitHub** 🎉

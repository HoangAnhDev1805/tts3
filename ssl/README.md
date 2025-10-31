# 🔐 SSL Certificate Setup Guide

Hướng dẫn setup SSL certificate cho 3daixs.com

---

## 📋 YÊU CẦU

- Domain name đã trỏ về IP server
- Port 80 và 443 đã mở
- Nginx đã cài đặt

---

## 🚀 CÁCH 1: Sử dụng Let's Encrypt (FREE)

### 1. Cài đặt Certbot

```bash
sudo apt update
sudo apt install -y certbot python3-certbot-nginx
```

### 2. Generate SSL Certificate

```bash
# Stop Nginx tạm thời
sudo systemctl stop nginx

# Generate certificate
sudo certbot certonly --standalone -d 3daixs.com -d www.3daixs.com

# Start Nginx lại
sudo systemctl start nginx
```

### 3. Kết quả

Certificates sẽ được lưu tại:
```
/etc/letsencrypt/live/3daixs.com/fullchain.pem
/etc/letsencrypt/live/3daixs.com/privkey.pem
```

### 4. Auto-renewal

```bash
# Test renewal
sudo certbot renew --dry-run

# Setup cron job
sudo crontab -e

# Add this line:
0 0 * * * certbot renew --quiet && systemctl reload nginx
```

---

## 🚀 CÁCH 2: Upload SSL Certificate có sẵn

Nếu bạn đã mua SSL certificate từ nhà cung cấp khác:

### 1. Tạo thư mục

```bash
sudo mkdir -p /etc/ssl/3daixs.com
```

### 2. Upload files

Upload 2 file sau lên server:
- `fullchain.pem` hoặc `certificate.crt` (public certificate)
- `privkey.pem` hoặc `private.key` (private key)

```bash
# Copy files
sudo cp /path/to/your/certificate.crt /etc/ssl/3daixs.com/fullchain.pem
sudo cp /path/to/your/private.key /etc/ssl/3daixs.com/privkey.pem

# Set permissions
sudo chmod 644 /etc/ssl/3daixs.com/fullchain.pem
sudo chmod 600 /etc/ssl/3daixs.com/privkey.pem
```

### 3. Update Nginx config

Edit `/etc/nginx/sites-available/3daixs.com`:

```nginx
ssl_certificate /etc/ssl/3daixs.com/fullchain.pem;
ssl_certificate_key /etc/ssl/3daixs.com/privkey.pem;
```

### 4. Reload Nginx

```bash
sudo nginx -t
sudo systemctl reload nginx
```

---

## 🧪 KIỂM TRA SSL

### 1. Test trong terminal

```bash
# Check certificate
openssl s_client -connect 3daixs.com:443 -servername 3daixs.com

# Check expiry date
echo | openssl s_client -connect 3daixs.com:443 2>/dev/null | openssl x509 -noout -dates
```

### 2. Test trong browser

Truy cập: https://3daixs.com

Kiểm tra:
- ✅ Có icon khóa bên cạnh URL
- ✅ Certificate hợp lệ
- ✅ Không có cảnh báo

### 3. Test online

- [SSL Labs](https://www.ssllabs.com/ssltest/)
- [SSL Checker](https://www.sslshopper.com/ssl-checker.html)

---

## 🔧 TROUBLESHOOTING

### Lỗi: Certificate not found

```bash
# Check file tồn tại
ls -la /etc/letsencrypt/live/3daixs.com/

# Hoặc
ls -la /etc/ssl/3daixs.com/
```

### Lỗi: Permission denied

```bash
sudo chmod 644 /etc/letsencrypt/live/3daixs.com/fullchain.pem
sudo chmod 600 /etc/letsencrypt/live/3daixs.com/privkey.pem
```

### Lỗi: SSL test failed

```bash
# Check Nginx config
sudo nginx -t

# Check Nginx error log
sudo tail -f /var/log/nginx/error.log
```

### Certificate expired

```bash
# Renew manually
sudo certbot renew

# Reload Nginx
sudo systemctl reload nginx
```

---

## 📊 SSL Configuration Best Practices

File `nginx.conf` đã include các best practices:

```nginx
# SSL Protocols
ssl_protocols TLSv1.2 TLSv1.3;
ssl_ciphers HIGH:!aNULL:!MD5;
ssl_prefer_server_ciphers on;

# SSL Session
ssl_session_cache shared:SSL:10m;
ssl_session_timeout 10m;

# Security Headers
add_header Strict-Transport-Security "max-age=31536000" always;
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
```

---

## 🔐 Backup SSL Certificates

### Backup Let's Encrypt

```bash
sudo tar -czf letsencrypt-backup.tar.gz /etc/letsencrypt/
```

### Backup Custom SSL

```bash
sudo tar -czf ssl-backup.tar.gz /etc/ssl/3daixs.com/
```

### Restore

```bash
sudo tar -xzf letsencrypt-backup.tar.gz -C /
# Hoặc
sudo tar -xzf ssl-backup.tar.gz -C /
```

---

## ⏰ SSL Certificate Renewal Timeline

### Let's Encrypt
- **Validity**: 90 days
- **Renew**: 60 days before expiry
- **Auto-renew**: Daily cron job

### Commercial SSL
- **Validity**: 1-3 years
- **Renew**: Manual renewal required

---

## 📝 Notes

1. **Không commit private key lên Git!**
2. Keep private key secure (chmod 600)
3. Backup certificates thường xuyên
4. Monitor expiry date
5. Test renewal process

---

## 🆘 Cần hỗ trợ?

- [Let's Encrypt Documentation](https://letsencrypt.org/docs/)
- [Certbot Instructions](https://certbot.eff.org/)
- [Nginx SSL Documentation](https://nginx.org/en/docs/http/configuring_https_servers.html)

---

**⚠️ QUAN TRỌNG**: Tuyệt đối KHÔNG share private key với bất kỳ ai!

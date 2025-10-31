# 🧪 TEST API ENDPOINTS

## Setup

```bash
# Start backend
cd /opt/3daixs.com/backend
npm install
npm run seed
npm run dev
```

Backend running at: **http://localhost:5000**

---

## 1. ✅ Health Check

```bash
curl http://localhost:5000/api/health
```

**Response:**
```json
{"success":true,"message":"API is running"}
```

---

## 2. 🔐 Authentication

### Login Admin
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {...},
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  }
}
```

**Save token:**
```bash
export TOKEN="your_access_token_here"
```

### Create Trial Account
```bash
curl -X POST http://localhost:5000/api/auth/trial
```

---

## 3. 👥 Users (Admin only)

### Get All Users
```bash
curl http://localhost:5000/api/users \
  -H "Authorization: Bearer $TOKEN"
```

### Get User Stats
```bash
curl http://localhost:5000/api/users/stats \
  -H "Authorization: Bearer $TOKEN"
```

---

## 4. 📇 Contacts

### Get All Contacts
```bash
curl http://localhost:5000/api/contacts \
  -H "Authorization: Bearer $TOKEN"
```

### Create Contact
```bash
curl -X POST http://localhost:5000/api/contacts \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Nguyễn Văn A",
    "phone": "0901234567",
    "address": "Hà Nội",
    "status": "active"
  }'
```

---

## 5. 💬 Messages

### Parse Message (Preview)
```bash
curl -X POST http://localhost:5000/api/messages/parse \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "contactId": "contact_id_here",
    "content": "dc 12 34 56 lo10",
    "date": "2024-01-15",
    "regions": ["mb"]
  }'
```

### Create Message
```bash
curl -X POST http://localhost:5000/api/messages \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "contactId": "contact_id_here",
    "content": "dc 12 34 56 lo10",
    "date": "2024-01-15",
    "regions": ["mb"],
    "parsed": {...}
  }'
```

---

## 6. 🎰 Lottery

### Get Today Results
```bash
curl http://localhost:5000/api/lottery/today
```

### Get Latest Results (7 days)
```bash
curl http://localhost:5000/api/lottery/latest
```

### Get By Date
```bash
curl http://localhost:5000/api/lottery/date/15-01-2024
```

### Crawl Results (Admin only)
```bash
curl -X POST http://localhost:5000/api/lottery/crawl \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "date": "15-01-2024"
  }'
```

---

## 7. 💳 Payment Packages

### Get All Packages
```bash
curl http://localhost:5000/api/packages
```

### Create Package (Admin)
```bash
curl -X POST http://localhost:5000/api/packages \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "6 tháng",
    "months": 6,
    "price": 900000,
    "description": "Gói 6 tháng sử dụng",
    "isActive": true,
    "order": 2
  }'
```

---

## 8. 💰 Payment Methods

### Get All Methods
```bash
curl http://localhost:5000/api/payment-methods
```

---

## 9. 📋 Transactions

### Create Transaction (Purchase)
```bash
curl -X POST http://localhost:5000/api/transactions \
  -H "Content-Type: application/json" \
  -d '{
    "type": "purchase",
    "packageId": "package_id_here",
    "paymentMethodId": "method_id_here",
    "phone": "0901234567"
  }'
```

### Get All Transactions (Admin)
```bash
curl http://localhost:5000/api/transactions \
  -H "Authorization: Bearer $TOKEN"
```

### Get Transaction Stats
```bash
curl http://localhost:5000/api/transactions/stats \
  -H "Authorization: Bearer $TOKEN"
```

### Confirm Transaction (Admin)
```bash
curl -X PATCH http://localhost:5000/api/transactions/transaction_id/confirm \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "notes": "Đã thanh toán"
  }'
```

### Reject Transaction (Admin)
```bash
curl -X PATCH http://localhost:5000/api/transactions/transaction_id/reject \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "rejectionReason": "Sai nội dung chuyển khoản"
  }'
```

---

## 10. ⚙️ Settings

### Get Website Settings
```bash
curl http://localhost:5000/api/settings/website
```

### Update Website Settings (Admin)
```bash
curl -X PATCH http://localhost:5000/api/settings/website \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "3DAIXS.COM - Updated",
    "description": "New description"
  }'
```

---

## 📊 Test Flow Example

```bash
# 1. Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}' \
  | jq -r '.data.accessToken' > token.txt

export TOKEN=$(cat token.txt)

# 2. Get packages
curl http://localhost:5000/api/packages | jq

# 3. Get payment methods
curl http://localhost:5000/api/payment-methods | jq

# 4. Create transaction
curl -X POST http://localhost:5000/api/transactions \
  -H "Content-Type: application/json" \
  -d '{
    "type":"purchase",
    "packageId":"package_id",
    "paymentMethodId":"method_id",
    "phone":"0901234567"
  }' | jq

# 5. Get all transactions (Admin)
curl http://localhost:5000/api/transactions \
  -H "Authorization: Bearer $TOKEN" | jq

# 6. Get lottery today
curl http://localhost:5000/api/lottery/today | jq
```

---

## 🔍 Tips

### Using jq (JSON formatter)
```bash
# Install jq
sudo apt install jq  # Ubuntu/Debian
brew install jq      # MacOS

# Pretty print responses
curl ... | jq
```

### Save token to file
```bash
# Login and save token
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}' \
  | jq -r '.data.accessToken' > token.txt

# Use token
export TOKEN=$(cat token.txt)
```

### Check MongoDB data
```bash
mongosh
use 3daixs
db.users.find().pretty()
db.transactions.find().pretty()
```

---

**✅ Backend API is fully functional and ready for testing!**

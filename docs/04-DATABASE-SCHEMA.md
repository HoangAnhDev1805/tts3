# CẤU TRÚC DATABASE MONGODB

> Schema collections và relationships

---

## 1. USERS COLLECTION

```javascript
{
  _id: ObjectId,
  username: String, // unique, required
  password: String, // bcrypt hashed
  email: String,
  phone: String,
  fullName: String,
  avatar: String, // URL hoặc path
  role: String, // enum: ['trial', 'user', 'admin']
  status: String, // enum: ['active', 'locked', 'expired']
  startDate: Date,
  expiryDate: Date,
  createdAt: Date,
  updatedAt: Date,
  lastLogin: Date,
  notes: String
}

// Indexes
username: unique
email: 1
role: 1
status: 1
expiryDate: 1
```

---

## 2. CONTACTS COLLECTION

```javascript
{
  _id: ObjectId,
  userId: ObjectId, // ref: users
  fullName: String, // required
  phone: String, // required
  address: String,
  notes: String,
  status: String, // enum: ['active', 'locked']
  debt: Number, // default: 0
  
  // Cấu hình tính tiền cho 40 loại cược × 3 miền
  pricingConfig: {
    // Miền Bắc
    mb: {
      de: { giaBan: Number, tienThang: Number },
      dau: { giaBan: Number, tienThang: Number },
      duoi: { giaBan: Number, tienThang: Number },
      dauduoi: { giaBan: Number, tienThang: Number },
      lo: { giaBan: Number, tienThang: Number },
      xiu_chu: { giaBan: Number, tienThang: Number },
      xiu_chu_dau: { giaBan: Number, tienThang: Number },
      xiu_chu_duoi: { giaBan: Number, tienThang: Number },
      da: { giaBan: Number, tienThang: Number },
      da_xien: { giaBan: Number, tienThang: Number },
      bay_lo: { giaBan: Number, tienThang: Number },
      tam_lo: { giaBan: Number, tienThang: Number },
      bay_lo_dao: { giaBan: Number, tienThang: Number },
      tam_lo_dao: { giaBan: Number, tienThang: Number },
      xiu_chu_dao_dau: { giaBan: Number, tienThang: Number },
      xiu_chu_dao_duoi: { giaBan: Number, tienThang: Number },
      keo: { giaBan: Number, tienThang: Number },
      chan: { giaBan: Number, tienThang: Number },
      le: { giaBan: Number, tienThang: Number },
      chan_chan: { giaBan: Number, tienThang: Number },
      le_le: { giaBan: Number, tienThang: Number },
      chan_le: { giaBan: Number, tienThang: Number },
      le_chan: { giaBan: Number, tienThang: Number },
      giap: { giaBan: Number, tienThang: Number },
      dai_2: { giaBan: Number, tienThang: Number },
      dai_3: { giaBan: Number, tienThang: Number },
      dai_4: { giaBan: Number, tienThang: Number },
      de_dau_db: { giaBan: Number, tienThang: Number },
      de_dau_g1: { giaBan: Number, tienThang: Number },
      de_giai1: { giaBan: Number, tienThang: Number },
      xien2: { giaBan: Number, tienThang: Number },
      xien3: { giaBan: Number, tienThang: Number },
      xien4: { giaBan: Number, tienThang: Number },
      de_giap: { giaBan: Number, tienThang: Number },
      de_dan: { giaBan: Number, tienThang: Number },
      de_tong: { giaBan: Number, tienThang: Number },
      de_dau_duoi: { giaBan: Number, tienThang: Number },
      de_chan_le: { giaBan: Number, tienThang: Number },
      de_he: { giaBan: Number, tienThang: Number },
      de_co_so: { giaBan: Number, tienThang: Number },
      de_kep: { giaBan: Number, tienThang: Number }
    },
    // Miền Trung
    mt: { /* same structure */ },
    // Miền Nam
    mn: { /* same structure */ }
  },
  
  createdAt: Date,
  updatedAt: Date
}

// Indexes
userId: 1
phone: 1
status: 1
```

---

## 3. MESSAGES COLLECTION

```javascript
{
  _id: ObjectId,
  userId: ObjectId, // ref: users
  contactId: ObjectId, // ref: contacts
  date: Date, // Ngày đánh
  content: String, // Nội dung gốc
  regions: [String], // ['mb', 'mt', 'mn']
  
  // Kết quả parse
  parsed: {
    success: Boolean,
    lines: [
      {
        stt: Number,
        region: String, // 'mb'|'mt'|'mn'
        province: String, // 'dc'|'tp'|...
        betType: String, // 'lo'|'de'|'dau'|...
        number: String, // '12'
        points: Number, // 10
        pricePerPoint: Number, // 0.75
        totalBet: Number, // 75000
        payoutMB: Number, // 750000
        payoutMT: Number,
        payoutMN: Number
      }
    ],
    stats: {
      totalLines: Number,
      totalBet: Number,
      totalPayoutMB: Number,
      totalPayoutMT: Number,
      totalPayoutMN: Number,
      maxPayout: Number
    }
  },
  
  // Kết quả thực tế (sau khi có kết quả xổ số)
  result: {
    processed: Boolean, // đã xử lý chưa
    totalWin: Number, // tổng tiền trúng
    totalLose: Number, // tổng tiền thua
    profit: Number, // lãi = thu - trả
    details: [
      {
        lineIndex: Number,
        won: Boolean,
        winAmount: Number
      }
    ]
  },
  
  status: String, // 'pending'|'won'|'lost'|'error'
  errorMessage: String, // nếu parse lỗi
  
  createdAt: Date,
  updatedAt: Date
}

// Indexes
userId: 1
contactId: 1
date: -1
status: 1
{ userId: 1, date: -1 }
```

---

## 4. LOTTERY_RESULTS COLLECTION

```javascript
{
  _id: ObjectId,
  date: String, // 'DD-MM-YYYY'
  region: String, // 'mb'|'mt'|'mn'
  
  // Miền Bắc
  mb: {
    meta: {
      region: { code: String, name: String },
      date: { original: String, formatted: String, display: String, dayOfWeek: String }
    },
    prizes: {
      special_codes: [String],
      db: String,
      g1: String,
      g2: [String],
      g3: [String],
      g4: [String],
      g5: [String],
      g6: [String],
      g7: [String]
    }
  },
  
  // Miền Trung/Nam
  mt: {
    meta: { /* same */ },
    prizes: {
      [provinceCode]: {
        province: { name: String, code: String, url: String },
        g8: String|[String],
        g7: String|[String],
        g6: String|[String],
        g5: String|[String],
        g4: String|[String],
        g3: String|[String],
        g2: String|[String],
        g1: String|[String],
        db: String|[String]
      }
    }
  },
  
  mn: { /* same structure as mt */ },
  
  createdAt: Date,
  updatedAt: Date
}

// Indexes
{ date: 1, region: 1 }: unique
date: -1
```

---

## 5. PAYMENT_PACKAGES COLLECTION

```javascript
{
  _id: ObjectId,
  name: String, // '3 tháng'
  months: Number, // 3
  price: Number, // 500000
  description: String,
  isActive: Boolean, // default: true
  order: Number, // thứ tự hiển thị
  createdAt: Date,
  updatedAt: Date
}

// Indexes
isActive: 1
order: 1
```

---

## 6. PAYMENT_METHODS COLLECTION

```javascript
{
  _id: ObjectId,
  type: String, // 'bank'|'momo'|'zalopay'
  bankName: String, // 'Vietcombank'
  bankCode: String, // 'VCB'
  accountNumber: String,
  accountName: String,
  transferContent: String, // 'MUA_[PHONE]'
  qrCode: String, // URL hoặc path
  isActive: Boolean,
  order: Number,
  createdAt: Date,
  updatedAt: Date
}

// Indexes
isActive: 1
order: 1
```

---

## 7. TRANSACTIONS COLLECTION

```javascript
{
  _id: ObjectId,
  userId: ObjectId, // ref: users hoặc null (chưa có user)
  type: String, // 'purchase'|'renewal'
  packageId: ObjectId, // ref: payment_packages
  paymentMethodId: ObjectId, // ref: payment_methods
  amount: Number,
  phone: String, // SĐT khách hàng
  transferContent: String, // nội dung chuyển khoản
  status: String, // 'pending'|'confirmed'|'rejected'
  confirmDate: Date,
  confirmedBy: ObjectId, // admin user
  notes: String,
  createdAt: Date,
  updatedAt: Date
}

// Indexes
userId: 1
status: 1
createdAt: -1
```

---

## 8. TELEGRAM_SETTINGS COLLECTION

```javascript
{
  _id: ObjectId,
  botToken: String,
  botUsername: String,
  webhookUrl: String,
  isActive: Boolean,
  lastTestDate: Date,
  updatedAt: Date
}
```

---

## 9. WEBSITE_SETTINGS COLLECTION

```javascript
{
  _id: ObjectId,
  // SEO
  title: String,
  description: String,
  keywords: [String],
  logo: String,
  favicon: String,
  ogImage: String,
  twitterImage: String,
  
  // Analytics
  googleAnalyticsId: String,
  facebookPixelId: String,
  
  // Custom scripts
  customCSS: String,
  customJS: String,
  headerScripts: String,
  footerScripts: String,
  
  // SMTP
  smtp: {
    host: String,
    port: Number,
    username: String,
    password: String,
    fromEmail: String,
    fromName: String
  },
  
  updatedAt: Date
}
```

---

## 10. GUIDES COLLECTION

```javascript
{
  _id: ObjectId,
  title: String,
  slug: String, // unique
  content: String, // markdown
  excerpt: String,
  category: String,
  order: Number,
  isPublished: Boolean,
  createdAt: Date,
  updatedAt: Date
}

// Indexes
slug: unique
isPublished: 1
order: 1
```

---

## 11. RELEASES COLLECTION

```javascript
{
  _id: ObjectId,
  version: String, // '1.0.0'
  title: String,
  content: String, // markdown
  releaseDate: Date,
  isPublished: Boolean,
  createdAt: Date,
  updatedAt: Date
}

// Indexes
releaseDate: -1
isPublished: 1
```

---

## 12. APP_DOWNLOADS COLLECTION

```javascript
{
  _id: ObjectId,
  platform: String, // 'ios'|'android'
  version: String,
  downloadUrl: String,
  qrCode: String,
  releaseNotes: String,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}

// Indexes
platform: 1
isActive: 1
```

---

## RELATIONSHIPS

```
users (1) ─────< (N) contacts
users (1) ─────< (N) messages
contacts (1) ───< (N) messages
users (1) ─────< (N) transactions
payment_packages (1) ───< (N) transactions
payment_methods (1) ────< (N) transactions
```

---

## DEFAULT DATA CẦN TẠO

### 1. Admin user mặc định
```javascript
{
  username: 'admin',
  password: bcrypt('admin123'),
  role: 'admin',
  status: 'active'
}
```

### 2. Payment packages mặc định
```javascript
[
  { name: '3 tháng', months: 3, price: 500000, order: 1 },
  { name: '6 tháng', months: 6, price: 900000, order: 2 },
  { name: '9 tháng', months: 9, price: 1200000, order: 3 },
  { name: '12 tháng', months: 12, price: 1500000, order: 4 }
]
```

### 3. Cấu hình giá mặc định (cho contacts)
```javascript
const defaultPricing = {
  mb: {
    de: { giaBan: 0.75, tienThang: 75 },
    // ... 40 loại cược
  }
}
```

### 4. Demo data cho trial user
- 5 contacts mẫu
- 15 messages mẫu

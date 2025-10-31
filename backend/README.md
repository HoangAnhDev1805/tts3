# 3DAIXS Backend

Backend API for 3DAIXS.COM Lottery Management System

## Installation

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
```

## Database Seeding

```bash
npm run seed
```

Default admin credentials:
- Username: `admin`
- Password: `admin123`

## Development

```bash
npm run dev
```

## Production

```bash
npm start
```

## API Documentation

See `/docs/05-API-ENDPOINTS.md` for full API documentation.

## Features

- JWT Authentication
- Role-based access control
- Trial account system
- Lottery result crawler (az24.vn)
- Message parser (40 bet types)
- Socket.IO real-time updates
- Cron jobs for automation
- Transaction management with countdown
- File upload support

## Tech Stack

- Node.js + Express
- MongoDB + Mongoose
- Socket.IO
- JWT
- Bcrypt
- Axios + Cheerio
- Multer + Sharp

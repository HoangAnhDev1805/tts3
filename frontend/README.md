# 3DAIXS Frontend

Frontend web application for 3DAIXS.COM Lottery Management System

## Installation

```bash
cd frontend
npm install
cp .env.local.example .env.local
# Edit .env.local
```

## Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Build

```bash
npm run build
npm start
```

## Tech Stack

- Next.js 14+ (App Router)
- TypeScript
- TailwindCSS + Shadcn/UI
- TanStack Query (React Query)
- Zustand (State management)
- Socket.IO Client
- React Hook Form + Zod
- Lucide Icons
- Recharts

## Features

- Modern, responsive UI
- Real-time updates (Socket.IO)
- Optimistic updates
- Form validation
- Dark mode support
- SEO friendly

## Project Structure

```
frontend/
├── app/                  # Pages (App Router)
│   ├── (auth)/          # Auth pages
│   ├── (user)/          # User pages
│   └── (admin)/         # Admin pages
├── components/          # React components
│   ├── ui/             # Shadcn/UI components
│   └── ...
├── lib/                # Utilities
├── hooks/              # Custom hooks
├── store/              # Zustand stores
├── types/              # TypeScript types
└── public/             # Static assets
```

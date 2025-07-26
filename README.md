This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
# testnet.id

#masuk
- sudo -u postgres psql
-- 1. Buat database
CREATE DATABASE testnet_id;

-- 2. Buat user dengan password
CREATE USER testnet_user WITH PASSWORD '123456';

-- 3. Berikan hak akses penuh ke user terhadap database
GRANT ALL PRIVILEGES ON DATABASE testnet_id TO testnet_user;

# STRUKTUR PROJECT
> Client: 
• memilih pair (usdt/eth) dll pada testnet maupun mainnet
• melihat estimasi pada setiap nominal dan pasangan tiap pair yg berlaku
• melihat detail transaksi (jumlah coin dan price pada saat pesanan)
• proses transaksi manual (copy alamat penerima) atau gunakan wallet connect dll
> Admin:
• create/delete/edit coin mainnet/testnet
• create/delete/edit pair + price mainnet/testnet
• cek history (pesanan yg berhasil) mainnet/testnet

# technology
- nextjs 13.4
- postgresql + schema prisma (metode api= server action + route api)
- tailwind

project-root/
├── prisma/
│   └── schema.prisma
│
├── public/
│   └── uploads/                   # Folder icon hasil upload
│
├── styles/
│   └── globals.css
│
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── coins/
│   │   │   │   ├── route.ts       # GET coins, POST create coin
│   │   │   │   ├── [id]/route.ts  # PUT edit coin
│   │   │   │   └── upload/        # Upload icon endpoint
│   │   │   │       └── route.ts   # POST file upload
│   │   │   │
│   │   │   ├── pairs/
│   │   │   │   ├── route.ts       # GET pairs, POST create pair
│   │   │   │   └── [id]/route.ts  # PUT edit pair
│   │   │   │
│   │   │   └── orders/
│   │   │       └── route.ts       # POST new order (from client)
│   │   │
│   │   ├── admin/
│   │   │   ├── page.tsx           # Dashboard summary (optional) 
│   │   │   ├── layout.tsx         # Admin layout 
│   │   │   ├── coins/
│   │   │   │   ├── page.tsx      # Admin UI: list/add/edit Coin
│   │   │   ├── pairs/
│   │   │   │   ├── page.tsx      # Admin UI: list/add/edit Pair
│   │   │   ├── history/
│   │   │   │   ├── page.tsx    # Admin UI: view completed Orders
│   │   │   └── actions.ts         # (Optional) all server actions in 1 file 
│   │   │
│   │   ├── page.tsx               # Public landing
│   │   ├── pairs.tsx              # Client UI: list/estimate pair
│   │   ├── order.tsx              # Client UI: order detail
│   │   └── layout.tsx             # App wrapper & import global CSS
│   │
│   ├── lib/
│   │   ├── prisma.ts              # Prisma client
│   │   └── auth.ts                # Role check utilities
│   │
│   └── types/
│       └── index.d.ts             # (Optional) custom types
│
├── middleware.ts
├── .env
├── package.json
└── tsconfig.json

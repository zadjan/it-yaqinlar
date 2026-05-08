# IT Yaqinlar — Hamjamiyat veb-sayti

**"IT sohasida yaqin bo'lamiz"**  
Asoschisi: Ikromov Ozodbek

---

## Texnologiyalar

- **Frontend:** React 18 + Vite + Tailwind CSS + React Router v6
- **Backend:** Node.js + Express
- **Database:** PostgreSQL + Prisma ORM
- **Rasm yuklash:** Multer
- **Auth:** JWT (Admin panel)

---

## Ishga tushirish

### 1. Talablar

- Node.js 18+
- PostgreSQL (ishlayotgan bo'lishi kerak)
- npm yoki yarn

### 2. Backend sozlash

```bash
cd server
npm install
```

`.env` fayl yarating:

```bash
cp .env.example .env
```

`.env` faylni to'ldiring:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/it_yaqinlar"
JWT_SECRET="your-super-secret-jwt-key"
ADMIN_SECRET="your-admin-registration-secret"
PORT=5000
CLIENT_URL="http://localhost:5173"
```

Database yarating va migrate qiling:

```bash
# PostgreSQL da database yarating
createdb it_yaqinlar

# Prisma migrate
npm run db:migrate

# Prisma client generate
npm run db:generate

# Test ma'lumotlar qo'shish (ixtiyoriy)
npm run seed
```

Backend ishga tushirish:

```bash
npm run dev
```

Server: http://localhost:5000

### 3. Frontend sozlash

```bash
cd client
npm install
npm run dev
```

Frontend: http://localhost:5173

---

## Sahifalar

| Sahifa | URL | Tavsif |
|--------|-----|--------|
| Bosh sahifa | `/` | Hero, keyingi meetup, statistika |
| Meetuplar | `/meetups` | Kelgusi va o'tgan meetuplar |
| Tarix | `/history` | O'tgan meetuplar fotogalereyasi |
| Asoschimiz | `/founder` | Ikromov Ozodbek haqida |
| Aloqa | `/contact` | Ijtimoiy tarmoqlar, forma |
| Admin | `/admin` | Boshqaruv paneli (JWT himoya) |

---

## Admin panel

Seed bajargandan keyin:
- **Email:** ikromovozod206@gmail.com
- **Parol:** admin123

> **Muhim:** Produksiyaga o'tishdan oldin parolni o'zgartiring!

---

## API Endpointlar

### Meetuplar
```
GET    /api/meetups              — Barcha meetuplar
GET    /api/meetups?status=upcoming — Kelgusi meetuplar
GET    /api/meetups/:id          — Bitta meetup
POST   /api/meetups              — Yangi meetup (admin)
PUT    /api/meetups/:id          — Yangilash (admin)
DELETE /api/meetups/:id          — O'chirish (admin)
```

### Ro'yxatlar
```
POST   /api/registrations        — Ro'yxatdan o'tish (public)
GET    /api/registrations        — Barcha ro'yxatlar (admin)
DELETE /api/registrations/:id    — O'chirish (admin)
```

### Tarix
```
GET    /api/history              — Barcha tarixlar
GET    /api/history/:id          — Bitta tarix
POST   /api/history              — Yangi tarix + rasmlar (admin)
PUT    /api/history/:id          — Yangilash (admin)
DELETE /api/history/:id          — O'chirish (admin)
```

### Admin
```
POST   /api/admin/login          — Login
POST   /api/admin/register       — Yangi admin (secretKey talab)
GET    /api/admin/me             — Joriy admin (token talab)
```

---

## Papka strukturasi

```
it-yaqinlar/
├── client/                   ← React frontend
│   ├── public/
│   │   ├── logo.png          ← Sayt logosi (qo'shing)
│   │   └── asoschi.png       ← Asoschining rasmi (qo'shing)
│   └── src/
│       ├── pages/            ← Sahifalar
│       ├── components/       ← Umumiy komponentlar
│       ├── App.jsx
│       └── main.jsx
└── server/                   ← Node.js backend
    ├── routes/               ← API yo'nalishlari
    ├── uploads/              ← Yuklangan rasmlar (auto yaratiladi)
    ├── prisma/
    │   └── schema.prisma
    └── index.js
```

---

## Rasmlarni qo'shish

1. `client/public/logo.png` — sayt logosi (tavsiya: 100x100px, PNG)
2. `client/public/asoschi.png` — asoschining rasmi (tavsiya: 400x400px, PNG)

---

## Produksiyaga chiqarish

```bash
# Frontend build
cd client && npm run build

# Backend uchun PM2 ishlatish (tavsiya)
cd server
npm install -g pm2
pm2 start index.js --name it-yaqinlar-api
```

---

## Ranglar

| Rang | Hex | Ishlatilishi |
|------|-----|--------------|
| Yashil | `#4ade80` | Asosiy aksent rangi |
| Dark fon | `#0a0a0a` | Dark rejim asosiy foni |
| Dark card | `#111111` | Dark rejim kartochkalar |
| Light fon | `#ffffff` | Light rejim asosiy foni |

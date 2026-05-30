# Implementation Plan — Backend & Landing Page Content Editor Integration

This plan details the backend implementation for **Napdoee** using Express.js, Prisma ORM, and PostgreSQL, along with a new feature that allows the Admin CMS to edit landing page content (name, class, stats, bio, etc.) dynamically.

---

## 🎨 New Feature: Landing Page Content CMS Editor

To meet the requirement of dynamically modifying the landing page content from the Admin CMS, we will introduce a `Setting` database model. This allows the admin to edit settings like the developer's name, class, HP, MP, speed, defense, bio, and target WhatsApp number directly from a new `/admin/settings` CMS panel.

```mermaid
graph LR
    A[Admin CMS Settings Panel] -->|POST /api/admin/settings| B[Express API + Prisma]
    B -->|Persist| C[PostgreSQL Database]
    D[Visitor Landing Page] -->|GET /api/settings| B
```

### 🗄️ Database Mappings (Prisma Schema Update)

We will create the database models including `Setting` inside `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model Setting {
  id        Int      @id @default(autoincrement())
  key       String   @unique // name, tagline, class, hp, mp, speed, defense, whatsapp, bio
  value     String   @db.Text
  updatedAt DateTime @updatedAt
}

model Service {
  id          Int      @id @default(autoincrement())
  title       String
  description String
  icon        String?
  priceRange  String?
  isActive    Boolean  @default(true)
  order       Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Project {
  id          Int      @id @default(autoincrement())
  title       String
  description String
  thumbnail   String?
  tags        String[] // e.g. ["React", "Node.js"]
  liveUrl     String?
  repoUrl     String?
  isFeatured  Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Inquiry {
  id        Int      @id @default(autoincrement())
  nama      String
  whatsapp  String
  email     String
  detail    String
  status    String   @default("NEW") // NEW | READ | ARCHIVED
  createdAt DateTime @default(now())
}

model Admin {
  id        Int      @id @default(autoincrement())
  username  String   @unique
  password  String   // bcrypt hash
  createdAt DateTime @default(now())
}
```

---

## User Review Required

> [!IMPORTANT]
> **Database Credentials & Local Setup:**
> To execute database migrations locally, we will setup a default `.env` file with a local PostgreSQL connection string (e.g. `DATABASE_URL="postgresql://postgres:postgres@localhost:5432/napdoee"`). 
> Please let us know if your local PostgreSQL database credentials differ so that we can pre-adjust this in the environment variables!

> [!TIP]
> **Landing Page Default Content Seed:**
> Upon performing the database migrations, we will automatically run a seed script `prisma/seed.js` to create the default admin user (`admin` / `admin123`) and seed the landing page stats (HP `99`, MP `88`, Speed `95`, Defense `90`, Makassar Developer bio) so the website is immediately loaded with data on the first run.

---

## Open Questions

> [!IMPORTANT]
> 1. **Local DB Server Running:** Is there a local PostgreSQL instance already running on your system? If not, we can write the backend to automatically fall back to a local SQLite database file (`file:./dev.db`) during development so that you can run and test the complete stack instantly without setting up local PG databases! SQLite is fully compatible with Prisma and is highly reliable for offline-first local validation checks.

---

## Proposed Changes

We will build the backend inside a new `server/` directory and connect the Vite dev proxy to seamlessly handle API requests.

---

### 📂 Backend Mappings

```
d:/Data YYT/Coding/Napdoee/
├── prisma/
│   ├── schema.prisma           # Prisma database schema definition
│   └── seed.js                 # Initial admin and settings database seeder
├── server/
│   ├── index.js                # Express app startup & routes mounting
│   ├── middleware/
│   │   └── auth.js             # JWT verification middleware
│   └── package.json            # Backend package configurations
├── vite.config.js              # Vite server API Proxy configuration
└── src/
    ├── pages/
    │   ├── Home.jsx            # Dynamic fetch landing page content
    │   ├── AdminDashboard.jsx  # HUD navigations for settings panel
    │   └── AdminSettings.jsx   # [NEW] Dynamic landing page content editor CRUD
```

---

### 🧱 Code Specifications

#### [NEW] [AdminSettings.jsx](file:///d:/Data%20YYT/Coding/Napdoee/src/pages/AdminSettings.jsx)
- A dynamic page inside the Admin CMS (`/admin/settings`).
- Allows editing the following elements in a single form:
  - Developer Name & Tagline
  - Level Class
  - Core Attributes: HP, MP, Speed, Defense
  - Makassar Developer Bio Text
  - WhatsApp target phone number.

#### [NEW] [index.js](file:///d:/Data%20YYT/Coding/Napdoee/server/index.js)
- Runs Express server with JSON parsers.
- Registers standard API routes:
  - `GET /api/settings` - Public settings fetch.
  - `POST /api/admin/settings` - Protected settings update.
  - `POST /api/auth/login` - Validates hash with `bcryptjs` and signs standard `jwt`.
  - CRUD operations mapped to Prisma client queries.

---

## Verification Plan

### Automated & Manual Verification
- Install server packages: `express`, `@prisma/client`, `bcryptjs`, `jsonwebtoken`, `cors`, `dotenv`.
- Perform schema migrations.
- Run `npm run build` and run local server tests to verify that front-to-back API proxies respond correctly.
- Manually change landing page text in Admin CMS and reload page to witness the dynamic update.

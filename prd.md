# PRD — Portfolio Website + Admin CMS
**Owner:** Web Programmer (Makassar)  
**Stack:** React + Vite · Prisma ORM · PostgreSQL · DokPloy  
**Theme Concept:** Google Dino Run — pixel/retro-game aesthetic meets clean developer portfolio

---

## 1. Design & Frontend Direction

### 1.1 Aesthetic Vision

> **"8-bit Desert Runner"** — A portfolio that feels like a living game world. The owner is the protagonist; visitors explore his services like levels. Every scroll, hover, and click has the energy of a side-scroller.

| Token | Value |
|---|---|
| **Primary BG** | `#F7F3E9` (aged parchment) |
| **Ground/Base** | `#535353` (dino grey) |
| **Accent** | `#4CAF50` (cactus green) |
| **Highlight** | `#FF6B35` (sunset orange — CTAs) |
| **Text** | `#1A1A1A` |
| **Pixel border** | 2–4px solid `#1A1A1A` with box-shadow offset trick |

### 1.2 Typography

| Role | Font | Source |
|---|---|---|
| **Display / Headings** | `Press Start 2P` | Google Fonts — pixel bitmap feel |
| **Body / UI** | `DM Mono` | Google Fonts — monospace, dev-flavored |
| **Accent / Labels** | `Silkscreen` | Google Fonts — retro terminal |

### 1.3 Motion & Interactions

- **Hero:** Parallax scrolling ground layers (sky → clouds → ground → cactus silhouettes). Pixel character runs continuously in the hero section.
- **Scroll trigger:** Sections "jump in" like a dino jump — translate Y down → bounce up on enter.
- **Hover states:** Buttons pixelate border on hover (CSS box-shadow pixel border animation). Cards lift with hard drop-shadow offset.
- **Cursor:** Custom pixel cursor (16×16 sprite) replaces default pointer.
- **Background:** Infinite scrolling desert floor SVG at bottom of viewport during scroll (CSS `animation: scroll-floor linear infinite`).
- **Page Load:** Minimal "press start" splash screen (1.5s) — score counter ticks up, then fades to portfolio.

### 1.4 Layout Principles

- **Grid:** 12-column, max-width 1280px, gutters 24px.
- **Sections are "stages":** Each section has a stage number label (STAGE 01, STAGE 02…) in pixel font.
- **Pixel cards:** All cards use 4px hard offset box-shadow in `#1A1A1A`, no border-radius (sharp pixel corners).
- **Mobile:** Single column, game UI shrinks gracefully. Dino run animation replaced by static pixel sprite on mobile.

---

## 2. Core Features

### 2.1 Public Portfolio (Visitor Side)

| # | Feature | Description |
|---|---|---|
| P1 | **Hero / Landing** | Full-viewport dino run animation, name + tagline, CTA button "START GAME →" scrolls to services |
| P2 | **About / Character Stats** | Bio styled as RPG character sheet — HP = Energy, Skills = Programming / Guitar / Editing, XP bar per skill |
| P3 | **Services Showcase** | Cards for each service fetched from CMS. Each card = a "level" with title, description, price range (optional), and "SELECT LEVEL" CTA |
| P4 | **Portfolio / Projects** | Grid of past projects with tags (tech stack), thumbnail, description — fetched from CMS |
| P5 | **Contact / Inquiry Form** | Pixel-styled form: Nama, Nomor WhatsApp, Email, Detail Tujuan/Project. Submit → stores to DB + sends WhatsApp deep-link confirmation |
| P6 | **Footer** | High score board style: copyright, social links (GitHub, LinkedIn, Instagram), current "run" year |

### 2.2 Admin CMS (Owner Side)

| # | Feature | Description |
|---|---|---|
| A1 | **Auth** | Simple username + password login (JWT, no OAuth needed). Protected routes via React Router. |
| A2 | **Services CRUD** | Add / Edit / Delete services. Fields: title, description, icon (emoji or upload), price range, active toggle |
| A3 | **Projects CRUD** | Add / Edit / Delete portfolio projects. Fields: title, description, thumbnail URL, tech tags, live URL, repo URL, featured toggle |
| A4 | **Inquiries Inbox** | Table of all submitted contact forms. Status: New / Read / Archived. Click to view full detail. |
| A5 | **Dashboard** | Stats widgets: total inquiries, new this week, total services, total projects |

---

## 3. Requirements

### 3.1 Functional Requirements

| ID | Requirement |
|---|---|
| FR-01 | Visitor can browse services without login |
| FR-02 | Visitor can submit inquiry form; all fields (Nama, WhatsApp, Email, Detail) are required |
| FR-03 | WhatsApp field validates Indonesian format (`08xx` or `+628xx`) |
| FR-04 | Email field validates standard email format |
| FR-05 | Submitted inquiry is persisted to PostgreSQL via Prisma |
| FR-06 | Admin can log in with credentials; session expires after 24h |
| FR-07 | Admin can create, read, update, delete Services |
| FR-08 | Admin can create, read, update, delete Projects |
| FR-09 | Admin can view all inquiries and mark them as Read / Archived |
| FR-10 | Services and Projects on public site are dynamically fetched from DB (no hardcode) |
| FR-11 | Only active services are shown on public site |
| FR-12 | Featured projects are shown first on portfolio section |

### 3.2 Non-Functional Requirements

| ID | Requirement |
|---|---|
| NFR-01 | First Contentful Paint < 2.5s on 4G mobile |
| NFR-02 | All API routes return JSON; no server-side rendering (SPA + REST API) |
| NFR-03 | Passwords hashed with bcrypt (min 10 rounds) |
| NFR-04 | API routes for Admin are protected by JWT middleware |
| NFR-05 | CORS configured — only portfolio domain allowed in production |
| NFR-06 | Database migrations managed via Prisma Migrate |
| NFR-07 | Environment variables via `.env` — never committed to repo |
| NFR-08 | DokPloy deployment: separate services for frontend (static/Nginx), backend (Node), and PostgreSQL |
| NFR-09 | Mobile responsive — all breakpoints: 375px, 768px, 1280px |
| NFR-10 | Pixel animations use `prefers-reduced-motion` media query fallback |

### 3.3 Database Schema (Prisma Models)

```prisma
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

## 4. User Flow

### 4.1 Visitor Flow

```
[Landing / Hero]
      │
      ▼
[Scroll → STAGE 01: About]
  Character stats, hobi: Programming / Guitar / Editing
      │
      ▼
[Scroll → STAGE 02: Services]
  Fetch from DB → Show active services as level cards
  Click "SELECT LEVEL" → Scroll to Contact Form
      │
      ▼
[Scroll → STAGE 03: Projects]
  Fetch from DB → Grid (featured first)
  Click card → Expand or open live URL
      │
      ▼
[Scroll → STAGE 04: Contact / Inquiry Form]
  Fill: Nama, WhatsApp, Email, Detail Project
  Click "SUBMIT HIGH SCORE" →
      ├── Validation passes → POST /api/inquiries → Success toast "GG! Pesan terkirim"
      └── Validation fails → Inline pixel-style error messages
```

### 4.2 Admin Flow

```
[/admin/login]
  Enter username + password →
      ├── Invalid → Error "GAME OVER. Try again."
      └── Valid → JWT stored in httpOnly cookie → Redirect to /admin/dashboard
            │
            ▼
      [Dashboard]
        Stats: Inquiries count, New this week, Services count, Projects count
            │
       ┌────┴────────────────────┐
       ▼                         ▼
  [/admin/services]        [/admin/projects]
   List → Add / Edit / Delete    List → Add / Edit / Delete
   Toggle isActive               Toggle isFeatured
            │
            ▼
  [/admin/inquiries]
   Table: Nama, WhatsApp, Email, Date, Status
   Click row → View full Detail
   Actions: Mark Read | Archive
            │
            ▼
  [Logout] → Clear JWT → Redirect to /admin/login
```

---

## 5. Page & Route Structure

### Frontend Routes (React Router)

| Route | Component | Auth |
|---|---|---|
| `/` | `Home` (all public sections) | Public |
| `/admin/login` | `AdminLogin` | Public |
| `/admin/dashboard` | `AdminDashboard` | Protected |
| `/admin/services` | `AdminServices` | Protected |
| `/admin/projects` | `AdminProjects` | Protected |
| `/admin/inquiries` | `AdminInquiries` | Protected |

### Backend API Endpoints (Express / Hono)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/services` | Public | Get all active services |
| `GET` | `/api/projects` | Public | Get all projects (featured first) |
| `POST` | `/api/inquiries` | Public | Submit inquiry form |
| `POST` | `/api/auth/login` | Public | Admin login → return JWT |
| `GET` | `/api/admin/services` | Admin | Get all services (incl. inactive) |
| `POST` | `/api/admin/services` | Admin | Create service |
| `PUT` | `/api/admin/services/:id` | Admin | Update service |
| `DELETE` | `/api/admin/services/:id` | Admin | Delete service |
| `GET` | `/api/admin/projects` | Admin | Get all projects |
| `POST` | `/api/admin/projects` | Admin | Create project |
| `PUT` | `/api/admin/projects/:id` | Admin | Update project |
| `DELETE` | `/api/admin/projects/:id` | Admin | Delete project |
| `GET` | `/api/admin/inquiries` | Admin | Get all inquiries |
| `PATCH` | `/api/admin/inquiries/:id` | Admin | Update status |

---

## 6. DokPloy Deployment Architecture

```
DokPloy Server
├── Service: portfolio-frontend
│     Runtime: Static / Nginx
│     Build: vite build → dist/
│     Port: 80 / 443
│
├── Service: portfolio-backend
│     Runtime: Node 20
│     Start: node dist/index.js
│     Port: 3001
│     Env: DATABASE_URL, JWT_SECRET, PORT
│
└── Service: portfolio-db
      Image: postgres:16-alpine
      Volume: postgres_data
      Env: POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB
```

**Environment Variables (backend):**
```env
DATABASE_URL="postgresql://user:pass@portfolio-db:5432/portfolio"
JWT_SECRET="<random-256-bit-string>"
PORT=3001
ADMIN_USERNAME="<set-on-first-run>"
ADMIN_PASSWORD_HASH="<bcrypt-hash>"
```

---

## 7. Out of Scope (v1)

- Email notification on new inquiry (v2: add Nodemailer / Resend)
- Multi-admin / role management
- Image upload to object storage (v1 uses URL strings; v2 adds S3/MinIO)
- Blog / articles section
- Dark mode toggle (theme is fixed light parchment + pixel)
- Internationalization (EN/ID)
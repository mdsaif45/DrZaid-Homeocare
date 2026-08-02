# 🩺 Dr. Zaid Homeocare — Clinic Management System with EMR & AI Assistant

[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61dafb.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6-646cff.svg)](https://vitejs.dev/)
[![pnpm](https://img.shields.io/badge/pnpm-9-f69220.svg)](https://pnpm.io/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38bdf8.svg)](https://tailwindcss.com/)
[![SQLite](https://img.shields.io/badge/SQLite-sql.js-003b57.svg)](https://www.sqlite.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Drizzle--ORM-336791.svg)](https://orm.drizzle.team/)
[![Gemini AI](https://img.shields.io/badge/Google--Gemini--AI-2.5-8e44ad.svg)](https://ai.google.dev/)

**Dr. Zaid Homeocare** is an enterprise-grade Homeopathic Clinic Management and Electronic Medical Record (EMR) platform. Built with a **Clean N-Tier Architecture**, strict **TypeScript** safety, **Shadcn UI** primitives, **Gemini AI Repertory Assistance**, one-click **PDF Prescription Generation**, and a **Dual-Database Provider** (SQLite by default, with PostgreSQL Dependency Injection switch).

---

## 🌟 Key Features

* 🤖 **AI Homeopathic Repertory Assistant (`@google/genai`)**: Analyzes patient chief complaints, physical generals, and mind rubrics against Kent/Boenninghausen homeopathic materia medica rules to suggest candidate remedies (*Pulsatilla*, *Silicea*, *Sulphur*, *Nux Vomica*).
* 📄 **One-Click PDF Prescription Generator (`jsPDF`)**: Generates branded PDF prescriptions with doctor credentials, patient metadata, remedy dosage matrix, instructions, and follow-up dates.
* ⚡ **Dual Database Architecture (SQLite Default + PostgreSQL DI)**:
  * **SQLite (`sql.js`)**: Zero-configuration WASM SQLite database engine running out-of-the-box (`homeocare.sqlite`).
  * **PostgreSQL (Drizzle ORM)**: High-performance PostgreSQL backend switchable via environment variable (`DB_PROVIDER=postgres`).
* 🎨 **Modern Frontend Design System**:
  * **Shadcn UI / Radix UI** primitives (`Button`, `Card`, `Badge`, `Input`, `Modal`, `Tabs`).
  * **Lucide Icons** (`lucide-react`) for clinical iconography.
  * **Framer Motion** (`motion`) for smooth dialog and tab transitions.
  * **Recharts** (`recharts`) for interactive patient visit trends and remedy analytics.
* 🔐 **Strict Type Safety & Zod Schema Validation**: Zero `// @ts-nocheck` suppressed types. Unified runtime payload validation via Zod middleware (`validateRequest`).
* 📲 **PWA Offline Support**: Progressive Web App service worker (`vite-plugin-pwa`) ensuring high availability during clinic network drops.

---

## 📁 Clean Project Directory Structure

```
dr-zaid-homeocare/
├── pnpm-workspace.yaml            # pnpm workspace configuration
├── package.json                   # Root package manager & workspace scripts
├── pnpm-lock.yaml                 # Lockfile for pnpm dependencies
├── README.md                      # Primary project documentation
├── ARCHITECTURE.md                # N-Tier SOLID Architecture documentation
├── docker-compose.yml             # Docker production deployment
├── docker-compose.dev.yml         # Docker dev setup
├── homeocare.sqlite               # Default WASM SQLite database file
│
├── client/                        # React 19 + Vite Frontend Workspace
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/                # Atomic UI primitives (Button, Card, Badge, Modal, Tabs)
│   │   │   ├── forms/             # EMR form sections (ChiefComplaints, Vitals, AiRemedyAssistantModal)
│   │   │   ├── common/            # Layouts & Guards
│   │   │   └── prescriptions/     # Prescription views
│   │   ├── pages/                 # Route pages (Dashboard, PatientList, CaseRecordForm)
│   │   ├── services/              # Client REST API services
│   │   ├── store/                 # Zustand state stores
│   │   └── utils/                 # Utilities (cn, pdfGenerator)
│   ├── package.json
│   └── vite.config.ts             # Vite + PWA configuration
│
├── server/                        # Express + Node.js Backend Workspace
│   ├── src/
│   │   ├── config/                # Database connections (sqlite.ts, database.ts, env.ts)
│   │   ├── db/
│   │   │   ├── schema/            # Type-safe Drizzle ORM schemas
│   │   │   └── sqliteSchema.sql   # SQLite DDL schema
│   │   ├── repositories/
│   │   │   ├── interfaces/        # Abstract Contracts (IPatientRepository, etc.)
│   │   │   ├── sqlite/            # Concrete WASM SQLite Repositories
│   │   │   ├── drizzle/           # Concrete PostgreSQL Drizzle Repositories
│   │   │   └── factory.ts         # RepositoryFactory DI Container
│   │   ├── services/              # Domain Services (PatientService, AiRepertoryService)
│   │   ├── controllers/           # HTTP Endpoint Handlers
│   │   ├── middleware/            # Zod validation, Auth, Error handlers
│   │   ├── routes/                # Express API routers (/api/patients, /api/ai, etc.)
│   │   └── server.ts              # Express Server Entrypoint
│   ├── package.json
│   └── drizzle.config.ts          # Drizzle Kit migration configuration
│
├── database/                      # SQL Setup scripts & PostgreSQL migrations
└── docs/                          # Project Documentation
    ├── SETUP_GUIDE.md
    ├── QUICK_START.md
    ├── DATABASE_SCHEMA.md
    └── history/                   # Phase logs & historical requirement drafts
```

---

## 🚀 Quick Start Guide

### Prerequisites
* **Node.js** v20+
* **pnpm** v9 (`npm install -g pnpm`)

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Run Concurrent Development Mode (`pnpm dev`)
Starts both the **Vite React Frontend** (`http://localhost:5173`) and the **Express Backend API** (`http://localhost:3000`) in a single terminal:
```bash
pnpm dev
```

### 3. Database Selection

#### Option A: SQLite (Default — Zero Config)
By default, the server runs using embedded WASM SQLite (`homeocare.sqlite`). No external database installation is required:
```bash
# Uses SQLite automatically
pnpm dev
```

#### Option B: PostgreSQL (Drizzle ORM)
To switch to PostgreSQL, set `DB_PROVIDER=postgres` in `.env` or run:
```bash
DB_PROVIDER=postgres pnpm dev
```

---

## 🛠️ Workspace Commands

| Command | Action |
| :--- | :--- |
| **`pnpm dev`** | Start both frontend (port 5173) and backend (port 3000) concurrently. |
| **`pnpm build`** | Compile client production assets and bundle server into standalone `dist/server.cjs`. |
| **`pnpm start`** | Execute standalone production server (`node server/dist/server.cjs`). |
| **`pnpm --filter client dev`** | Start frontend client only. |
| **`pnpm --filter server dev`** | Start backend API server only. |

---

## 📜 License & Author

* **Author**: Dr. MD Zaid
* **License**: UNLICENSED
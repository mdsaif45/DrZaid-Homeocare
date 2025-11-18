# System Architecture - Dr. ZAID's Homeo Care

## High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                                 │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌─────────────────────┐         ┌──────────────────────┐          │
│  │  Public Website     │         │  Doctor Dashboard    │          │
│  │  (React + Vite)     │         │  (React + Vite)      │          │
│  ├─────────────────────┤         ├──────────────────────┤          │
│  │ - Home              │         │ - Patient Management │          │
│  │ - About             │         │ - Case Records (EMR) │          │
│  │ - Services          │         │ - Prescriptions      │          │
│  │ - Contact           │         │ - Appointments       │          │
│  │ - Blog              │         │ - Invoices           │          │
│  │ - Book Appointment  │         │ - Analytics          │          │
│  └─────────────────────┘         └──────────────────────┘          │
│           │                                   │                      │
└───────────┼───────────────────────────────────┼──────────────────────┘
            │                                   │
            └───────────────┬───────────────────┘
                            │
                    ┌───────▼────────┐
                    │   NGINX        │
                    │ Reverse Proxy  │
                    └───────┬────────┘
                            │
┌───────────────────────────▼──────────────────────────────────────────┐
│                      API GATEWAY / BACKEND                            │
├───────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌────────────────────────────────────────────────────────────┐     │
│  │           Node.js + Express.js (REST API)                  │     │
│  ├────────────────────────────────────────────────────────────┤     │
│  │                                                              │     │
│  │  ┌─────────────┐  ┌──────────────┐  ┌──────────────┐      │     │
│  │  │   Auth      │  │   Patient    │  │  Appointment │      │     │
│  │  │  Service    │  │   Service    │  │   Service    │      │     │
│  │  └─────────────┘  └──────────────┘  └──────────────┘      │     │
│  │                                                              │     │
│  │  ┌─────────────┐  ┌──────────────┐  ┌──────────────┐      │     │
│  │  │Prescription │  │   Invoice    │  │     Blog     │      │     │
│  │  │  Service    │  │   Service    │  │   Service    │      │     │
│  │  └─────────────┘  └──────────────┘  └──────────────┘      │     │
│  │                                                              │     │
│  └────────────────────────────┬─────────────────────────────┘     │
│                                │                                    │
└────────────────────────────────┼────────────────────────────────────┘
                                 │
                    ┌────────────┴──────────────┐
                    │                           │
         ┌──────────▼──────────┐    ┌──────────▼──────────┐
         │   PostgreSQL        │    │   File Storage      │
         │   Database          │    │   (S3 / Local)      │
         ├─────────────────────┤    ├─────────────────────┤
         │ - Users             │    │ - Patient photos    │
         │ - Patients          │    │ - Investigation     │
         │ - Case Records      │    │   reports (PDF/JPG) │
         │ - Prescriptions     │    │ - Blog images       │
         │ - Appointments      │    │ - Invoices          │
         │ - Invoices          │    └─────────────────────┘
         │ - Blogs             │
         └─────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                    EXTERNAL SERVICES                                 │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │   Twilio     │  │  SendGrid    │  │ Google Maps  │              │
│  │   (SMS)      │  │  (Email)     │  │     API      │              │
│  └──────────────┘  └──────────────┘  └──────────────┘              │
│                                                                       │
│  ┌──────────────┐  ┌──────────────┐                                 │
│  │  WhatsApp    │  │  Payment     │                                 │
│  │   Business   │  │  Gateway     │                                 │
│  │     API      │  │ (Razorpay)   │                                 │
│  └──────────────┘  └──────────────┘                                 │
│                                                                       │
└───────────────────────────────────────────────────────────────────────┘
```

---

## Component Architecture

### Frontend Architecture

```
┌────────────────────────────────────────────────────────────┐
│                    React Application                        │
├────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌────────────────────────────────────────────────────┐   │
│  │              Presentation Layer                      │   │
│  ├────────────────────────────────────────────────────┤   │
│  │  • Pages (Route Components)                         │   │
│  │  • UI Components (shadcn/ui)                        │   │
│  │  • Forms (React Hook Form)                          │   │
│  │  • Layouts                                           │   │
│  └────────────────┬───────────────────────────────────┘   │
│                   │                                         │
│  ┌────────────────▼───────────────────────────────────┐   │
│  │              Business Logic Layer                    │   │
│  ├────────────────────────────────────────────────────┤   │
│  │  • Custom Hooks                                      │   │
│  │  • State Management (Zustand/Redux)                 │   │
│  │  • Validation Logic (Zod)                           │   │
│  │  • Utils & Helpers                                   │   │
│  └────────────────┬───────────────────────────────────┘   │
│                   │                                         │
│  ┌────────────────▼───────────────────────────────────┐   │
│  │              Data Access Layer                       │   │
│  ├────────────────────────────────────────────────────┤   │
│  │  • API Services (Axios)                             │   │
│  │  • HTTP Interceptors                                │   │
│  │  • LocalStorage/SessionStorage                      │   │
│  └────────────────────────────────────────────────────┘   │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### Backend Architecture (Layered)

```
┌────────────────────────────────────────────────────────────┐
│                Express.js Application                       │
├────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌────────────────────────────────────────────────────┐   │
│  │              Routes Layer                            │   │
│  ├────────────────────────────────────────────────────┤   │
│  │  • Define endpoints                                  │   │
│  │  • Route parameters                                  │   │
│  │  • Middleware attachment                             │   │
│  └────────────────┬───────────────────────────────────┘   │
│                   │                                         │
│  ┌────────────────▼───────────────────────────────────┐   │
│  │              Controller Layer                        │   │
│  ├────────────────────────────────────────────────────┤   │
│  │  • Handle HTTP requests/responses                   │   │
│  │  • Input validation                                  │   │
│  │  • Call service layer                                │   │
│  │  • Error handling                                    │   │
│  └────────────────┬───────────────────────────────────┘   │
│                   │                                         │
│  ┌────────────────▼───────────────────────────────────┐   │
│  │              Service Layer                           │   │
│  ├────────────────────────────────────────────────────┤   │
│  │  • Business logic                                    │   │
│  │  • Data transformation                               │   │
│  │  • External API calls                                │   │
│  │  • File processing                                   │   │
│  └────────────────┬───────────────────────────────────┘   │
│                   │                                         │
│  ┌────────────────▼───────────────────────────────────┐   │
│  │              Data Access Layer (Models)              │   │
│  ├────────────────────────────────────────────────────┤   │
│  │  • Database queries (SQL/ORM)                       │   │
│  │  • Data models                                       │   │
│  │  • Transactions                                      │   │
│  └────────────────────────────────────────────────────┘   │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## Data Flow Diagrams

### 1. Patient Booking Appointment (Public Flow)

```
┌──────────┐       ┌──────────┐       ┌──────────┐       ┌──────────┐
│  Patient │       │  React   │       │   API    │       │ Database │
│  (User)  │       │  Client  │       │  Server  │       │          │
└────┬─────┘       └────┬─────┘       └────┬─────┘       └────┬─────┘
     │                  │                   │                   │
     │ Fill Booking     │                   │                   │
     │ Form             │                   │                   │
     ├─────────────────>│                   │                   │
     │                  │                   │                   │
     │                  │ POST /api/        │                   │
     │                  │ appointments      │                   │
     │                  ├──────────────────>│                   │
     │                  │                   │                   │
     │                  │                   │ INSERT            │
     │                  │                   │ appointment       │
     │                  │                   ├──────────────────>│
     │                  │                   │                   │
     │                  │                   │ Success           │
     │                  │                   │<──────────────────┤
     │                  │                   │                   │
     │                  │                   │ Send Email/SMS    │
     │                  │                   ├──────────────────>│
     │                  │                   │ (Twilio/SendGrid) │
     │                  │                   │                   │
     │                  │ Success Response  │                   │
     │                  │<──────────────────┤                   │
     │                  │                   │                   │
     │ Confirmation     │                   │                   │
     │ Message          │                   │                   │
     │<─────────────────┤                   │                   │
     │                  │                   │                   │
```

### 2. Doctor Creating Case Record (EMR Flow)

```
┌──────────┐       ┌──────────┐       ┌──────────┐       ┌──────────┐
│  Doctor  │       │Dashboard │       │   API    │       │ Database │
│          │       │  Client  │       │  Server  │       │          │
└────┬─────┘       └────┬─────┘       └────┬─────┘       └────┬─────┘
     │                  │                   │                   │
     │ Search Patient   │                   │                   │
     ├─────────────────>│                   │                   │
     │                  │                   │                   │
     │                  │ GET /api/patients │                   │
     │                  │ ?q=search         │                   │
     │                  ├──────────────────>│                   │
     │                  │                   │                   │
     │                  │                   │ SELECT patients   │
     │                  │                   ├──────────────────>│
     │                  │                   │<──────────────────┤
     │                  │                   │                   │
     │                  │ Patient List      │                   │
     │                  │<──────────────────┤                   │
     │                  │                   │                   │
     │ Select Patient   │                   │                   │
     ├─────────────────>│                   │                   │
     │                  │                   │                   │
     │ Voice-to-Text    │                   │                   │
     │ (Record Case)    │                   │                   │
     ├─────────────────>│                   │                   │
     │                  │ [Web Speech API]  │                   │
     │                  │ Convert to text   │                   │
     │                  │                   │                   │
     │ Fill Case Form   │                   │                   │
     ├─────────────────>│                   │                   │
     │                  │                   │                   │
     │ Upload Files     │                   │                   │
     │ (Reports)        │                   │                   │
     ├─────────────────>│                   │                   │
     │                  │ POST /api/        │                   │
     │                  │ case-records      │                   │
     │                  │ /upload           │                   │
     │                  ├──────────────────>│                   │
     │                  │                   │ Save to S3/Local  │
     │                  │                   ├──────────────────>│
     │                  │                   │                   │
     │ Submit Case      │                   │                   │
     ├─────────────────>│                   │                   │
     │                  │ POST /api/        │                   │
     │                  │ case-records      │                   │
     │                  ├──────────────────>│                   │
     │                  │                   │                   │
     │                  │                   │ INSERT case_record│
     │                  │                   ├──────────────────>│
     │                  │                   │                   │
     │                  │                   │ INSERT prescription│
     │                  │                   ├──────────────────>│
     │                  │                   │                   │
     │                  │ Success + PDF     │                   │
     │                  │<──────────────────┤                   │
     │                  │                   │                   │
     │ Case Saved       │                   │                   │
     │ Download PDF     │                   │                   │
     │<─────────────────┤                   │                   │
     │                  │                   │                   │
```

---

## Security Architecture

```
┌────────────────────────────────────────────────────────────────┐
│                      Security Layers                            │
├────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. Network Layer                                               │
│     ├─ HTTPS/SSL Certificate (Let's Encrypt)                   │
│     ├─ Firewall (UFW/iptables)                                 │
│     └─ DDoS Protection (Cloudflare)                             │
│                                                                  │
│  2. Application Layer                                           │
│     ├─ JWT Authentication (Access + Refresh Tokens)            │
│     ├─ Role-Based Access Control (RBAC)                        │
│     ├─ CORS Configuration                                       │
│     ├─ Rate Limiting (express-rate-limit)                      │
│     ├─ Helmet.js (HTTP headers security)                       │
│     └─ Input Validation (Joi/Zod)                              │
│                                                                  │
│  3. Data Layer                                                  │
│     ├─ Password Hashing (bcrypt)                               │
│     ├─ Parameterized Queries (SQL injection prevention)        │
│     ├─ Encrypted Fields (sensitive data)                       │
│     ├─ Database Connection Encryption                          │
│     └─ Regular Backups (encrypted)                             │
│                                                                  │
│  4. File Upload Security                                        │
│     ├─ File Type Validation (whitelist)                        │
│     ├─ File Size Limits                                         │
│     ├─ Virus Scanning (ClamAV - optional)                      │
│     └─ Secure Storage (S3 with presigned URLs)                 │
│                                                                  │
│  5. Monitoring & Logging                                        │
│     ├─ Audit Logs (who did what, when)                         │
│     ├─ Error Logging (Winston)                                 │
│     ├─ Failed Login Attempts Tracking                          │
│     └─ Suspicious Activity Alerts                              │
│                                                                  │
└────────────────────────────────────────────────────────────────┘
```

---

## Deployment Architecture

### Development Environment
```
┌──────────────────────────────────────────┐
│          Local Development               │
├──────────────────────────────────────────┤
│  • Frontend: localhost:5173 (Vite)       │
│  • Backend:  localhost:3000 (Express)    │
│  • Database: localhost:5432 (PostgreSQL) │
│  • Files:    Local filesystem            │
└──────────────────────────────────────────┘
```

### Production Environment (Docker)
```
┌────────────────────────────────────────────────────────┐
│                  Production Server                      │
├────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────────────────────────────────────────┐ │
│  │              Docker Compose                       │ │
│  ├──────────────────────────────────────────────────┤ │
│  │                                                    │ │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐ │ │
│  │  │   Nginx    │  │  Frontend  │  │  Backend   │ │ │
│  │  │ Container  │  │ Container  │  │ Container  │ │ │
│  │  │  (Port 80) │  │            │  │            │ │ │
│  │  └────────────┘  └────────────┘  └────────────┘ │ │
│  │                                                    │ │
│  │  ┌────────────┐  ┌────────────┐                  │ │
│  │  │ PostgreSQL │  │   Redis    │                  │ │
│  │  │ Container  │  │ Container  │                  │ │
│  │  └────────────┘  └────────────┘                  │ │
│  │                                                    │ │
│  └──────────────────────────────────────────────────┘ │
│                                                          │
│  ┌──────────────────────────────────────────────────┐ │
│  │          Volume Mounts                            │ │
│  ├──────────────────────────────────────────────────┤ │
│  │  • /var/lib/postgresql/data (DB persistence)     │ │
│  │  • /app/uploads (File storage)                   │ │
│  │  • /var/log (Application logs)                   │ │
│  └──────────────────────────────────────────────────┘ │
│                                                          │
└────────────────────────────────────────────────────────┘
```

---

## Technology Stack Details

### Frontend Stack
```
React 18.x
├── Vite (Build tool)
├── React Router v6 (Routing)
├── TailwindCSS (Styling)
├── shadcn/ui (Component library)
├── Zustand (State management)
├── React Hook Form (Forms)
├── Zod (Validation)
├── Axios (HTTP client)
├── date-fns (Date utilities)
├── react-pdf (PDF viewing)
├── jsPDF (PDF generation)
└── react-speech-recognition (Voice-to-text)
```

### Backend Stack
```
Node.js 20.x
├── Express.js 4.x (Framework)
├── PostgreSQL 15+ (Database)
├── pg (PostgreSQL client)
├── bcrypt (Password hashing)
├── jsonwebtoken (JWT)
├── Joi (Validation)
├── Multer (File upload)
├── NodeMailer (Email)
├── Twilio SDK (SMS)
├── Winston (Logging)
├── cors (CORS handling)
├── helmet (Security headers)
└── express-rate-limit (Rate limiting)
```

### DevOps Stack
```
Deployment
├── Docker (Containerization)
├── Docker Compose (Multi-container)
├── Nginx (Web server/reverse proxy)
├── PM2 (Process manager)
├── GitHub Actions (CI/CD)
└── Let's Encrypt (SSL certificates)
```

---

## Scalability Considerations

### Horizontal Scaling
```
┌──────────────────────────────────────────┐
│         Load Balancer (Nginx)            │
└────────────┬─────────────────────────────┘
             │
    ┌────────┴────────┐
    │                 │
┌───▼────┐       ┌───▼────┐
│ API    │       │ API    │
│ Server │       │ Server │
│   #1   │       │   #2   │
└───┬────┘       └───┬────┘
    │                │
    └────────┬───────┘
             │
     ┌───────▼────────┐
     │   PostgreSQL   │
     │   (Primary)    │
     └────────────────┘
```

### Caching Strategy
```
Client Request
      ↓
┌─────────────┐
│   Redis     │  ← Cache frequently accessed data
│   Cache     │    (Patient list, recent appointments)
└─────┬───────┘
      │ (Cache Miss)
      ↓
┌─────────────┐
│ PostgreSQL  │
│  Database   │
└─────────────┘
```

---

## Performance Optimization

1. **Frontend**
   - Code splitting (React.lazy)
   - Image lazy loading
   - Bundle size optimization
   - Service worker for offline capability

2. **Backend**
   - Database query optimization
   - Indexing on frequently queried fields
   - Connection pooling
   - Response compression (gzip)

3. **Database**
   - Query optimization
   - Proper indexing
   - Regular VACUUM and ANALYZE
   - Partitioning for large tables

---

**This architecture is designed to be:**
- ✅ Scalable
- ✅ Secure
- ✅ Maintainable
- ✅ Cost-effective
- ✅ Production-ready

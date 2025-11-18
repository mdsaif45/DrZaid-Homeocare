# Dr. ZAID's Homeo Care - Clinic Management System

A comprehensive, production-ready web application for homeopathy clinic management with integrated EMR (Electronic Medical Records) system.

## Features

### Public Website
- 🏠 Home page with clinic introduction
- 👨‍⚕️ About page with doctor's profile
- 💊 Services listing and treatment information
- 📞 Contact page with Google Maps integration
- 📅 Online appointment booking
- 📱 WhatsApp integration
- 📝 Blog/Articles section

### EMR Dashboard (Private)
- 👥 Patient management (CRUD operations)
- 📋 Case records (minimalist, homeopathy-focused)
- 💊 Prescription tracking
- 📅 Appointment management
- 📁 File uploads for investigation reports
- 🔍 Advanced search (by patient, remedy, tags)
- 📊 Patient timeline view
- 🎤 Voice-to-text case recording (planned)
- 🧾 Invoice generation (planned)

## Tech Stack

### Frontend
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **Routing**: React Router v6
- **State Management**: Zustand
- **Forms**: React Hook Form + Zod
- **HTTP Client**: Axios

### Backend
- **Runtime**: Node.js 20+
- **Framework**: Express.js + TypeScript
- **Database**: PostgreSQL 15+
- **Authentication**: JWT
- **File Upload**: Multer
- **Email**: Nodemailer
- **Logging**: Winston
- **Security**: Helmet, CORS, Rate Limiting

### DevOps
- **Containerization**: Docker + Docker Compose
- **Web Server**: Nginx
- **CI/CD**: GitHub Actions (planned)

## Project Structure

```
DrZaid-Homeocare/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── layouts/       # Layout components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── services/      # API service layer
│   │   ├── store/         # State management
│   │   └── utils/         # Utility functions
│   └── package.json
│
├── server/                # Node.js backend
│   ├── src/
│   │   ├── config/        # Configuration files
│   │   ├── controllers/   # Route controllers
│   │   ├── models/        # Data models
│   │   ├── routes/        # API routes
│   │   ├── middleware/    # Custom middleware
│   │   ├── services/      # Business logic
│   │   └── utils/         # Utility functions
│   └── package.json
│
├── database/
│   ├── migrations/        # SQL migration files
│   └── setup.sql          # Initial setup script
│
├── docs/                  # Documentation
├── docker-compose.yml     # Docker orchestration
└── README.md              # This file
```

## Getting Started

### Prerequisites

- **Node.js** 20+ ([Download](https://nodejs.org/))
- **PostgreSQL** 15+ ([Download](https://www.postgresql.org/download/))
- **Git** ([Download](https://git-scm.com/))
- **Docker** (optional, for containerized deployment)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/DrZaid-Homeocare.git
   cd DrZaid-Homeocare
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Setup PostgreSQL Database**
   ```bash
   # Create database and user
   psql -U postgres

   CREATE DATABASE homeocare_db;
   CREATE USER homeocare_user WITH PASSWORD 'your_secure_password';
   GRANT ALL PRIVILEGES ON DATABASE homeocare_db TO homeocare_user;
   \q

   # Run migrations
   psql -U homeocare_user -d homeocare_db -f database/setup.sql
   ```

4. **Configure environment variables**
   ```bash
   # Backend
   cd server
   cp .env.example .env
   # Edit .env with your configuration

   # Client (if needed)
   cd ../client
   cp .env.example .env
   ```

5. **Start development servers**
   ```bash
   # From root directory
   npm run dev

   # Or individually:
   npm run dev:client   # Frontend on http://localhost:5173
   npm run dev:server   # Backend on http://localhost:3000
   ```

### Using Docker

```bash
# Development
docker-compose up

# Production
docker-compose --profile production up -d
```

## Development

### Frontend Development
```bash
cd client
npm run dev        # Start dev server
npm run build      # Build for production
npm run preview    # Preview production build
```

### Backend Development
```bash
cd server
npm run dev        # Start dev server with hot reload
npm run build      # Compile TypeScript
npm start          # Start production server
```

### Database Migrations

Migration files are located in `database/migrations/`. They are numbered sequentially:

1. `001_create_users.sql` - User authentication table
2. `002_create_patients.sql` - Patient information
3. `003_create_case_records.sql` - EMR case records
4. `004_create_prescriptions.sql` - Prescription tracking
5. `005_create_appointments.sql` - Appointment management

To run migrations:
```bash
psql -U homeocare_user -d homeocare_db -f database/setup.sql
```

## API Documentation

### Base URL
- Development: `http://localhost:3000/api`
- Production: `https://your domain.com/api`

### Authentication Endpoints
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

### Patient Endpoints
- `GET /api/patients` - List all patients
- `GET /api/patients/:id` - Get patient details
- `POST /api/patients` - Create new patient
- `PUT /api/patients/:id` - Update patient
- `DELETE /api/patients/:id` - Delete patient

See [API_DOCUMENTATION.md](docs/API_DOCUMENTATION.md) for complete API reference.

## Deployment

### Production Deployment with Docker

1. **Build and start containers**
   ```bash
   docker-compose --profile production up -d
   ```

2. **Setup SSL** (using Let's Encrypt)
   ```bash
   # Install certbot
   sudo apt-get install certbot python3-certbot-nginx

   # Get certificate
   sudo certbot --nginx -d yourdomain.com
   ```

3. **Configure environment**
   - Set all production environment variables
   - Update `CORS_ORIGIN` to your domain
   - Generate secure `JWT_SECRET` keys

### Hosting Options

**Budget Option ($10-15/month)**
- Railway.app or Render.com
- Includes database and hosting

**Production Option ($30-50/month)**
- DigitalOcean Droplet
- Managed PostgreSQL
- Better performance and control

## Security

- ✅ JWT authentication
- ✅ Password hashing with bcrypt
- ✅ HTTPS/SSL enforced in production
- ✅ CORS protection
- ✅ Rate limiting
- ✅ Helmet.js security headers
- ✅ Input validation
- ✅ SQL injection prevention
- ✅ XSS protection

## Testing

```bash
# Frontend
cd client
npm test

# Backend
cd server
npm test
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is proprietary and confidential. Unauthorized copying or distribution is prohibited.

## Support

For support, email dr.zaid@homeocare.com or create an issue in the repository.

## Acknowledgments

- Built with ❤️ for homeopathic healthcare
- Designed specifically for Dr. MD Zaid's practice
- Focus on simplicity and efficiency

---

**Status**: 🚧 In Development (Phase 1: Foundation Complete)

**Next Phase**: Authentication & Patient Management

See [IMPLEMENTATION_ROADMAP.md](IMPLEMENTATION_ROADMAP.md) for detailed development timeline.
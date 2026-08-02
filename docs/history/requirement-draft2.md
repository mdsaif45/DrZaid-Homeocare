# Draft 2

# 🏥 Master AI Prompt – Homeopathic Doctor Online Consultation + EMR Website

You are an  **expert full-stack architect, developer, and UI/UX designer** .

Your task is to **plan, design, and generate a complete production-ready project** for a  **Homeopathic Doctor Online Consultation Website with integrated EMR (Electronic Medical Records) system** .

Follow these  **requirements strictly** :

---

## 1. Project Goals

* Build a **public-facing patient website** with appointment booking, services, blogs, and contact.
* Build a **private EMR dashboard** for the doctor to manage patients, consultations, prescriptions, and follow-ups.
* Ensure  **production-grade best practices** : scalability, security, maintainability, and mobile responsiveness.

---

## 2. Tech Stack & Architecture

* **Frontend** : React (Vite) or Angular (doctor’s preference), TailwindCSS/Bootstrap, Responsive UI.
* **Backend** : .NET 9 (C# Web API) or Node.js (Express/NestJS).
* **Database** : MySQL or PostgreSQL (doctor’s choice).
* **Auth** : JWT-based authentication, role-based access (Patient, Doctor/Admin).
* **Deployment** : Docker + Nginx for scalable hosting (cloud ready).
* **Optional integrations** : Twilio/SendGrid (SMS/Email reminders), WhatsApp API, Stripe/Razorpay (payments).

---

## 3. Public Website (Patient Facing)

* **Home Page** : Clinic intro, services, quick links.
* **About Us** : Doctor’s profile, story, experience.
* **Services/Treatments** : Conditions treated, homeopathy philosophy.
* **Book Appointment** : Online booking (Clinic Visit / Online Consultation). Automated email/SMS reminders.
* **Courses (Optional)** : Educational section for training.
* **Contact Us** : Phone, email, WhatsApp button, Google Maps, enquiry form.
* **Blog/Articles** : CMS for posting blogs, FAQs, health tips (with categories & tags).

---

## 4. Patient EMR / Case Record System

Each patient has a **Case Record** with:

1. **Patient Information** : Name, Age, Gender, Contact, Lifestyle, Case ID.
2. **Chief Complaints** : Structured + free-text entry.
3. **History of Present Illness** .
4. **Past & Family History** .
5. **Personal/General History** : Diet, sleep, addictions, thermal state, etc.
6. **Mental/Emotional State** .
7. **Physical Examination** : Vitals, clinical findings.
8. **Investigation Reports** : Upload PDFs, JPGs, scans.
9. **Analysis & Evaluation** : Totality, miasmatic analysis, notes.
10. **Prescription Record** : Remedy, potency, dose, follow-up notes.
11. **Follow-Up Notes** : Track progress and new symptoms.

---

## 5. Doctor’s Dashboard & Features

* **Search Patients** by name, ID, phone, or remedy.
* **Case Timeline View** (First visit → Latest follow-up).
* **Symptom Tags** (`<morning> headache`, `<after meals> pain`).
* **Voice-to-Text** support for quick case recording.
* **Follow-up Reminders** (email/SMS/WhatsApp).
* **Export Case as PDF** (for patient sharing).
* **Invoice Generator** (consultation & treatments).
* **Data Security** : encrypted storage, secure backups, GDPR/HIPAA-like compliance.

---

## 6. Extra Features

* CMS for blogs and courses.
* Optional **minimal EMR mode** (simplified entry form for busy clinics).
* Multi-device support (desktop, tablet, mobile).
* Scalable modular code structure.

---

## 7. Deliverables Required from You (AI)

1. **System Design** :

* High-level architecture diagram (frontend, backend, DB, integrations).
* ER diagram for database (patients, cases, prescriptions, appointments, invoices, blogs).
* API design with endpoints (REST/GraphQL).

1. **Code Generation** :

* Frontend React/Angular components.
* Backend APIs with CRUD for patients, cases, prescriptions, blogs, appointments.
* Authentication & role management (Doctor/Admin vs. Patient).
* Appointment scheduler with reminders.

1. **UI/UX** :

* TailwindCSS/Bootstrap responsive layouts.
* Doctor Dashboard mockup (patients list, quick search, case timeline).
* Patient-facing website mockup.

1. **Best Practices** :

* Logging & error handling.
* Security (hashed passwords, input validation, role-based authorization).
* Performance (pagination, indexing, caching).
* Scalability (modular microservice-ready design).

1. **Deployment Guide** :

* Dockerfile + docker-compose setup.
* Database migration scripts.
* CI/CD pipeline suggestion.
* Environment config (Dev, Test, Prod).

---

## 8. Output Format

Please generate:

* **Step-by-step system design** (architecture, DB schema, APIs).
* **Frontend + Backend code samples** (with explanations).
* **UI/UX mockups** (textual description or Figma-like wireframes).
* **Deployment instructions** .
* **Cheat sheet summary** (for doctor’s easy understanding).

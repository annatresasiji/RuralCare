# 🏥 RuralCare — Cloud-Based Rural Telemedicine Assistance Platform

**End-Semester Cloud Computing Project**

---

## ☁️ Google Cloud Services Used

| Service | Purpose |
|---|---|
| **Cloud Run** | Hosts the Express.js backend API |
| **Cloud Storage** | Stores medical records (PDFs, scans, prescriptions) |
| **BigQuery** | Healthcare analytics — disease trends, patient insights |
| **Cloud Functions** | Emergency alerts + appointment notifications |

---

## 🚀 How to Run (5 minutes)

### Prerequisites
- Node.js LTS → https://nodejs.org

### Step 1 — Start Backend
```bash
cd backend
npm install
# Add your Anthropic API key to .env
npm run dev
```
Backend runs at: **http://localhost:4000**

### Step 2 — Start Frontend (new terminal)
```bash
cd frontend
npm install
npm run dev
```
Frontend runs at: **http://localhost:5173**

### Step 3 — Open Browser
Go to **http://localhost:5173** ✅

---

## 📁 Structure

```
RuralCare/
├── backend/          ← Express API (Cloud Run)
│   ├── config/       ← GCP client initialisation
│   ├── middleware/   ← Firebase Auth verification
│   ├── routes/       ← API endpoints
│   └── services/     ← Cloud Storage, BigQuery, Pub/Sub
├── frontend/         ← React + Vite
│   └── src/
│       ├── components/
│       ├── hooks/
│       └── data/
└── cloud-functions/  ← Cloud Functions source code
    ├── emergency-alert/
    └── appointment-notify/
```

---

## 🎯 Features

- ✅ User Registration / Login (Firebase Auth)
- ✅ AI Symptom Checker (Vertex AI / Claude)
- ✅ Doctor & Hospital Finder (location-based)
- ✅ Appointment Booking (BigQuery logged)
- ✅ Medical Record Upload (Cloud Storage)
- ✅ Emergency Alert System (Pub/Sub → Cloud Functions)
- ✅ Mental Health AI Chat
- ✅ Follow-up Care Tracker
- ✅ Admin Dashboard (BigQuery analytics)

---

## 👥 Team

- (Add names)
- (Add roll numbers)

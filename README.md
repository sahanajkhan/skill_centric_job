# 🚀 Skill-Centric Unified Job Aggregator & AI Project Builder

An AI-driven job aggregation, transparent skill-matching, and career project generator platform that connects candidates to opportunities based on what they can actually build.

---

## 🏗️ System Architecture

```
[ Frontend: React + Vite + CSS ]
           │
           ▼ (HTTP/REST + JWT)
[ Backend: Node.js + Express + MongoDB Atlas ]
           │
           ▼ (Microservice REST on :8000)
[ AI Service: Python + FastAPI + NLP + Scikit-Learn ]
     ├── Resume Parser (PDF / DOCX / Text via pdfplumber)
     ├── Skill Taxonomy & Normalizer ("ReactJS" -> "React")
     ├── Transparent Weighted Matching Engine (Skills 50%, Role 20%, Exp 10%, Remote 10%, Tech 10%)
     ├── Free API Ingestion & Deduplicator (Remotive, Arbeitnow, USAJobs)
     └── AI Skill-Gap Project Blueprint Generator
```

---

## 🌟 Key Features

1. **Automatic Skill Extraction & Normalization**:
   - Drag & drop PDF resumes (e.g. `Riya Bansal Resume.pdf`).
   - Standardizes variations like `ReactJS` → `React`, `Node` → `Node.js`, `Mongo` → `MongoDB`.
2. **Transparent Multi-Factor Matching**:
   - 5-factor scoring engine with explainable reasons (e.g., matched core skills vs growth opportunities).
3. **Official Free Job APIs & Deduplication**:
   - Ingests real remote jobs from **Remotive** and **Arbeitnow** public APIs without requiring paid keys.
   - Fuzzy NLP deduplication across job providers.
4. **Skill-Gap AI Project Builder**:
   - Generates full architecture plans, DB schemas, REST API endpoints, folder structures, and roadmaps tailored to bridge missing candidate skills.
5. **Saved Bookmarks & Application Pipeline**:
   - Bookmarking and logging application outreach with direct links to original verified sources.

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js**: v18+ (tested on v24.12.0)
- **Python**: 3.10+ (tested on Python 3.13.3)
- **MongoDB**: MongoDB Atlas or Local MongoDB

---

### 2. Running AI Microservice (Port 8000)

```bash
cd ai
pip install -r requirements.txt
python -m uvicorn ai.main:app --host 127.0.0.1 --port 8000 --reload
```
*Health Probe*: `http://localhost:8000/health`

---

### 3. Running Backend API (Port 5000)

```bash
cd backend
npm install
npm run dev
# or: node server.js
```
*Backend API*: `http://localhost:5000`
*Health Check*: `http://localhost:5000/api/health`

---

### 4. Running Frontend (Port 5173)

```bash
cd frontend
npm install
npm run dev
```
*Open in browser*: `http://localhost:5173`

---

## 🧪 Running Automated Test Suites

### AI Microservice Tests
```bash
python -m unittest ai/tests/test_ai_suite.py
```

### Backend & Microservice Integration Tests
```bash
cd backend
node tests/api.test.js
```

### Frontend Production Build Test
```bash
cd frontend
npm run build
```

---

## 📡 API Endpoints Overview

| Service | Method | Route | Description |
|---|---|---|---|
| **AI** | `GET` | `/health` | Health check |
| **AI** | `POST` | `/api/extract-resume` | Extract skills from PDF/DOCX |
| **AI** | `POST` | `/api/match-jobs` | Multi-factor weighted job matching |
| **AI** | `POST` | `/api/generate-project-plan` | Architecture & task generator |
| **Backend** | `POST` | `/api/auth/register` | User signup & JWT issuance |
| **Backend** | `POST` | `/api/auth/login` | User authentication |
| **Backend** | `GET` | `/api/skills` | Active user skills & analysis |
| **Backend** | `POST` | `/api/skills/resume` | Upload PDF resume |
| **Backend** | `GET` | `/api/jobs` | Filtered job listings |
| **Backend** | `GET` | `/api/jobs/feed` | Personalized AI job matches |
| **Backend** | `POST` | `/api/jobs/sync` | Sync live listings from free APIs |
| **Backend** | `GET` | `/api/jobs/sources` | API transparency directory |
| **Backend** | `POST` | `/api/saved-jobs` | Bookmark opportunity |
| **Backend** | `POST` | `/api/applications` | Track submitted application |
| **Backend** | `POST` | `/api/recommendations/generate-project` | Generate and save blueprint |

---

## 🐳 Docker Deployment

```bash
docker-compose up --build
```
Spins up `skill_centric_ai` on `:8000`, `skill_centric_backend` on `:5000`, and `skill_centric_frontend` on `:5173`.

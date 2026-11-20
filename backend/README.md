# Skill-Centric Job Aggregator — Backend API

Production-ready layered MERN backend with AI-powered resume skill extraction, provider-independent job aggregation, transparent skill matching, and personalized career recommendations.

---

## 🏗 Architecture Overview

```
Routes
  ↓
Middleware (Auth JWT, Multer Upload, Centralized Error Handling)
  ↓
Controllers (Request handling, Validation, Response Formatting)
  ↓
Services (Business logic, AI Communication, Aggregation Engine)
  ↓
Models (Mongoose Schemas: User, Skill, Job, SavedJob, Application, GeneratedProject)
  ↓
MongoDB Database
```

Dedicated external service adapters:
- **`aiService.js`**: Communicates with the FastAPI AI Microservice (`http://127.0.0.1:8000`) for NLP resume parsing, transparent job scoring, and project blueprint generation. Features resilient fallback logic when the AI service is offline.
- **`jobProviders/`**: Pluggable provider adapter modules (`remotiveProvider.js`, `arbeitnowProvider.js`) ensuring high availability for job data.

---

## 🚀 Quick Start

### 1. Prerequisites
- Node.js v18+
- MongoDB instance (local or MongoDB Atlas connection string)
- Python 3.9+ (for running the optional FastAPI AI microservice)

### 2. Installation

Navigate to the `backend` directory and install dependencies:

```bash
cd backend
npm install
```

### 3. Environment Configuration

Create a `.env` file inside the `backend` directory (refer to `.env.example`):

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/skill_centric
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d
AI_SERVICE_URL=http://127.0.0.1:8000
FRONTEND_URL=http://localhost:5173
GOOGLE_CLIENT_ID=your_google_client_id_optional
```

### 4. Running the Servers

#### Start Backend (Development mode with Nodemon)
```bash
npm run dev
```

#### Start Backend (Production mode)
```bash
npm start
```

#### Start Python AI Service (in a separate terminal)
```bash
cd ../ai
pip install -r requirements.txt
python main.py
```

---

## 🔑 Authentication Flow

All protected endpoints require a valid JWT passed in the HTTP Authorization header:

```
Authorization: Bearer <JWT_TOKEN>
```

---

## 📡 Complete API Reference

### 🔐 Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new user account (`name`, `email`, `password`) |
| `POST` | `/api/auth/login` | Public | Authenticate user & return JWT token |
| `POST` | `/api/auth/google` | Public | OAuth Google login/register |
| `GET` | `/api/auth/me` | Protected | Get authenticated user profile |

### 🛠 Skill Management (`/api/skills`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/skills` | Protected | Add skill with automatic AI normalization |
| `GET` | `/api/skills` | Protected | Fetch user's verified and extracted skill set |
| `PUT` | `/api/skills/:id` | Protected | Update skill name/category |
| `DELETE` | `/api/skills/:id` | Protected | Remove skill from profile |
| `POST` | `/api/skills/resume` | Protected | Upload resume (PDF/DOCX) or paste text to extract skills |
| `POST` | `/api/resume/upload` | Protected | Alias route for resume upload |

### 💼 Jobs & Aggregation (`/api/jobs`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/jobs` | Public | Paginated job search (`search`, `skill`, `role`, `remote`, `page`, `limit`) |
| `GET` | `/api/jobs/search` | Public | Alias search endpoint |
| `GET` | `/api/jobs/:id` | Public | Get single job details by ID |
| `GET` | `/api/jobs/recommended` | Protected | Get jobs matched against user skills with match percentage |
| `GET` | `/api/jobs/feed` | Protected | Alias for personalized match feed |
| `GET` | `/api/jobs/match` | Protected | Alias for skill match scoring |
| `POST` | `/api/jobs/sync` | Public/Admin | Trigger live synchronization from job providers |
| `GET` | `/api/jobs/sources` | Public | Get status and metadata of integrated job provider APIs |

### 📌 Saved Jobs & Applications
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/saved-jobs` | Protected | Bookmark/save a job |
| `GET` | `/api/saved-jobs` | Protected | List user saved jobs |
| `DELETE` | `/api/saved-jobs/:jobId` | Protected | Remove saved job |
| `POST` | `/api/applications` | Protected | Track job application status |
| `GET` | `/api/applications` | Protected | List user job applications |

### 💡 AI Recommendations & Project Builder (`/api/recommendations`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/recommendations/analysis` | Protected | Get skill gap analysis & career readiness |
| `GET` | `/api/recommendations/projects` | Protected | Get recommended portfolio projects |
| `POST` | `/api/recommendations/generate-project` | Protected | Generate full AI project architecture & step-by-step roadmap |
| `GET` | `/api/recommendations/user-projects` | Protected | View saved user project blueprints |

---

## 🧪 Testing

Run the automated integration test suite:

```bash
node tests/api.test.js
```

---

## 🛡 Security Practices

- Passwords are hashed using bcrypt with salt rounds = 10.
- Passwords are excluded from user queries by default (`select: false`).
- Input normalization and Mongoose Schema validation.
- Centralized error handling masks internal trace details in production (`NODE_ENV === "production"`).

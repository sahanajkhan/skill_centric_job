from typing import List, Dict, Any

def generate_custom_project_blueprint(
    target_role: str,
    existing_skills: List[str],
    missing_skills: List[str],
    difficulty: str = "Intermediate",
    preferred_stack: str = "MERN / Modern Fullstack",
    job_requirements: str = ""
) -> Dict[str, Any]:
    role_name = target_role or "Full Stack Software Engineer"
    key_gap = missing_skills[0] if missing_skills else "Cloud & CI/CD"
    secondary_gap = missing_skills[1] if len(missing_skills) > 1 else "Testing"
    
    title = f"Production-Grade {role_name} Platform with {key_gap}"
    
    problem_statement = (
        f"Modern tech companies hiring for {role_name} expect real-world competency in both core engineering "
        f"and modern cloud/infrastructure practices like {key_gap}. This portfolio project bridges your gap in "
        f"{', '.join(missing_skills[:3]) or 'scalable system architecture'} by building a real, highly responsive "
        f"distributed web service."
    )
    
    features = [
        "User authentication and role-based access control (JWT & OAuth2)",
        f"High-performance data aggregation and search incorporating {key_gap}",
        "Real-time event logging, metrics tracking, and analytics dashboard",
        "Responsive glassmorphic UI with dark mode and dynamic state management",
        f"Automated test coverage and automated containerization with {secondary_gap or 'Docker'}"
    ]
    
    tech_stack = {
        "frontend": "React, Vite, Vanilla CSS / Tailwind, React Router, Lucide Icons",
        "backend": "Node.js, Express / Python FastAPI",
        "database": "MongoDB / PostgreSQL with indexing",
        "devops_cloud": f"{key_gap}, Docker, GitHub Actions CI/CD",
        "testing": "Jest, Supertest, PyTest"
    }
    
    database_schema = {
        "Users": {
            "id": "ObjectId / UUID (Primary Key)",
            "name": "String",
            "email": "String (Unique, Indexed)",
            "passwordHash": "String (Bcrypt)",
            "role": "String (Enum: candidate, admin)",
            "createdAt": "Timestamp"
        },
        "Resources": {
            "id": "ObjectId / UUID",
            "ownerId": "ObjectId (Foreign Key -> Users)",
            "title": "String (Text Indexed)",
            "metadata": "JSON / BSON",
            "tags": "Array of Strings",
            "status": "String (Enum: draft, published, archived)",
            "updatedAt": "Timestamp"
        },
        "Analytics": {
            "id": "ObjectId",
            "userId": "ObjectId",
            "actionType": "String",
            "timestamp": "Timestamp"
        }
    }
    
    api_design = [
        {"method": "POST", "endpoint": "/api/v1/auth/register", "description": "Registers new user with hashed credentials"},
        {"method": "POST", "endpoint": "/api/v1/auth/login", "description": "Authenticates user and signs JWT token"},
        {"method": "GET", "endpoint": "/api/v1/resources", "description": "Paginated list with full-text search and filters"},
        {"method": "POST", "endpoint": "/api/v1/resources", "description": "Creates new resource entry with input validation"},
        {"method": "GET", "endpoint": "/api/v1/analytics/summary", "description": f"Aggregates system metrics utilizing {key_gap}"}
    ]
    
    folder_structure = """
project-root/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.jsx
│   ├── package.json
│   └── vite.config.js
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── server.js
│   ├── tests/
│   ├── package.json
│   └── .env.example
├── docker-compose.yml
├── Dockerfile
└── README.md
"""
    
    implementation_plan = [
        {"phase": "Phase 1: Environment & Architecture Setup", "detail": "Initialize Git, setup repository workspaces, configure ESLint and environment schemas."},
        {"phase": "Phase 2: Database Schema & Authentication", "detail": "Create database models, implement bcrypt password hashing and JWT middleware."},
        {"phase": "Phase 3: Core Business Logic & APIs", "detail": "Implement REST endpoints with data validation and pagination."},
        {"phase": f"Phase 4: Integration of {key_gap}", "detail": f"Configure and integrate {key_gap} into the workflow to master the target requirement."},
        {"phase": "Phase 5: Responsive Frontend Experience", "detail": "Build the user interface with state management, loading states, and error handling."},
        {"phase": "Phase 6: Testing & CI/CD Pipeline", "detail": "Write unit and integration tests, configure GitHub Actions workflow for automated validation."}
    ]
    
    development_tasks = [
        "Initialize backend with Express/FastAPI and establish DB connection with retry logic",
        "Implement secure authentication routes with unit tests",
        f"Develop {key_gap} module with clear error boundary handling",
        "Build modern frontend dashboard with responsive layout",
        "Containerize services using Docker and Docker Compose",
        "Deploy to free tier cloud provider (Render / Vercel / Railway)"
    ]
    
    testing_strategy = (
        "Unit testing for all controller utilities and data normalization functions. "
        "Integration tests verifying end-to-end API response codes and JWT authorization headers. "
        "Component testing for critical frontend workflows."
    )
    
    deployment_strategy = (
        "Dockerized multi-stage container build. Frontend deployed to Vercel/Netlify with CDN caching. "
        "Backend containerized and deployed on Render/Railway. MongoDB Atlas for managed database."
    )
    
    return {
        "title": title,
        "difficulty": difficulty,
        "targetRole": role_name,
        "problemStatement": problem_statement,
        "features": features,
        "technologyStack": tech_stack,
        "databaseSchema": database_schema,
        "apiDesign": api_design,
        "folderStructure": folder_structure.strip(),
        "implementationPlan": implementation_plan,
        "developmentTasks": development_tasks,
        "testingStrategy": testing_strategy,
        "deploymentStrategy": deployment_strategy,
        "skillsTargeted": {
            "existing": existing_skills,
            "gapBridged": missing_skills[:4]
        }
    }

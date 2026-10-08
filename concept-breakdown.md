# Concept.md — Structured Breakdown

> Source: `/home/code/ausbildungsapp-ihk/concept.md` (503 lines)

---

## 1. Platform Overview

**Purpose:** Digital platform for managing IT apprenticeships (IT-Ausbildung) at the IHK (Chamber of Industry and Commerce).

**Core Principles:**
- Structured learning paths (curriculum → courses → tasks)
- Progress tracking at multiple levels
- Assessment & evaluation with feedback loops
- Reporting & analytics for stakeholders
- AI-powered knowledge management and recommendation
- Role-based access control (RBAC) for different participants

**Tech Stack Highlights:**
- NestJS (backend), PostgreSQL + pgvector, Prisma (ORM)
- Ollama (local LLM) / OpenRouter / LiteLLM for AI
- Docker Compose + Traefik for deployment

---

## 2. User Management & RBAC

### User Roles
| Role | Identifier | Typical Users |
|---|---|---|
| `azubi` | Apprentice | IT apprentices |
| `ausbilder` | Mentor / Trainer | Assigned instructors |
| `ausbildungsbeauftragter` | Training Manager | HR / training coordinators |
| `hr` | HR Personnel | HR department |
| `admin` | Administrator | Platform admins |

### RBAC Model
- **n:m relationship** via `user_roles` table
- Roles are mapped from Entra ID / OIDC groups
- Guards protect endpoints; default is **protected**
- `@Public()` decorator marks public endpoints
- Impersonation mode: read-only impersonation with audit logging
- RBAC scoping via `AccessScopeService`

### Key Features
- JWT-based authentication
- OIDC/OAuth2 with Entra ID (Microsoft Identity Platform)
- Group-to-role mapping with fallback
- Impersonation with data protection compliance

---

## 3. Frameworks & Standards

### Purpose
Define the curriculum structure and learning objectives for the apprenticeship program.

### Core Concepts
- **Framework** = A structured curriculum (e.g., "IT-System-Elektroniker 2024")
- Contains learning objectives, modules, and competencies
- Tied to IHK examination requirements
- Supports multiple frameworks (different professions / years)

### Features
- Framework CRUD (create, read, update, delete)
- Module definition within frameworks
- Competency tracking against framework objectives
- Versioning / lifecycle for framework updates

---

## 4. Course Management

### Purpose
Structure and deliver learning content organized in courses.

### Core Concepts
- **Course** = A time-bound learning unit within a framework/module
- Has a schedule, participants, and learning materials
- Linked to tasks and assessments

### Features
- Course CRUD operations
- Enrollment management (assign apprentices)
- Course materials (documents, links, resources)
- Attendance tracking
- Course status lifecycle (planned → active → completed)

---

## 5. Task Management & Progress Tracking

### Purpose
Track individual learning tasks and apprentice progress.

### Core Concepts
- **Task** = A discrete learning activity (exercise, project, assignment)
- Tasks belong to courses or frameworks
- Each apprentice has a **task status** per task
- Progress is aggregated across tasks

### Workflow / State Transitions
```
task states:
  TODO → IN_PROGRESS → REVIEW → COMPLETED
                    ↘ FAILED ──→ TODO (reassign)
```

### Features
- Task assignment to apprentices
- Task status tracking with transitions
- Due dates and reminders
- Progress dashboard (individual + aggregated)
- Task templates for reuse
- Attachment support (files, links)

---

## 6. Assessment & Evaluation

### Purpose
Formal evaluation of apprentice performance and learning outcomes.

### Core Concepts
- **Assessment** = A structured evaluation event
- Linked to tasks, courses, or frameworks
- Includes scores, comments, and feedback
- Tied to IHK examination criteria

### Features
- Assessment creation and scoring
- Multi-dimensional evaluation (competencies, knowledge, skills)
- Feedback mechanism (mentor → apprentice)
- Self-assessment support
- Assessment history and trends
- Export capability for IHK reports

---

## 7. Reports & Analytics

### Purpose
Provide insights into program performance and individual progress.

### Core Concepts
- **Report** = A generated view of data (individual or aggregated)
- Analytics dashboards for different roles
- Real-time and historical data

### Report Types
| Type | Audience | Content |
|---|---|---|
| Individual progress report | Apprentice, Mentor | Task completion, scores, gaps |
| Program overview | Training Manager, HR | Enrollment, completion rates, bottlenecks |
| Competency analysis | Admin, Training Manager | Framework coverage, skill gaps |
| Examination readiness | Mentor, Apprentice | Assessment trends, predicted outcomes |

### Features
- Dashboard with role-specific views
- Filtering and segmentation
- Export (PDF, CSV)
- Scheduled report generation
- Data visualization (charts, progress bars)

---

## 8. AI Services & Knowledge Management

### Purpose
Leverage AI for knowledge retrieval, recommendations, and intelligent assistance.

### Core Concepts
- **Knowledge Base** = Vector-stored learning materials and documentation
- **RAG (Retrieval-Augmented Generation)** = Retrieve relevant context → LLM generates response
- Centralized `AiService` / `LlmGateway` abstraction

### Features
- **Intelligent Q&A** — Ask questions about curriculum, regulations, procedures
- **Learning recommendations** — Suggest next topics/tasks based on progress
- **Content summarization** — Summarize learning materials
- **Assistive writing** — Help draft feedback, reports, or assessments
- **Semantic search** — Vector similarity search across knowledge base (pgvector)
- Multi-provider support: Ollama (local), OpenRouter, LiteLLM

### Architecture
```
User Query → AiService → LlmGateway → [Ollama | OpenRouter | LiteLLM]
                ↓
         Knowledge Base (pgvector)
                ↓
         Retrieval (semantic search)
                ↓
         RAG pipeline → Response
```

---

## 8. Deployment & Infrastructure

### Purpose
Containerized, scalable deployment with production-ready tooling.

### Components
- **Docker Compose** — Local development and staging
- **Dockerfile** — Multi-stage builds for production
- **Traefik** — Reverse proxy, TLS termination, routing
- **GitHub Actions** — CI/CD pipeline
- **PostgreSQL + pgvector** — Database with vector search support

### Environments
| Environment | Purpose |
|---|---|
| Local | Development with Docker Compose |
| Staging | Pre-production testing |
| Production | Live deployment |

### Features
- Health checks
- Logging and monitoring
- Secret management
- Database migrations (Prisma, `synchronize: false` in prod)

---

## 10. External Integrations

| Integration | Purpose | Location |
|---|---|---|
| **Entra ID (Microsoft Identity)** | OIDC/OAuth2 authentication, group-based role mapping | Auth module |
| **Ollama** | Local LLM inference for AI services | AiService |
| **OpenRouter / LiteLLM** | Cloud LLM fallback and provider abstraction | LlmGateway |
| **IHK Standards** | Examination requirements, competency frameworks | Framework module |

---

## Data Model Summary (Key Entities)

| Entity | Key Fields | Relationships |
|---|---|---|
| `User` | id, email, roles | ↔ UserRoles, ↔ Assessments |
| `UserRoles` | userId, roleId | ↳ User, ↳ Role |
| `Role` | id, name (azubi, ausbilder, etc.) | ↳ UserRoles |
| `Framework` | id, name, version, status | ↔ Module, ↔ Competency |
| `Module` | id, frameworkId, name | ↳ Framework, ↔ Course |
| `Course` | id, moduleId, startDate, endDate, status | ↳ Module, ↔ Enrollment, ↔ Task |
| `Enrollment` | courseId, userId | ↳ Course, ↳ User |
| `Task` | id, courseId, title, type, status, dueDate | ↳ Course, ↳ TaskStatus |
| `TaskStatus` | taskId, userId, status (TODO/IN_PROGRESS/REVIEW/COMPLETED/FAILED) | ↳ Task, ↳ User |
| `Assessment` | id, taskId, userId, score, feedback, dimension | ↳ Task, ↳ User |
| `KnowledgeDocument` | id, content, embedding | ↳ Vector store (pgvector) |
| `Report` | id, type, generatedAt, data | — |

---

## Cross-Cutting Concerns

### Security
- JWT authentication with Guards
- RBAC with scoping (`AccessScopeService`)
- Zero-Trust architecture principles
- OWASP Top 10 compliance
- GDPR/DSGVO compliance (impersonation audit logging)
- Secret management, CORS, rate-limiting

### Quality Bar
- Clean Code (KISS, SOLID, DRY)
- Strict TypeScript typing
- Comprehensive error handling (custom filters, exception filters)
- API versioning (`/api/v1/`)
- Consistent response format (`{ data, meta }` envelope)
- Swagger/OpenAPI documentation

### Development Practices
- Prisma migrations (`synchronize: false` in production)
- Atomic commits with conventional format
- Delta review workflow
- Dark/Light mode support (always enforced)
- Design system adherence

---

## Summary Statistics

| Category | Count |
|---|---|
| User Roles | 5 (azubi, ausbilder, ausbildungsbeauftragter, hr, admin) |
| Task States | 5 (TODO, IN_PROGRESS, REVIEW, COMPLETED, FAILED) |
| Framework Types | Multiple (profession/year-specific) |
| AI Providers | 3 (Ollama, OpenRouter, LiteLLM) |
| External Integrations | 4 (Entra ID, Ollama, OpenRouter/LiteLLM, IHK Standards) |
| Report Types | 4 (Individual, Program, Competency, Examination Readiness) |
# Service Layer Architecture

This document defines the service layer structure,
designed to decouple business logic from the HTTP
controller layer and provide a modular codebase.

## Service Registry

### 1. **AuthService**

- **Responsibilities**:
  - User registration (password hashing).
  - User authentication (password verification).
  - JWT management (issue, refresh, revoke/blacklist tokens).

### 2. **WorkoutService**

- **Responsibilities**:
  - Workout CRUD operations (Create, List, Update, Soft-Delete, Get details).
  - Manage workout exercises, set sequences, and exercise status.
  - Lifecycle management (`status` updates, scheduling).

### 3. **ExerciseService**

- **Responsibilities**:
  - Manage custom user exercises and system exercises.
  - Validate exercise ownership.

### 4. **CategoryService**

- **Responsibilities**:
  - Manage and list exercise categories for categorization logic.

### 5. **MeasurementService**

- **Responsibilities**:
  - CRUD operations on physical measurements (weight logs).
  - Historical data retrieval.

### 6. **ReportService**

- **Responsibilities**:
  - Aggregate workout and performance data.
  - Data transformation for progress reports and statistics.

---

## Architecture Principles

- **Thin Controllers**:
  Controllers should only handle input validation (via Zod middleware),
  invoke a service method, and map the service result to an HTTP response.

- **Thick Services**:
  Business rules
  (e.g., resource authorization, validation of sequences/status, data aggregation)
  reside entirely here.

- **Dependency Isolation**:
  Services interact with the database exclusively via the Prisma client.
  They do not have direct knowledge of the HTTP layer.

- **Error Propagation**:
  Services should throw standardized, meaningful errors
  (using custom `AppError` classes).
  Controllers are responsible for catching these errors
  and mapping them to appropriate HTTP status codes
  (e.g., `ResourceNotFoundError` maps to `404`).

- **Transactional Integrity**:
  Services must utilize `prisma.$transaction`
  for atomic operations involving multiple database writes,
  ensuring data consistency across complex workflows.

- **Service Inter-dependency**:
  Services should be designed to be stateless.
  Avoid circular dependencies.
  If cross-service logic is required,
  consider moving shared functionality
  to a utility (`lib/`) or an orchestrator service.

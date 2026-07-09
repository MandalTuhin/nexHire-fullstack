# nexHire HRMS — Technical Design (Sprint Review v2)

## Architecture

- **Backend**: Spring Boot 3.2.5, Java 17, PostgreSQL, JWT auth, Apache POI, OpenPDF
- **Frontend**: Angular 19, Angular Material, modular architecture (NgModules)
- **Storage**: Local filesystem (`uploads/`) for documents and generated PDFs
- **Auth**: Stateless JWT with role-based path security + method-level @PreAuthorize

## API Endpoints

### Auth (`/api/auth`)

| Method | Endpoint             | Auth   | Description              |
| ------ | -------------------- | ------ | ------------------------ |
| POST   | `/api/auth/register` | Public | Register candidate       |
| POST   | `/api/auth/login`    | Public | Login, returns JWT       |
| GET    | `/api/auth/me`       | Any    | Get current user profile |
| PUT    | `/api/auth/profile`  | Any    | Update own name/phone    |

### Candidate Profile (`/api/candidate-profile`)

| Method | Endpoint                          | Auth     | Description                     |
| ------ | --------------------------------- | -------- | ------------------------------- |
| GET    | `/api/candidate-profile`          | EMPLOYEE | Get own profile                 |
| GET    | `/api/candidate-profile/{userId}` | Any      | Get profile by user ID (HR use) |
| PUT    | `/api/candidate-profile`          | EMPLOYEE | Save/update profile             |

### Documents (`/api/documents`)

| Method | Endpoint                       | Auth     | Description                 |
| ------ | ------------------------------ | -------- | --------------------------- |
| POST   | `/api/documents/upload`        | EMPLOYEE | Upload document (multipart) |
| GET    | `/api/documents/my`            | EMPLOYEE | List own documents          |
| GET    | `/api/documents/user/{userId}` | HR       | List candidate's documents  |
| GET    | `/api/documents/download/{id}` | Any      | Download document file      |

### Jobs (`/api/jobs`)

| Method | Endpoint         | Auth   | Description      |
| ------ | ---------------- | ------ | ---------------- |
| GET    | `/api/jobs`      | Public | List active jobs |
| GET    | `/api/jobs/{id}` | Public | Get job details  |
| POST   | `/api/jobs`      | HR     | Create job       |

### Applications (`/api/applications`)

| Method | Endpoint                                  | Auth        | Description                           |
| ------ | ----------------------------------------- | ----------- | ------------------------------------- |
| POST   | `/api/applications`                       | EMPLOYEE    | Apply (blocked if profile incomplete) |
| GET    | `/api/applications/my`                    | EMPLOYEE    | Own applications                      |
| GET    | `/api/applications`                       | HR          | All applications (newest first)       |
| GET    | `/api/applications/{id}`                  | HR/EMPLOYEE | Get by ID                             |
| PUT    | `/api/applications/{id}/start-assessment` | HR          | Start assessment                      |

### Assessments (`/api/assessments`)

| Method | Endpoint                                   | Auth | Description    |
| ------ | ------------------------------------------ | ---- | -------------- |
| POST   | `/api/assessments/{applicationId}`         | HR   | Enter score    |
| PUT    | `/api/assessments/{applicationId}/qualify` | HR   | Mark qualified |
| PUT    | `/api/assessments/{applicationId}/reject`  | HR   | Mark rejected  |

### BGV (`/api/bgv`)

| Method | Endpoint                   | Auth | Description   |
| ------ | -------------------------- | ---- | ------------- |
| POST   | `/api/bgv/{applicationId}` | HR   | Initiate BGV  |
| GET    | `/api/bgv`                 | HR   | List all      |
| PUT    | `/api/bgv/{id}/status`     | HR   | Update status |

### HR Bulk Operations (`/api/hr`)

| Method | Endpoint                        | Auth | Description                               |
| ------ | ------------------------------- | ---- | ----------------------------------------- |
| GET    | `/api/hr/template`              | HR   | Download Excel template                   |
| POST   | `/api/hr/bulk-upload`           | HR   | Upload Excel (assessment+BGC+eligibility) |
| POST   | `/api/hr/bulk-generate-offers`  | HR   | Bulk generate PDF offer letters           |
| POST   | `/api/hr/bulk-generate-joining` | HR   | Bulk generate PDF joining letters         |

### Offers (`/api/offers`)

| Method | Endpoint                  | Auth     | Description  |
| ------ | ------------------------- | -------- | ------------ |
| GET    | `/api/offers/my`          | EMPLOYEE | Own offers   |
| PUT    | `/api/offers/{id}/accept` | EMPLOYEE | Accept offer |
| PUT    | `/api/offers/{id}/reject` | EMPLOYEE | Reject offer |

### Joining Letters (`/api/joining-letters`)

| Method | Endpoint                           | Auth     | Description         |
| ------ | ---------------------------------- | -------- | ------------------- |
| GET    | `/api/joining-letters/my`          | EMPLOYEE | Own joining letters |
| PUT    | `/api/joining-letters/{id}/accept` | EMPLOYEE | Accept joining      |

### Files (`/api/files`)

| Method | Endpoint                             | Auth | Description          |
| ------ | ------------------------------------ | ---- | -------------------- |
| GET    | `/api/files/offer/{applicationId}`   | Any  | Download offer PDF   |
| GET    | `/api/files/joining/{applicationId}` | Any  | Download joining PDF |

### Training (`/api/training`)

| Method | Endpoint                             | Auth     | Description                           |
| ------ | ------------------------------------ | -------- | ------------------------------------- |
| GET    | `/api/training/trainees`             | HR       | All trainees                          |
| GET    | `/api/training/my`                   | EMPLOYEE | Own training (auto-computed progress) |
| PUT    | `/api/training/{traineeId}/complete` | HR       | Mark complete                         |

### Projects (`/api/projects`)

| Method | Endpoint                                | Auth      | Description                     |
| ------ | --------------------------------------- | --------- | ------------------------------- |
| GET    | `/api/projects`                         | ADMIN/RMG | List all projects               |
| POST   | `/api/projects`                         | ADMIN     | Create project                  |
| PUT    | `/api/projects/{id}`                    | ADMIN     | Update project                  |
| DELETE | `/api/projects/{id}`                    | ADMIN     | Delete project                  |
| GET    | `/api/projects/eligible-trainees`       | RMG       | Training-completed trainees     |
| POST   | `/api/projects/{id}/assign/{traineeId}` | RMG       | Assign single                   |
| POST   | `/api/projects/{id}/assign-bulk`        | RMG       | Bulk assign (body: traineeId[]) |

### Locations (`/api/locations`)

| Method | Endpoint              | Auth | Description                     |
| ------ | --------------------- | ---- | ------------------------------- |
| GET    | `/api/locations`      | HR   | All locations with budget/seats |
| PUT    | `/api/locations/{id}` | HR   | Update budget/seats             |

### Dashboard (`/api/dashboard`)

| Method | Endpoint                  | Auth         | Description           |
| ------ | ------------------------- | ------------ | --------------------- |
| GET    | `/api/dashboard/stats`    | ADMIN/HR/RMG | Live computed metrics |
| GET    | `/api/dashboard/charts/*` | ADMIN/HR/RMG | Chart data            |

### Notifications (`/api/notifications`)

| Method | Endpoint                          | Auth | Description       |
| ------ | --------------------------------- | ---- | ----------------- |
| GET    | `/api/notifications/my`           | Any  | Own notifications |
| GET    | `/api/notifications/unread-count` | Any  | Unread count      |
| PUT    | `/api/notifications/{id}/read`    | Any  | Mark read         |
| PUT    | `/api/notifications/read-all`     | Any  | Mark all read     |

## Role Permissions Matrix

| Feature                     | ADMIN | HR  | RMG | EMPLOYEE             |
| --------------------------- | ----- | --- | --- | -------------------- |
| Register/Login              | -     | -   | -   | ✓ (public)           |
| Complete Profile            | -     | -   | -   | ✓                    |
| Upload Documents            | -     | -   | -   | ✓                    |
| View Jobs                   | -     | ✓   | -   | ✓                    |
| Apply for Jobs              | -     | -   | -   | ✓ (profile required) |
| Manage Assessments          | -     | ✓   | -   | -                    |
| Excel Bulk Upload           | -     | ✓   | -   | -                    |
| Manage BGC                  | -     | ✓   | -   | -                    |
| Bulk Generate Offers        | -     | ✓   | -   | -                    |
| Accept/Reject Offer         | -     | -   | -   | ✓                    |
| Bulk Generate Joining       | -     | ✓   | -   | -                    |
| Accept Joining Letter       | -     | -   | -   | ✓                    |
| View Training               | -     | ✓   | -   | ✓ (own)              |
| Manage Projects (CRUD)      | ✓     | -   | -   | -                    |
| Assign Trainees to Projects | -     | -   | ✓   | -                    |
| Manage Users/Roles          | ✓     | -   | -   | -                    |
| Manage Assets               | ✓     | -   | -   | -                    |
| View Budget/Capacity        | -     | ✓   | -   | -                    |
| View Dashboard              | ✓     | ✓   | ✓   | -                    |

## Data Model (Key Entities)

- `User` (id, name, email, password, phone, role, lifecycleStatus, active, profileComplete)
- `CandidateProfile` (userId, address, dob, class10%/year, class12%/year, btechCgpa/year, skills, locationPref1/2/3)
- `CandidateDocument` (userId, docType, fileName, filePath, uploadedAt)
- `Job` (title, description, requirements, locationId, active)
- `JobApplication` (userId, jobId, status, holdReason, appliedAt)
- `AssessmentResult` (applicationId, score, remarks, evaluatedBy)
- `BackgroundVerification` (applicationId, status [BgvStatus enum], vendorName, remarks)
- `OfferLetter` (applicationId, content [PDF path], sentBy, sentAt, respondedAt)
- `JoiningLetter` (applicationId, content [PDF path], joiningDate, locationId, sentBy)
- `Trainee` (userId, applicationId, joinedAt)
- `TrainingRecord` (traineeId, progress [auto-computed], topic, trainingStartDate, trainingEndDate, completed)
- `Project` (name, description, active, teamSize)
- `ProjectAssignment` (traineeId, projectId, assignedBy, assignedAt)
- `Location` (name, city)
- `HiringBudget` (locationId, totalSlots, usedSlots, budgetAmount, usedAmount)
- `TrainingSeat` (locationId, totalSeats, occupiedSeats)
- `Asset` / `AssetAssignment`
- `ActivityLog` / `Notification`

## Key Business Logic

1. **Profile gate**: User.profileComplete must be true before applying
2. **Location allocation**: tries prefs 1→2→3→any→JOINING_ON_HOLD
3. **Budget deduction**: ₹50,000 per candidate on joining letter generation
4. **Auto-training**: 60-day period from joining date, progress = elapsed/total × 100
5. **Bulk PDF**: offer + joining letters generated as PDFs via OpenPDF
6. **Excel processing**: Apache POI parses .xlsx, matches by email, batch-updates

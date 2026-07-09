# nexHire HRMS — Implementation Tasks (Sprint Review v2)

## Status: COMPLETED

All tasks from the sprint review have been implemented.

---

## Backend Tasks (Completed)

- [x] Add CandidateProfile entity + repository + service + controller
- [x] Add profileComplete field to User; block job apply if incomplete
- [x] Add CandidateDocument entity + file upload/download endpoints
- [x] Add uploads/ directory to .gitignore
- [x] Update DataSeeder: single "Systems Engineer" job, realistic project names
- [x] Revamp BgvStatus enum (NOT_STARTED, DOCUMENTS_PENDING, DOCUMENTS_SUBMITTED, IN_PROGRESS, PASSED, FAILED)
- [x] Add Apache POI dependency for Excel processing
- [x] Add OpenPDF dependency for PDF generation
- [x] Implement HrBulkService: Excel parse, PDF offer generation, PDF joining generation
- [x] Implement HrBulkController: /api/hr/bulk-upload, /template, /bulk-generate-offers, /bulk-generate-joining
- [x] Implement location allocation logic (3 preferences → any → ON_HOLD)
- [x] Add FileController for PDF downloads (/api/files/offer/{appId}, /api/files/joining/{appId})
- [x] Add trainingStartDate/trainingEndDate to TrainingRecord
- [x] Compute training progress automatically from dates (elapsed/total × 100)
- [x] Auto-create trainee + training record on joining letter acceptance (60-day training)
- [x] Add bulk project assignment endpoint (POST /api/projects/{id}/assign-bulk)
- [x] Update SecurityConfig for new endpoints (/api/candidate-profile, /api/documents, /api/hr, /api/files)
- [x] Budget deduction: ₹50,000 per candidate on joining letter generation

## Frontend Tasks (Completed)

- [x] Candidate profile completion page (personal details, education, skills, location preferences)
- [x] Candidate document upload page (upload, list, download)
- [x] HR bulk operations page (Excel template download, upload, bulk offer/joining generation)
- [x] Update RMG released component with bulk assign button
- [x] Add bulkAssign() to ProjectRmgService
- [x] Wire new routes: /candidate/documents, /hr/bulk
- [x] Add nav items for Documents (candidate) and Bulk Operations (HR)
- [x] Update API endpoints config with all new backend routes
- [x] Update mock interceptor passthrough list

## Documentation Tasks (Completed)

- [x] Update requirements.md with all sprint review changes
- [x] Update design.md with full API table and data model
- [x] Update tasks.md (this file)

---

## How to Run

### Backend

```bash
cd backend
# Ensure PostgreSQL is running with database 'nexhire'
# First time: psql -U postgres -c "CREATE DATABASE nexhire;"
mvn spring-boot:run
# Server starts on http://localhost:8080
# DataSeeder auto-populates on first boot (empty DB)
```

### Frontend

```bash
cd nexHire-frontend
npm install
npx ng serve
# App runs on http://localhost:4200
```

### Test Credentials (from DataSeeder)

| Role      | Email             | Password |
| --------- | ----------------- | -------- |
| Admin     | admin@nexhire.com | admin123 |
| HR        | hr@nexhire.com    | hr123    |
| RMG       | rmg@nexhire.com   | rmg123   |
| Candidate | (register new)    | —        |

---

## Critical Flows to Test

### 1. Candidate Registration → Profile → Apply

```bash
# Register
curl -X POST http://localhost:8080/api/auth/register -H "Content-Type: application/json" -d '{"name":"Test User","email":"test@example.com","password":"test123","phone":"9999999999"}'

# Try apply without profile (should fail)
curl -X POST http://localhost:8080/api/applications -H "Authorization: Bearer <token>" -H "Content-Type: application/json" -d '{"jobId":1,"userId":X}'
# → 400: "Complete your profile before applying."

# Complete profile
curl -X PUT http://localhost:8080/api/candidate-profile -H "Authorization: Bearer <token>" -H "Content-Type: application/json" -d '{"phone":"9999999999","address":"123 Main St","dateOfBirth":"2000-01-15","class10Percentage":85.5,"class10PassingYear":2016,"class12Percentage":78.0,"class12PassingYear":2018,"btechCgpa":8.2,"btechPassingYear":2022,"skills":"Java, Python, SQL","locationPreference1":"Bangalore","locationPreference2":"Hyderabad","locationPreference3":"Bangalore"}'

# Now apply (should succeed)
curl -X POST http://localhost:8080/api/applications -H "Authorization: Bearer <token>" -H "Content-Type: application/json" -d '{"jobId":1,"userId":X}'
```

### 2. HR Bulk Upload

```bash
# Download template
curl http://localhost:8080/api/hr/template -H "Authorization: Bearer <hr_token>" -o template.xlsx

# Upload filled Excel
curl -X POST http://localhost:8080/api/hr/bulk-upload -H "Authorization: Bearer <hr_token>" -F "file=@filled_template.xlsx"

# Bulk generate offers
curl -X POST http://localhost:8080/api/hr/bulk-generate-offers -H "Authorization: Bearer <hr_token>"

# Bulk generate joining
curl -X POST http://localhost:8080/api/hr/bulk-generate-joining -H "Authorization: Bearer <hr_token>"
```

### 3. RMG Bulk Assign

```bash
curl -X POST http://localhost:8080/api/projects/1/assign-bulk -H "Authorization: Bearer <rmg_token>" -H "Content-Type: application/json" -d '[1,2,3]'
```

---

## Frontend Pages to Test

| Page                | URL                     | Role      |
| ------------------- | ----------------------- | --------- |
| Candidate Profile   | /candidate/profile      | CANDIDATE |
| Candidate Documents | /candidate/documents    | CANDIDATE |
| Browse Jobs         | /candidate/jobs         | CANDIDATE |
| My Applications     | /candidate/applications | CANDIDATE |
| My Offers           | /candidate/offers       | CANDIDATE |
| My Joining          | /candidate/joining      | CANDIDATE |
| My Training         | /candidate/training     | CANDIDATE |
| HR Dashboard        | /hr                     | HR        |
| HR Applications     | /hr/applications        | HR        |
| HR Bulk Operations  | /hr/bulk                | HR        |
| HR Budget Overview  | /hr/budget              | HR        |
| RMG Allocation      | /hr/released            | RMG       |
| Admin Projects      | /admin/projects         | ADMIN     |
| Admin Users         | /admin/users            | ADMIN     |

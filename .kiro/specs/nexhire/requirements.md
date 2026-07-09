# nexHire HRMS — Requirements (Sprint Review v2)

## Glossary

- **nexHIRE**: HRMS application for managing end-to-end hiring, onboarding, and training of candidates at scale
- **UserRole**: ADMIN, HR, RMG, EMPLOYEE
- **LifecycleStatus**: CANDIDATE, TRAINEE, PROJECT_ASSIGNED
- **ApplicationStatus**: APPLIED, ASSESSMENT_PENDING, ASSESSMENT_COMPLETED, QUALIFIED, REJECTED, OFFER_SENT, OFFER_ACCEPTED, OFFER_REJECTED, JOINING_ON_HOLD, JOINING_LETTER_SENT, TRAINING_IN_PROGRESS, TRAINING_COMPLETED, PROJECT_ASSIGNED
- **BgvStatus**: NOT_STARTED, DOCUMENTS_PENDING, DOCUMENTS_SUBMITTED, IN_PROGRESS, PASSED, FAILED
- **Candidate**: EMPLOYEE-role user with lifecycleStatus=CANDIDATE
- **Trainee**: EMPLOYEE-role user with lifecycleStatus=TRAINEE
- **HR**: Manages hiring workflow, assessments, offers, joining, training, BGC
- **RMG**: Allocates training-completed trainees to projects (bulk assign)
- **Admin**: User management, role management, project CRUD, asset management, location/budget configuration, activity logs
- **CandidateProfile**: Detailed profile (education, skills, location preferences) that must be completed before applying
- **CandidateDocument**: Uploaded files (resume, certificates, ID proof) stored on local filesystem
- **BGC**: Background Check — HR manages status; documents uploaded by candidate
- **Excel Bulk Upload**: HR uploads Excel to batch-update assessments, BGC status, and offer eligibility
- **PDF Letters**: Offer and joining letters generated as PDF files, downloadable by candidate
- **Location Allocation**: When generating joining letters, system tries candidate's 3 location preferences in order based on budget/seat availability
- **Automatic Training**: When candidate accepts joining letter, trainee record is auto-created with 60-day training period and progress computed from elapsed days
- **Bulk Operations**: HR can bulk-generate offers/joining letters; RMG can bulk-assign trainees to projects

## Requirements

### Requirement 1: Registration & Login

- Candidate registers with name, email, password, phone
- JWT-based authentication for all roles
- Role-based redirect after login (Candidate → /candidate, HR → /hr, RMG → /hr/released, Admin → /admin)

### Requirement 2: Candidate Profile Completion

- Candidate must complete profile before applying for jobs
- Profile includes: phone, address, DOB, Class 10 %/year, Class 12 %/year, B.Tech CGPA/year, skills, 3 location preferences
- Backend blocks job application with clear error if profile is incomplete

### Requirement 3: Candidate Document Upload

- Document types: RESUME, CLASS10_CERT, CLASS12_CERT, BTECH_MARKSHEET, ID_PROOF, OTHER
- Files stored under `uploads/documents/{userId}/`
- HR can view/download candidate documents

### Requirement 4: Job Listing & Application

- Single active job: "Systems Engineer" (generic entry-level IT role)
- Candidate browses jobs, applies (blocked if profile incomplete or already applied)
- Application status tracked through the full pipeline

### Requirement 5: HR Assessment Management

- HR can start assessment (APPLIED → ASSESSMENT_PENDING)
- HR records scores (via UI or Excel bulk upload)
- HR qualifies or rejects candidates

### Requirement 6: BGC (Background Check)

- BGC record auto-created or managed via Excel bulk upload
- Statuses: NOT_STARTED → DOCUMENTS_PENDING → DOCUMENTS_SUBMITTED → IN_PROGRESS → PASSED/FAILED
- HR updates BGC status; candidate uploads documents
- BGC must be PASSED before offer letter generation

### Requirement 7: Excel Bulk Upload

- HR downloads template (candidateEmail, assessmentScore, assessmentRemarks, bgcStatus, bgcRemarks, offerEligible)
- HR uploads filled Excel; backend processes rows, returns summary (total/success/failed/errors)
- Updates assessment scores, BGC status, and marks candidates as QUALIFIED if eligible

### Requirement 8: PDF Offer Letter Generation

- Bulk endpoint: generates PDFs for all QUALIFIED + BGC PASSED candidates
- PDF includes: company header, candidate name, job title, date, terms, HR signature
- Stored under `uploads/offers/`
- Candidate can view/download PDF from portal

### Requirement 9: Offer Accept/Reject

- Candidate views offer in portal, accepts or rejects
- Accept → OFFER_ACCEPTED; Reject → OFFER_REJECTED

### Requirement 10: PDF Joining Letter Generation with Location Allocation

- Bulk endpoint: processes all OFFER_ACCEPTED candidates
- Location allocation logic: try preference 1 → 2 → 3 → any available → JOINING_ON_HOLD
- Consumes hiring budget slot + training seat + ₹50,000 from monetary budget
- PDF includes: location, joining date (14 days from generation), training duration
- Stored under `uploads/joining/`

### Requirement 11: Joining Letter Accept

- Candidate views joining letter in portal, accepts
- On acceptance: auto-creates Trainee + TrainingRecord with startDate=joiningDate, endDate=startDate+60 days

### Requirement 12: Automatic Training Progress

- Progress computed: elapsed_days / total_training_days × 100 (capped 0–100)
- No manual "+15%" button needed
- When progress reaches 100%, trainee is eligible for project assignment

### Requirement 13: Project Assignment (RMG)

- RMG views training-completed trainees
- RMG can assign individually or bulk-assign all eligible trainees to a project
- On assignment: applicationStatus=PROJECT_ASSIGNED, lifecycleStatus=PROJECT_ASSIGNED

### Requirement 14: Admin Features

- CRUD projects (Admin only; RMG only allocates)
- Manage users (list, change role, deactivate)
- Manage assets (CRUD + assign/revoke)
- View activity logs
- Manage location budgets (total slots, monetary budget, training seats)

### Requirement 15: Notifications

- Bell icon with unread count badge
- Auto-generated on: offer received, joining letter issued, training completed, project assigned
- Dropdown shows list; click marks as read

### Requirement 16: Budget & Capacity Tracking

- HR views budget overview: per-location slots used/available, monetary budget used/remaining, training seats
- Budget consumed when joining letter is generated
- JOINING_ON_HOLD if no capacity available

### Requirement 17: Dashboard

- HR/Admin see computed stats from live data (no mocks)
- Charts: application funnel, assessment breakdown, BGV status, training status

import { environment } from '../../environments/environment';

const BASE = environment.apiBaseUrl;

/**
 * Centralized API endpoint configuration.
 * Aligned with the nexHIRE Spring Boot backend contract.
 * To adapt to backend changes, only update this file.
 */
export const API_ENDPOINTS = {
  // ─── Auth ──────────────────────────────────────────────────────────────────
  AUTH: {
    REGISTER: `${BASE}/api/auth/register`,
    LOGIN: `${BASE}/api/auth/login`,
    LOGOUT: `${BASE}/api/auth/logout`,
    ME: `${BASE}/api/auth/me`,
  },

  // ─── Users (Admin) ─────────────────────────────────────────────────────────
  USERS: {
    BASE: `${BASE}/api/users`,
    BY_ID: (id: number) => `${BASE}/api/users/${id}`,
    UPDATE_ROLE: (id: number) => `${BASE}/api/users/${id}/role`,
    DEACTIVATE: (id: number) => `${BASE}/api/users/${id}/deactivate`,
  },

  // ─── Roles ─────────────────────────────────────────────────────────────────
  ROLES: {
    BASE: `${BASE}/api/roles`,
  },

  // ─── Candidate Profile ─────────────────────────────────────────────────────
  CANDIDATE_PROFILE: {
    BASE: `${BASE}/api/candidate-profile`,
    BY_USER: (userId: number) => `${BASE}/api/candidate-profile/${userId}`,
  },

  // ─── Candidate Documents ───────────────────────────────────────────────────
  DOCUMENTS: {
    UPLOAD: `${BASE}/api/documents/upload`,
    MY: `${BASE}/api/documents/my`,
    BY_USER: (userId: number) => `${BASE}/api/documents/user/${userId}`,
    DOWNLOAD: (id: number) => `${BASE}/api/documents/download/${id}`,
  },

  // ─── HR Bulk Operations ────────────────────────────────────────────────────
  HR_BULK: {
    UPLOAD: `${BASE}/api/hr/bulk-upload`,
    TEMPLATE: `${BASE}/api/hr/template`,
    GENERATE_OFFERS: `${BASE}/api/hr/bulk-generate-offers`,
    GENERATE_JOINING: `${BASE}/api/hr/bulk-generate-joining`,
  },

  // ─── Files (PDF download) ──────────────────────────────────────────────────
  FILES: {
    OFFER: (appId: number) => `${BASE}/api/files/offer/${appId}`,
    JOINING: (appId: number) => `${BASE}/api/files/joining/${appId}`,
  },

  // ─── Jobs ──────────────────────────────────────────────────────────────────
  JOBS: {
    BASE: `${BASE}/api/jobs`,
    BY_ID: (id: number) => `${BASE}/api/jobs/${id}`,
    CREATE: `${BASE}/api/jobs`,
  },

  // ─── Applications ──────────────────────────────────────────────────────────
  APPLICATIONS: {
    BASE: `${BASE}/api/applications`,
    APPLY: `${BASE}/api/applications`,
    MY: `${BASE}/api/applications/my`,
    BY_ID: (id: number) => `${BASE}/api/applications/${id}`,
    START_ASSESSMENT: (id: number) =>
      `${BASE}/api/applications/${id}/start-assessment`,
  },

  // ─── Assessments ───────────────────────────────────────────────────────────
  ASSESSMENTS: {
    ENTER_SCORE: (applicationId: number) =>
      `${BASE}/api/assessments/${applicationId}`,
    QUALIFY: (applicationId: number) =>
      `${BASE}/api/assessments/${applicationId}/qualify`,
    REJECT: (applicationId: number) =>
      `${BASE}/api/assessments/${applicationId}/reject`,
  },

  // ─── Offer Letters ─────────────────────────────────────────────────────────
  OFFERS: {
    SEND: (applicationId: number) => `${BASE}/api/offers/${applicationId}`,
    MY: `${BASE}/api/offers/my`,
    ACCEPT: (id: number) => `${BASE}/api/offers/${id}/accept`,
    REJECT: (id: number) => `${BASE}/api/offers/${id}/reject`,
  },

  // ─── Joining Letters ───────────────────────────────────────────────────────
  JOINING_LETTERS: {
    SEND: (applicationId: number) =>
      `${BASE}/api/joining-letters/${applicationId}`,
    MY: `${BASE}/api/joining-letters/my`,
    ACCEPT: (id: number) => `${BASE}/api/joining-letters/${id}/accept`,
  },

  // ─── Locations (budget + seats) ──────────────────────────────────────────────
  LOCATIONS: {
    BASE: `${BASE}/api/locations`,
    BY_ID: (id: number) => `${BASE}/api/locations/${id}`,
  },

  // ─── Background Verification (Phase B) ───────────────────────────────────────
  BGV: {
    BASE: `${BASE}/api/bgv`,
    BY_ID: (id: number) => `${BASE}/api/bgv/${id}`,
    BY_APPLICATION: (applicationId: number) =>
      `${BASE}/api/bgv/application/${applicationId}`,
    INITIATE: (applicationId: number) => `${BASE}/api/bgv/${applicationId}`,
    UPDATE_STATUS: (id: number) => `${BASE}/api/bgv/${id}/status`,
  },

  // ─── Trainees / Training (Phase B) ───────────────────────────────────────────
  TRAINEES: {
    BASE: `${BASE}/api/training/trainees`,
    MY: `${BASE}/api/training/my`,
    UPDATE_PROGRESS: (traineeId: number) =>
      `${BASE}/api/training/${traineeId}/progress`,
    COMPLETE: (traineeId: number) =>
      `${BASE}/api/training/${traineeId}/complete`,
    BY_ID: (id: number) => `${BASE}/api/trainees/${id}`,
    UPDATE_STATUS: (id: number) => `${BASE}/api/trainees/${id}/status`,
    BY_TRAINING: (trainingId: number) =>
      `${BASE}/api/trainees/training/${trainingId}`,
  },

  // ─── Projects / Allocation (Phase B) ─────────────────────────────────────────
  PROJECTS: {
    BASE: `${BASE}/api/projects`,
    CREATE: `${BASE}/api/projects`,
    ELIGIBLE_TRAINEES: `${BASE}/api/projects/eligible-trainees`,
    ASSIGN: (projectId: number, traineeId: number) =>
      `${BASE}/api/projects/${projectId}/assign/${traineeId}`,
    BY_ID: (id: number) => `${BASE}/api/projects/${id}`,
    UPDATE: (id: number) => `${BASE}/api/projects/${id}`,
    UPDATE_STATUS: (id: number) => `${BASE}/api/projects/${id}/status`,
    ACTIVE: `${BASE}/api/projects/active`,
  },

  // ─── Assets (Phase B) ────────────────────────────────────────────────────────
  ASSETS: {
    BASE: `${BASE}/api/assets`,
    CREATE: `${BASE}/api/assets`,
    ASSIGN: (assetId: number, userId: number) =>
      `${BASE}/api/assets/${assetId}/assign/${userId}`,
    REVOKE: (assignmentId: number) =>
      `${BASE}/api/assets/assignments/${assignmentId}/revoke`,
    BY_USER: (userId: number) => `${BASE}/api/assets/user/${userId}`,
    BY_ID: (id: number) => `${BASE}/api/assets/${id}`,
    UPDATE: (id: number) => `${BASE}/api/assets/${id}`,
    UPDATE_STATUS: (id: number) => `${BASE}/api/assets/${id}/status`,
    AVAILABLE: `${BASE}/api/assets/available`,
  },

  // ─── Activity Logs (Phase C) ─────────────────────────────────────────────────
  ACTIVITY_LOGS: {
    BASE: `${BASE}/api/activity-logs`,
  },

  // ─── Legacy groups (mock-only modules not yet on the real backend) ───────────
  // These remain so mock-backed services keep compiling. They are only hit while
  // environment.useMockData is true and the module has not been migrated.
  EMPLOYEES: {
    BASE: `${BASE}/api/employees`,
    BY_ID: (id: number) => `${BASE}/api/employees/${id}`,
    UPDATE_ROLE: (id: number) => `${BASE}/api/employees/${id}/role`,
    UPDATE_STATUS: (id: number) => `${BASE}/api/employees/${id}/status`,
    SEARCH: `${BASE}/api/employees/search`,
  },
  SELECTED: {
    BASE: `${BASE}/api/selected`,
    BY_ID: (id: number) => `${BASE}/api/selected/${id}`,
    BY_EMPLOYEE: (empId: number) => `${BASE}/api/selected/employee/${empId}`,
    UPDATE_STATUS: (id: number) => `${BASE}/api/selected/${id}/status`,
  },
  CITIES: {
    BASE: `${BASE}/api/cities`,
    BY_ID: (id: number) => `${BASE}/api/cities/${id}`,
    CREATE: `${BASE}/api/cities`,
    UPDATE: (id: number) => `${BASE}/api/cities/${id}`,
    BUDGET: (id: number) => `${BASE}/api/cities/${id}/budget`,
  },
  BRANCHES: {
    BASE: `${BASE}/api/branches`,
    BY_ID: (id: number) => `${BASE}/api/branches/${id}`,
    BY_CITY: (cityId: number) => `${BASE}/api/branches/city/${cityId}`,
    CREATE: `${BASE}/api/branches`,
    UPDATE: (id: number) => `${BASE}/api/branches/${id}`,
  },
  BLOCKS: {
    BASE: `${BASE}/api/blocks`,
    BY_ID: (id: number) => `${BASE}/api/blocks/${id}`,
    BY_BRANCH: (branchId: number) => `${BASE}/api/blocks/branch/${branchId}`,
    CREATE: `${BASE}/api/blocks`,
    UPDATE: (id: number) => `${BASE}/api/blocks/${id}`,
    VACANCY: (id: number) => `${BASE}/api/blocks/${id}/vacancy`,
  },
  BUDGETS: {
    BASE: `${BASE}/api/budgets`,
    BY_CITY: (cityId: number) => `${BASE}/api/budgets/city/${cityId}`,
    UPDATE: (id: number) => `${BASE}/api/budgets/${id}`,
  },
  TRAININGS: {
    BASE: `${BASE}/api/trainings`,
    BY_ID: (id: number) => `${BASE}/api/trainings/${id}`,
    CREATE: `${BASE}/api/trainings`,
    UPDATE: (id: number) => `${BASE}/api/trainings/${id}`,
    ACTIVE: `${BASE}/api/trainings/active`,
  },
  TRAINING_ASSIGNMENTS: {
    BASE: `${BASE}/api/training-assignments`,
    ASSIGN: `${BASE}/api/training-assignments`,
    BULK_ASSIGN: `${BASE}/api/training-assignments/bulk`,
  },
  ASSET_ASSIGNMENTS: {
    BASE: `${BASE}/api/asset-assignments`,
    BY_ID: (id: number) => `${BASE}/api/asset-assignments/${id}`,
    ASSIGN: `${BASE}/api/asset-assignments`,
    RETURN: (id: number) => `${BASE}/api/asset-assignments/${id}/return`,
    BY_TRAINEE: (traineeId: number) =>
      `${BASE}/api/asset-assignments/trainee/${traineeId}`,
  },
  RELEASED: {
    BASE: `${BASE}/api/released`,
    BY_ID: (id: number) => `${BASE}/api/released/${id}`,
    BY_DOMAIN: (domain: string) => `${BASE}/api/released/domain/${domain}`,
  },
  PROJECT_ALLOCATIONS: {
    BASE: `${BASE}/api/project-allocations`,
    BY_ID: (id: number) => `${BASE}/api/project-allocations/${id}`,
    ALLOCATE: `${BASE}/api/project-allocations`,
    BY_PROJECT: (projectId: number) =>
      `${BASE}/api/project-allocations/project/${projectId}`,
    BY_RELEASED: (releasedId: number) =>
      `${BASE}/api/project-allocations/released/${releasedId}`,
  },
  DASHBOARD: {
    STATS: `${BASE}/api/dashboard/stats`,
    CHARTS: `${BASE}/api/dashboard/charts`,
    APPLICATION_CHART: `${BASE}/api/dashboard/charts/applications`,
    ASSESSMENT_CHART: `${BASE}/api/dashboard/charts/assessments`,
    BGV_CHART: `${BASE}/api/dashboard/charts/bgv`,
    TRAINING_CHART: `${BASE}/api/dashboard/charts/training`,
    PROJECT_CHART: `${BASE}/api/dashboard/charts/projects`,
    BUDGET_CHART: `${BASE}/api/dashboard/charts/budget`,
  },
} as const;

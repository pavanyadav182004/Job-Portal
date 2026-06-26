export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://raw.githubusercontent.com/kirtii28/JobJson/main";

export const JOBS_ENDPOINT = "/jobs.json";

export const STORAGE_KEYS = {
  USERS: "users",
  CURRENT_USER: "currentUser",
  JOBS: "jobs",
  APPLICATIONS: "applications",
  SAVED_JOBS: "savedJobs",
  DELETED_JOBS: "deletedJobs",
};

export const USER_ROLES = {
  JOBSEEKER: "jobseeker",
  EMPLOYER: "employer",
};

export const APPLICATION_STATUS = {
  PENDING: "Pending",
  ACCEPTED: "Accepted",
  REJECTED: "Rejected",
};

export const JOB_TYPES = ["Full Time", "Part Time", "Internship", "Remote"];

export const DEFAULT_JOB_TYPE = "Full Time";

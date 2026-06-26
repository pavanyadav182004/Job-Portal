import { APPLICATION_STATUS, USER_ROLES } from "../utils/constants";
import {
  getApplications,
  getCurrentUser,
  saveApplications,
} from "../utils/storage";

export async function getAllApplications() {
  return getApplications();
}

export async function getMyApplications(email) {
  const userEmail = email || getCurrentUser()?.email;
  const applications = getApplications();

  return userEmail
    ? applications.filter((application) => application.email === userEmail)
    : applications;
}

export async function applyForJob(job) {
  const user = getCurrentUser();

  if (!user) {
    throw new Error("Please login before applying.");
  }

  if (user.role === USER_ROLES.EMPLOYER) {
    throw new Error("Employer account cannot apply for jobs.");
  }

  if (!job?.id) {
    throw new Error("Job not found.");
  }

  const applications = getApplications();
  const alreadyApplied = applications.some(
    (application) => application.jobId === job.id && application.email === user.email
  );

  if (alreadyApplied) {
    throw new Error("You have already applied for this job.");
  }

  const application = {
    id: Date.now(),
    jobId: job.id,
    jobTitle: job.title,
    company: job.company,
    name: user.username,
    email: user.email,
    status: APPLICATION_STATUS.PENDING,
  };

  saveApplications([...applications, application]);
  return application;
}

export async function updateApplicationStatus(id, status) {
  const applications = getApplications();
  const updatedApplications = applications.map((application) =>
    application.id === id ? { ...application, status } : application
  );

  saveApplications(updatedApplications);
  return updatedApplications;
}

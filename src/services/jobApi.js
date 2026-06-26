import api from "./api";
import { JOBS_ENDPOINT } from "../utils/constants";
import {
  getCurrentUser,
  getJobs,
  getSavedJobs,
  saveJobs,
  saveSavedJobs,
  seedJobs,
  getDeletedJobs,
  saveDeletedJobs,
} from "../utils/storage";

function mergeJobs(primaryJobs, secondaryJobs) {
  const jobsById = new Map();

  [...primaryJobs, ...secondaryJobs].forEach((job) => {
    if (job?.id) {
      jobsById.set(Number(job.id), { ...job, id: Number(job.id) });
    }
  });

  return Array.from(jobsById.values());
}

export async function getAllJobs() {
  const localJobs = getJobs();
  const deletedJobs = getDeletedJobs();

  try {
    const response = await api.get(JOBS_ENDPOINT);
    let remoteJobs = Array.isArray(response.data) ? response.data : [];
    
    remoteJobs = remoteJobs.filter((job) => !deletedJobs.includes(Number(job.id)));

    const jobs = mergeJobs(remoteJobs, localJobs);

    saveJobs(jobs);
    return jobs;
  } catch (error) {
    console.error(error);
    return localJobs.length ? localJobs : seedJobs;
  }
}

export async function getJobById(id) {
  const jobs = await getAllJobs();
  return jobs.find((job) => job.id === Number(id)) || null;
}

export async function createJob(jobData) {
  const jobs = getJobs();
  const job = {
    id: Date.now(),
    createdAt: new Date().toISOString().split('T')[0], // format: YYYY-MM-DD
    type: "Full Time",
    ...jobData,
  };

  saveJobs([...jobs, job]);
  return job;
}

export async function updateJob(id, jobData) {
  const jobs = getJobs();
  const updatedJobs = jobs.map((job) =>
    job.id === Number(id) ? { ...job, ...jobData, id: Number(id) } : job
  );

  saveJobs(updatedJobs);
  return updatedJobs.find((job) => job.id === Number(id)) || null;
}

export async function deleteJob(id) {
  const numericId = Number(id);
  const updatedJobs = getJobs().filter((job) => job.id !== numericId);
  saveJobs(updatedJobs);

  const deletedJobs = getDeletedJobs();
  if (!deletedJobs.includes(numericId)) {
    saveDeletedJobs([...deletedJobs, numericId]);
  }

  return updatedJobs;
}

export async function getSavedJobsForCurrentUser() {
  const user = getCurrentUser();
  const savedJobs = getSavedJobs();

  if (!user) {
    return [];
  }

  return savedJobs.filter((savedJob) => savedJob.email === user.email);
}

export async function saveJobForCurrentUser(job) {
  const user = getCurrentUser();

  if (!user) {
    throw new Error("Please login before saving jobs.");
  }

  if (!job?.id) {
    throw new Error("Job not found.");
  }

  const savedJobs = getSavedJobs();
  const alreadySaved = savedJobs.some(
    (savedJob) => savedJob.email === user.email && savedJob.jobId === job.id
  );

  if (alreadySaved) {
    throw new Error("This job is already saved.");
  }

  const savedJob = {
    id: Date.now(),
    jobId: job.id,
    title: job.title,
    company: job.company,
    location: job.location,
    salary: job.salary,
    type: job.type || "Full Time",
    email: user.email,
  };

  saveSavedJobs([...savedJobs, savedJob]);
  return savedJob;
}

export async function removeSavedJob(id) {
  const updatedSavedJobs = getSavedJobs().filter((savedJob) => savedJob.id !== Number(id));
  saveSavedJobs(updatedSavedJobs);
  return getSavedJobsForCurrentUser();
}

export const getJob = getAllJobs;

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  createJob,
  deleteJob,
  getAllJobs,
  getJobById,
  getSavedJobsForCurrentUser,
  removeSavedJob,
  saveJobForCurrentUser,
  updateJob,
} from "../services/jobApi";
import useAuth from "../hooks/useAuth";
import JobContext from "./JobContext.js";

export function JobProvider({ children }) {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refreshJobs = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const jobData = await getAllJobs();
      setJobs(jobData);
      return jobData;
    } catch (jobError) {
      setError(jobError.message);
      throw jobError;
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshSavedJobs = useCallback(async () => {
    try {
      const savedJobData = await getSavedJobsForCurrentUser();
      setSavedJobs(savedJobData);
      return savedJobData;
    } catch (jobError) {
      setError(jobError.message);
      throw jobError;
    }
  }, []);

  useEffect(() => {
    let active = true;

    async function loadJobs() {
      try {
        const jobData = await getAllJobs();

        if (active) {
          setJobs(jobData);
        }
      } catch (jobError) {
        if (active) {
          setError(jobError.message);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadJobs();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;

    async function loadSavedJobs() {
      try {
        const savedJobData = await getSavedJobsForCurrentUser();

        if (active) {
          setSavedJobs(savedJobData);
        }
      } catch (jobError) {
        if (active) {
          setError(jobError.message);
        }
      }
    }

    loadSavedJobs();

    return () => {
      active = false;
    };
  }, [user]);

  const getJob = useCallback(
    async (id) => {
      const numericId = Number(id);
      const cachedJob = jobs.find((job) => job.id === numericId);
      return cachedJob || getJobById(numericId);
    },
    [jobs]
  );

  const addJob = useCallback(async (jobData) => {
    const newJob = await createJob(jobData);
    setJobs((currentJobs) => [...currentJobs, newJob]);
    return newJob;
  }, []);

  const editJob = useCallback(async (id, jobData) => {
    const updatedJob = await updateJob(id, jobData);
    setJobs((currentJobs) =>
      currentJobs.map((job) => (job.id === Number(id) ? updatedJob : job))
    );
    return updatedJob;
  }, []);

  const removeJob = useCallback(async (id) => {
    const updatedJobs = await deleteJob(id);
    setJobs(updatedJobs);
    return updatedJobs;
  }, []);

  const saveJob = useCallback(async (job) => {
    const savedJob = await saveJobForCurrentUser(job);
    setSavedJobs((currentSavedJobs) => [...currentSavedJobs, savedJob]);
    return savedJob;
  }, []);

  const unsaveJob = useCallback(async (id) => {
    const updatedSavedJobs = await removeSavedJob(id);
    setSavedJobs(updatedSavedJobs);
    return updatedSavedJobs;
  }, []);

  const value = useMemo(
    () => ({
      jobs,
      savedJobs,
      loading,
      error,
      refreshJobs,
      refreshSavedJobs,
      getJob,
      addJob,
      editJob,
      removeJob,
      saveJob,
      unsaveJob,
      clearError: () => setError(""),
    }),
    [
      jobs,
      savedJobs,
      loading,
      error,
      refreshJobs,
      refreshSavedJobs,
      getJob,
      addJob,
      editJob,
      removeJob,
      saveJob,
      unsaveJob,
    ]
  );

  return <JobContext.Provider value={value}>{children}</JobContext.Provider>;
}

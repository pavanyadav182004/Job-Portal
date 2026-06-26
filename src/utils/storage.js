import { STORAGE_KEYS } from "./constants";
import { getLocalItem, removeLocalItem, setLocalItem } from "./localStorage";

// Emergency cleanup: if localStorage is too large, clear huge files to fix QuotaExceededError
try {
  const usersStr = localStorage.getItem(STORAGE_KEYS.USERS);
  if (usersStr && usersStr.length > 1000000) {
    let users = JSON.parse(usersStr);
    users = users.map(u => ({ ...u, photoFile: null, resumeFile: null }));
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }
  const currUserStr = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  if (currUserStr && currUserStr.length > 500000) {
    let user = JSON.parse(currUserStr);
    user.photoFile = null;
    user.resumeFile = null;
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  }
  const jobsStr = localStorage.getItem(STORAGE_KEYS.JOBS);
  if (jobsStr && jobsStr.length > 1000000) {
    let jobs = JSON.parse(jobsStr);
    jobs = jobs.map(j => ({ ...j, companyImage: null }));
    localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(jobs));
  }
} catch (e) {
  console.error("Cleanup error:", e);
}

export const seedJobs = [
  // {
  //   id: 101,
  //   title: "Frontend Developer",
  //   company: "TechNova Solutions",
  //   location: "Bengaluru",
  //   salary: "600000",
  //   type: "Full Time",
  //   description:
  //     "Build responsive React interfaces, connect APIs, and improve user workflows for a growing product team.",
  // },
  // {
  //   id: 102,
  //   title: "React Intern",
  //   company: "BrightApps",
  //   location: "Remote",
  //   salary: "180000",
  //   type: "Internship",
  //   description:
  //     "Learn by shipping UI components, fixing bugs, and collaborating with designers and senior developers.",
  // },
  // {
  //   id: 103,
  //   title: "Backend Developer",
  //   company: "CloudCore Labs",
  //   location: "Hyderabad",
  //   salary: "750000",
  //   type: "Full Time",
  //   description:
  //     "Create reliable APIs, manage database workflows, and support integrations for web applications.",
  // },
];

export function readStorage(key, fallback = []) {
  return getLocalItem(key, fallback);
}

export function writeStorage(key, value) {
  try {
    return setLocalItem(key, value);
  } catch (e) {
    if (e.name === 'QuotaExceededError' || e.message.toLowerCase().includes('quota')) {
      // Aggressive scrubbing on failure
      try {
        const usersStr = localStorage.getItem(STORAGE_KEYS.USERS);
        if (usersStr) {
          let users = JSON.parse(usersStr);
          users = users.map(u => ({ ...u, photoFile: null, resumeFile: null }));
          localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
        }
        const currUserStr = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
        if (currUserStr) {
          let user = JSON.parse(currUserStr);
          user.photoFile = null;
          user.resumeFile = null;
          localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
        }
      } catch (err) {}
      
      alert("Storage limit was reached and has been automatically cleaned up. Please refresh the page (Ctrl+R / Cmd+R) and try logging in again.");
      throw new Error("Storage quota exceeded. Please refresh the page.");
    }
    throw e;
  }
}

export function getUsers() {
  return readStorage(STORAGE_KEYS.USERS, []);
}

export function saveUsers(users) {
  return writeStorage(STORAGE_KEYS.USERS, users);
}

export function getJobs() {
  const jobs = readStorage(STORAGE_KEYS.JOBS, seedJobs);
  return Array.isArray(jobs) && jobs.length ? jobs : seedJobs;
}

export function saveJobs(jobs) {
  return writeStorage(STORAGE_KEYS.JOBS, jobs);
}

export function getApplications() {
  return readStorage(STORAGE_KEYS.APPLICATIONS, []);
}

export function saveApplications(applications) {
  return writeStorage(STORAGE_KEYS.APPLICATIONS, applications);
}

export function getCurrentUser() {
  return readStorage(STORAGE_KEYS.CURRENT_USER, null);
}

export function saveCurrentUser(user) {
  return writeStorage(STORAGE_KEYS.CURRENT_USER, user);
}

export function updateCurrentUser(updates) {
  const currentUser = getCurrentUser();

  if (!currentUser) {
    return null;
  }

  const updatedUser = { ...currentUser, ...updates };
  const updatedUsers = getUsers().map((user) =>
    user.email === currentUser.email ? updatedUser : user
  );

  saveUsers(updatedUsers);
  saveCurrentUser(updatedUser);

  return updatedUser;
}

export function removeCurrentUser() {
  removeLocalItem(STORAGE_KEYS.CURRENT_USER);
}

export function getSavedJobs() {
  return readStorage(STORAGE_KEYS.SAVED_JOBS, []);
}

export function saveSavedJobs(savedJobs) {
  return writeStorage(STORAGE_KEYS.SAVED_JOBS, savedJobs);
}

export function getDeletedJobs() {
  return readStorage(STORAGE_KEYS.DELETED_JOBS, []);
}

export function saveDeletedJobs(deletedJobs) {
  return writeStorage(STORAGE_KEYS.DELETED_JOBS, deletedJobs);
}

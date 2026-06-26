import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getSavedJobsForCurrentUser, removeSavedJob } from "../../services/jobApi";
import "../Common/JobList.css";

export default function SavedJobs() {
  const [savedJobs, setSavedJobs] = useState([]);

  useEffect(() => {
    async function loadSavedJobs() {
      const data = await getSavedJobsForCurrentUser();
      setSavedJobs(data);
    }

    loadSavedJobs();
  }, []);

  const handleRemove = async (id) => {
    const updatedSavedJobs = await removeSavedJob(id);
    setSavedJobs(updatedSavedJobs);
  };

  return (
    <div className="job-list-container">
      <h1>Saved Jobs</h1>

      {savedJobs.length === 0 ? (
        <p className="empty-state">No saved jobs found.</p>
      ) : (
        <div className="jobs-grid">
          {savedJobs.map((job) => (
            <div key={job.id} className="job-card">
              <h3>{job.title}</h3>
              <p>
                <b>Company:</b> {job.company}
              </p>
              <p>
                <b>Location:</b> {job.location}
              </p>
              <p>
                <b>Salary:</b> Rs. {job.salary}
              </p>
              <p>
                <b>Type:</b> {job.type || "Full Time"}
              </p>

              <div className="btn-group">
                <Link to={`/jobs/${job.jobId}`}>
                  <button>View</button>
                </Link>
                <button className="delete-btn" onClick={() => handleRemove(job.id)}>
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

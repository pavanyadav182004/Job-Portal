import { useState } from "react";
import { Link } from "react-router-dom";
import "./MyJob.css";
import { getJobs } from "../../utils/storage";
import { deleteJob } from "../../services/jobApi";

export default function MyJob() {
  const [jobs, setJobs] = useState(() => getJobs());

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this job?");
    if (!confirmDelete) return;

    const updatedJobs = await deleteJob(id);
    setJobs(updatedJobs);
  };

  return (
    <div className="my-jobs-container">
      <div className="page-title-row">
        <h1>My Jobs</h1>
        <Link to="/add-job" className="primary-link">Add Job</Link>
      </div>

      {jobs.length === 0 ? (
        <p className="no-jobs">No Jobs Found</p>
      ) : (
        <div className="jobs-grid">
          {jobs.map((job) => (
            <div key={job.id} className="job-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
                {job.companyImage && <img src={job.companyImage} alt="Company" style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover' }} />}
                <h3 style={{ margin: 0 }}>{job.title}</h3>
              </div>
              <p><b>Company:</b> {job.company}</p>
              <p><b>Location:</b> {job.location}</p>
              <p><b>Salary:</b> Rs. {job.salary}</p>
              <p><b>Type:</b> {job.type || "Full Time"}</p>
              <p style={{ color: "#ff0000", fontWeight: "bold" }}><b>Add Date:</b> {job.createdAt || "N/A"}</p>
              <p style={{ color: "#ff0000", fontWeight: "bold" }}><b>Expire Date:</b> {job.expireDate || "N/A"}</p>

              <div className="btn-group">
                <Link to={`/edit-job/${job.id}`}>
                  <button className="edit-btn">Edit</button>
                </Link>

                <button className="delete-btn" onClick={() => handleDelete(job.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

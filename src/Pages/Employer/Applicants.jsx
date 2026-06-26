import { useState } from "react";
import { updateApplicationStatus } from "../../services/applicationApi";
import { getApplications } from "../../utils/storage";
import "../Common/JobList.css";

export default function Applicants() {
  const [applicants, setApplicants] = useState(getApplications());

  const updateStatus = async (id, status) => {
    const updatedApplications = await updateApplicationStatus(id, status);
    setApplicants(updatedApplications);
  };

  return (
    <div className="job-list-container">
      <h1>Applicants</h1>

      {applicants.length === 0 ? (
        <p className="empty-state">No applications found.</p>
      ) : (
        <div className="jobs-grid">
          {applicants.map((app) => (
            <div key={app.id} className="job-card">
              <h3>{app.name}</h3>
              <p><b>Email:</b> {app.email}</p>
              <p><b>Job:</b> {app.jobTitle}</p>
              <p><b>Company:</b> {app.company}</p>
              <p><b>Status:</b> {app.status}</p>

              <div className="btn-group">
                <button className="accept-btn" onClick={() => updateStatus(app.id, "Accepted")}>
                  Accept
                </button>
                <button className="delete-btn" onClick={() => updateStatus(app.id, "Rejected")}>
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

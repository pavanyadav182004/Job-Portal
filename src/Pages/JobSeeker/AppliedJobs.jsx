import "./AppliedJobs.css";
import { getApplications, getCurrentUser } from "../../utils/storage";

export default function AppliedJobs() {
  const user = getCurrentUser();
  const applications = getApplications().filter((application) =>
    user ? application.email === user.email : true
  );

  return (
    <div className="applied-jobs-container">
      <h1>Applied Jobs</h1>

      {applications.length === 0 ? (
        <p className="no-data">No Applications Found</p>
      ) : (
        <div className="jobs-grid">
          {applications.map((application) => (
            <div key={application.id} className="job-card">
              <h3>{application.jobTitle}</h3>
              <p><b>Company:</b> {application.company}</p>
              <p><b>Applicant:</b> {application.name}</p>
              <p><b>Status:</b> {application.status}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

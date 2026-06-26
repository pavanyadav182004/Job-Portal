import { Link } from "react-router-dom";
import "./JobSeekDash.css";
import { getCurrentUser } from "../../utils/storage";

export default function JobSeekerDashboard() {
  const user = getCurrentUser();

  return (
    <div className="dashboard">
      <h1>Job Seeker Dashboard</h1>
      <h2>Welcome {user?.username || "Job Seeker"}</h2>

      <div className="dashboard-actions">
        <Link to="/jobs" className="view-jobs"><button>View Jobs</button></Link>
        <Link to="/applied-jobs" className="applied-jobs"><button>Applied Jobs</button></Link>
        <Link to="/saved-jobs" className="saved-jobs"><button>Saved Jobs</button></Link>
      </div>
    </div>
  );
}

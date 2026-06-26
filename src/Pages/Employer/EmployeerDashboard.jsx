import { Link } from "react-router-dom";
import "./EmpDash.css";
import { getCurrentUser } from "../../utils/storage";

export default function EmployeerDashboard() {
  const user = getCurrentUser();

  return (
    <div className="dashboard">
      <h1>Employer Dashboard</h1>
      <h2>Welcome {user?.username || "Employer"}</h2>

      <Link to="/add-job" className="add-job">Add Job</Link>
      <Link to="/my-jobs" className="my-job-link">My Jobs</Link>
      <Link to="/applicants" className="view-applicants">View Applicants</Link>
      <Link to="/company-profile" className="profile-link">Company Profile</Link>
    </div>
  );
}

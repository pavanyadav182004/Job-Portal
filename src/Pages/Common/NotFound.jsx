import { Link } from "react-router-dom";
import "./JobList.css";

export default function NotFound() {
  return (
    <div className="job-list-container">
      <p className="empty-state">Page not found.</p>
      <Link to="/jobs" className="primary-link">Go to Jobs</Link>
    </div>
  );
}

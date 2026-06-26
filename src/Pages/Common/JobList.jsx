import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Filter from "../../Components/Filters/Filter";
import SearchBar from "../../Components/SearchBar/SearchBar";
import { getJob } from "../../services/jobApi";
import "./JobList.css";

export default function JobList() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [location, setLocation] = useState("");

  useEffect(() => {
    let active = true;

    async function fetchJobs() {
      const data = await getJob();
      if (active) {
        setJobs(data);
        setLoading(false);
      }
    }

    fetchJobs();

    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return <h2 className="loading-text">Loading Jobs...</h2>;
  }

  const locations = [...new Set(jobs.map((job) => job.location).filter(Boolean))].sort();
  const normalizedSearch = searchText.trim().toLowerCase();
  const filteredJobs = jobs.filter((job) => {
    const title = job.title?.toLowerCase() || "";
    const company = job.company?.toLowerCase() || "";
    const jobLocation = job.location || "";
    const matchesSearch =
      !normalizedSearch ||
      title.includes(normalizedSearch) ||
      company.includes(normalizedSearch);
    const matchesLocation = !location || jobLocation === location;

    return matchesSearch && matchesLocation;
  });

  const clearFilters = () => {
    setSearchText("");
    setLocation("");
  };

  return (
    <div className="job-list-container">
      <h1>Available Jobs</h1>

      <div className="job-search-panel">
        <SearchBar value={searchText} onChange={setSearchText} />
        <Filter
          locations={locations}
          value={location}
          onChange={setLocation}
          onClear={clearFilters}
        />
      </div>

      <p className="result-count">
        Showing {filteredJobs.length} of {jobs.length} jobs
      </p>

      {jobs.length === 0 ? (
        <p className="empty-state">No jobs available right now.</p>
      ) : filteredJobs.length === 0 ? (
        <p className="empty-state">No jobs matched your search.</p>
      ) : (
        <div className="jobs-grid">
          {filteredJobs.map((job) => (
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

              <Link to={`/jobs/${job.id}`}>
                <button>View Details</button>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

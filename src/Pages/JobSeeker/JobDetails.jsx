import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { applyForJob } from "../../services/applicationApi";
import { getJobById, saveJobForCurrentUser } from "../../services/jobApi";
import { getCurrentUser } from "../../utils/storage";
import "../Common/JobList.css";

function renderInlineFormatting(text) {
  const parts = String(text).split(/(\*\*[^*]+\*\*|__[^_]+__|\*[^*]+\*|_[^_]+_)/g);

  return parts.map((part, index) => {
    if (!part) return null;

    if (
      (part.startsWith("**") && part.endsWith("**")) ||
      (part.startsWith("__") && part.endsWith("__"))
    ) {
      return <strong key={`${part}-${index}`}>{part.slice(2, -2)}</strong>;
    }

    if (
      (part.startsWith("*") && part.endsWith("*")) ||
      (part.startsWith("_") && part.endsWith("_"))
    ) {
      return <em key={`${part}-${index}`}>{part.slice(1, -1)}</em>;
    }

    return <span key={`${part}-${index}`}>{part}</span>;
  });
}

function FormattedDescription({ text }) {
  const content = String(text || "").trimEnd();

  if (!content.trim()) {
    return <span>No description added yet.</span>;
  }

  const lines = content.split(/\r?\n/);
  const blocks = [];
  let currentList = null;

  const pushCurrentList = () => {
    if (currentList) {
      blocks.push(currentList);
      currentList = null;
    }
  };

  lines.forEach((line) => {
    const headingMatch = line.match(/^\s{0,3}(#{1,6})\s*(.+)$/);
    const unorderedMatch = line.match(/^\s*(?:[-*•])\s*(.+)$/);
    const orderedMatch = line.match(/^\s*\d+[.)]\s*(.+)$/);

    if (headingMatch) {
      pushCurrentList();
      blocks.push({
        type: "heading",
        level: Math.min(headingMatch[1].length, 3),
        text: headingMatch[2],
      });
      return;
    }

    if (unorderedMatch || orderedMatch) {
      const type = unorderedMatch ? "ul" : "ol";
      const itemText = unorderedMatch ? unorderedMatch[1] : orderedMatch[1];

      if (!currentList || currentList.type !== type) {
        pushCurrentList();
        currentList = { type, items: [] };
      }

      currentList.items.push(itemText);
      return;
    }

    pushCurrentList();
    blocks.push({ type: line.trim() ? "paragraph" : "blank", text: line });
  });

  pushCurrentList();

  return (
    <div className="formatted-description">
      {blocks.map((block, index) => {
        if (block.type === "heading") {
          return (
            <h3
              key={`${block.text}-${index}`}
              className={`description-heading heading-level-${block.level}`}
            >
              {renderInlineFormatting(block.text)}
            </h3>
          );
        }

        if (block.type === "ul") {
          return (
            <ul key={`ul-${index}`} className="description-list">
              {block.items.map((item, itemIndex) => (
                <li key={`${item}-${itemIndex}`}>{renderInlineFormatting(item)}</li>
              ))}
            </ul>
          );
        }

        if (block.type === "ol") {
          return (
            <ol key={`ol-${index}`} className="description-list">
              {block.items.map((item, itemIndex) => (
                <li key={`${item}-${itemIndex}`}>{renderInlineFormatting(item)}</li>
              ))}
            </ol>
          );
        }

        if (block.type === "blank") {
          return <div key={`blank-${index}`} className="description-break" />;
        }

        return (
          <p key={`${block.text}-${index}`} className="description-paragraph">
            {renderInlineFormatting(block.text)}
          </p>
        );
      })}
    </div>
  );
}

export default function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const user = getCurrentUser();

  useEffect(() => {
    let active = true;

    async function loadJob() {
      const selectedJob = await getJobById(id);

      if (active) {
        setJob(selectedJob);
        setLoading(false);
      }
    }

    loadJob();

    return () => {
      active = false;
    };
  }, [id]);

  const handleApply = async () => {
    if (!user) {
      alert("Please login before applying.");
      navigate("/login");
      return;
    }

    try {
      await applyForJob(job);
      alert("Application submitted successfully.");
      navigate("/applied-jobs");
    } catch (error) {
      alert(error.message);
    }
  };

  const handleSaveJob = async () => {
    try {
      await saveJobForCurrentUser(job);
      alert("Job saved successfully.");
    } catch (error) {
      alert(error.message);
    }
  };

  if (loading) {
    return <h2 className="loading-text">Loading Job...</h2>;
  }

  if (!job) {
    return (
      <div className="job-list-container">
        <p className="empty-state">Job not found.</p>
        <Link to="/jobs" className="primary-link">
          Back to Jobs
        </Link>
      </div>
    );
  }

  return (
    <div className="job-list-container">
      <div className="job-details-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px', marginBottom: '20px' }}>
          <div style={{ flex: '1', minWidth: '250px' }}>
            <h1 style={{ marginTop: 0 }}>{job.title}</h1>
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
            <p style={{ color: "#ff0000", fontWeight: "bold" }}>
              <b>Add Date:</b> {job.createdAt || "N/A"}
            </p>
            <p style={{ color: "#ff0000", fontWeight: "bold" }}>
              <b>Expire Date:</b> {job.expireDate || "N/A"}
            </p>
          </div>
          {job.companyImage && (
            <div style={{ flexShrink: 0, textAlign: 'center' }}>
              <img src={job.companyImage} alt="Company" style={{ width: '250px', height: '250px', objectFit: 'contain', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', backgroundColor: '#fff', padding: '10px' }} />
            </div>
          )}
        </div>

        <div className="job-description">
          <b>Description:</b>
          <FormattedDescription text={job.description} />
        </div>

        <div className="details-actions">
          <button onClick={handleApply}>Apply Now</button>
          <button className="save-job-btn" onClick={handleSaveJob}>Save Job</button>
          <Link to="/jobs" className="secondary-link">
            Back to Jobs
          </Link>
        </div>
      </div>
    </div>
  );
}

import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { updateCurrentUser } from "../../utils/storage";
import { compressImage } from "../../utils/imageUtils";
import "../Common/JobList.css";

const MAX_RESUME_SIZE = 1024 * 1024;
const ALLOWED_RESUME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

function normalizeSkills(skills) {
  if (Array.isArray(skills)) {
    return skills.filter(Boolean);
  }

  return String(skills || "")
    .split(",")
    .map((skill) => skill.trim())
    .filter(Boolean);
}

export default function Profile() {
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();
  const fileInputRef = useRef(null);
  const [profile, setProfile] = useState({
    username: user?.username || "",
    phone: user?.phone || "",
    location: user?.location || "",
    skills: normalizeSkills(user?.skills),
    resumeLink: user?.resumeLink || "",
    resumeFile: user?.resumeFile || null,
    summary: user?.summary || "",
    photoFile: user?.photoFile || null,
  });
  const [skillInput, setSkillInput] = useState("");
  const [resumeError, setResumeError] = useState("");

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });

    if (e.target.name === "resumeLink") {
      setResumeError("");
    }
  };

  const addSkill = () => {
    const skill = skillInput.trim();

    if (!skill) return;

    const alreadyAdded = profile.skills.some(
      (savedSkill) => savedSkill.toLowerCase() === skill.toLowerCase()
    );

    if (!alreadyAdded) {
      setProfile((currentProfile) => ({
        ...currentProfile,
        skills: [...currentProfile.skills, skill],
      }));
    }

    setSkillInput("");
  };

  const handleSkillKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addSkill();
    }
  };

  const removeSkill = (skillToRemove) => {
    setProfile((currentProfile) => ({
      ...currentProfile,
      skills: currentProfile.skills.filter((skill) => skill !== skillToRemove),
    }));
  };

  const handleResumeUpload = (e) => {
    const file = e.target.files?.[0];
    setResumeError("");

    if (!file) return;

    if (!ALLOWED_RESUME_TYPES.includes(file.type)) {
      setResumeError("Please upload a PDF, DOC, or DOCX file.");
      e.target.value = "";
      return;
    }

    if (file.size > MAX_RESUME_SIZE) {
      setResumeError("Resume file must be 1 MB or smaller.");
      e.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setProfile((currentProfile) => ({
        ...currentProfile,
        resumeFile: {
          name: file.name,
          type: file.type,
          size: file.size,
          data: reader.result,
        },
      }));
    };
    reader.onerror = () => setResumeError("Could not read this file. Please try again.");
    reader.readAsDataURL(file);
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    compressImage(file, (compressedDataUrl) => {
      setProfile((currentProfile) => ({
        ...currentProfile,
        photoFile: compressedDataUrl,
      }));
    });
  };

  const removeResumeFile = () => {
    setProfile((currentProfile) => ({ ...currentProfile, resumeFile: null }));
    setResumeError("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !profile.username.trim() ||
      !profile.phone.trim() ||
      !profile.location.trim() ||
      !profile.summary.trim()
    ) {
      alert("Please fill all required fields.");
      return;
    }

    if (profile.skills.length === 0) {
      alert("Please add at least one skill.");
      return;
    }

    if (!profile.resumeLink.trim() && !profile.resumeFile) {
      setResumeError("Add a resume link or upload a resume file.");
      return;
    }

    try {
      updateCurrentUser(profile);
      refreshUser();
      alert("Profile updated");
      navigate("/jobseeker");
    } catch {
      setResumeError("Profile could not be saved. Try a smaller resume file.");
    }
  };

  if (!user) {
    return (
      <div className="job-list-container">
        <p className="empty-state">Please login to update your profile.</p>
        <Link to="/login" className="primary-link">
          Login
        </Link>
      </div>
    );
  }

  return (
    <div className="job-list-container">
      <div className="job-details-card">
        <h1>My Profile</h1>

        <form className="profile-form" onSubmit={handleSubmit}>
          <div className="profile-photo-container">
            {profile.photoFile ? (
              <img src={profile.photoFile} alt="Profile" className="profile-photo" />
            ) : (
              <div className="profile-photo" style={{ backgroundColor: '#fecaca', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ff0844', fontWeight: 'bold' }}>
                No Photo
              </div>
            )}
            <input type="file" accept="image/*" onChange={handlePhotoUpload} style={{ marginTop: '10px' }} />
          </div>

          <input
            type="text"
            name="username"
            placeholder="Full Name"
            value={profile.username}
            onChange={handleChange}
            required
          />

          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={profile.phone}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="location"
            placeholder="Location"
            value={profile.location}
            onChange={handleChange}
            required
          />

          <div className="profile-field">
            <label htmlFor="skill-input">Skills</label>
            <div className="skill-entry">
              <input
                id="skill-input"
                type="text"
                placeholder="e.g. React"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleSkillKeyDown}
                required={profile.skills.length === 0}
              />
              <button type="button" onClick={addSkill} className="add-skill-btn">
                + Add Skill
              </button>
            </div>
            {profile.skills.length > 0 && (
              <div className="skill-list" aria-label="Added skills">
                {profile.skills.map((skill) => (
                  <span className="skill-tag" key={skill}>
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      aria-label={`Remove ${skill}`}
                      title={`Remove ${skill}`}
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="profile-field resume-field">
            <label htmlFor="resume-link">Resume</label>
            <input
              id="resume-link"
              type="url"
              name="resumeLink"
              placeholder="Paste resume link"
              value={profile.resumeLink}
              onChange={handleChange}
              aria-required="true"
            />
            <span className="resume-divider">or upload a file</span>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={handleResumeUpload}
            />
            <small>PDF, DOC, or DOCX up to 1 MB</small>
            {resumeError && <p className="field-error">{resumeError}</p>}
            {profile.resumeFile && (
              <div className="resume-file">
                <a
                  href={profile.resumeFile.data}
                  download={profile.resumeFile.name}
                  target="_blank"
                  rel="noreferrer"
                >
                  {profile.resumeFile.name}
                </a>
                <button type="button" onClick={removeResumeFile}>
                  Remove
                </button>
              </div>
            )}
          </div>

          <textarea
            name="summary"
            placeholder="Profile Summary"
            value={profile.summary}
            onChange={handleChange}
            rows="5"
            required
          />

          <div className="details-actions">
            <button type="submit">Save Profile</button>
            <Link to="/jobseeker" className="secondary-link">
              Back to Dashboard
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

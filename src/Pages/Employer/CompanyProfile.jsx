import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { updateCurrentUser } from "../../utils/storage";
import { getLoggedInUser } from "../../services/authApi";
import { compressImage } from "../../utils/imageUtils";
import "../Common/JobList.css";

export default function CompanyProfile() {
  const navigate = useNavigate();
  const user = getLoggedInUser();
  const [profile, setProfile] = useState({
    username: user?.username || "",
    companyName: user?.companyName || "",
    companyLocation: user?.companyLocation || "",
    companyWebsite: user?.companyWebsite || "",
    companyDescription: user?.companyDescription || "",
    photoFile: user?.photoFile || null,
  });

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
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

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!profile.username.trim()) {
      alert("Please enter your name");
      return;
    }

    if (!profile.companyName.trim()) {
      alert("Please enter company name");
      return;
    }

    updateCurrentUser(profile);
    alert("Company profile updated");
    navigate("/employer");
  };

  if (!user) {
    return (
      <div className="job-list-container">
        <p className="empty-state">Please login to update company profile.</p>
        <Link to="/login" className="primary-link">
          Login
        </Link>
      </div>
    );
  }

  return (
    <div className="job-list-container">
      <div className="job-details-card">
        <h1>Company Profile</h1>

        <form className="profile-form" onSubmit={handleSubmit}>
          <div className="profile-photo-container">
            {profile.photoFile ? (
              <img src={profile.photoFile} alt="Company Profile" className="profile-photo" />
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
            placeholder="Employer Name"
            value={profile.username}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="companyName"
            placeholder="Company Name"
            value={profile.companyName}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="companyLocation"
            placeholder="Company Location"
            value={profile.companyLocation}
            onChange={handleChange}
          />

          <input
            type="url"
            name="companyWebsite"
            placeholder="Company Website"
            value={profile.companyWebsite}
            onChange={handleChange}
          />

          <textarea
            name="companyDescription"
            placeholder="Company Description"
            value={profile.companyDescription}
            onChange={handleChange}
            rows="5"
          />

          <div className="details-actions">
            <button type="submit">Save Profile</button>
            <Link to="/employer" className="secondary-link">
              Back to Dashboard
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

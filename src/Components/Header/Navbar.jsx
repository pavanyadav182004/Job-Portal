import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./Navbar.css";
import useAuth from "../../hooks/useAuth";

import brandLogoUrl from "../../assets/job.png";

export default function Navbar() {
  const [menu, setMenu] = useState(false);
  const [profileMenu, setProfileMenu] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    setMenu(false);
    setProfileMenu(false);
    navigate("/login");
  };

  const dashboardPath = user?.role === "employer" ? "/employer" : "/jobseeker";
  const profilePath = user?.role === "employer" ? "/company-profile" : "/profile";
  const displayName = user?.username || "User";
  const avatarImage = user?.profileImage || user?.avatar || user?.photoUrl || user?.photoFile;
  const avatarInitial = displayName.charAt(0).toUpperCase();

  return (
    <header>
      <Link to="/jobs" className="brand" aria-label="Job Portal">
        <img
          src={brandLogoUrl}
          alt="Job Portal logo"
          onError={(event) => {
            event.currentTarget.style.display = "none";
            event.currentTarget.nextElementSibling.classList.add("brand-fallback");
          }}
        />
        {/* <span>Job Portal</span> */}
      </Link>

      <button
        className="menu-icon"
        onClick={() => {
          setMenu(!menu);
          setProfileMenu(false);
        }}
        aria-label="Toggle menu"
      >
        {menu ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        )}
      </button>

      <nav className={menu ? "active" : ""}>
        <ul>
          <li><Link to="/jobs" onClick={() => setMenu(false)}>Find Jobs</Link></li>
          {user && <li><Link to={dashboardPath} onClick={() => setMenu(false)}>Dashboard</Link></li>}
          {user?.role === "employer" && <li><Link to="/my-jobs" onClick={() => setMenu(false)}>My Jobs</Link></li>}
          {user?.role === "employer" && <li><Link to="/company-profile" onClick={() => setMenu(false)}>Company</Link></li>}
          {user?.role === "jobseeker" && <li><Link to="/applied-jobs" onClick={() => setMenu(false)}>Applied Jobs</Link></li>}
          {user?.role === "jobseeker" && <li><Link to="/saved-jobs" onClick={() => setMenu(false)}>Saved Jobs</Link></li>}
        </ul>

        {user ? (
          <div className="user-section">
            <span className="username">{displayName}</span>
            <div className="profile-menu">
              <button
                className="profile-trigger"
                onClick={() => setProfileMenu(!profileMenu)}
                aria-expanded={profileMenu}
                aria-haspopup="menu"
                aria-label="Open profile menu"
              >
                {avatarImage ? (
                  <img src={avatarImage} alt={displayName} />
                ) : (
                  <span>{avatarInitial}</span>
                )}
              </button>

              {profileMenu && (
                <div className="profile-dropdown" role="menu">
                  <Link
                    to={profilePath}
                    role="menuitem"
                    onClick={() => {
                      setMenu(false);
                      setProfileMenu(false);
                    }}
                  >
                    Profile
                  </Link>
                  <button type="button" role="menuitem" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <Link to="/login" onClick={() => setMenu(false)}>
            <button className="login-btn">Login</button>
          </Link>
        )}
      </nav>
    </header>
  );
}

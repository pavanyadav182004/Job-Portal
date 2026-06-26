import { Route, Routes, Navigate } from "react-router-dom";
import Login from "../Pages/Auth/Login/Login";
import Register from "../Pages/Auth/Register/Register";
import JobList from "../Pages/Common/JobList";
import JobDetails from "../Pages/JobSeeker/JobDetails";
import EmployeerDashboard from "../Pages/Employer/EmployeerDashboard";
import JobSeekerDashboard from "../Pages/JobSeeker/JobSeekerDashboard";
import AppliedJobs from "../Pages/JobSeeker/AppliedJobs";
import AddJob from "../Pages/Employer/AddJob";
import MyJob from "../Pages/Employer/MyJob";
import EditJob from "../Pages/Employer/EditJob";
import Applicants from "../Pages/Employer/Applicants";
import CompanyProfile from "../Pages/Employer/CompanyProfile";
import Profile from "../Pages/JobSeeker/Profile";
import SavedJobs from "../Pages/JobSeeker/SavedJobs";
import NotFound from "../Pages/Common/NotFound";



export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/jobs" replace />} />
      
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/jobseeker" element={<JobSeekerDashboard/>} />
      <Route path="/employer" element={< EmployeerDashboard/>} />


      <Route path="/jobs" element={<JobList/>} />
      <Route path="/jobs/:id" element={<JobDetails/>} />

      <Route path="/applied-jobs" element={<AppliedJobs/>} />
      <Route path="/saved-jobs" element={<SavedJobs />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/add-job" element={<AddJob/>} />
      <Route path="/my-jobs" element={<MyJob/>} />
      <Route path="/edit-job/:id" element={<EditJob/>} />
      <Route path="/applicants" element={<Applicants />} />
      <Route path="/company-profile" element={<CompanyProfile />} />
      <Route path="*" element={<NotFound />} />
     

    </Routes>
  );
}

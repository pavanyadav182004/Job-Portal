import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../../../services/authApi";
import { getUsers } from "../../../utils/storage";
import "./Register.css";

const initialUser = {
  username: "",
  email: "",
  password: "",
  cpassword: "",
  role: "jobseeker",
};

export default function Register() {
  const navigate = useNavigate();
  const [user, setUser] = useState(initialUser);

  const existingUsers = getUsers();
  const hasEmployer = existingUsers.some(u => u.role === "employer");

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await registerUser(user);
      alert("Registration Successful");
      setUser(initialUser);
      navigate("/login");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h1>Register</h1>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Enter Username"
            value={user.username}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Enter Email"
            value={user.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Enter Password"
            value={user.password}
            onChange={handleChange}
            required
          />

          {/* <small style={{ color: "red" }}>
            Password must contain 6+ characters, 1 letter, 1 number and 1 special
            character (@,#,$,!).
          </small> */}

          <input
            type="password"
            name="cpassword"
            placeholder="Confirm Password"
            value={user.cpassword}
            onChange={handleChange}
            required
          />

          <select name="role" value={user.role} onChange={handleChange}>
            <option value="jobseeker">Job Seeker</option>
            {!hasEmployer && <option value="employer">Employer</option>}
          </select>

          <button type="submit">Register</button> 
        </form>

        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

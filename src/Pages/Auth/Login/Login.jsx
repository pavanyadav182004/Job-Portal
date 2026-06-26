import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../../../services/authApi";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const user = await loginUser({ email, password });
      alert(`Welcome ${user.username}`);

      if (user.role === "employer") {
        navigate("/employer");
      } else {
        navigate("/jobseeker");
      }
    } catch (error) {
      alert(error.message);
      return;
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Login</h1>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">Login</button>

          <p>
            Create a new User?{" "}
            <Link to="/register">Register</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

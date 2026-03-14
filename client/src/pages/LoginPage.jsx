import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const roleConfig = {
  principal: {
    title: "Admin / Principal Login",
    icon: "🛡️",
    iconBg: "#dbeafe",
    iconColor: "#2563eb",
  },
  admin: {
    title: "Admin / Principal Login",
    icon: "🛡️",
    iconBg: "#dbeafe",
    iconColor: "#2563eb",
  },
  hod: {
    title: "Head of Department Login",
    icon: "👥",
    iconBg: "#dbeafe",
    iconColor: "#2563eb",
  },
  staff: {
    title: "Staff Login",
    icon: "👨‍🏫",
    iconBg: "#dbeafe",
    iconColor: "#2563eb",
  },
  student: {
    title: "Student Login",
    icon: "🎓",
    iconBg: "#dbeafe",
    iconColor: "#2563eb",
  },
};

export default function LoginPage() {
  const { role } = useParams();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const config = roleConfig[role] || roleConfig.student;
  const isStudentLogin = (role || "").toLowerCase() === "student";

  const roleRouteMap = {
    principal: "/admin/dashboard",
    admin: "/admin/dashboard",
    staff: "/hod/dashboard",
    hod: "/hod/dashboard",
    student: "/student/dashboard",
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const res = await axios.post("/auth/login", {
        email,
        password,
        role,
      });

      const apiRole = res.data.role || res.data.user?.role || role;

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
      }
      if (res.data.user) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
      }

      navigate(roleRouteMap[apiRole] || "/student/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-page">
      <button className="back-button" onClick={() => navigate("/")}>
        ← Back to Home
      </button>

      <div className="login-container">
        <div
          className="login-icon"
          style={{ background: config.iconBg, color: config.iconColor }}
        >
          {config.icon}
        </div>
        <h1 className="login-title">{config.title}</h1>
        <p className="login-subtitle">
          Enter your credentials to access the dashboard
        </p>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={isStudentLogin ? "rollnumber@svecw.edu.in" : "Enter your email"}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-input">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={isStudentLogin ? "Enter roll number in lowercase" : "Enter your password"}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "👁️" : "👁️"}
              </button>
            </div>
          </div>

          <div className="form-footer">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              Remember me
            </label>
            <a href="#" className="forgot-link">
              Forgot password?
            </a>
          </div>

          <button type="submit" className="login-button">
            {isSubmitting ? "Signing In..." : "Sign In"}
          </button>
        </form>

        {error && <p className="error" style={{ marginTop: "12px" }}>{error}</p>}

        <div className="demo-note">
          <strong>Demo:</strong>{" "}
          {isStudentLogin
            ? "Use rollnumber@svecw.edu.in and password as roll/register number in lowercase letters and numbers."
            : "Login is connected to backend API and routes by your role."}
        </div>
      </div>
    </div>
  );
}

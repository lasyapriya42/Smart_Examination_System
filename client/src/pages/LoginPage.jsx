import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const roleConfig = {
  admin: {
    title: "Admin / Principal Login",
    icon: "🛡️",
    iconBg: "#ede9fe",
    iconColor: "#7c3aed",
  },
  hod: {
    title: "Head of Department Login",
    icon: "👥",
    iconBg: "#d1fae5",
    iconColor: "#059669",
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

  const config = roleConfig[role] || roleConfig.student;

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(`/${role}/dashboard`);
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
              placeholder="Enter your email"
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
                placeholder="Enter your password"
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
            Sign In
          </button>
        </form>

        <div className="demo-note">
          <strong>Demo:</strong> Enter any email and password to access the
          dashboard
        </div>
      </div>
    </div>
  );
}

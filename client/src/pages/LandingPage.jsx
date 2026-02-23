import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar.jsx";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="page">
      <NavBar />

      <header className="hero" id="top">
        <div className="hero-content">
          <h1>
            Smart Examination
            <span>Management System</span>
          </h1>
          <p className="hero-subtitle">
            Automate your entire examination process with our comprehensive
            digital platform. From scheduling to results, manage everything
            efficiently.
          </p>
          <div className="hero-actions">
            <button className="primary">Get Started</button>
            <button className="secondary">Learn More</button>
          </div>
        </div>
      </header>

      <section className="features" id="features">
        <h2>Why Choose ExamSmart?</h2>
        <div className="feature-grid">
          <article className="feature-card">
            <div className="icon-badge">📘</div>
            <h3>Digital Examination</h3>
            <p> 
              Conduct secure online exams with timer-based submissions and
              auto-grading.
            </p>
          </article>
          <article className="feature-card">
            <div className="icon-badge">📋</div>
            <h3>Smart Evaluation</h3>
            <p>
              Automated answer checking with detailed performance analytics.
            </p>
          </article>
          <article className="feature-card">
            <div className="icon-badge">📊</div>
            <h3>Real-time Analytics</h3>
            <p>
              Track student progress, identify weak areas, and generate reports.
            </p>
          </article>
        </div>
      </section>

      <section className="portals" id="portals">
        <h2>Select Your Portal</h2>
        <p className="section-subtitle">
          Choose your role to access the appropriate dashboard and features.
        </p>
        <div className="portal-grid">
          <article
            className="portal-card portal-admin"
            onClick={() => navigate("/login/admin")}
          >
            <div className="portal-icon">🛡️</div>
            <div>
              <h3>Admin / Principal</h3>
              <p>
                Complete system control, user management, exam scheduling, and
                analytics.
              </p>
              <ul>
                <li>User Management</li>
                <li>Exam Scheduling</li>
                <li>Reports & Analytics</li>
              </ul>
            </div>
            <span className="portal-arrow">→</span>
          </article>
          <article
            className="portal-card portal-hod"
            onClick={() => navigate("/login/hod")}
          >
            <div className="portal-icon">👥</div>
            <div>
              <h3>HOD</h3>
              <p>
                Department management, faculty oversight, and question paper
                approval.
              </p>
              <ul>
                <li>Faculty Management</li>
                <li>Question Bank</li>
                <li>Performance Analysis</li>
              </ul>
            </div>
            <span className="portal-arrow">→</span>
          </article>
          <article
            className="portal-card portal-student"
            onClick={() => navigate("/login/student")}
          >
            <div className="portal-icon">🎓</div>
            <div>
              <h3>Student</h3>
              <p>
                Access exams, view results, and track academic performance.
              </p>
              <ul>
                <li>Online Exams</li>
                <li>View Results</li>
                <li>Performance Tracking</li>
              </ul>
            </div>
            <span className="portal-arrow">→</span>
          </article>
        </div>
      </section>

      <footer className="footer">
        © 2026 ExamSmart - Smart Examination Management System
      </footer>
    </div>
  );
}

import { useNavigate } from "react-router-dom";

export default function StudentDashboard() {
  const navigate = useNavigate();

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo">🎓</div>
          <div>
            <strong>Student Portal</strong>
            <span>ExamSmart</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <p className="nav-label">Navigation</p>
          <a href="#" className="nav-item active">
            <span>📊</span> Dashboard
          </a>
          <a href="#" className="nav-item">
            <span>📝</span> My Exams
          </a>
          <a href="#" className="nav-item">
            <span>📄</span> Results
          </a>
          <a href="#" className="nav-item">
            <span>📈</span> Performance
          </a>
          <a href="#" className="nav-item">
            <span>⚙️</span> Profile
          </a>
        </nav>

        <div className="sidebar-user">
          <div className="user-avatar">ST</div>
          <div>
            <strong>Student User</strong>
            <span>user@example.com</span>
          </div>
        </div>

        <button className="logout-button" onClick={() => navigate("/")}>
          <span>🚪</span> Logout
        </button>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <button className="menu-toggle">☰</button>
          <button className="notification-button">
            🔔<span className="notification-badge">1</span>
          </button>
        </header>

        <div className="dashboard-content">
          <div className="page-header">
            <h1>Student Dashboard</h1>
            <p>Track your exams, results, and academic progress</p>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-header">
                <span>Upcoming Exams</span>
                <span className="stat-icon">📋</span>
              </div>
              <div className="stat-value">3</div>
            </div>
            <div className="stat-card">
              <div className="stat-header">
                <span>Completed Exams</span>
                <span className="stat-icon">✅</span>
              </div>
              <div className="stat-value">12</div>
            </div>
            <div className="stat-card">
              <div className="stat-header">
                <span>Average Score</span>
                <span className="stat-icon">📈</span>
              </div>
              <div className="stat-value">78%</div>
            </div>
            <div className="stat-card">
              <div className="stat-header">
                <span>Subjects Enrolled</span>
                <span className="stat-icon">📚</span>
              </div>
              <div className="stat-value">6</div>
            </div>
          </div>

          <section className="content-section">
            <h2>Upcoming Exams</h2>
            <p className="section-subtitle">Your scheduled examinations</p>
            <div className="exam-card">
              <div className="exam-info">
                <h3>Data Structures Mid-Term</h3>
                <p>Computer Science</p>
                <div className="exam-meta">
                  <span>📅 Feb 15, 2026</span>
                  <span>🕐 10:00 AM</span>
                  <span>⏱️ 2 hours</span>
                </div>
              </div>
              <button className="start-button">▶ Start</button>
            </div>
          </section>

          <section className="content-section">
            <h2>Recent Results</h2>
            <p className="section-subtitle">Your latest exam scores</p>
            <div className="results-list">
              <div className="result-item">
                <div>
                  <strong>Database Systems</strong>
                  <span>Feb 1, 2026</span>
                </div>
                <div className="result-score">
                  <strong>85/100</strong>
                  <span className="grade-badge grade-a">Grade: A</span>
                </div>
              </div>
              <div className="result-item">
                <div>
                  <strong>Operating Systems</strong>
                  <span>Jan 28, 2026</span>
                </div>
                <div className="result-score">
                  <strong>72/100</strong>
                  <span className="grade-badge grade-b">Grade: B</span>
                </div>
              </div>
              <div className="result-item">
                <div>
                  <strong>Computer Networks</strong>
                  <span>Jan 25, 2026</span>
                </div>
                <div className="result-score">
                  <strong>91/100</strong>
                  <span className="grade-badge grade-a">Grade: A+</span>
                </div>
              </div>
            </div>
            <button className="view-all-button">View All Results</button>
          </section>

          <section className="content-section">
            <h2>Subject Progress</h2>
            <p className="section-subtitle">
              Track your exam completion by subject
            </p>
            <div className="progress-list">
              <div className="progress-item">
                <div>
                  <strong>Data Structures</strong>
                  <span>3 of 4 exams completed</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: "75%" }}></div>
                </div>
                <span className="progress-percent">75%</span>
              </div>
              <div className="progress-item">
                <div>
                  <strong>Mathematics</strong>
                  <span>3 of 5 exams completed</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: "60%" }}></div>
                </div>
                <span className="progress-percent">60%</span>
              </div>
              <div className="progress-item">
                <div>
                  <strong>Physics</strong>
                  <span>2 of 4 exams completed</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: "50%" }}></div>
                </div>
                <span className="progress-percent">50%</span>
              </div>
              <div className="progress-item">
                <div>
                  <strong>Database Systems</strong>
                  <span>4 of 4 exams completed</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: "100%" }}></div>
                </div>
                <span className="progress-percent">100%</span>
              </div>
            </div>
          </section>

          <div className="action-cards">
            <div className="action-card">
              <span className="action-icon">📝</span>
              <strong>Take Practice Test</strong>
              <p>Prepare for upcoming exams</p>
            </div>
            <div className="action-card">
              <span className="action-icon">📄</span>
              <strong>View Scorecards</strong>
              <p>Download your results</p>
            </div>
            <div className="action-card">
              <span className="action-icon">📊</span>
              <strong>Performance Analytics</strong>
              <p>View detailed insights</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

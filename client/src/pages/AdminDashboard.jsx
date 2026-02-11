import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo" style={{ background: "#ede9fe", color: "#7c3aed" }}>
            🛡️
          </div>
          <div>
            <strong>Admin Portal</strong>
            <span>ExamSmart</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <p className="nav-label">Navigation</p>
          <a href="#" className="nav-item active">
            <span>📊</span> Dashboard
          </a>
          <a href="#" className="nav-item">
            <span>👥</span> User Management
          </a>
          <a href="#" className="nav-item">
            <span>🏢</span> Departments
          </a>
          <a href="#" className="nav-item">
            <span>📝</span> Exam Management
          </a>
          <a href="#" className="nav-item">
            <span>📄</span> Results
          </a>
          <a href="#" className="nav-item">
            <span>📈</span> Analytics
          </a>
          <a href="#" className="nav-item">
            <span>⚙️</span> Settings
          </a>
        </nav>

        <div className="sidebar-user">
          <div className="user-avatar" style={{ background: "#7c3aed" }}>AD</div>
          <div>
            <strong>Admin User</strong>
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
            <h1>Admin Dashboard</h1>
            <p>Welcome back! Here's an overview of your examination system.</p>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-header">
                <span>Total Users</span>
                <span className="stat-icon" style={{ color: "#3b82f6" }}>👥</span>
              </div>
              <div className="stat-value">1,234</div>
              <div className="stat-trend positive">📈 +12% from last month</div>
            </div>
            <div className="stat-card">
              <div className="stat-header">
                <span>Active Students</span>
                <span className="stat-icon" style={{ color: "#8b5cf6" }}>🎓</span>
              </div>
              <div className="stat-value">856</div>
              <div className="stat-trend positive">📈 +8% from last month</div>
            </div>
            <div className="stat-card">
              <div className="stat-header">
                <span>Departments</span>
                <span className="stat-icon" style={{ color: "#14b8a6" }}>🏢</span>
              </div>
              <div className="stat-value">12</div>
              <div className="stat-trend neutral">📈 0% from last month</div>
            </div>
            <div className="stat-card">
              <div className="stat-header">
                <span>Exams Scheduled</span>
                <span className="stat-icon" style={{ color: "#a855f7" }}>📋</span>
              </div>
              <div className="stat-value">24</div>
              <div className="stat-trend positive">📈 +3 from last month</div>
            </div>
          </div>

          <section className="content-section">
            <h2>Recent Activity</h2>
            <p className="section-subtitle">Latest actions across the system</p>
            <div className="activity-list">
              <div className="activity-item">
                <span className="activity-dot green"></span>
                <div className="activity-content">
                  <strong>New student registered</strong>
                  <span>John Doe • 2 minutes ago</span>
                </div>
              </div>
              <div className="activity-item">
                <span className="activity-dot blue"></span>
                <div className="activity-content">
                  <strong>Exam scheduled</strong>
                  <span>Dr. Smith • 15 minutes ago</span>
                </div>
              </div>
              <div className="activity-item">
                <span className="activity-dot orange"></span>
                <div className="activity-content">
                  <strong>Malpractice alert</strong>
                  <span>Jane Student • 1 hour ago</span>
                </div>
              </div>
              <div className="activity-item">
                <span className="activity-dot green"></span>
                <div className="activity-content">
                  <strong>Results published</strong>
                  <span>System • 2 hours ago</span>
                </div>
              </div>
            </div>
          </section>

          <section className="content-section">
            <h2>Upcoming Exams</h2>
            <p className="section-subtitle">Scheduled examinations this month</p>
            <div className="exam-list">
              <div className="exam-list-item">
                <div className="exam-list-info">
                  <strong>Computer Science Mid-Term</strong>
                  <div className="exam-list-meta">
                    <span>🕐 Feb 15, 2026</span>
                    <span>👥 120 students</span>
                  </div>
                </div>
                <span className="status-badge status-scheduled">Scheduled</span>
              </div>
              <div className="exam-list-item">
                <div className="exam-list-info">
                  <strong>Mathematics Final</strong>
                  <div className="exam-list-meta">
                    <span>🕐 Feb 18, 2026</span>
                    <span>👥 95 students</span>
                  </div>
                </div>
                <span className="status-badge status-pending">Pending Approval</span>
              </div>
              <div className="exam-list-item">
                <div className="exam-list-info">
                  <strong>Physics Practical</strong>
                  <div className="exam-list-meta">
                    <span>🕐 Feb 20, 2026</span>
                    <span>👥 78 students</span>
                  </div>
                </div>
                <span className="status-badge status-scheduled">Scheduled</span>
              </div>
            </div>
          </section>

          <div className="metric-cards">
            <div className="metric-card" style={{ background: "#d1fae5" }}>
              <span className="metric-icon">✅</span>
              <div>
                <div className="metric-value">92%</div>
                <div className="metric-label">Exam Completion Rate</div>
              </div>
            </div>
            <div className="metric-card" style={{ background: "#fed7aa" }}>
              <span className="metric-icon">⚠️</span>
              <div>
                <div className="metric-value">5</div>
                <div className="metric-label">Pending Approvals</div>
              </div>
            </div>
            <div className="metric-card" style={{ background: "#dbeafe" }}>
              <span className="metric-icon">📊</span>
              <div>
                <div className="metric-value">78%</div>
                <div className="metric-label">Average Pass Rate</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

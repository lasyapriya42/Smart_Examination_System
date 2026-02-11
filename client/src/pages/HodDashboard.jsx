import { useNavigate } from "react-router-dom";

export default function HodDashboard() {
  const navigate = useNavigate();

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo" style={{ background: "#d1fae5", color: "#059669" }}>
            👥
          </div>
          <div>
            <strong>HOD Portal</strong>
            <span>ExamSmart</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <p className="nav-label">Navigation</p>
          <a href="#" className="nav-item active">
            <span>📊</span> Dashboard
          </a>
          <a href="#" className="nav-item">
            <span>👨‍🏫</span> Faculty
          </a>
          <a href="#" className="nav-item">
            <span>📚</span> Question Bank
          </a>
          <a href="#" className="nav-item">
            <span>📝</span> Exam Scheduling
          </a>
          <a href="#" className="nav-item">
            <span>📈</span> Student Performance
          </a>
          <a href="#" className="nav-item">
            <span>📄</span> Reports
          </a>
          <a href="#" className="nav-item">
            <span>⚙️</span> Settings
          </a>
        </nav>

        <div className="sidebar-user">
          <div className="user-avatar" style={{ background: "#059669" }}>HD</div>
          <div>
            <strong>HOD User</strong>
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
            <h1>HOD Dashboard</h1>
            <p>Manage your department's examinations and faculty</p>
            <button className="primary-action">+ Schedule Exam</button>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-header">
                <span>Faculty Members</span>
                <span className="stat-icon" style={{ color: "#3b82f6" }}>👥</span>
              </div>
              <div className="stat-value">18</div>
              <div className="stat-trend positive">📈 +2 this semester</div>
            </div>
            <div className="stat-card">
              <div className="stat-header">
                <span>Question Bank</span>
                <span className="stat-icon" style={{ color: "#3b82f6" }}>📚</span>
              </div>
              <div className="stat-value">456</div>
              <div className="stat-trend positive">📈 +34 this semester</div>
            </div>
            <div className="stat-card">
              <div className="stat-header">
                <span>Active Exams</span>
                <span className="stat-icon" style={{ color: "#f59e0b" }}>📋</span>
              </div>
              <div className="stat-value">6</div>
              <div className="stat-trend positive">📈 +1 this semester</div>
            </div>
            <div className="stat-card">
              <div className="stat-header">
                <span>Pending Reviews</span>
                <span className="stat-icon" style={{ color: "#ef4444" }}>📄</span>
              </div>
              <div className="stat-value">12</div>
              <div className="stat-trend negative">📈 -3 this semester</div>
            </div>
          </div>

          <section className="content-section">
            <h2>Pending Question Paper Approvals</h2>
            <p className="section-subtitle">Review and approve submitted question papers</p>
            <div className="approval-list">
              <div className="approval-item">
                <div className="approval-info">
                  <strong>Data Structures Mid-Term</strong>
                  <div className="approval-meta">
                    <span>Dr. Johnson</span>
                    <span>•</span>
                    <span>50 questions</span>
                    <span>•</span>
                    <span>🕐 2 hours ago</span>
                  </div>
                </div>
                <div className="approval-actions">
                  <button className="action-button secondary">Review</button>
                  <button className="action-button primary">Approve</button>
                </div>
              </div>
              <div className="approval-item">
                <div className="approval-info">
                  <strong>Algorithm Design Quiz</strong>
                  <div className="approval-meta">
                    <span>Prof. Williams</span>
                    <span>•</span>
                    <span>25 questions</span>
                    <span>•</span>
                    <span>🕐 Yesterday</span>
                  </div>
                </div>
                <div className="approval-actions">
                  <button className="action-button secondary">Review</button>
                  <button className="action-button primary">Approve</button>
                </div>
              </div>
              <div className="approval-item">
                <div className="approval-info">
                  <strong>Database Systems Final</strong>
                  <div className="approval-meta">
                    <span>Dr. Brown</span>
                    <span>•</span>
                    <span>75 questions</span>
                    <span>•</span>
                    <span>🕐 2 days ago</span>
                  </div>
                </div>
                <div className="approval-actions">
                  <button className="action-button secondary">Review</button>
                  <button className="action-button primary">Approve</button>
                </div>
              </div>
            </div>
          </section>

          <section className="content-section">
            <h2>Faculty Performance</h2>
            <p className="section-subtitle">Overview of faculty contributions</p>
            <div className="faculty-list">
              <div className="faculty-item">
                <div className="faculty-avatar" style={{ background: "#14b8a6", color: "#fff" }}>DSJ</div>
                <div className="faculty-info">
                  <strong>Dr. Sarah Johnson</strong>
                  <span>3 subjects • 12 exams created</span>
                </div>
                <div className="faculty-rating">
                  <strong>4.8</strong>
                  <span>⭐</span>
                  <span className="rating-label">Avg Rating</span>
                </div>
              </div>
              <div className="faculty-item">
                <div className="faculty-avatar" style={{ background: "#14b8a6", color: "#fff" }}>PMW</div>
                <div className="faculty-info">
                  <strong>Prof. Michael Williams</strong>
                  <span>2 subjects • 8 exams created</span>
                </div>
                <div className="faculty-rating">
                  <strong>4.5</strong>
                  <span>⭐</span>
                  <span className="rating-label">Avg Rating</span>
                </div>
              </div>
              <div className="faculty-item">
                <div className="faculty-avatar" style={{ background: "#14b8a6", color: "#fff" }}>DEB</div>
                <div className="faculty-info">
                  <strong>Dr. Emily Brown</strong>
                  <span>4 subjects • 15 exams created</span>
                </div>
                <div className="faculty-rating">
                  <strong>4.9</strong>
                  <span>⭐</span>
                  <span className="rating-label">Avg Rating</span>
                </div>
              </div>
            </div>
          </section>

          <section className="content-section">
            <h2>Department Overview - Computer Science</h2>
            <p className="section-subtitle">Key metrics for this semester</p>
            <div className="overview-metrics">
              <div className="overview-metric">
                <div className="overview-value" style={{ color: "#14b8a6" }}>245</div>
                <div className="overview-label">Total Students</div>
              </div>
              <div className="overview-metric">
                <div className="overview-value" style={{ color: "#10b981" }}>82%</div>
                <div className="overview-label">Pass Rate</div>
              </div>
              <div className="overview-metric">
                <div className="overview-value" style={{ color: "#3b82f6" }}>18</div>
                <div className="overview-label">Exams Conducted</div>
              </div>
              <div className="overview-metric">
                <div className="overview-value" style={{ color: "#f59e0b" }}>4</div>
                <div className="overview-label">Upcoming Exams</div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

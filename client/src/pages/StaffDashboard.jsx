import { useNavigate } from "react-router-dom";

export default function StaffDashboard() {
  const navigate = useNavigate();

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo">
            👨‍🏫
          </div>
          <div>
            <strong>Staff Portal</strong>
            <span>ExamSmart</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <p className="nav-label">Navigation</p>
          <a href="#" className="nav-item active">
            <span>📊</span> Dashboard
          </a>
          <a href="#" className="nav-item">
            <span>📝</span> Invigilation Duties
          </a>
          <a href="#" className="nav-item">
            <span>🏫</span> Room Assignments
          </a>
          <a href="#" className="nav-item">
            <span>📄</span> Reports
          </a>
        </nav>

        <div className="sidebar-user">
          <div className="user-avatar">SF</div>
          <div>
            <strong>Staff User</strong>
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
        </header>

        <div className="dashboard-content">
          <div className="page-header">
            <h1>Staff Dashboard</h1>
            <p>Manage your exam duties and room assignments</p>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-header">
                <span>Upcoming Duties</span>
              </div>
              <div className="stat-value">3</div>
            </div>
            <div className="stat-card">
              <div className="stat-header">
                <span>Assigned Rooms</span>
              </div>
              <div className="stat-value">5</div>
            </div>
            <div className="stat-card">
              <div className="stat-header">
                <span>Completed Reports</span>
              </div>
              <div className="stat-value">14</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

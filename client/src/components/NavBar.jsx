export default function NavBar() {
  return (
    <nav className="nav">
      <div className="brand">
        <span className="logo">🎓</span>
        <div>
          <strong>ExamSmart</strong>
          <span>Examination Management System</span>
        </div>
      </div>
      <div className="links">
        <a className="link" href="#features">Features</a>
        <a className="link" href="#portals">Portals</a>
      </div>
    </nav>
  );
}

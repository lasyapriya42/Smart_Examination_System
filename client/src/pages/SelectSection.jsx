import { useNavigate, useParams, useLocation } from "react-router-dom";

export default function SelectSection() {
  const navigate = useNavigate();
  const { year, dept } = useParams();
  const location = useLocation();
  const studentData = location.state?.studentData || {};

  const allSections = Object.keys(studentData?.[year]?.[dept] || {});
  const sectionOptions = ["ALL", ...allSections];

  const handleSectionSelect = (section) => {
    // Check if section has data
    if (section !== "ALL" && !studentData[year]?.[dept]?.[section]) {
      alert(`No student data available for Section ${section}`);
      return;
    }
    navigate(`/students-list/${year}/${dept}/${section}`, {
      state: { studentData }
    });
  };

  const handleBack = () => {
    navigate(-1);
  };

  // Check if department has data
  if (!studentData[year]?.[dept]) {
    return (
      <div className="selection-page">
        <div className="selection-container">
          <button className="back-button" onClick={handleBack}>
            ← Back
          </button>
          <div className="page-header">
            <h1>No Data Available</h1>
            <p>Year {year} — {dept} has no student records yet.</p>
          </div>
          <p className="no-data" style={{ marginTop: "40px" }}>
            Please add students for this department first.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="selection-page">
      <div className="selection-container">
        <button className="back-button" onClick={handleBack}>
          ← Back
        </button>

        <div className="page-header">
          <h1>Select Section</h1>
          <p>Year {year} — {dept} — Choose a section</p>
        </div>

        <div className="selection-grid">
          {sectionOptions.length > 0 ? (
            sectionOptions.map((section) => (
              <button
                key={section}
                className="selection-card"
                onClick={() => handleSectionSelect(section)}
              >
                <span className="card-icon">👥</span>
                <span className="card-text">
                  {section === "ALL" ? "All Sections" : `Section ${section}`}
                </span>
              </button>
            ))
          ) : (
            <p className="no-data">No sections available for {dept} in Year {year}</p>
          )}
        </div>
      </div>
    </div>
  );
}

import { useNavigate, useParams, useLocation } from "react-router-dom";

export default function SelectDepartment() {
  const navigate = useNavigate();
  const { year } = useParams();
  const location = useLocation();
  const studentData = location.state?.studentData || {};

  const departments = Object.keys(studentData?.[year] || {});

  const handleDeptSelect = (dept) => {
    // Check if department has data
    if (!studentData[year]?.[dept]) {
      alert(`No student data available for ${dept} in Year ${year}`);
      return;
    }
    navigate(`/select-section/${year}/${dept}`, {
      state: { studentData }
    });
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="selection-page">
      <div className="selection-container">
        <button className="back-button" onClick={handleBack}>
          ← Back
        </button>

        <div className="page-header">
          <h1>Select Department</h1>
          <p>Year {year} — Choose a department</p>
        </div>

        <div className="selection-grid">
          {departments.length > 0 ? (
            departments.map((dept) => (
              <button
                key={dept}
                className="selection-card"
                onClick={() => handleDeptSelect(dept)}
              >
                <span className="card-icon">🏢</span>
                <span className="card-text">{dept}</span>
              </button>
            ))
          ) : (
            <p className="no-data">No departments available for Year {year}</p>
          )}
        </div>
      </div>
    </div>
  );
}

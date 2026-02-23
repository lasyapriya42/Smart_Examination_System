import { useNavigate, useParams, useLocation } from "react-router-dom";

export default function SelectDepartment() {
  const navigate = useNavigate();
  const { year } = useParams();
  const location = useLocation();
  const studentData = location.state?.studentData || {};

  // All available departments
  const allDepartments = [
    { code: "CSE", name: "Computer Science and Engineering (CSE)" },
    { code: "IT", name: "Information Technology (IT)" },
    { code: "AIML", name: "Artificial Intelligence and Machine Learning (AIML)" },
    { code: "AIDS", name: "Artificial Intelligence and Data Science (AIDS)" },
    { code: "ECE", name: "Electronics and Communication Engineering (ECE)" },
    { code: "EEE", name: "Electrical and Electronics Engineering (EEE)" },
    { code: "ME", name: "Mechanical Engineering (ME)" },
    { code: "CE", name: "Civil Engineering (CE)" },
  ];

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
          {allDepartments.map((dept) => (
            <button
              key={dept.code}
              className="selection-card"
              onClick={() => handleDeptSelect(dept.code)}
            >
              <span className="card-icon">🏢</span>
              <span className="card-text">{dept.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

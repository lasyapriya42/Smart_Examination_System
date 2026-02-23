import { useNavigate, useParams, useLocation } from "react-router-dom";

export default function StudentsList() {
  const navigate = useNavigate();
  const { year, dept, section } = useParams();
  const location = useLocation();
  const studentData = location.state?.studentData || {};

  const students = studentData[year]?.[dept]?.[section] || [];

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
          <h1>Students List</h1>
          <p>Year {year} — {dept} — Section {section}</p>
        </div>

        {students.length > 0 ? (
          <div className="students-list-container">
            <ul className="students-list">
              {students.map((student) => (
                <li key={student._id} className="student-item">
                  <div className="student-info">
                    <div className="student-roll">{student.rollNo}</div>
                    <div className="student-details">
                      <h4>{student.name}</h4>
                      <p>{student.email}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="no-data">No students found in this section</p>
        )}
      </div>
    </div>
  );
}

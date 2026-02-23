import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function SelectYear() {
  const navigate = useNavigate();
  const location = useLocation();
  const [studentData, setStudentData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch grouped student data
    axios
      .get("http://localhost:5000/api/student/grouped")
      .then((res) => {
        setStudentData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  const handleYearSelect = (year) => {
    navigate(`/select-department/${year}`, {
      state: { studentData }
    });
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  // Always show years 1-4
  const allYears = ["1", "2", "3", "4"];

  return (
    <div className="selection-page">
      <div className="selection-container">
        <button className="back-button" onClick={handleBack}>
          ← Back
        </button>

        <div className="page-header">
          <h1>Select Year</h1>
          <p>Choose the academic year to view students</p>
        </div>

        <div className="selection-grid">
          {allYears.length > 0 ? (
            allYears.map((year) => (
              <button
                key={year}
                className="selection-card"
                onClick={() => handleYearSelect(year)}
              >
                <span className="card-icon">📚</span>
                <span className="card-text">Year {year}</span>
              </button>
            ))
          ) : (
            <p className="no-data">No years available</p>
          )}
        </div>
      </div>
    </div>
  );
}

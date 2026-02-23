import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function SelectStaffDept() {
  const navigate = useNavigate();
  const location = useLocation();
  const [staffData, setStaffData] = useState({});
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/staff/grouped")
      .then((res) => {
        setStaffData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  const handleDeptSelect = (dept) => {
    if (!staffData[dept] || staffData[dept].length === 0) {
      alert(`No staff data available for ${dept}`);
      return;
    }
    navigate(`/staff-list/${dept}`, {
      state: { staffData }
    });
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="selection-page">
      <div className="selection-container">
        <button className="back-button" onClick={handleBack}>
          ← Back
        </button>

        <div className="page-header">
          <h1>Select Department</h1>
          <p>Choose a department to view staff</p>
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

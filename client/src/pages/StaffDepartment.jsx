import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "../index.css";

export default function StaffDepartment() {
  const { dept } = useParams();
  const [staffList, setStaffList] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/staff/grouped")
      .then((res) => {
        setStaffList(res.data[dept] || []);
      })
      .catch((err) => console.log(err));
  }, [dept]);

  return (
    <div className="staff-dept-page" style={{ padding: "2rem", background: "#f7f8fa", minHeight: "100vh" }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <h1 style={{ fontWeight: 700, fontSize: "2rem", marginBottom: "1.5rem", color: "#1e293b" }}>
          Staff in {dept}
        </h1>
        {staffList.length === 0 ? (
          <div style={{ background: "#fff", borderRadius: 8, padding: "2rem", boxShadow: "0 2px 8px #e0e7ef", textAlign: "center" }}>
            <p style={{ color: "#64748b", fontSize: "1.1rem" }}>No staff found for this department.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gap: "1.5rem" }}>
            {staffList.map((staff) => (
              <div
                key={staff.staffId}
                style={{
                  background: "#fff",
                  borderRadius: 8,
                  padding: "1.5rem",
                  boxShadow: "0 2px 8px #e0e7ef",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}
              >
                <div style={{ fontWeight: 600, fontSize: "1.1rem", color: "#334155" }}>
                  <span style={{ color: "#7c3aed" }}>{staff.staffId}</span> — {staff.name}
                </div>
                <div style={{ color: "#6366f1", fontWeight: 500 }}>{staff.designation}</div>
                {staff.phone && (
                  <div style={{ color: "#0ea5e9", fontSize: "1rem" }}>📱 {staff.phone}</div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

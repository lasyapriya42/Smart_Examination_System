import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

export default function StudentsList() {
  const navigate = useNavigate();
  const { year, dept, section } = useParams();
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ name: "", email: "", semester: "" });

  const normalize = (value) => String(value || "").trim().toUpperCase();

  const filteredStudents = students.filter((student) => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return true;
    return (
      student.name.toLowerCase().includes(keyword) ||
      student.rollNo.toLowerCase().includes(keyword) ||
      student.email.toLowerCase().includes(keyword)
    );
  });

  const loadStudents = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/students");
      const filtered = res.data.filter(
        (student) =>
          String(student.year) === String(year) &&
          normalize(student.department) === normalize(dept) &&
          (normalize(section) === "ALL" || normalize(student.section) === normalize(section))
      );
      setStudents(filtered);
    } catch (error) {
      console.error(error);
      alert("Failed to fetch students");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, [year, dept, section]);

  const startEdit = (student) => {
    setEditingId(student._id);
    setEditData({
      name: student.name,
      email: student.email,
      semester: student.semester,
    });
  };

  const saveEdit = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/students/${id}`, {
        ...editData,
        semester: Number(editData.semester),
      });
      setEditingId(null);
      await loadStudents();
      alert("Student updated successfully");
    } catch (error) {
      console.error(error);
      alert("Failed to update student");
    }
  };

  const removeStudent = async (id) => {
    if (!window.confirm("Delete this student?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/students/${id}`);
      setStudents((prev) => prev.filter((student) => student._id !== id));
      alert("Student deleted successfully");
    } catch (error) {
      console.error(error);
      alert("Failed to delete student");
    }
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
          <h1>Students List</h1>
          <p>
            Year {year} — {dept} — {normalize(section) === "ALL" ? "All Sections" : `Section ${section}`}
          </p>
        </div>

        <div className="manage-toolbar">
          <input
            className="manage-search"
            type="text"
            placeholder="Search by name, roll no, or email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <span className="manage-count">Total: {filteredStudents.length}</span>
        </div>

        {loading ? (
          <p className="no-data">Loading students...</p>
        ) : filteredStudents.length > 0 ? (
          <div className="students-list-container">
            <ul className="students-list">
              {filteredStudents.map((student) => (
                <li key={student._id} className="student-item">
                  <div className="student-info">
                    <div className="student-roll">{student.rollNo}</div>
                    <div className="student-details">
                      {editingId === student._id ? (
                        <>
                          <input
                            className="manage-input"
                            value={editData.name}
                            onChange={(e) =>
                              setEditData((prev) => ({ ...prev, name: e.target.value }))
                            }
                          />
                          <input
                            className="manage-input"
                            value={editData.email}
                            onChange={(e) =>
                              setEditData((prev) => ({ ...prev, email: e.target.value }))
                            }
                          />
                          <input
                            className="manage-input"
                            type="number"
                            value={editData.semester}
                            onChange={(e) =>
                              setEditData((prev) => ({ ...prev, semester: e.target.value }))
                            }
                          />
                        </>
                      ) : (
                        <>
                          <h4>{student.name}</h4>
                          <p>{student.email}</p>
                          <p>Semester: {student.semester}</p>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="manage-actions">
                    {editingId === student._id ? (
                      <>
                        <button className="btn-primary" onClick={() => saveEdit(student._id)}>Save</button>
                        <button className="btn-muted" onClick={() => setEditingId(null)}>Cancel</button>
                      </>
                    ) : (
                      <>
                        <button className="btn-muted" onClick={() => startEdit(student)}>Edit</button>
                        <button className="btn-danger" onClick={() => removeStudent(student._id)}>Delete</button>
                      </>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="no-data">No students match your filter in this section</p>
        )}
      </div>
    </div>
  );
}

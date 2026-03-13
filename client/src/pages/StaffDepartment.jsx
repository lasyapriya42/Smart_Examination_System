import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "../index.css";

export default function StaffDepartment() {
  const navigate = useNavigate();
  const { dept } = useParams();
  const [staffList, setStaffList] = useState([]);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", email: "", designation: "", phone: "" });

  const filteredStaff = staffList.filter((staff) => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return true;
    return (
      staff.name.toLowerCase().includes(keyword) ||
      staff.staffId.toLowerCase().includes(keyword) ||
      staff.email.toLowerCase().includes(keyword)
    );
  });

  const loadStaff = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/staff");
      setStaffList(res.data.filter((staff) => staff.department === dept));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadStaff();
  }, [dept]);

  const startEdit = (staff) => {
    setEditingId(staff._id);
    setEditForm({
      name: staff.name,
      email: staff.email,
      designation: staff.designation,
      phone: staff.phone || "",
    });
  };

  const saveEdit = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/staff/${id}`, editForm);
      setEditingId(null);
      await loadStaff();
      alert("Staff updated successfully");
    } catch (err) {
      console.log(err);
      alert("Failed to update staff");
    }
  };

  const removeStaff = async (id) => {
    if (!window.confirm("Delete this staff member?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/staff/${id}`);
      setStaffList((prev) => prev.filter((staff) => staff._id !== id));
      alert("Staff deleted successfully");
    } catch (err) {
      console.log(err);
      alert("Failed to delete staff");
    }
  };

  return (
    <div className="selection-page">
      <div className="selection-container">
        <button className="back-button" onClick={() => navigate(-1)}>
          ← Back
        </button>

        <h1 className="manage-heading">
          Staff in {dept}
        </h1>

        <div className="manage-toolbar">
          <input
            className="manage-search"
            type="text"
            placeholder="Search by name, staff ID, or email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <span className="manage-count">Total: {filteredStaff.length}</span>
        </div>

        {filteredStaff.length === 0 ? (
          <div className="manage-empty">
            <p>No staff found for this department.</p>
          </div>
        ) : (
          <div className="manage-grid">
            {filteredStaff.map((staff) => (
              <div
                key={staff._id}
                className="manage-card"
              >
                <div className="manage-meta">
                  <span className="student-roll">{staff.staffId}</span>
                </div>

                {editingId === staff._id ? (
                  <>
                    <input
                      className="manage-input"
                      value={editForm.name}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, name: e.target.value }))}
                    />
                    <input
                      className="manage-input"
                      value={editForm.email}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, email: e.target.value }))}
                    />
                    <input
                      className="manage-input"
                      value={editForm.designation}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, designation: e.target.value }))}
                    />
                    <input
                      className="manage-input"
                      value={editForm.phone}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, phone: e.target.value }))}
                    />
                    <div className="manage-actions">
                      <button className="btn-primary" onClick={() => saveEdit(staff._id)}>Save</button>
                      <button className="btn-muted" onClick={() => setEditingId(null)}>Cancel</button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="student-details">
                      <h4>{staff.name}</h4>
                      <p>{staff.email}</p>
                      <p>{staff.designation}</p>
                      {staff.phone && <p>Phone: {staff.phone}</p>}
                    </div>
                    <div className="manage-actions">
                      <button className="btn-muted" onClick={() => startEdit(staff)}>Edit</button>
                      <button className="btn-danger" onClick={() => removeStaff(staff._id)}>Delete</button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

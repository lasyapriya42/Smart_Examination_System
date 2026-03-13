import { useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

export default function AdminDashboard() {
  const [feedback, setFeedback] = useState({ type: "", text: "" });

  // ========== STUDENT FORM ==========
  const [studentFormData, setStudentFormData] = useState({
    name: "",
    rollNo: "",
    email: "",
    year: "",
    semester: "",
    department: "",
    section: "",
  });

  // ========== STAFF FORM ==========
  const [staffFormData, setStaffFormData] = useState({
    name: "",
    staffId: "",
    email: "",
    department: "",
    designation: "",
    phone: "",
  });

  const handleStudentChange = (e) => {
    setStudentFormData({
      ...studentFormData,
      [e.target.name]: e.target.value,
    });
  };

  const handleStaffChange = (e) => {
    setStaffFormData({
      ...staffFormData,
      [e.target.name]: e.target.value,
    });
  };

  const handleStudentSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/students", studentFormData);
      showFeedback("success", "Student added successfully");
      setStudentFormData({
        name: "",
        rollNo: "",
        email: "",
        year: "",
        semester: "",
        department: "",
        section: "",
      });
      // Refresh student data
      try {
        const response = await axios.get("http://localhost:5000/api/students/grouped");
        console.log("Student data refreshed:", response.data);
        setStudentData(response.data);
        loadDashboardMetrics();
      } catch (error) {
        console.error("Error fetching student data:", error);
      }
    } catch (error) {
      console.error(error);
      showFeedback("error", "Error adding student");
    }
  };

  const handleStaffSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/staff", staffFormData);
      showFeedback("success", "Staff added successfully");
      setStaffFormData({
        name: "",
        staffId: "",
        email: "",
        department: "",
        designation: "",
        phone: "",
      });
      // Refresh staff data
      try {
        const response = await axios.get("http://localhost:5000/api/staff/grouped");
        console.log("Staff data refreshed:", response.data);
        setStaffData(response.data);
        loadDashboardMetrics();
      } catch (error) {
        console.error("Error fetching staff data:", error);
      }
    } catch (error) {
      console.error(error);
      showFeedback("error", "Error adding staff");
    }
  };

  const navigate = useNavigate();
  const location = useLocation();

  // ========== SECTION CONTROL ==========
  const [activeSection, setActiveSection] = useState(
  location.state?.openSection || "dashboard"
);
  const [studentSubSection, setStudentSubSection] = useState("add");
  const [staffSubSection, setStaffSubSection] = useState("add");
   const [blocksSubSection, setBlocksSubSection] = useState("blocks");

  // ========== STUDENT DATA ==========
  const [studentData, setStudentData] = useState({});
  const [studentViewSearch, setStudentViewSearch] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedDept, setSelectedDept] = useState("");
  const [selectedSection, setSelectedSection] = useState("");

  // ========== STAFF DATA ==========
  const [staffData, setStaffData] = useState({});
  const [selectedStaffDept, setSelectedStaffDept] = useState("");
 
   // ========== BLOCKS & ROOMS DATA ==========
  const [blocksData, setBlocksData] = useState([]);
  const [roomsData, setRoomsData] = useState([]);
  const [blockForm, setBlockForm] = useState({ name: "" });
  const [roomForm, setRoomForm] = useState({ number: "", block: "", capacity: "" });
  const [metrics, setMetrics] = useState({ students: 0, staff: 0, blocks: 0, rooms: 0 });

  const showFeedback = (type, text) => {
    setFeedback({ type, text });
    setTimeout(() => setFeedback({ type: "", text: "" }), 2500);
  };

  const handleBulkStudentUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/upload/students",
        formData
      );

      const skipped = res.data?.skipped || 0;
      const invalidCount = res.data?.invalidRows?.length || 0;
      alert(
        `${res.data.message} (${res.data.count} inserted, ${skipped} duplicates skipped, ${invalidCount} invalid rows)`
      );

      const groupedRes = await axios.get("http://localhost:5000/api/students/grouped");
      setStudentData(groupedRes.data || {});
      loadDashboardMetrics();
    } catch (err) {
      console.error(err);
      const message = err?.response?.data?.message || "Upload failed";
      const missingColumns = err?.response?.data?.missingColumns;

      if (Array.isArray(missingColumns) && missingColumns.length > 0) {
        alert(`${message}: ${missingColumns.join(", ")}`);
      } else {
        alert(message);
      }
    } finally {
      // Allow selecting the same file again if user retries.
      e.target.value = "";
    }
  };

  const handleDeleteAllStudents = async () => {
    const confirmed = window.confirm(
      "This will permanently delete all student records. Continue?"
    );
    if (!confirmed) return;

    try {
      const res = await axios.post("http://localhost:5000/api/students/delete-bulk", {});
      alert(`${res.data.message} (${res.data.deletedCount} deleted)`);
      setStudentData({});
      loadDashboardMetrics();
    } catch (error) {
      console.error(error);
      alert(error?.response?.data?.message || "Failed to delete students");
    }
  };

  const loadDashboardMetrics = async () => {
    try {
      const [studentsRes, staffRes, blocksRes, roomsRes] = await Promise.all([
        axios.get("http://localhost:5000/api/students"),
        axios.get("http://localhost:5000/api/staff"),
        axios.get("http://localhost:5000/api/blocks"),
        axios.get("http://localhost:5000/api/rooms"),
      ]);

      setMetrics({
        students: studentsRes.data?.length || 0,
        staff: staffRes.data?.length || 0,
        blocks: blocksRes.data?.length || 0,
        rooms: roomsRes.data?.length || 0,
      });
    } catch (error) {
      console.error("Error loading metrics", error);
    }
  };
  

  // ========== FETCH STUDENTS & STAFF ==========
  useEffect(() => {
    loadDashboardMetrics();
  }, []);

  useEffect(() => {
    if (activeSection === "students") {
      axios
        .get("http://localhost:5000/api/students/grouped")
        .then((res) => setStudentData(res.data))
        .catch((err) => console.log(err));
    }
  }, [activeSection]);

  useEffect(() => {
    if (activeSection === "staff") {
      axios
        .get("http://localhost:5000/api/staff/grouped")
        .then((res) => setStaffData(res.data))
        .catch((err) => console.log(err));
    }
  }, [activeSection]);
 
   useEffect(() => {
     if (activeSection === "blocks") {
       // Load blocks data
       axios
         .get("http://localhost:5000/api/blocks")
         .then((res) => {
           console.log("Blocks loaded:", res.data);
           setBlocksData(res.data || []);
           loadDashboardMetrics();
         })
         .catch((err) => console.error("Error loading blocks:", err));

       // Load rooms data
       axios
         .get("http://localhost:5000/api/rooms")
         .then((res) => {
           console.log("Rooms loaded:", res.data);
           setRoomsData(res.data || []);
         })
         .catch((err) => console.error("Error loading rooms:", err));
     }
   }, [activeSection]);

  const sortLabel = (a, b) =>
    String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: "base" });

  const branchSectionData = useMemo(() => {
    const grouped = {};

    Object.entries(studentData || {}).forEach(([yearKey, deptMap]) => {
      Object.entries(deptMap || {}).forEach(([deptKey, sectionMap]) => {
        const branch = String(deptKey || "NA");
        if (!grouped[branch]) grouped[branch] = {};

        Object.entries(sectionMap || {}).forEach(([sectionKey, students]) => {
          const section = String(sectionKey || "NA");
          if (!grouped[branch][section]) grouped[branch][section] = [];

          (students || []).forEach((student) => {
            grouped[branch][section].push({
              ...student,
              year: student.year ?? yearKey,
              department: student.department ?? branch,
              section: student.section ?? section,
            });
          });

          grouped[branch][section].sort((a, b) =>
            String(a.rollNo || "").localeCompare(String(b.rollNo || ""), undefined, {
              numeric: true,
              sensitivity: "base",
            })
          );
        });
      });
    });

    return grouped;
  }, [studentData]);

  const availableBranches = useMemo(
    () => Object.keys(branchSectionData).sort(sortLabel),
    [branchSectionData]
  );

  const availableSections = useMemo(
    () => Object.keys(branchSectionData[selectedDept] || {}).sort(sortLabel),
    [branchSectionData, selectedDept]
  );

  const selectedBranchSectionStudents = useMemo(() => {
    const selected = branchSectionData[selectedDept]?.[selectedSection] || [];
    const keyword = studentViewSearch.trim().toLowerCase();

    if (!keyword) return selected;

    return selected.filter((student) =>
      [student.name, student.rollNo, student.email]
        .map((v) => String(v || "").toLowerCase())
        .some((v) => v.includes(keyword))
    );
  }, [branchSectionData, selectedDept, selectedSection, studentViewSearch]);

  // Reset section when branch is cleared
  useEffect(() => {
    if (!selectedDept) {
      setSelectedSection("");
      setStudentViewSearch("");
    }
  }, [selectedDept]);

  
  return (
    <div className="dashboard-layout">
      {/* ================= SIDEBAR ================= */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div
            className="sidebar-logo"
            style={{ background: "#ede9fe", color: "#7c3aed" }}
          >
            🛡️
          </div>
          <div>
            <strong>Admin Portal</strong>
            <span>ExamSmart</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <p className="nav-label">Navigation</p>

          {/* Dashboard */}
          <button
            className={`nav-item ${activeSection === "dashboard" ? "active" : ""}`}
            onClick={() => setActiveSection("dashboard")}
          >
            <span>📊</span> Dashboard
          </button>

          {/* Student Module */}
          <button
            className={`nav-item ${activeSection === "students" ? "active" : ""}`}
            onClick={() => setActiveSection("students")}
          >
            <span>👥</span> Student Management
          </button>

          {/* Staff Module */}
          <button
            className={`nav-item ${activeSection === "staff" ? "active" : ""}`}
            onClick={() => setActiveSection("staff")}
          >
            <span>👨‍💼</span> Staff Management
          </button>
 
           {/* Blocks & Rooms Module (Admin only) */}
           <button
             className={`nav-item ${activeSection === "blocks" ? "active" : ""}`}
             onClick={() => setActiveSection("blocks")}
           >
             <span>🏫</span> Blocks & Rooms
           </button>
         
        </nav>

        <div className="sidebar-user">
          <div
            className="user-avatar"
            style={{ background: "#7c3aed" }}
          >
            AD
          </div>
          <div>
            <strong>Admin User</strong>
            <span>user@example.com</span>
          </div>
        </div>

        <button
          className="logout-button"
          onClick={() => navigate("/")}
        >
          🚪 Logout
        </button>
      </aside>

      {/* ================= MAIN ================= */}
      <main className="dashboard-main">
        <header className="dashboard-header">
          <button className="menu-toggle">☰</button>
        </header>

        <div className="dashboard-content">
          {feedback.text && (
            <div className={`admin-feedback ${feedback.type}`}>{feedback.text}</div>
          )}

          {/* ===================================================== */}
          {/* ================= DASHBOARD VIEW ==================== */}
          {/* ===================================================== */}
          {activeSection === "dashboard" && (
            <>
              <div className="page-header">
                <h1>Admin Dashboard</h1>
                <p>
                  Welcome back! Here's an overview of your
                  examination system.
                </p>
              </div>

              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-header">
                    <span>Total Students</span>
                  </div>
                  <div className="stat-value">{metrics.students}</div>
                </div>

                <div className="stat-card">
                  <div className="stat-header">
                    <span>Total Staff</span>
                  </div>
                  <div className="stat-value">{metrics.staff}</div>
                </div>

                <div className="stat-card">
                  <div className="stat-header">
                    <span>Total Blocks</span>
                  </div>
                  <div className="stat-value">{metrics.blocks}</div>
                </div>

                <div className="stat-card">
                  <div className="stat-header">
                    <span>Total Rooms</span>
                  </div>
                  <div className="stat-value">{metrics.rooms}</div>
                </div>
              </div>

              <div className="admin-quick-actions">
                <button onClick={() => setActiveSection("students")}>Go To Students</button>
                <button onClick={() => setActiveSection("staff")}>Go To Staff</button>
                <button onClick={() => setActiveSection("blocks")}>Go To Blocks & Rooms</button>
              </div>
            </>
          )}

          {/* ===================================================== */}
          {/* ================= STUDENT MODULE ==================== */}
          {/* ===================================================== */}
          {activeSection === "students" && (
  <div>

    <div className="page-header">
      <h1>Student Management</h1>
      <p>Manage student records efficiently</p>
    </div>

    {/* ===== SUB MODULE NAVIGATION ===== */}
    <div className="student-subnav">
      <button
        className={studentSubSection === "add" ? "active-subtab" : ""}
        onClick={() => setStudentSubSection("add")}
      >
        ➕ Add Student
      </button>

      <button
        className={studentSubSection === "view" ? "active-subtab" : ""}
        onClick={() => setStudentSubSection("view")}
      >
        📋 View Students
      </button>
    </div>

    {/* ===== ADD STUDENT SUBMODULE ===== */}
    {studentSubSection === "add" && (
      <div className="student-form-card">
        <h3>Add New Student</h3>

        <form onSubmit={handleStudentSubmit} className="student-form-grid">

          <div className="form-group">
            <label>Name</label>
            <input type="text" name="name" value={studentFormData.name} onChange={handleStudentChange} required />
          </div>

          <div className="form-group">
            <label>Roll No</label>
            <input type="text" name="rollNo" value={studentFormData.rollNo} onChange={handleStudentChange} required />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" value={studentFormData.email} onChange={handleStudentChange} required />
          </div>

          <div className="form-group">
            <label>Year</label>
            <select name="year" value={studentFormData.year} onChange={handleStudentChange} required>
              <option value="">Select Year</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
            </select>
          </div>

          <div className="form-group">
            <label>Semester</label>
            <select name="semester" value={studentFormData.semester} onChange={handleStudentChange} required>
              <option value="">Select Semester</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
            </select>
          </div>

          <div className="form-group">
            <label>Department</label>
            <select name="department" value={studentFormData.department} onChange={handleStudentChange} required>
              <option value="">Select Department</option>
              <option value="CSE">Computer Science and Engineering (CSE)</option>
              <option value="IT">Information Technology (IT)</option>
              <option value="AIML">Artificial Intelligence and Machine Learning (AIML)</option>
              <option value="AIDS">Artificial Intelligence and Data Science (AIDS)</option>
              <option value="ECE">Electronics and Communication Engineering (ECE)</option>
              <option value="EEE">Electrical and Electronics Engineering (EEE)</option>
              <option value="ME">Mechanical Engineering (ME)</option>
              <option value="CE">Civil Engineering (CE)</option>
            </select>
          </div>

          <div className="form-group">
            <label>Section</label>
            <select
              name="section"
              value={studentFormData.section}
              onChange={handleStudentChange}
              required
            >
              <option value="">Select Section</option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
            </select>
          </div>

          <button type="submit" className="add-student-btn">
            + Add Student
          </button>

        </form>
        <div style={{ marginTop: "20px" }}>
  <h4>📂 Bulk Upload Students (CSV / Excel)</h4>

  <input
    type="file"
    accept=".csv,.xlsx,.xls,.pdf,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/pdf"
    onChange={handleBulkStudentUpload}
  />
  <div style={{ marginTop: "12px" }}>
    <button
      type="button"
      className="btn-danger"
      onClick={handleDeleteAllStudents}
    >
      Delete All Students
    </button>
  </div>
</div>
      </div>
    )}

    {/* ===== VIEW STUDENTS SUBMODULE ===== */}
    {studentSubSection === "view" && (
  <div className="view-students-card">
    <div className="card-header">
      <span className="card-title-icon">📚</span>
      <h2>Student Directory</h2>
    </div>
    <p className="card-description">
      Select a branch and section identified from MongoDB records.
    </p>

    {/* State 1: No branch selected — show branch cards */}
    {!selectedDept && (
      <>
        <h4 style={{ marginTop: "14px", marginBottom: "8px" }}>Branches</h4>
        <div className="selection-grid" style={{ marginBottom: "14px" }}>
          {availableBranches.length > 0 ? (
            availableBranches.map((branch) => (
              <button
                key={branch}
                type="button"
                className="selection-card"
                onClick={() => {
                  setSelectedDept(branch);
                  setSelectedSection("");
                  setStudentViewSearch("");
                }}
              >
                <span className="card-icon">🏢</span>
                <span className="card-text">{branch}</span>
              </button>
            ))
          ) : (
            <p className="no-data">No branches found in database.</p>
          )}
        </div>
      </>
    )}

    {/* State 2: Branch selected, no section — show section cards */}
    {selectedDept && !selectedSection && (
      <>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "14px" }}>
          <h4 style={{ margin: 0 }}>Sections — {selectedDept}</h4>
          <button
            type="button"
            className="btn-muted"
            onClick={() => {
              setSelectedDept("");
              setSelectedSection("");
              setStudentViewSearch("");
            }}
          >
            ← Change Branch
          </button>
        </div>
        <div className="selection-grid" style={{ marginBottom: "14px", marginTop: "8px" }}>
          {availableSections.length > 0 ? (
            availableSections.map((section) => (
              <button
                key={section}
                type="button"
                className="selection-card"
                onClick={() => {
                  setSelectedSection(section);
                  setStudentViewSearch("");
                }}
              >
                <span className="card-icon">👥</span>
                <span className="card-text">Section {section}</span>
                <span className="card-sub">{(branchSectionData[selectedDept]?.[section] || []).length} students</span>
              </button>
            ))
          ) : (
            <p className="no-data">No sections found for this branch.</p>
          )}
        </div>
      </>
    )}

    {/* State 3: Branch + Section selected — show student details */}
    {selectedDept && selectedSection && (
      <>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "14px", marginBottom: "12px" }}>
          <div>
            <h4 style={{ margin: 0 }}>{selectedDept} — Section {selectedSection}</h4>
            <span style={{ fontSize: "13px", color: "#666" }}>
              {selectedBranchSectionStudents.length} student{selectedBranchSectionStudents.length !== 1 ? "s" : ""}
            </span>
          </div>
          <button
            type="button"
            className="btn-muted"
            onClick={() => {
              setSelectedSection("");
              setStudentViewSearch("");
            }}
          >
            ← Back to Sections
          </button>
        </div>

        <div className="manage-toolbar" style={{ marginBottom: "12px" }}>
          <input
            className="manage-search"
            type="text"
            placeholder="Search by name, roll no, or email"
            value={studentViewSearch}
            onChange={(e) => setStudentViewSearch(e.target.value)}
          />
          <span className="manage-count">Total: {selectedBranchSectionStudents.length}</span>
        </div>

        {selectedBranchSectionStudents.length > 0 ? (
          <div className="students-list-container">
            <ul className="students-list">
              {selectedBranchSectionStudents.map((student, idx) => (
                <li key={student._id || `${student.rollNo}-${student.email}`} className="student-item">
                  <div className="student-serial">{idx + 1}</div>
                  <div className="student-info">
                    <div className="student-roll">{student.rollNo}</div>
                    <div className="student-details">
                      <h4>{student.name}</h4>
                      <p className="student-email">{student.email}</p>
                      <p className="student-meta">
                        Dept: {student.department} &nbsp;|&nbsp; Section: {student.section} &nbsp;|&nbsp; Sem {student.semester}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="no-data">No students found{studentViewSearch ? " for your search" : ""}.</p>
        )}
      </>
    )}
  </div>
)}

  </div>
)}

          {/* ===================================================== */}
          {/* ================= STAFF MODULE ==================== */}
          {/* ===================================================== */}
           {activeSection === "blocks" && (
     <div>
       <div className="page-header">
         <h1>Blocks & Rooms</h1>
         <p>Manage campus blocks and rooms (admin only)</p>
       </div>
 
       {activeSection === "blocks" && (
         <div className="student-form-card">
           <h3>View & Manage Blocks</h3>
           
           {/* ========== ADD NEW BLOCK FORM ========== */}
           <div className="block-form-wrap">
             <h4 className="block-form-title">➕ Add New Block</h4>
             <form onSubmit={async (e) => {
               e.preventDefault();
               if (!blockForm.name.trim()) {
                 showFeedback("error", "Block name cannot be empty");
                 return;
               }
               try {
                 await axios.post("http://localhost:5000/api/blocks", blockForm);
                 showFeedback("success", "Block added successfully");
                 setBlockForm({ name: "" });
                 const res = await axios.get("http://localhost:5000/api/blocks");
                 setBlocksData(res.data || []);
                 loadDashboardMetrics();
               } catch (err) {
                 console.error(err);
                 showFeedback("error", "Error adding block");
               }
             }} className="block-form-inline">
               <input
                 type="text"
                 value={blockForm.name}
                 name="name"
                 onChange={(e) => setBlockForm({ ...blockForm, [e.target.name]: e.target.value })}
                 placeholder="e.g., A, B, C, D"
                 required
                 className="block-name-input"
               />
               <button type="submit" className="block-add-btn">
                 + Add Block
               </button>
             </form>
           </div>

           {/* ========== BLOCKS LIST ========== */}
           {blocksData && blocksData.length > 0 ? (
             <div className="blocks-list-wrap">
               {blocksData.map((block) => {
                 const blockRooms = roomsData.filter(room => 
                   (room.block && typeof room.block === 'object' && room.block._id === block._id) ||
                   (room.block && typeof room.block === 'string' && room.block === block._id)
                 );
                 
                 return (
                   <div key={block._id} className="block-row">
                     {/* Block Header - Clickable to Navigate */}
                     <button
                       onClick={() => navigate("/admin/block-rooms", { state: { block } })}
                       className="block-open-btn"
                     >
                       <span>📦 Block {block.name}</span>
                       <span className="block-room-count">{blockRooms.length} rooms</span>
                     </button>

                     {/* Delete Button */}
                     <button
                       onClick={async () => {
                         if (window.confirm(`Delete Block ${block.name}? This will also delete all rooms in this block.`)) {
                           try {
                             await axios.delete(`http://localhost:5000/api/blocks/${block._id}`);
                             showFeedback("success", "Block deleted successfully");
                             const res = await axios.get("http://localhost:5000/api/blocks");
                             setBlocksData(res.data || []);
                             const roomsRes = await axios.get("http://localhost:5000/api/rooms");
                             setRoomsData(roomsRes.data || []);
                             loadDashboardMetrics();
                           } catch (err) {
                             console.error(err);
                             showFeedback("error", "Error deleting block");
                           }
                         }
                       }}
                       className="block-delete-btn"
                     >
                       🗑️ Delete
                     </button>
                   </div>
                 );
               })}
             </div>
           ) : (
             <p className="block-empty-msg">
               ⚠️ No blocks exist yet. Add a block using the form above.
             </p>
           )}
         </div>
       )}
 
     </div>
   )}

          {activeSection === "staff" && (
  <div>

    <div className="page-header">
      <h1>Staff Management</h1>
      <p>Manage staff records efficiently</p>
    </div>

    {/* ===== SUB MODULE NAVIGATION ===== */}
    <div className="student-subnav">
      <button
        className={staffSubSection === "add" ? "active-subtab" : ""}
        onClick={() => setStaffSubSection("add")}
      >
        ➕ Add Staff
      </button>

      <button
        className={staffSubSection === "view" ? "active-subtab" : ""}
        onClick={() => setStaffSubSection("view")}
      >
        📋 View Staff
      </button>
    </div>

    {/* ===== ADD STAFF SUBMODULE ===== */}
    {staffSubSection === "add" && (
      <div className="student-form-card">
        <h3>Add New Staff</h3>

        <form onSubmit={handleStaffSubmit} className="student-form-grid">

          <div className="form-group">
            <label>Name</label>
            <input type="text" name="name" value={staffFormData.name} onChange={handleStaffChange} required />
          </div>

          <div className="form-group">
            <label>Staff ID</label>
            <input type="text" name="staffId" value={staffFormData.staffId} onChange={handleStaffChange} required />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" value={staffFormData.email} onChange={handleStaffChange} required />
          </div>

          <div className="form-group">
            <label>Department</label>
            <select name="department" value={staffFormData.department} onChange={handleStaffChange} required>
              <option value="">Select Department</option>
              <option value="CSE">Computer Science and Engineering (CSE)</option>
              <option value="IT">Information Technology (IT)</option>
              <option value="AIML">Artificial Intelligence and Machine Learning (AIML)</option>
              <option value="AIDS">Artificial Intelligence and Data Science (AIDS)</option>
              <option value="ECE">Electronics and Communication Engineering (ECE)</option>
              <option value="EEE">Electrical and Electronics Engineering (EEE)</option>
              <option value="ME">Mechanical Engineering (ME)</option>
              <option value="CE">Civil Engineering (CE)</option>
            </select>
          </div>

          <div className="form-group">
            <label>Designation</label>
            <input type="text" name="designation" value={staffFormData.designation} onChange={handleStaffChange} required />
          </div>

          <div className="form-group">
            <label>Phone</label>
            <input type="text" name="phone" value={staffFormData.phone} onChange={handleStaffChange} />
          </div>

          <button type="submit" className="add-student-btn">
            + Add Staff
          </button>

        </form>
      </div>
    )}

    {/* ===== VIEW STAFF SUBMODULE ===== */}
    {staffSubSection === "view" && (
      <div className="staff-view-container">
        <div className="page-header">
          <h2>View Staff by Department</h2>
          <p>Select a department to view staff members</p>
        </div>

        {/* DEPARTMENT CARDS */}
        <div className="department-cards-grid">
          {(
            [
              { code: "CSE", name: "Computer Science and Engineering (CSE)" },
              { code: "IT", name: "Information Technology (IT)" },
              { code: "AIML", name: "Artificial Intelligence and Machine Learning (AIML)" },
              { code: "AIDS", name: "Artificial Intelligence and Data Science (AIDS)" },
              { code: "ECE", name: "Electronics and Communication Engineering (ECE)" },
              { code: "EEE", name: "Electrical and Electronics Engineering (EEE)" },
              { code: "ME", name: "Mechanical Engineering (ME)" },
              { code: "CE", name: "Civil Engineering (CE)" },
            ]
          ).map((dept) => (
            <button
              key={dept.code}
              className="dept-card-btn"
              onClick={() => navigate(`/staff-department/${dept.code}`)}
            >
              <span className="dept-icon">🏢</span>
              <span className="dept-name">{dept.name}</span>
            </button>
          ))}
        </div>
      </div>
    )}

  </div>
)}

        </div>
      </main>
    </div>
  );
}
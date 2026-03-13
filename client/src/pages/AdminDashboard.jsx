import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

export default function AdminDashboard() {
  // ========== STUDENT FORM ==========
  const [studentFormData, setStudentFormData] = useState({
    name: "",
    rollNo: "",
    email: "",
    year: "",
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
      await axios.post("http://localhost:5000/api/student", studentFormData);
      alert("Student added successfully!");
      setStudentFormData({
        name: "",
        rollNo: "",
        email: "",
        year: "",
        department: "",
        section: "",
      });
      // Refresh student data
      try {
        const response = await axios.get("http://localhost:5000/api/student/grouped");
        console.log("Student data refreshed:", response.data);
        setStudentData(response.data);
      } catch (error) {
        console.error("Error fetching student data:", error);
      }
    } catch (error) {
      console.error(error);
      alert("Error adding student");
    }
  };

  const handleStaffSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/staff", staffFormData);
      alert("Staff added successfully!");
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
      } catch (error) {
        console.error("Error fetching staff data:", error);
      }
    } catch (error) {
      console.error(error);
      alert("Error adding staff");
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
  

  // ========== FETCH STUDENTS & STAFF ==========
  useEffect(() => {
    if (activeSection === "students") {
      axios
        .get("http://localhost:5000/api/student/grouped")
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
            className="nav-item"
            onClick={() => setActiveSection("dashboard")}
          >
            <span>📊</span> Dashboard
          </button>

          {/* Student Module */}
          <button
            className="nav-item"
            onClick={() => setActiveSection("students")}
          >
            <span>👥</span> Student Management
          </button>

          {/* Staff Module */}
          <button
            className="nav-item"
            onClick={() => setActiveSection("staff")}
          >
            <span>👨‍💼</span> Staff Management
          </button>
 
           {/* Blocks & Rooms Module (Admin only) */}
           <button
             className="nav-item"
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
                    <span>Total Users</span>
                  </div>
                  <div className="stat-value">1,234</div>
                </div>

                <div className="stat-card">
                  <div className="stat-header">
                    <span>Active Students</span>
                  </div>
                  <div className="stat-value">856</div>
                </div>

                <div className="stat-card">
                  <div className="stat-header">
                    <span>Departments</span>
                  </div>
                  <div className="stat-value">12</div>
                </div>

                <div className="stat-card">
                  <div className="stat-header">
                    <span>Exams Scheduled</span>
                  </div>
                  <div className="stat-value">24</div>
                </div>
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
  <h4>📂 Bulk Upload Students (CSV)</h4>

  <input
    type="file"
    accept=".csv"
    onChange={async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await axios.post(
          "http://localhost:5000/api/upload/students",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        alert(res.data.message + " (" + res.data.count + " students)");
      } catch (err) {
        console.error(err);
        alert("Upload failed");
      }
    }}
  />
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
      Access comprehensive student records organized by academic year, department, and section. Browse and manage student information efficiently.
    </p>
    <button
      className="primary-action-btn"
      onClick={() => navigate("/select-year")}
    >
      <span>🔍</span> Search Students
    </button>
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
           <div style={{ marginBottom: '24px', padding: '16px', backgroundColor: '#f0f9ff', borderRadius: '8px', border: '2px solid #0ea5e9' }}>
             <h4 style={{ marginTop: 0, color: '#0284c7' }}>➕ Add New Block</h4>
             <form onSubmit={async (e) => {
               e.preventDefault();
               if (!blockForm.name.trim()) {
                 alert("Block name cannot be empty");
                 return;
               }
               try {
                 await axios.post("http://localhost:5000/api/blocks", blockForm);
                 alert("Block added successfully!");
                 setBlockForm({ name: "" });
                 const res = await axios.get("http://localhost:5000/api/blocks");
                 setBlocksData(res.data || []);
               } catch (err) {
                 console.error(err);
                 alert("Error adding block");
               }
             }} style={{ display: 'flex', gap: '10px' }}>
               <input
                 type="text"
                 value={blockForm.name}
                 name="name"
                 onChange={(e) => setBlockForm({ ...blockForm, [e.target.name]: e.target.value })}
                 placeholder="e.g., A, B, C, D"
                 required
                 style={{ flex: 1, padding: '10px', border: '1px solid #0ea5e9', borderRadius: '4px' }}
               />
               <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#0284c7', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                 + Add Block
               </button>
             </form>
           </div>

           {/* ========== BLOCKS LIST ========== */}
           {blocksData && blocksData.length > 0 ? (
             <div style={{ marginTop: '20px' }}>
               {blocksData.map((block) => {
                 const blockRooms = roomsData.filter(room => 
                   (room.block && typeof room.block === 'object' && room.block._id === block._id) ||
                   (room.block && typeof room.block === 'string' && room.block === block._id)
                 );
                 
                 return (
                   <div key={block._id} style={{ marginBottom: '12px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                     {/* Block Header - Clickable to Navigate */}
                     <button
                       onClick={() => navigate("/admin/block-rooms", { state: { block } })}
                       style={{
                         flex: 1,
                         padding: '16px',
                         border: '2px solid #7c3aed',
                         borderRadius: '8px',
                         backgroundColor: '#f8f6ff',
                         color: '#7c3aed',
                         fontSize: '16px',
                         fontWeight: 'bold',
                         cursor: 'pointer',
                         display: 'flex',
                         justifyContent: 'space-between',
                         alignItems: 'center',
                         transition: 'all 0.3s ease'
                       }}
                       onMouseEnter={(e) => {
                         e.target.style.backgroundColor = '#7c3aed';
                         e.target.style.color = 'white';
                       }}
                       onMouseLeave={(e) => {
                         e.target.style.backgroundColor = '#f8f6ff';
                         e.target.style.color = '#7c3aed';
                       }}
                     >
                       <span>📦 Block {block.name}</span>
                       <span style={{ fontSize: '14px' }}>{blockRooms.length} rooms</span>
                     </button>

                     {/* Delete Button */}
                     <button
                       onClick={async () => {
                         if (window.confirm(`Delete Block ${block.name}? This will also delete all rooms in this block.`)) {
                           try {
                             await axios.delete(`http://localhost:5000/api/blocks/${block._id}`);
                             alert("Block deleted successfully!");
                             const res = await axios.get("http://localhost:5000/api/blocks");
                             setBlocksData(res.data || []);
                             const roomsRes = await axios.get("http://localhost:5000/api/rooms");
                             setRoomsData(roomsRes.data || []);
                           } catch (err) {
                             console.error(err);
                             alert("Error deleting block");
                           }
                         }
                       }}
                       style={{
                         padding: '12px 16px',
                         backgroundColor: '#ef4444',
                         color: 'white',
                         border: 'none',
                         borderRadius: '8px',
                         cursor: 'pointer',
                         fontWeight: 'bold',
                         whiteSpace: 'nowrap'
                       }}
                       onMouseEnter={(e) => {
                         e.target.style.backgroundColor = '#dc2626';
                       }}
                       onMouseLeave={(e) => {
                         e.target.style.backgroundColor = '#ef4444';
                       }}
                     >
                       🗑️ Delete
                     </button>
                   </div>
                 );
               })}
             </div>
           ) : (
             <p style={{ color: '#d97706', padding: '16px', backgroundColor: '#fef3c7', borderRadius: '4px' }}>
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
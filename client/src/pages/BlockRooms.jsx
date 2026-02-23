import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

export default function BlockRooms() {
  const navigate = useNavigate();
  const location = useLocation();
  const { block } = location.state || {};

  const [roomsData, setRoomsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roomForm, setRoomForm] = useState({ number: "", capacity: "" });
  const [editingRoomId, setEditingRoomId] = useState(null);
  const [editCapacity, setEditCapacity] = useState("");

  useEffect(() => {
    if (!block) {
      navigate("/admin/dashboard");
      return;
    }

    // Fetch all rooms and filter by block
    axios
      .get("http://localhost:5000/api/rooms")
      .then((res) => {
        const filteredRooms = res.data.filter(room => 
          (room.block && typeof room.block === 'object' && room.block._id === block._id) ||
          (room.block && typeof room.block === 'string' && room.block === block._id)
        );
        setRoomsData(filteredRooms);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching rooms:", err);
        setLoading(false);
      });
  }, [block, navigate]);

  const handleAddRoom = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/rooms", {
        ...roomForm,
        block: block._id,
        capacity: parseInt(roomForm.capacity) || 30
      });
      alert("Room added successfully!");
      setRoomForm({ number: "", capacity: "" });
      
      // Refresh rooms
      const res = await axios.get("http://localhost:5000/api/rooms");
      const filteredRooms = res.data.filter(room => 
        (room.block && typeof room.block === 'object' && room.block._id === block._id) ||
        (room.block && typeof room.block === 'string' && room.block === block._id)
      );
      setRoomsData(filteredRooms);
    } catch (err) {
      console.error("Error adding room:", err);
      alert("Error adding room");
    }
  };

  const handleDeleteRoom = async (roomId) => {
    if (window.confirm("Are you sure you want to delete this room?")) {
      try {
        await axios.delete(`http://localhost:5000/api/rooms/${roomId}`);
        alert("Room deleted successfully!");
        setRoomsData(roomsData.filter(room => room._id !== roomId));
      } catch (err) {
        console.error("Error deleting room:", err);
        alert("Error deleting room");
      }
    }
  };

  const handleEditCapacity = async (roomId, newCapacity) => {
  if (!newCapacity || isNaN(newCapacity)) {
    alert("Please enter valid capacity");
    return;
  }

  try {
    await axios.put(
      `http://localhost:5000/api/rooms/${roomId}`,
      {
        capacity: Number(newCapacity),
      }
    );

    alert("Room capacity updated successfully!");

    const res = await axios.get(
      "http://localhost:5000/api/rooms"
    );

    const filteredRooms = res.data.filter(
      (room) =>
        (room.block &&
          typeof room.block === "object" &&
          room.block._id === block._id) ||
        (room.block &&
          typeof room.block === "string" &&
          room.block === block._id)
    );

    setRoomsData(filteredRooms);
    setEditingRoomId(null);
    setEditCapacity("");

  } catch (err) {
    console.error(err.response?.data || err);
    alert("Error updating room capacity");
  }
};
  if (!block) return null;

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
          <button
            className="nav-item"
            onClick={() =>
  navigate("/admin/dashboard", {
    state: { openSection: "blocks" },
  })
}
            style={{ cursor: "pointer" }}
          >
            <span>⬅️</span> Back to Blocks
          </button>
        </nav>
      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <main className="main-content">
        <div className="page-header">
          <h1>📦 Block {block.name}</h1>
          <p>Manage rooms and their capacity</p>
        </div>

        {/* ================= ADD ROOM FORM ================= */}
        <div style={{
          backgroundColor: '#f0f9ff',
          border: '2px solid #0ea5e9',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '32px'
        }}>
          <h3 style={{ marginTop: 0, color: '#0284c7' }}>➕ Add New Room</h3>
          
          <form onSubmit={handleAddRoom} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 200px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', color: '#333' }}>Room Number</label>
              <input
                value={roomForm.number}
                name="number"
                onChange={(e) => setRoomForm({ ...roomForm, number: e.target.value })}
                placeholder="e.g., 101, 102"
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #0ea5e9',
                  borderRadius: '8px',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ flex: '1 1 150px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', color: '#333' }}>Capacity</label>
              <input
                type="number"
                value={roomForm.capacity}
                name="capacity"
                onChange={(e) => setRoomForm({ ...roomForm, capacity: e.target.value })}
                placeholder="e.g., 30"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #0ea5e9',
                  borderRadius: '8px',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <button type="submit" style={{
                padding: '12px 24px',
                backgroundColor: '#0284c7',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '14px'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#0369a1'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#0284c7'}
              >
                + Add Room
              </button>
            </div>
          </form>
        </div>

        {/* ================= ROOMS LIST ================= */}
        <div>
          <h3 style={{ marginBottom: '20px' }}>🚪 Rooms in Block {block.name}</h3>
          
          {loading ? (
            <p style={{ textAlign: 'center', color: '#666' }}>Loading rooms...</p>
          ) : roomsData && roomsData.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
              {roomsData.map((room) => (
                <div key={room._id} style={{
                  backgroundColor: 'white',
                  border: '2px solid #e5e7eb',
                  borderRadius: '12px',
                  padding: '20px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(124, 58, 237, 0.15)';
                  e.currentTarget.style.borderColor = '#7c3aed';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
                  e.currentTarget.style.borderColor = '#e5e7eb';
                }}
                >
                  {/* Room Number */}
                  <h4 style={{ margin: '0 0 16px 0', color: '#7c3aed', fontSize: '18px' }}>
                    🏛️ Room {room.number}
                  </h4>

                  {/* Capacity Section */}
                  <div style={{ marginBottom: '16px', padding: '12px', backgroundColor: '#f3f4f6', borderRadius: '8px' }}>
                    {editingRoomId === room._id ? (
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <input
                          type="number"
                          value={editCapacity}
                          onChange={(e) => setEditCapacity(e.target.value)}
                          style={{
                            flex: 1,
                            padding: '8px',
                            border: '2px solid #7c3aed',
                            borderRadius: '6px',
                            fontSize: '14px'
                          }}
                          autoFocus
                        />
                        <button
                          onClick={() => handleEditCapacity(room._id, editCapacity)}
                          style={{
                            padding: '8px 12px',
                            backgroundColor: '#10b981',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            fontSize: '13px'
                          }}
                        >
                          ✓
                        </button>
                        <button
                          onClick={() => setEditingRoomId(null)}
                          style={{
                            padding: '8px 12px',
                            backgroundColor: '#ef4444',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            fontSize: '13px'
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#666' }}>Capacity</p>
                          <p style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', color: '#7c3aed' }}>
                            👥 {room.capacity} students
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            setEditingRoomId(room._id);
                            setEditCapacity(room.capacity);
                          }}
                          style={{
                            padding: '6px 12px',
                            backgroundColor: '#3b82f6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '12px',
                            fontWeight: 'bold'
                          }}
                          onMouseEnter={(e) => e.target.style.backgroundColor = '#2563eb'}
                          onMouseLeave={(e) => e.target.style.backgroundColor = '#3b82f6'}
                        >
                          ✏️ Edit
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDeleteRoom(room._id)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      backgroundColor: '#ef4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      fontSize: '14px',
                      transition: 'background-color 0.3s'
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#dc2626'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#ef4444'}
                  >
                    🗑️ Delete Room
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div style={{
              backgroundColor: '#fef3c7',
              border: '2px solid #fcd34d',
              borderRadius: '12px',
              padding: '24px',
              textAlign: 'center'
            }}>
              <p style={{ margin: 0, color: '#92400e', fontSize: '16px' }}>
                📭 No rooms added in this block yet. Add one using the form above.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

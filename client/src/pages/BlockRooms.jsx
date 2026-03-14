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
  const [feedback, setFeedback] = useState({ type: "", text: "" });
  const [modalState, setModalState] = useState({
    open: false,
    type: "info",
    title: "",
    message: "",
    confirmText: "OK",
    cancelText: "Cancel",
    onConfirm: null,
  });

  const showFeedback = (type, text) => {
    setFeedback({ type, text });
    setTimeout(() => setFeedback({ type: "", text: "" }), 2500);
  };

  const openInfoModal = (message, title = "Notice") => {
    setModalState({
      open: true,
      type: "info",
      title,
      message,
      confirmText: "OK",
      cancelText: "",
      onConfirm: null,
    });
  };

  const openConfirmModal = ({ title, message, onConfirm, confirmText = "Confirm" }) => {
    setModalState({
      open: true,
      type: "confirm",
      title,
      message,
      confirmText,
      cancelText: "Cancel",
      onConfirm,
    });
  };

  const closeModal = () => {
    setModalState((prev) => ({ ...prev, open: false, onConfirm: null }));
  };

  const handleModalConfirm = async () => {
    const action = modalState.onConfirm;
    closeModal();
    if (typeof action === "function") {
      await action();
    }
  };

  const fetchRoomsByBlock = async () => {
    const res = await axios.get("http://localhost:5000/api/rooms");
    const filteredRooms = (res.data || []).filter(
      (room) =>
        (room.block && typeof room.block === "object" && room.block._id === block._id) ||
        (room.block && typeof room.block === "string" && room.block === block._id)
    );
    setRoomsData(filteredRooms);
  };

  useEffect(() => {
    if (!block) {
      navigate("/admin/dashboard");
      return;
    }

    fetchRoomsByBlock()
      .catch((err) => console.error("Error fetching rooms:", err))
      .finally(() => setLoading(false));
  }, [block, navigate]);

  const handleAddRoom = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/rooms", {
        ...roomForm,
        block: block._id,
        capacity: parseInt(roomForm.capacity) || 30,
      });
      showFeedback("success", "Room added successfully");
      setRoomForm({ number: "", capacity: "" });
      await fetchRoomsByBlock();
    } catch (err) {
      console.error("Error adding room:", err);
      openInfoModal("Unable to add room right now. Please try again.", "Request Failed");
    }
  };

  const handleDeleteRoom = async (roomId) => {
    openConfirmModal({
      title: "Delete Room",
      message: "Are you sure you want to delete this room?",
      confirmText: "Delete",
      onConfirm: async () => {
        try {
          await axios.delete(`http://localhost:5000/api/rooms/${roomId}`);
          showFeedback("success", "Room deleted successfully");
          setRoomsData((prev) => prev.filter((room) => room._id !== roomId));
        } catch (err) {
          console.error("Error deleting room:", err);
          openInfoModal("Unable to delete room right now.", "Request Failed");
        }
      },
    });
  };

  const handleEditCapacity = async (roomId, newCapacity) => {
    if (!newCapacity || isNaN(newCapacity)) {
      openInfoModal("Please enter a valid numeric capacity.", "Invalid Input");
      return;
    }

    try {
      await axios.put(`http://localhost:5000/api/rooms/${roomId}`, {
        capacity: Number(newCapacity),
      });

      showFeedback("success", "Room capacity updated successfully");
      await fetchRoomsByBlock();
      setEditingRoomId(null);
      setEditCapacity("");
    } catch (err) {
      console.error(err.response?.data || err);
      openInfoModal("Unable to update room capacity right now.", "Request Failed");
    }
  };

  if (!block) return null;

  return (
    <div className="dashboard-layout">
      {/* ================= SIDEBAR ================= */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo">
            🛡️
          </div>
          <div>
            <strong>Admin Portal</strong>
            <span>ExamSmart</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <p className="nav-label">Navigation</p>

          <button
            className="nav-item"
            onClick={() => navigate("/admin/dashboard", { state: { openSection: "dashboard" } })}
          >
            <span>📊</span> Dashboard
          </button>

          <button
            className="nav-item"
            onClick={() => navigate("/admin/dashboard", { state: { openSection: "students" } })}
          >
            <span>👥</span> Student Management
          </button>

          <button
            className="nav-item"
            onClick={() => navigate("/admin/dashboard", { state: { openSection: "staff" } })}
          >
            <span>👨‍💼</span> Staff Management
          </button>

          <button
            className="nav-item active"
            onClick={() =>
              navigate("/admin/dashboard", {
                state: { openSection: "blocks" },
              })
            }
          >
            <span>🏫</span> Blocks & Rooms
          </button>
        </nav>

        <div className="sidebar-user">
          <div className="user-avatar">AD</div>
          <div>
            <strong>Admin User</strong>
            <span>user@example.com</span>
          </div>
        </div>

        <button className="logout-button" onClick={() => navigate("/")}>
          🚪 Logout
        </button>
      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <main className="dashboard-main">
        <header className="dashboard-header">
          <button className="menu-toggle">☰</button>
        </header>

        <div className="dashboard-content">
        {feedback.text && <div className={`admin-feedback ${feedback.type}`}>{feedback.text}</div>}

        <div className="page-header">
          <h1>Block {block.name}</h1>
          <p>Manage rooms and their capacity</p>
        </div>

        <div className="student-form-card room-form-card">
          <h3>Add New Room</h3>

          <form onSubmit={handleAddRoom} className="room-form-inline">
            <div className="form-group room-form-field">
              <label>Room Number</label>
              <input
                value={roomForm.number}
                name="number"
                onChange={(e) => setRoomForm({ ...roomForm, number: e.target.value })}
                placeholder="e.g., 101, 102"
                required
              />
            </div>

            <div className="form-group room-form-field room-capacity-field">
              <label>Capacity</label>
              <input
                type="number"
                value={roomForm.capacity}
                name="capacity"
                onChange={(e) => setRoomForm({ ...roomForm, capacity: e.target.value })}
                placeholder="e.g., 30"
              />
            </div>

            <div className="room-submit-wrap">
              <button type="submit" className="block-add-btn room-submit-btn">
                + Add Room
              </button>
            </div>
          </form>
        </div>

        <div>
          <h3 className="rooms-heading">Rooms in Block {block.name}</h3>

          {loading ? (
            <p className="no-data">Loading rooms...</p>
          ) : roomsData && roomsData.length > 0 ? (
            <div className="rooms-grid">
              {roomsData.map((room) => (
                <div key={room._id} className="room-card">
                  <h4 className="room-card-title">Room {room.number}</h4>

                  <div className="room-capacity-panel">
                    {editingRoomId === room._id ? (
                      <div className="room-edit-row">
                        <input
                          type="number"
                          value={editCapacity}
                          onChange={(e) => setEditCapacity(e.target.value)}
                          className="room-edit-input"
                          autoFocus
                        />
                        <button
                          type="button"
                          className="btn-primary room-small-btn"
                          onClick={() => handleEditCapacity(room._id, editCapacity)}
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          className="btn-muted room-small-btn"
                          onClick={() => setEditingRoomId(null)}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="room-capacity-row">
                        <div>
                          <p className="room-meta-label">Capacity</p>
                          <p className="room-capacity-value">{room.capacity} students</p>
                        </div>
                        <button
                          type="button"
                          className="btn-primary room-small-btn"
                          onClick={() => {
                            setEditingRoomId(room._id);
                            setEditCapacity(room.capacity);
                          }}
                        >
                          Edit
                        </button>
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteRoom(room._id)}
                    className="block-delete-btn room-delete-btn"
                  >
                    Delete Room
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="block-empty-msg">No rooms added in this block yet. Add one using the form above.</p>
          )}
        </div>

        {modalState.open && (
          <div className="admin-modal-overlay" role="dialog" aria-modal="true">
            <div className="admin-modal">
              <h3>{modalState.title}</h3>
              <p>{modalState.message}</p>
              <div className="admin-modal-actions">
                {modalState.type === "confirm" && (
                  <button type="button" className="btn-muted" onClick={closeModal}>
                    {modalState.cancelText}
                  </button>
                )}
                <button
                  type="button"
                  className={modalState.type === "confirm" ? "btn-danger" : "btn-primary"}
                  onClick={handleModalConfirm}
                >
                  {modalState.confirmText}
                </button>
              </div>
            </div>
          </div>
        )}
        </div>
      </main>
    </div>
  );
}

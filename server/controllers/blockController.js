import Block from "../models/Block.js";
import Room from "../models/Room.js";

// ========== BLOCKS ==========
export const addBlock = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Block name is required" });
    }

    const existingBlock = await Block.findOne({ name });
    if (existingBlock) {
      return res.status(400).json({ message: "Block already exists" });
    }

    const block = new Block({
      name,
      description: description || "",
    });

    await block.save();
    res.status(201).json(block);
  } catch (error) {
    console.error("Error adding block:", error);
    res.status(500).json({ message: "Error adding block", error: error.message });
  }
};

export const getBlocks = async (req, res) => {
  try {
    const blocks = await Block.find();
    res.json(blocks);
  } catch (error) {
    console.error("Error fetching blocks:", error);
    res.status(500).json({ message: "Error fetching blocks", error: error.message });
  }
};

export const deleteBlock = async (req, res) => {
  try {
    const { id } = req.params;

    const block = await Block.findByIdAndDelete(id);
    if (!block) {
      return res.status(404).json({ message: "Block not found" });
    }

    // Delete all rooms in this block
    await Room.deleteMany({ block: id });

    res.json({ message: "Block deleted successfully" });
  } catch (error) {
    console.error("Error deleting block:", error);
    res.status(500).json({ message: "Error deleting block", error: error.message });
  }
};

// ========== ROOMS ==========
export const addRoom = async (req, res) => {
  try {
    const { number, block, capacity } = req.body;

    if (!number || !block) {
      return res.status(400).json({ message: "Room number and block are required" });
    }

    const blockExists = await Block.findById(block);
    if (!blockExists) {
      return res.status(404).json({ message: "Block not found" });
    }

    const parsedCapacity = capacity === undefined || capacity === null || capacity === ""
      ? 30
      : Number(capacity);

    if (!Number.isFinite(parsedCapacity) || parsedCapacity <= 0) {
      return res.status(400).json({ message: "Capacity must be greater than 0" });
    }

    const room = new Room({
      number,
      block,
      capacity: parsedCapacity,
    });

    await room.save();
    const populatedRoom = await room.populate("block");
    res.status(201).json(populatedRoom);
  } catch (error) {
    console.error("Error adding room:", error);
    res.status(500).json({ message: "Error adding room", error: error.message });
  }
};

export const getRooms = async (req, res) => {
  try {
    const rooms = await Room.find().populate("block");
    res.json(rooms);
  } catch (error) {
    console.error("Error fetching rooms:", error);
    res.status(500).json({ message: "Error fetching rooms", error: error.message });
  }
};

export const deleteRoom = async (req, res) => {
  try {
    const { id } = req.params;

    const room = await Room.findByIdAndDelete(id);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    res.json({ message: "Room deleted successfully" });
  } catch (error) {
    console.error("Error deleting room:", error);
    res.status(500).json({ message: "Error deleting room", error: error.message });
  }
};

export const updateRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const { capacity } = req.body;

    // Validate capacity properly
    if (capacity === undefined || capacity === null) {
      return res.status(400).json({
        message: "Capacity is required",
      });
    }

    const parsedCapacity = parseInt(capacity);

    if (isNaN(parsedCapacity) || parsedCapacity <= 0) {
      return res.status(400).json({
        message: "Capacity must be greater than 0",
      });
    }

    const room = await Room.findByIdAndUpdate(
      id,
      { capacity: parsedCapacity },
      { new: true }
    ).populate("block");

    if (!room) {
      return res.status(404).json({
        message: "Room not found",
      });
    }

    res.json(room);

  } catch (error) {
    console.error("Error updating room:", error);
    res.status(500).json({
      message: "Error updating room",
      error: error.message,
    });
  }
};
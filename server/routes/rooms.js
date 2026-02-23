import express from "express";
import {
  addRoom,
  getRooms,
  deleteRoom,
  updateRoom
} from "../controllers/blockController.js";

const router = express.Router();

router.get("/", getRooms);
router.post("/", addRoom);
router.delete("/:id", deleteRoom);
router.put("/:id", updateRoom);

export default router;
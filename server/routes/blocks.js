import { Router } from "express";
import {
  addBlock,
  getBlocks,
  deleteBlock,
  addRoom,
  getRooms,
  deleteRoom,
  updateRoom,
} from "../controllers/blockController.js";

const router = Router();

// Block routes
router.post("/", addBlock);
router.get("/", getBlocks);
router.delete("/:id", deleteBlock);

export default router;

// Separate router for rooms
export const roomRouter = Router();
roomRouter.post("/", addRoom);
roomRouter.get("/", getRooms);
roomRouter.delete("/:id", deleteRoom);
roomRouter.put("/:id", updateRoom);

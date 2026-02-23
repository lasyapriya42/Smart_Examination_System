import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    number: {
      type: String,
      required: true,
      trim: true,
    },
    block: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Block",
      required: true,
    },
    capacity: {
      type: Number,
      required: true,
      default: 30,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Room", roomSchema);

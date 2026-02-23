import mongoose from "mongoose";

const staffSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  staffId: {
    type: String,
    required: true,
    unique: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  department: {
    type: String,
    required: true,
  },

  designation: {
    type: String,
    required: true,
  },

  phone: {
    type: String,
    required: false,
  },
});

export default mongoose.model("Staff", staffSchema);

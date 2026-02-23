import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  rollNo: {
    type: String,
    required: true,
    unique: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  year: {
    type: Number,
    required: true,
  },

  department: {
    type: String,
    required: true,
  },

  semester: {
    type: Number,
    required: true,
  },

  section: {
  type: String,
  required: true,
},
});

export default mongoose.model("Student", studentSchema);
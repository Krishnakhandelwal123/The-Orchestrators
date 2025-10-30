import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true, index: true, required: true },
  rawResponse: { type: String, default: "" }
}, {
  timestamps: true,
  collection: 'studentresults'
});

export default mongoose.model("StudentResult", studentSchema);



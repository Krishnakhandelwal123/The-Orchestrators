import mongoose from "mongoose";

const AnalysisSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true, index: true, required: true },
  resumeResult: { type: mongoose.Schema.Types.Mixed, default: null },
  transcriptResult: { type: mongoose.Schema.Types.Mixed, default: null },
  certificateResult: { type: mongoose.Schema.Types.Mixed, default: null },
  githubResult: { type: mongoose.Schema.Types.Mixed, default: null },
  personalityResult: { type: mongoose.Schema.Types.Mixed, default: null },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

AnalysisSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.model("Analysis", AnalysisSchema);



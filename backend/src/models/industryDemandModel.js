import mongoose from "mongoose";

const IndustryDemandSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    location: { type: String, required: true, index: true },
    job_demand_data: { type: Object, default: {} },
    salary_data: { type: Object, default: {} },
    skills_data: { type: Object, default: {} },
    summary: { type: Object, default: {} },
  },
  { timestamps: true }
);

IndustryDemandSchema.index({ userId: 1, location: 1, createdAt: -1 });

const IndustryDemand = mongoose.model("IndustryDemand", IndustryDemandSchema);
export default IndustryDemand;



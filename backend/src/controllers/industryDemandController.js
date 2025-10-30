import path from "path";
import { fileURLToPath } from "url";
import { spawn } from "child_process";
import IndustryDemand from "../models/industryDemandModel.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const runPythonJson = (scriptPath, args = []) => {
  return new Promise((resolve, reject) => {
    const py = spawn("python", [scriptPath, ...args], {
      shell: false,
      cwd: path.dirname(scriptPath),
    });
    let stdout = "";
    let stderr = "";
    py.stdout.on("data", (d) => (stdout += d.toString()));
    py.stderr.on("data", (d) => (stderr += d.toString()));
    py.on("close", (code) => {
      if (code !== 0) {
        return reject(new Error(`Python exited with code ${code}: ${stderr}`));
      }
      try {
        const parsed = JSON.parse(stdout.trim());
        resolve(parsed);
      } catch (err) {
        reject(new Error(`Failed to parse JSON from Python: ${err.message}. Raw: ${stdout}`));
      }
    });
  });
};

export const runIndustryDemand = async (req, res) => {
  try {
    const userId = req.user._id;
    const { location = "India" } = req.body || {};

    const backendDir = path.resolve(__dirname, "../../");
    const repoRoot = path.resolve(backendDir, "..");
    const script = path.resolve(repoRoot, "jobDemand.py");

    const result = await runPythonJson(script, [location]);

    const doc = await IndustryDemand.create({
      userId,
      location,
      job_demand_data: result.job_demand_data || {},
      salary_data: result.salary_data || {},
      skills_data: result.skills_data || {},
      summary: result.summary || {},
    });

    return res.status(200).json({ message: "Industry demand updated", data: doc });
  } catch (error) {
    console.error("runIndustryDemand error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getLatestIndustryDemand = async (req, res) => {
  try {
    const userId = req.user._id;
    const { location = "India" } = req.query || {};
    const latest = await IndustryDemand.findOne({ userId, location })
      .sort({ createdAt: -1 })
      .lean(); // Use lean() to get plain JS object instead of Mongoose document
    if (!latest) return res.status(404).json({ message: "No data found" });
    return res.status(200).json({ data: latest });
  } catch (error) {
    console.error("getLatestIndustryDemand error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};



import path from "path";
import { fileURLToPath } from "url";
import { spawn } from "child_process";
import IndustryDemand from "../models/industryDemandModel.js";
import StudentResult from "../models/studentResultModel.js";

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

export const getCareerRoles = async (req, res) => {
  try {
    const userId = req.user._id;
    const { location = "India" } = req.body || {};

    // Fetch industry demand data from database
    const industryDemand = await IndustryDemand.findOne({ userId, location })
      .sort({ createdAt: -1 })
      .lean();
    
    if (!industryDemand) {
      return res.status(404).json({ 
        message: "No industry demand data found. Please generate industry demand data first." 
      });
    }

    // Fetch user's student profile
    const studentResult = await StudentResult.findOne({ userId }).lean();
    
    if (!studentResult || !studentResult.rawResponse) {
      return res.status(404).json({ 
        message: "No student profile found. Please generate your profile first using 'Analyse five'." 
      });
    }

    // Parse student profile
    let userProfile;
    try {
      const parsed = typeof studentResult.rawResponse === 'string' 
        ? JSON.parse(studentResult.rawResponse) 
        : studentResult.rawResponse;
      userProfile = parsed?.structured_profile || parsed || {};
    } catch (e) {
      userProfile = {};
    }

    // Prepare job analysis data
    const jobAnalysis = {
      job_demand_data: industryDemand.job_demand_data || {},
      salary_data: industryDemand.salary_data || {},
      skills_data: industryDemand.skills_data || {},
      summary: industryDemand.summary || {},
      location: industryDemand.location || location,
    };

    // Resolve Python script path
    const backendDir = path.resolve(__dirname, "../../");
    const repoRoot = path.resolve(backendDir, "..");
    const script = path.resolve(repoRoot, "CareerRole.py");

    // Convert to JSON strings for command line arguments
    const jobAnalysisJson = JSON.stringify(jobAnalysis);
    const userProfileJson = JSON.stringify(userProfile);

    // Run CareerRole.py
    const result = await runPythonJson(script, [jobAnalysisJson, userProfileJson]);

    return res.status(200).json({ 
      message: "Career roles generated successfully",
      suggested_roles: result.suggested_roles || []
    });
  } catch (error) {
    console.error("getCareerRoles error:", error);
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};


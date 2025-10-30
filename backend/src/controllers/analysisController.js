import path from "path";
import { fileURLToPath } from "url";
import { spawn } from "child_process";
import fs from "fs";
import Analysis from "../models/analysisModel.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const runPython = (scriptPath, args = []) => {
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
        // If not JSON, return raw text
        resolve({ output: stdout.trim() });
      }
    });
  });
};

export const runPersonalityReview = async (req, res) => {
  try {
    const userId = req.user._id;
    const { riasecCode } = req.body || {};
    if (!riasecCode || typeof riasecCode !== "string") {
      return res.status(400).json({ message: "riasecCode is required" });
    }

    const backendDir = path.resolve(__dirname, "../../");
    const repoRoot = path.resolve(backendDir, "..");
    const script = path.resolve(repoRoot, "personality.py");

    const result = await runPython(script, [riasecCode]);

    const analysisDoc = await Analysis.findOneAndUpdate(
      { userId },
      { $set: { personalityResult: result }, $setOnInsert: { userId } },
      { upsert: true, new: true }
    );

    return res.status(200).json({ message: "Personality summary saved", personalityResult: analysisDoc.personalityResult });
  } catch (error) {
    console.error("runPersonalityReview error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getPersonalityInstructions = async (req, res) => {
  try {
    const backendDir = path.resolve(__dirname, "../../");
    const repoRoot = path.resolve(backendDir, "..");
    const script = path.resolve(repoRoot, "personality.py");
    const out = await runPython(script, ["--instructions"]);
    return res.status(200).json(out);
  } catch (error) {
    console.error("getPersonalityInstructions error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const uploadAndAnalyze = async (req, res) => {
  try {
    const userId = req.user._id;
    const files = req.files || {};
    const { githubUrl } = req.body || {};
    // If nothing uploaded in this request, we'll try to use existing files on disk

    // Proceed to run scripts and then upsert results into a single per-user document

    // Resolve Python script absolute paths (repo root has python files)
    const backendDir = path.resolve(__dirname, "../../");
    const repoRoot = path.resolve(backendDir, "..");
    const uploadsRoot = path.resolve(backendDir, "uploads");
    const username = (req.user?.name || req.user?.email || String(req.user?._id))
      .toLowerCase()
      .replace(/[^a-z0-9_-]+/g, "-");
    const userDir = path.join(uploadsRoot, username);

    const results = { resume: null, transcript: null, certificate: null, github: null };

    const pickExisting = (base) => {
      const exts = [".png", ".jpg", ".jpeg", ".webp"];
      for (const ext of exts) {
        const p = path.join(userDir, `${base}${ext}`);
        if (fs.existsSync(p)) return p;
      }
      return null;
    };

    const resumePath = files.resume?.[0]?.path || (fs.existsSync(userDir) ? pickExisting("resume") : null);
    const transcriptPath = files.transcript?.[0]?.path || (fs.existsSync(userDir) ? pickExisting("transcript") : null);
    const certificatePath = files.certificate?.[0]?.path || (fs.existsSync(userDir) ? pickExisting("certificate") : null);

    if (!resumePath || !transcriptPath || !certificatePath || !githubUrl) {
      return res.status(400).json({ message: "Resume, Transcript, Certificate, and GitHub URL are required" });
    }

    if (resumePath) {
      const script = path.resolve(repoRoot, "resume.py");
      results.resume = await runPython(script, [resumePath]);
    }
    if (transcriptPath) {
      const script = path.resolve(repoRoot, "transcript.py");
      results.transcript = await runPython(script, [transcriptPath]);
    }
    if (certificatePath) {
      const script = path.resolve(repoRoot, "certificate.py");
      results.certificate = await runPython(script, [certificatePath]);
    }
    if (githubUrl) {
      const script = path.resolve(repoRoot, "github.py");
      results.github = await runPython(script, [githubUrl]);
    }

    const updates = {};
    if (results.resume) updates.resumeResult = results.resume;
    if (results.transcript) updates.transcriptResult = results.transcript;
    if (results.certificate) updates.certificateResult = results.certificate;
    if (results.github) updates.githubResult = results.github;

    const analysisDoc = await Analysis.findOneAndUpdate(
      { userId },
      { $set: updates, $setOnInsert: { userId } },
      { upsert: true, new: true }
    );

    res.status(200).json({ analysisId: analysisDoc._id, message: "Analysis saved" });
  } catch (error) {
    console.error("Upload/Analyze error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getLatestAnalysis = async (req, res) => {
  try {
    const analysis = await Analysis.findOne({ userId: req.user._id });
    if (!analysis) return res.status(404).json({ message: "No analysis found" });
    res.status(200).json(analysis);
  } catch (error) {
    console.error("GetLatestAnalysis error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const processExisting = async (req, res) => {
  try {
    req.files = {};
    return uploadAndAnalyze(req, res);
  } catch (error) {
    console.error("ProcessExisting error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


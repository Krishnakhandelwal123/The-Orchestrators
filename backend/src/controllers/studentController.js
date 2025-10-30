import Analysis from "../models/analysisModel.js";
import StudentResult from "../models/studentResultModel.js";
import dotenv from "dotenv";
dotenv.config();

// Lazy import @google/generative-ai to avoid hard failure if not installed
let GoogleGenerativeAI = null;
try {
  ({ GoogleGenerativeAI } = await import("@google/generative-ai"));
} catch (_) {
  // Will handle missing module at runtime with a friendly error
}

const STUDENT_SCHEMA_STRING = `{
  "studentProfile": {
    "personalInformation": {
      "name": "",
      "email": "",
      "phone": "",
      "location": "",
      "linkedin": "",
      "github": "",
      "summary": ""
    },
    "academicInformation": {
      "university": "",
      "degree": "",
      "branch": "",
      "yearOfStudy": "",
      "cgpa": "",
      "academicHistory": []
    },
    "skills": {
      "technicalSkills": [],
      "nonTechnicalSkills": [],
      "skillGaps": [],
      "skillInsights": ""
    },
    "projects": [],
    "achievements": [],
    "certifications": [],
    "personalityProfile": {
      "riasecType": "",
      "dominantTraits": [],
      "traitScores": {},
      "careerPersonalityFit": []
    },
    "githubAnalysis": {
      "username": "",
      "repositoriesAnalyzed": [],
      "languagesUsed": [],
      "contributionActivity": "",
      "githubInsights": ""
    },
    "careerRecommendations": {
      "suggestedCareerPaths": [],
      "recommendedCourses": [],
      "recommendedInternships": []
    },
    "portfolioSummary": {
      "strengths": [],
      "weaknesses": [],
      "overallEvaluation": "",
      "profileCompletenessScore": ""
    },
    "metadata": {
      "dataSources": ["Resume", "Transcript", "Certificates", "GitHub", "Personality Test"],
      "lastUpdated": "",
      "dataVersion": "v1.0"
    }
  }
}`;

const buildPrompt = (studentSchema) => `You are an expert AI career and profile analysis system. You are provided with 5 datasets about a student:

1. Resume content
2. Academic transcript
3. Certificates and achievements
4. GitHub profile analysis
5. Personality assessment

Your job:
- Merge and summarize all information.
- Eliminate redundant or duplicate data.
- Output in TWO sections:
  1. "structured_profile": a detailed JSON matching this schema:
  ${studentSchema}
  2. "text_report": a concise human-readable summary of the student’s strengths, profile, and career readiness.

Rules:
- Use exact JSON format (valid JSON).
- Fill as many fields as possible based on given input.
- If data is missing, leave values as empty strings or arrays.
- Ensure "structured_profile" and "text_report" are valid JSON keys.`;

export const analyseFive = async (req, res) => {
  try {
    if (!GoogleGenerativeAI) {
      return res.status(500).json({ message: "@google/generative-ai is not installed on the server" });
    }
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ message: "GOOGLE_API_KEY not set" });
    }

    const userId = req.user._id;
    const analysis = await Analysis.findOne({ userId });
    if (!analysis) {
      return res.status(404).json({ message: "No analysis found for user" });
    }

    const combinedInput = {
      resume: analysis.resumeResult || null,
      transcript: analysis.transcriptResult || null,
      certificate: analysis.certificateResult || null,
      github: analysis.githubResult || null,
      personality: analysis.personalityResult || null,
    };

    const prompt = buildPrompt(STUDENT_SCHEMA_STRING);

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

    const result = await model.generateContent([
      { text: prompt },
      { text: JSON.stringify(combinedInput, null, 2) },
    ]);

    const responseText = result?.response?.text?.() || "";

    const doc = await StudentResult.findOneAndUpdate(
      { userId },
      {
        $set: { rawResponse: responseText },
        $setOnInsert: { userId },
      },
      { new: true, upsert: true }
    );

    return res.status(200).json({ status: "success", rawResponse: doc.rawResponse });
  } catch (error) {
    console.error("analyseFive error:", error);
    return res.status(500).json({ error: "Failed to generate profile", details: error?.message || String(error) });
  }
};

export const getStudentResult = async (req, res) => {
  try {
    const doc = await StudentResult.findOne({ userId: req.user._id });
    if (!doc) return res.status(404).json({ message: "No student result found" });
    return res.status(200).json(doc);
  } catch (error) {
    console.error("getStudentResult error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Utility to run python script
import { spawn } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const backendDir = path.resolve(__dirname, "../../");
const repoRoot = path.resolve(backendDir, "..");

const runPython = (scriptPath, args = []) => {
  return new Promise((resolve, reject) => {
    const py = spawn("python", [scriptPath, ...args], { shell: false, cwd: path.dirname(scriptPath) });
    let stdout = "";
    let stderr = "";
    py.stdout.on("data", (d) => (stdout += d.toString()));
    py.stderr.on("data", (d) => (stderr += d.toString()));
    py.on("close", (code) => {
      if (code !== 0) {
        return reject(new Error(`Python exited with code ${code}: ${stderr}`));
      }
      try {
        resolve(JSON.parse(stdout.trim()));
      } catch {
        resolve({ output: stdout.trim() });
      }
    });
  });
};

export const runSkillPathway = async (req, res) => {
  try {
    const { targetCareer } = req.body || {};
    if (!targetCareer || typeof targetCareer !== "string") {
      return res.status(400).json({ message: "targetCareer is required" });
    }

    const student = await StudentResult.findOne({ userId: req.user._id });
    if (!student || !student.rawResponse) {
      return res.status(404).json({ message: "No student raw response found. Run 'Analyse five' first." });
    }

    // Extract text_report from rawResponse JSON
    let textReport = "";
    try {
      const parsed = JSON.parse(student.rawResponse);
      textReport = parsed?.text_report || "";
    } catch {
      // If not JSON, use raw as-is
      textReport = student.rawResponse;
    }
    if (!textReport) {
      return res.status(400).json({ message: "text_report not found in rawResponse" });
    }

    // Write to a temporary file for the Python script to read
    const tmpDir = path.resolve(backendDir, "tmp");
    if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });
    const tmpFile = path.join(tmpDir, `userdoc_${req.user._id}.txt`);
    fs.writeFileSync(tmpFile, textReport, "utf-8");

    const script = path.resolve(repoRoot, "skillpath.py");
    const out = await runPython(script, [targetCareer, tmpFile]);

    return res.status(200).json({ status: "success", pathway: out });
  } catch (error) {
    console.error("runSkillPathway error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const courseRecommendations = async (req, res) => {
  try {
    if (!GoogleGenerativeAI) {
      return res.status(500).json({ message: "@google/generative-ai is not installed on the server" });
    }
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ message: "GOOGLE_API_KEY not set" });
    }

    const student = await StudentResult.findOne({ userId: req.user._id });
    if (!student || !student.rawResponse) {
      return res.status(404).json({ message: "No student raw response found. Run 'Analyse five' first." });
    }

    let textReport = "";
    try {
      const parsed = JSON.parse(student.rawResponse);
      textReport = parsed?.text_report || "";
    } catch {
      textReport = student.rawResponse;
    }
    if (!textReport) {
      return res.status(400).json({ message: "text_report not found in rawResponse" });
    }

    const prompt = `You are a senior learning architect. Based on the following student profile summary, propose a prioritized list of 8-12 course recommendations with clear rationale.

Student text report:\n\n${textReport}\n\n
Return strict JSON with keys:
{
  "courses": [
    { "title": "", "level": "Beginner|Intermediate|Advanced", "provider": "", "topics": [], "why": "" }
  ],
  "summary": ""
}`;

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });
    const result = await model.generateContent([{ text: prompt }]);
    const responseText = result?.response?.text?.() || "";

    let parsed;
    try {
      parsed = JSON.parse(responseText);
    } catch (_) {
      const start = responseText.indexOf("{");
      const end = responseText.lastIndexOf("}") + 1;
      parsed = JSON.parse(start >= 0 && end > start ? responseText.slice(start, end) : "{}");
    }

    return res.status(200).json({ status: "success", recommendations: parsed });
  } catch (error) {
    console.error("courseRecommendations error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const portfolioBuilder = async (req, res) => {
  try {
    const student = await StudentResult.findOne({ userId: req.user._id });
    if (!student || !student.rawResponse) {
      return res.status(404).json({ message: "No student raw response found. Run 'Analyse five' first." });
    }

    let textReport = "";
    try {
      const parsed = JSON.parse(student.rawResponse);
      textReport = parsed?.text_report || "";
    } catch {
      textReport = student.rawResponse;
    }
    if (!textReport) {
      return res.status(400).json({ message: "text_report not found in rawResponse" });
    }

    const tmpDir = path.resolve(backendDir, "tmp");
    if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });
    const tmpFile = path.join(tmpDir, `portfolio_${req.user._id}.txt`);
    fs.writeFileSync(tmpFile, textReport, "utf-8");

    const script = path.resolve(repoRoot, "portfolioBuilder.py");
    const out = await runPython(script, [tmpFile]);

    return res.status(200).json({ status: "success", portfolio: out });
  } catch (error) {
    console.error("portfolioBuilder error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};



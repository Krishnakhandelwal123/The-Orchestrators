import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { protectRoute } from "../middlewares/authMiddleware.js";
import { sanitizeInput } from "../middlewares/sanitize.js";
import { uploadAndAnalyze, getLatestAnalysis, processExisting, runPersonalityReview, getPersonalityInstructions } from "../controllers/analysisController.js";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadsDir = path.resolve(__dirname, "../../uploads");

const safeName = (value) => String(value || "user").toLowerCase().replace(/[^a-z0-9_-]+/g, "-");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    try {
      const username = safeName(req.user?.name || req.user?.email || req.user?._id?.toString());
      const userDir = path.join(uploadsDir, username);
      if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);
      if (!fs.existsSync(userDir)) fs.mkdirSync(userDir);
      cb(null, userDir);
    } catch (err) {
      cb(err);
    }
  },
  filename: function (req, file, cb) {
    try {
      const ext = path.extname(file.originalname) || ".png";
      const username = safeName(req.user?.name || req.user?.email || req.user?._id?.toString());
      const field = file.fieldname; // resume | transcript | certificate
      const targetName = `${field}${ext}`;
      const targetPath = path.join(uploadsDir, username, targetName);
      if (fs.existsSync(targetPath)) {
        return cb(new Error(`${field} already uploaded. Delete before re-uploading.`));
      }
      cb(null, targetName);
    } catch (err) {
      cb(err);
    }
  },
});

const upload = multer({ storage });

const uploadMiddleware = upload.fields([
  { name: "resume", maxCount: 1 },
  { name: "transcript", maxCount: 1 },
  { name: "certificate", maxCount: 1 },
]);

router.post("/upload", protectRoute, (req, res, next) => {
  uploadMiddleware(req, res, function (err) {
    if (err) {
      return res.status(400).json({ message: err.message || "Upload failed" });
    }
    next();
  });
}, sanitizeInput, uploadAndAnalyze);

// Process already-uploaded files in user's folder
router.post("/process", protectRoute, processExisting);

router.get("/latest", protectRoute, getLatestAnalysis);

// Personality review endpoints
router.get("/personality/instructions", protectRoute, getPersonalityInstructions);
router.post("/personality", protectRoute, sanitizeInput, runPersonalityReview);

export default router;


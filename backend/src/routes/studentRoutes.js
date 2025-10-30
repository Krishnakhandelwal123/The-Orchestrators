import express from "express";
import { protectRoute } from "../middlewares/authMiddleware.js";
import { sanitizeInput } from "../middlewares/sanitize.js";
import { analyseFive, getStudentResult, runSkillPathway, courseRecommendations, portfolioBuilder } from "../controllers/studentController.js";

const router = express.Router();

router.post("/analyse-five", protectRoute, sanitizeInput, analyseFive);
router.get("/latest", protectRoute, getStudentResult);
router.post("/skill-pathway", protectRoute, sanitizeInput, runSkillPathway);
router.post("/course-recommendations", protectRoute, sanitizeInput, courseRecommendations);
router.post("/portfolio-builder", protectRoute, sanitizeInput, portfolioBuilder);

export default router;



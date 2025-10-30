import express from "express";
import { protectRoute } from "../middlewares/authMiddleware.js";
import { sanitizeInput } from "../middlewares/sanitize.js";
import { runIndustryDemand, getLatestIndustryDemand } from "../controllers/industryDemandController.js";

const router = express.Router();

router.get("/latest", protectRoute, getLatestIndustryDemand);
router.post("/run", protectRoute, sanitizeInput, runIndustryDemand);

export default router;



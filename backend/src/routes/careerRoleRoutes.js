import express from "express";
import { protectRoute } from "../middlewares/authMiddleware.js";
import { sanitizeInput } from "../middlewares/sanitize.js";
import { getCareerRoles } from "../controllers/careerRoleController.js";

const router = express.Router();

router.post("/suggest", protectRoute, sanitizeInput, getCareerRoles);

export default router;


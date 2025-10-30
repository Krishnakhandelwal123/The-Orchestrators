import express from 'express';
import { signup, login, logout, checkAuth, googleLogin, verifyEmail,forgotPassword,resetPassword, becomeCreator, resendVerification } from '../controllers/authController.js';
import { protectRoute } from '../middlewares/authMiddleware.js';
import { authLimiter, passwordResetLimiter, emailVerificationLimiter } from '../middlewares/rateLimit.js';
import { sanitizeInput } from '../middlewares/sanitize.js';

const router = express.Router();

router.post("/signup", authLimiter, sanitizeInput, signup);
router.post("/login", authLimiter, sanitizeInput, login);
router.post("/logout", logout);
router.post("/google", authLimiter, sanitizeInput, googleLogin);
router.post("/verifyemail", protectRoute, emailVerificationLimiter, sanitizeInput, verifyEmail); 
router.post("/resendverification", protectRoute, emailVerificationLimiter, resendVerification);
router.post("/forgotpassword", passwordResetLimiter, sanitizeInput, forgotPassword);
router.post("/resetpassword/:token", passwordResetLimiter, sanitizeInput, resetPassword);
router.post("/becomecreator", protectRoute, sanitizeInput, becomeCreator);

router.get("/check", protectRoute, checkAuth);

export default router;
  
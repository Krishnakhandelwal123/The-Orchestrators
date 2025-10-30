import { generateToken } from "../lib/utils.js";
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import admin from '../lib/firebase.js';
import { sendOtpEmail, sendwelcomeemail, sendPasswordResetEmail,sendResetSuccessEmail } from '../middlewares/emailConfig.js';
import crypto from 'crypto';

const signup = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    // Input validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    
    // Sanitize inputs
    const sanitizedName = name.trim();
    const sanitizedEmail = email.toLowerCase().trim();
    
    // Input length validation
    if (sanitizedName.length < 2 || sanitizedName.length > 50) {
      return res.status(400).json({ message: "Name must be between 2 and 50 characters" });
    }
    
    if (sanitizedEmail.length > 100) {
      return res.status(400).json({ message: "Email is too long" });
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(sanitizedEmail)) {
      return res.status(400).json({ message: "Invalid email format" });
    }
    
    if (password.length < 6 || password.length > 128) {
      return res.status(400).json({ message: "Password must be between 6 and 128 characters" });
    }
    
    const user = await User.findOne({ email: sanitizedEmail });
    if (user) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const VerificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const VerificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000);

    const newUser = new User({
      name: sanitizedName,
      email: sanitizedEmail,
      password: hashedPassword,
      VerificationCode,
      VerificationCodeExpires
    });
    if (newUser) {
      generateToken(newUser._id, res);
      await newUser.save();
      await sendOtpEmail(newUser.email, VerificationCode);
      res.status(201).json({
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        isVerified: newUser.isVerified,
        VerificationCode,
        VerificationCodeExpires
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Input validation
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }
    
    const sanitizedEmail = email.toLowerCase().trim();
    
    // Input length validation
    if (sanitizedEmail.length > 100) {
      return res.status(400).json({ message: "Email is too long" });
    }
    
    if (password.length > 128) {
      return res.status(400).json({ message: "Password is too long" });
    }
    
    const user = await User.findOne({ email: sanitizedEmail });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    generateToken(user._id, res);
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isVerified: user.isVerified
    });
  } catch (error) {
    console.error("Error in login controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const googleLogin = async (req, res) => {
  const { token } = req.body;
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    const { uid, email, name, picture } = decodedToken;

    let user = await User.findOne({ email });

    if (user) {
      if (user.authMethod !== 'google') {
        return res.status(400).json({ message: `You have previously signed up with a password. Please use your password to log in.` });
      }
      // Ensure Google users are always verified
      if (!user.isVerified) {
        user.isVerified = true;
        await user.save();
      }
    } else {
      user = new User({
        name,
        email,
        googleId: uid,
        profileImage: picture || '',
        authMethod: 'google',
        isVerified: true
      });
      await user.save();
    }

    generateToken(user._id, res);
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      profileImage: user.profileImage,
      isVerified: user.isVerified
    });
  } catch (error) {
    console.error("Google Login Error:", error);
    if (error.code === 'auth/id-token-expired') {
      return res.status(401).json({ message: 'Firebase token has expired. Please sign in again.' });
    }
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Error in logout controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.error("Error in checkAuth controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const verifyEmail = async (req, res) => {
  const { code } = req.body;

  try {
    if (!code) {
      return res.status(400).json({ message: "Verification code is required" });
    }
    
    if (code.length !== 6 || !/^\d{6}$/.test(code)) {
      return res.status(400).json({ message: "Invalid verification code format" });
    }

    const user = await User.findOne({
      VerificationCode: code,
      VerificationCodeExpires: { $gt: new Date() }
    });

    if (!user) return res.status(404).json({ message: 'User not found' });

    user.isVerified = true;
    user.VerificationCode = undefined;
    user.VerificationCodeExpires = undefined;
    
    await user.save();
    await sendwelcomeemail(user.email, user.name);
    
    res.status(200).json({ message: 'Email verified successfully' });
  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    
    const sanitizedEmail = email.toLowerCase().trim();
    
    // Input length validation
    if (sanitizedEmail.length > 100) {
      return res.status(400).json({ message: "Email is too long" });
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(sanitizedEmail)) {
      return res.status(400).json({ message: "Invalid email format" });
    }
    
    const user = await User.findOne({ email: sanitizedEmail });
    // Always return success to prevent email enumeration
    if (!user) {
      return res.status(200).json({ message: 'Password reset email sent' });
    }
    
    const resetToken = crypto.randomBytes(20).toString('hex');
    const resetTokenExpires = new Date(Date.now() + 10 * 60 * 1000);

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetTokenExpires;
    await user.save();

    await sendPasswordResetEmail(user.email, `${process.env.CLIENT_URL}/resetpassword/${resetToken}`);
    res.status(200).json({ message: 'Password reset email sent' });

  } catch (error) {
    console.error("Error in forgotPassword controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    
    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }
    
    if (password.length < 6 || password.length > 128) {
      return res.status(400).json({ message: "Password must be between 6 and 128 characters" });
    }
    
    const user = await User.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: new Date() } });
    if (!user) return res.status(404).json({ message: 'Invalid or expired password reset token' });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.resetPasswordToken = undefined;  
    user.resetPasswordExpires = undefined;
    await user.save();
    
    await sendResetSuccessEmail(user.email);
    res.status(200).json({ message: 'Password reset successfully' });


  } catch (error) {
    console.error("Error in resetPassword controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

const becomeCreator = async (req, res) => {
  try {
    const { displayName, bio, category, avatar, socialLinks, coverImage } = req.body;
    
    // Input validation
    if (!displayName || !bio || !category) {
      return res.status(400).json({ message: "Display name, bio, and category are required" });
    }
    
    // Validate category
    const validCategories = ['Developer', 'Data Scientist', 'Designer', 'Other'];
    if (!validCategories.includes(category)) {
      return res.status(400).json({ message: "Invalid category selected" });
    }
    
    // Validate display name length
    if (displayName.length < 2 || displayName.length > 50) {
      return res.status(400).json({ message: "Display name must be between 2 and 50 characters" });
    }
    
    // Validate bio length
    if (bio.length < 10 || bio.length > 500) {
      return res.status(400).json({ message: "Bio must be between 10 and 500 characters" });
    }
    
    // Validate social links if provided
    if (socialLinks) {
      const urlRegex = /^https?:\/\/.+/;
      if (socialLinks.github && !urlRegex.test(socialLinks.github)) {
        return res.status(400).json({ message: "Invalid GitHub URL format" });
      }
      if (socialLinks.twitter && !urlRegex.test(socialLinks.twitter)) {
        return res.status(400).json({ message: "Invalid Twitter URL format" });
      }
      if (socialLinks.linkedin && !urlRegex.test(socialLinks.linkedin)) {
        return res.status(400).json({ message: "Invalid LinkedIn URL format" });
      }
      if (socialLinks.website && !urlRegex.test(socialLinks.website)) {
        return res.status(400).json({ message: "Invalid website URL format" });
      }
    }
    
    // Get user from middleware
    const user = req.user;
    
    // Check if user is already a creator
    if (user.roles.isCreator) {
      return res.status(400).json({ message: "User is already a creator" });
    }
    
    // Create creator profile
    const creatorProfile = {
      displayName: displayName.trim(),
      bio: bio.trim(),
      category,
      avatar: avatar || user.profileImage || '',
      coverImage: coverImage || '',
      socialLinks: socialLinks || {}
    };
    
    // Update user with creator role and profile
    user.roles.isCreator = true;
    user.creatorProfile = creatorProfile;
    
    await user.save();
    
    res.status(200).json({
      message: "Successfully became a creator!",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        roles: user.roles,
        creatorProfile: user.creatorProfile
      }
    });
    
  } catch (error) {
    console.error("Error in becomeCreator controller:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export {

  signup,
  login,
  logout,
  checkAuth,
  googleLogin,
  verifyEmail,
  forgotPassword,
  resetPassword,
  becomeCreator
};


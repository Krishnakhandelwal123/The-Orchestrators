import { create } from "zustand"; 
import { axiosInstance } from "../lib/Axios.js";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({ 
  authUser: null,
  isSigningUp: false, 
  isLoggingIn: false,  
  isCheckingAuth: true,
  isBecomingCreator: false,

  checkAuth: async () => {
    try {
      set({ isCheckingAuth: true });
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
    } catch (error) {
      console.error("Error in checkAuth:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },
  logout: async (navigate) => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      navigate("/");
      toast.success("Logged out successfully");
      
    } catch (error) {
      console.error("Logout error:", error);
      toast.error(error.response?.data?.message || "Logout failed");
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      toast.success("Account created successfully! Please check your email for verification.");
    } catch (error) {
      console.error("Signup error:", error);
      toast.error(error.response?.data?.message || "Signup failed");
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try { 
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Logged in successfully");

    } catch (error) {
      console.error("Login error:", error);
      const message =
        error?.response?.data?.message || error?.message || "Login failed";
      toast.error(message);
    }
    finally {
      set({ isLoggingIn: false });
    }
  },

  googleLogin: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/google", data);
      set({ authUser: res.data });
      toast.success("Logged in successfully with Google");
    } catch (error) {
      console.error("Google login error:", error);
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Google login failed";
      toast.error(message);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  verifyEmail: async (code) => {
    try {
      const res = await axiosInstance.post("/auth/verifyemail", { code });
      toast.success(res.data.message || "Email verified successfully");
      
      // Refresh auth state after successful verification
      const authRes = await axiosInstance.get("/auth/check");
      set({ authUser: authRes.data });
      
      return { success: true, message: res.data.message };
    } catch (error) {
      console.error("Email verification error:", error);
      const message = error?.response?.data?.message || error?.message || "Verification failed";
      toast.error(message);
      return { success: false, message };
    }
  },

  forgotPassword: async (email) => {
    try {
      const res = await axiosInstance.post("/auth/forgotpassword", { email });
      const message = res.data.message || "Password reset email sent";
      toast.success(message);
      return { success: true, message };
    } catch (error) {
      console.error("Forgot password error:", error);
      // toast.error is handled by the component
      const message = error?.response?.data?.message || error?.message || "Failed to send reset email";
      toast.error(message);
      return { success: false, message };
    }
  },

  resetPassword: async (token, password) => {
    try {
      const res = await axiosInstance.post(`/auth/resetpassword/${token}`, { password });
      const message = res.data.message || "Password reset successfully";
      toast.success(message);
      return { success: true, message };
    } catch (error) {
      console.error("Reset password error:", error);
      // toast.error is handled by the component
      const message = error?.response?.data?.message || error?.message || "Failed to reset password";
      toast.error(message);
      return { success: false, message };
    }
  },


}))

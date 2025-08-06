import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import { Toaster } from "react-hot-toast";
import Signup from './pages/Signup'
import Initial from './pages/Initial'
import { useAuthStore } from "./Store/AuthStore";
import { useEffect, useCallback } from 'react';
import { Loader } from "lucide-react";
import EmailVerification from './pages/EmailVerification';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import Home from './pages/Home';
import CreatorHome from './pages/CreatorHome';
import BecomeCreator from './pages/BecomeCreator';
import CustomCursor from './components/CustomCursor';


const ProtectedRoute = ({ children }) => {
  const { authUser } = useAuthStore();

  if (!authUser) {
    return <Navigate to='/' replace />;
  }

  if (!authUser.isVerified) {
    return <Navigate to='/verifyemail' replace />;
  }

  return children;
};

// redirect authenticated users to the home page
const RedirectAuthenticatedUser = ({ children }) => {
  const { authUser } = useAuthStore();

  if (authUser && authUser.isVerified) {
    // Redirect based on user role
    if (authUser.roles?.isCreator) {
      return <Navigate to='/c/home' replace />;
    } else {
      return <Navigate to='/s/home' replace />;
    }
  }

  return children;
};

// Protect email verification route - only for authenticated but unverified users
const EmailVerificationRoute = ({ children }) => {
  const { authUser } = useAuthStore();

  if (!authUser) {
    return <Navigate to='/' replace />;
  }

  if (authUser.isVerified) {
    // Redirect based on user role
    if (authUser.roles?.isCreator) {
      return <Navigate to='/c/home' replace />;
    } else {
      return <Navigate to='/s/home' replace />;
    }
  }

  return children;
};

// Route protection for supporter-only routes
const SupporterRoute = ({ children }) => {
  const { authUser } = useAuthStore();

  if (!authUser) {
    return <Navigate to='/' replace />;
  }

  if (!authUser.isVerified) {
    return <Navigate to='/verifyemail' replace />;
  }

  return children;
};

// Route protection for creator-only routes
const CreatorRoute = ({ children }) => {
  const { authUser } = useAuthStore();

  if (!authUser) {
    return <Navigate to='/' replace />;
  }

  if (!authUser.isVerified) {
    return <Navigate to='/verifyemail' replace />;
  }

  if (!authUser.roles?.isCreator) {
    return <Navigate to='/s/home' replace />;
  }

  return children;
};

// Route protection for become creator page - only for verified supporters
const BecomeCreatorRoute = ({ children }) => {
  const { authUser } = useAuthStore();

  if (!authUser) {
    return <Navigate to='/' replace />;
  }

  if (!authUser.isVerified) {
    return <Navigate to='/verifyemail' replace />;
  }

  if (authUser.roles?.isCreator) {
    return <Navigate to='/c/home' replace />;
  }

  return children;
};

const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

  const stableCheckAuth = useCallback(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    stableCheckAuth();
  }, [stableCheckAuth]);

  // Show loading only when checking auth and no user exists
  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <CustomCursor />
      <Routes>
        <Route
          path="/"
          element={
            !authUser || !authUser.isVerified
              ? <Initial />
              : authUser.roles?.isCreator 
                ? <Navigate to="/c/home" replace />
                : <Navigate to="/s/home" replace />
          }
        />
        
        {/* Supporter Routes */}
        <Route path='/s/home' element={<SupporterRoute><Home /></SupporterRoute>} />
        <Route path='/s/explore' element={<SupporterRoute><Home /></SupporterRoute>} />
        <Route path='/s/notifications' element={<SupporterRoute><Home /></SupporterRoute>} />
        <Route path='/s/settings' element={<SupporterRoute><Home /></SupporterRoute>} />
        
        {/* Creator Routes */}
        <Route path='/c/home' element={<CreatorRoute><CreatorHome /></CreatorRoute>} />
        <Route path='/c/projects' element={<CreatorRoute><CreatorHome /></CreatorRoute>} />
        <Route path='/c/analytics' element={<CreatorRoute><CreatorHome /></CreatorRoute>} />
        <Route path='/c/supporters' element={<CreatorRoute><CreatorHome /></CreatorRoute>} />
        <Route path='/c/settings' element={<CreatorRoute><CreatorHome /></CreatorRoute>} />
        
        {/* Become Creator Route */}
        <Route path='/becomecreator' element={<BecomeCreatorRoute><BecomeCreator /></BecomeCreatorRoute>} />
        
        {/* Auth Routes */}
        <Route path='/login' element={<RedirectAuthenticatedUser><Login /></RedirectAuthenticatedUser>} />
        <Route path='/signup' element={<RedirectAuthenticatedUser><Signup /></RedirectAuthenticatedUser>} />
        <Route path='/verifyemail' element={<EmailVerificationRoute><EmailVerification /></EmailVerificationRoute>} />
        <Route path='/forgotpassword' element={<RedirectAuthenticatedUser><ForgotPasswordPage /></RedirectAuthenticatedUser>} />
        <Route
          path='/resetpassword/:token'
          element={
            <RedirectAuthenticatedUser>
              <ResetPasswordPage />
            </RedirectAuthenticatedUser>
          }
        />
        
        {/* catch all routes */}
        <Route path='/s' element={<Navigate to='/s/home' replace />} />
        <Route path='/c' element={<Navigate to='/c/home' replace />} />
        <Route path='*' element={<Navigate to='/' replace />} />
      </Routes>
      <Toaster />
    </>
  )
}

export default App

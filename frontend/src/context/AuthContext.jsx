import { useContext, createContext, useState, useEffect } from "react";
import axios from "axios";

import {
  GoogleAuthProvider,
  signInWithRedirect,
  signInWithPopup,
  getRedirectResult,
  signOut,
} from "firebase/auth";

import { auth } from "../firebase/firebase.config";

import getBaseUrl from "../utils/baseURL";

import {
  clearAllAuthSessions,
  clearUserSession,
  saveUserSession,
  USER_TOKEN_KEY,
} from "../utils/authStorage";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

const googleProvider = new GoogleAuthProvider();

export const AuthProvide = ({ children }) => {

  const [currentUser, setCurrentUser] = useState(null);

  const [loading, setLoading] = useState(true);

  // Restore user from token
  const syncUserFromToken = async () => {

    const token = localStorage.getItem(USER_TOKEN_KEY);

    if (!token) {
      setCurrentUser(null);
      setLoading(false);
      return;
    }

    try {

      const response = await axios.get(
        `${getBaseUrl()}/api/auth/me`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCurrentUser(response.data.user);

    } catch (error) {

      console.error("[AUTH] Failed to restore user session", {
        status: error?.response?.status,
        message: error?.response?.data?.message || error.message,
      });

      clearUserSession();

      setCurrentUser(null);

    } finally {

      setLoading(false);

    }
  };

  // Handle Google redirect login
  const handleGoogleRedirect = async () => {
    if (!auth) {
      return;
    }

    try {

      const result = await getRedirectResult(auth);

      if (result?.user) {

        const googleUser = result.user;

        const response = await axios.post(
          `${getBaseUrl()}/api/auth/google`,
          {
            email: googleUser.email,

            username:
              googleUser.displayName ||
              googleUser.email?.split("@")[0],
          }
        );

        saveUserSession(response.data);

        setCurrentUser({
          ...response.data.user,

          displayName:
            googleUser.displayName ||
            response.data.user?.username,

          photoURL: googleUser.photoURL || "",
        });

        // Safely redirect to homepage if user gets stuck on login/register screens during redirect flow
        if (
          window.location.pathname === "/login" ||
          window.location.pathname === "/register" ||
          window.location.pathname === "/signup"
        ) {
          window.location.replace("/");
        }
      }

    } catch (error) {

      console.error("[GOOGLE_REDIRECT_ERROR]", error);

    }
  };

  useEffect(() => {

    handleGoogleRedirect();

    syncUserFromToken();

  }, []);

  // Register
  const registerUser = async (email, password, username) => {

    const response = await axios.post(
      `${getBaseUrl()}/api/auth/register`,
      {
        email: email.trim(),
        password,
        username: username.trim(),
      }
    );

    saveUserSession(response.data);

    setCurrentUser(response.data.user);

    return response.data;
  };

  // Login
  const loginUser = async (email, password) => {

    const response = await axios.post(
      `${getBaseUrl()}/api/auth/login`,
      {
        email: email.trim(),
        password,
      }
    );

    saveUserSession(response.data);

    setCurrentUser(response.data.user);

    return response.data;
  };

  // Google Login
  const signInWithGoogle = async () => {
    if (!auth) {
      alert("Google Sign-In is not configured. Please use a regular account to log in, or set up Firebase environment variables.");
      return;
    }

    try {

      const popupResult = await signInWithPopup(auth, googleProvider);
      const googleUser = popupResult.user;

      const response = await axios.post(
        `${getBaseUrl()}/api/auth/google`,
        {
          email: googleUser.email,
          username:
            googleUser.displayName ||
            googleUser.email?.split("@")[0],
        }
      );

      saveUserSession(response.data);

      setCurrentUser({
        ...response.data.user,
        displayName:
          googleUser.displayName ||
          response.data.user?.username,
        photoURL: googleUser.photoURL || "",
      });

      return response.data;

    } catch (error) {

      console.error("[GOOGLE_SIGNIN_ERROR]", error);

      throw error;
    }
  };

  // Logout
  const logout = async () => {
    if (auth) {
      await signOut(auth).catch(() => {});
    }

    clearAllAuthSessions();

    setCurrentUser(null);
  };

  const value = {
    currentUser,
    loading,
    registerUser,
    loginUser,
    signInWithGoogle,
    logout,
    refreshCurrentUser: syncUserFromToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
import { useContext, createContext, useState, useEffect } from "react";
import axios from "axios";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { auth } from "../firebase/firebase.congif";
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

  const syncUserFromToken = async () => {
    const token = localStorage.getItem(USER_TOKEN_KEY);

    if (!token) {
      setCurrentUser(null);
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`${getBaseUrl()}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

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

  useEffect(() => {
    syncUserFromToken();
  }, []);

  const registerUser = async (email, password, username) => {
  const response = await axios.post(`${getBaseUrl()}/api/auth/register`, {
    email: email.trim(),
    password,
    username: username.trim(),
  });

  return response.data;
};

  const loginUser = async (email, password) => {
    const response = await axios.post(`${getBaseUrl()}/api/auth/login`, {
      email: email.trim(),
      password,
    });

    saveUserSession(response.data);
    setCurrentUser(response.data.user);
    return response.data;
  };

  const signInWithGoogle = async () => {
    const popupResult = await signInWithPopup(auth, googleProvider);
    const googleUser = popupResult.user;

    const response = await axios.post(`${getBaseUrl()}/api/auth/google`, {
      email: googleUser.email,
      username: googleUser.displayName || googleUser.email?.split("@")[0],
    });

    saveUserSession(response.data);
    setCurrentUser({
      ...response.data.user,
      displayName: googleUser.displayName || response.data.user?.username,
      photoURL: googleUser.photoURL || "",
    });

    return response.data;
  };

  const logout = async () => {
    await signOut(auth).catch(() => {});
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

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

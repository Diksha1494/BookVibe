import { useContext, createContext, useState, useEffect } from "react";
import axios from "axios";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { auth } from "../firebase/firebase.congif";
import getBaseUrl from "../utils/baseURL";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

const googleProvider = new GoogleAuthProvider();
const USER_TOKEN_KEY = "userToken";
const ADMIN_TOKEN_KEY = "token";

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
      localStorage.removeItem(USER_TOKEN_KEY);
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
    email,
    password,
    username,
  });

  return response.data;
};

  const loginUser = async (email, password) => {
    const response = await axios.post(`${getBaseUrl()}/api/auth/login`, {
      email,
      password,
    });

    localStorage.setItem(USER_TOKEN_KEY, response.data.token);
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

    localStorage.setItem(USER_TOKEN_KEY, response.data.token);
    setCurrentUser({
      ...response.data.user,
      displayName: googleUser.displayName || response.data.user?.username,
      photoURL: googleUser.photoURL || "",
    });

    return response.data;
  };

  const logout = async () => {
    await signOut(auth).catch(() => {});
    localStorage.removeItem(USER_TOKEN_KEY);
    localStorage.removeItem(ADMIN_TOKEN_KEY);
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

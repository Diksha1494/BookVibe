import React, { useEffect, useState } from "react";
import axios from "axios";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import Loading from "../components/Loading";
import getBaseUrl from "../utils/baseURL";
import { clearAdminSession, getAdminToken, saveAdminSession } from "../utils/authStorage";

const AdminRoute = ({ children }) => {
  const location = useLocation();
  const [status, setStatus] = useState("checking");

  useEffect(() => {
    const token = getAdminToken();

    if (!token) {
      setStatus("unauthenticated");
      return;
    }

    const verifyAdmin = async () => {
      try {
        const response = await axios.get(`${getBaseUrl()}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const user = response.data?.user;
        if (user?.role !== "admin") {
          clearAdminSession();
          setStatus("forbidden");
          return;
        }

        saveAdminSession({ token, user });
        setStatus("authenticated");
      } catch (error) {
        console.error("[ADMIN_ROUTE] Token verification failed", {
          status: error?.response?.status,
          message: error?.response?.data?.message || error.message,
        });
        clearAdminSession();
        setStatus("unauthenticated");
      }
    };

    verifyAdmin();
  }, []);

  if (status === "checking") {
    return <Loading />;
  }

  if (status !== "authenticated") {
    return <Navigate to="/admin" replace state={{ from: location }} />;
  }

  return children || <Outlet />;
};

export default AdminRoute;

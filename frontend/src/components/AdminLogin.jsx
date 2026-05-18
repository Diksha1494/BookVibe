import React, { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import axios from "axios";
import getBaseUrl from '../utils/baseURL';
import { useNavigate } from 'react-router-dom';
import './AdminLogin.css';
import { clearAdminSession, getAdminToken, saveAdminSession } from '../utils/authStorage';

const AdminLogin = () => {
    const [message, setMessage] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const navigate = useNavigate();

    useEffect(() => {
        const token = getAdminToken();
        if (!token) return;

        const verifyExistingAdmin = async () => {
            try {
                const response = await axios.get(`${getBaseUrl()}/api/auth/me`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (response.data?.user?.role === "admin") {
                    navigate("/dashboard", { replace: true });
                }
            } catch {
                clearAdminSession();
            }
        };

        verifyExistingAdmin();
    }, [navigate]);

    const onSubmit = async (data) => {
        try {
            setSubmitting(true);
            setMessage("");
            const response = await axios.post(`${getBaseUrl()}/api/auth/admin`, data, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            const auth = response.data;

            if (auth.token) {
                saveAdminSession(auth);
            }

            navigate("/dashboard");

        } catch (error) {
            const status = error?.response?.status;
            const detail = error?.response?.data?.message;
            setMessage(detail || (status === 401 ? "Invalid admin email or password." : "Admin login failed. Please try again."));
            console.error("[ADMIN_LOGIN_UI]", {
                status,
                message: detail || error.message,
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="admin-container">
            <div className="admin-form-box">
                <h2>Admin Dashboard Login</h2>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div>
                        <label className="admin-label" htmlFor="email">Email</label>
                        <input
                            {...register("email", { required: true })}
                            type="email"
                            name="email"
                            id="email"
                            placeholder="admin@gmail.com"
                            className="admin-input"
                        />
                        {errors.email && <p className="admin-error">Email is required.</p>}
                    </div>

                    <div>
                        <label className="admin-label" htmlFor="password">Password</label>
                        <input
                            {...register("password", { required: true })}
                            type="password"
                            name="password"
                            id="password"
                            placeholder="Password"
                            className="admin-input"
                        />
                        {errors.password && <p className="admin-error">Password is required.</p>}
                    </div>

                    {message && <p className="admin-error">{message}</p>}

                    <div>
                        <button className="admin-button" type="submit" disabled={submitting}>
                            {submitting ? "Logging in..." : "Login"}
                        </button>
                    </div>
                </form>

                <p className="admin-footer">Copyright 2025 BookVibe. All rights reserved.</p>
            </div>
        </div>
    );
};

export default AdminLogin;

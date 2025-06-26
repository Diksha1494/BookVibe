import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import axios from "axios";
import getBaseUrl from '../utils/baseURL';
import { useNavigate } from 'react-router-dom';
import './AdminLogin.css'; // 👈 Import the custom CSS

const AdminLogin = () => {
    const [message, setMessage] = useState("");
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const navigate = useNavigate();

    const onSubmit = async (data) => {
        try {
            const response = await axios.post(`${getBaseUrl()}/api/auth/admin`, data, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            const auth = response.data;

            if (auth.token) {
                localStorage.setItem('token', auth.token);
                setTimeout(() => {
                    localStorage.removeItem('token');
                    alert('Token has expired! Please login again.');
                    navigate("/");
                }, 3600 * 1000);
            }

            alert("Admin login successful!");
            navigate("/dashboard");

        } catch (error) {
            setMessage("Please provide a valid email and password");
            console.error(error);
        }
    };

    return (
        <div className="admin-container">
            <div className="admin-form-box">
                <h2>Admin Dashboard Login</h2>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div>
                        <label className="admin-label" htmlFor="username">Username</label>
                        <input
                            {...register("username", { required: true })}
                            type="text"
                            name="username"
                            id="username"
                            placeholder="Username"
                            className="admin-input"
                        />
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
                    </div>

                    {message && <p className="admin-error">{message}</p>}

                    <div>
                        <button className="admin-button" type="submit">Login</button>
                    </div>
                </form>

                <p className="admin-footer">©2025 Book Store. All rights reserved.</p>
            </div>
        </div>
    );
};

export default AdminLogin;

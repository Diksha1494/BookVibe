// DashboardLayout.jsx
import axios from 'axios';
import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { HiViewGridAdd } from "react-icons/hi";
import { MdOutlineManageHistory } from "react-icons/md";
import './DashboardLayout.css'; // Import CSS file

const DashboardLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate("/");
  };

  return (
    <section className="dashboard-layout">
      <aside className="dashboard-sidebar">
        <a href="/" className="logo-link">
          <img src="/fav-icon.png" alt="Logo" />
        </a>
        <div className="sidebar-menu">
          <nav className="nav-links">
            <Link to="/dashboard" className="nav-link active">Dashboard</Link>
            <Link to="/dashboard/add-new-book" className="nav-link">
              <HiViewGridAdd />
            </Link>
            <Link to="/dashboard/manage-books" className="nav-link">
              <MdOutlineManageHistory />
            </Link>
          </nav>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </aside>

      <div className="dashboard-main">
        <header className="dashboard-header">
          <div className="search-box">
            <input type="text" placeholder="Search..." />
          </div>
          <div className="user-info">
            <span className="user-name">Diksha Rai</span>
            <span className="user-role">Undergraduate </span>
            <img src="/pic.jpg" alt="User" className="user-avatar" />
          </div>
        </header>

        <main className="dashboard-content">
          <div className="dashboard-header-content">
            <h1>Dashboard</h1>
            <h2>Book Store Inventory</h2>
            <div className="dashboard-actions">
              <Link to="/dashboard/manage-books" className="btn outline">Manage Books</Link>
              <Link to="/dashboard/add-new-book" className="btn primary">Add New Book</Link>
            </div>
          </div>
          <Outlet />
        </main>
      </div>
    </section>
  );
};

export default DashboardLayout;
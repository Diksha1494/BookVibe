import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Loading from '../../components/Loading';
import getBaseUrl from '../../utils/baseURL';
import { MdIncompleteCircle } from 'react-icons/md';
import RevenueChart from './RevenueChart';
import './Dashboard.css';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${getBaseUrl()}/api/admin`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        });
        setData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchData();
  }, []);

  if (loading) return <Loading />;

  return (
    <>
      <section className="dashboard-grid">
        <div className="card purple">
          <div className="icon-circle">
            📚
          </div>
          <div>
            <span className="stat-number">{data?.totalBooks}</span>
            <span className="stat-label">Products</span>
          </div>
        </div>

        <div className="card green">
          <div className="icon-circle">
            💰
          </div>
          <div>
            <span className="stat-number">${data?.totalSales}</span>
            <span className="stat-label">Total Sales</span>
          </div>
        </div>

        <div className="card red">
          <div className="icon-circle">
            📈
          </div>
          <div>
            <span className="stat-number">{data?.trendingBooks}</span>
            <span className="trend-percent">(13%)</span>
            <div className="stat-label">Trending Books This Month</div>
          </div>
        </div>

        <div className="card blue">
          <div className="icon-circle">
            <MdIncompleteCircle className="icon" />
          </div>
          <div>
            <span className="stat-number">{data?.totalOrders}</span>
            <span className="stat-label">Total Orders</span>
          </div>
        </div>
      </section>

      <section className="dashboard-layout">
        <div className="chart-box wide-tall">
          <div className="chart-title">The number of orders per month</div>
          <div className="chart-body">
            <RevenueChart />
          </div>
        </div>

        <div className="card yellow">
          <div className="icon-circle">📦</div>
          <div>
            <span className="stat-number">02</span>
            <span className="stat-label">Orders left</span>
          </div>
        </div>

        <div className="card teal">
          <div className="icon-circle">👀</div>
          <div>
            <span className="stat-number">139</span>
            <span className="stat-label">Website visits (last day)</span>
          </div>
        </div>

        <div className="user-list tall">
          <div className="chart-title">
            <span>Users by average order</span>
          </div>
          <ul className="user-items">
            {[
              { name: "Annette Watson", score: 9.3, img: 82 },
              { name: "Calvin Steward", score: 8.9, img: 81 },
              { name: "Ralph Richards", score: 8.7, img: 80 },
              { name: "Bernard Murphy", score: 8.2, img: 79 },
              { name: "Arlene Robertson", score: 8.2, img: 78 },
              { name: "Jane Lane", score: 8.1, img: 77 },
              { name: "Pat Mckinney", score: 7.9, img: 76 },
              { name: "Norman Walters", score: 7.7, img: 75 },
            ].map(user => (
              <li key={user.name} className="user-item">
                <img src={`https://randomuser.me/api/portraits/${user.name.includes("Annette") || user.name.includes("Jane") || user.name.includes("Arlene") ? 'women' : 'men'}/${user.img}.jpg`} alt={user.name} />
                <span>{user.name}</span>
                <span className="score">{user.score}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="chart-box tall">
          <div className="chart-title">Students by type of studying</div>
          <div className="chart-body">Chart</div>
        </div>
      </section>

      <footer className="dashboard-footer">
        <a href="#" className="link">Recreated on Codepen</a> with <a href="https://tailwindcss.com/" className="link">Tailwind CSS</a> by Azri Kahar,
        <a href="https://dribbble.com/shots/10711741-Free-UI-Kit-for-Figma-Online-Courses-Dashboard" className="link"> original design</a> by Chili Labs
      </footer>
    </>
  );
};

export default Dashboard;

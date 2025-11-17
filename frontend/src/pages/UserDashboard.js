import React, { useState, useEffect } from 'react';
import '../styles/Dashboard.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import RaiseRequest from '../components/RaiseRequest';
import ReviewRequest from '../components/ReviewRequest';
import CloseRequest from '../components/CloseRequest';
import HelpSection from '../components/HelpSection';
import UserProfile from '../components/UserProfile';

const UserDashboard = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('raise');
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/user-auth');
      return;
    }

    fetchUserData();
  }, [navigate]);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/users/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserData(response.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    localStorage.removeItem('userId');
    navigate('/');
  };

  if (!userData) {
    return <div className="dashboard loading">Loading...</div>;
  }

  return (
    <div className="dashboard user-dashboard">
      <nav className="dashboard-nav">
        <div className="nav-brand">
          <h2>📋 Citizen Portal</h2>
        </div>
        <ul className="nav-links">
          <li>
            <button
              className={`nav-btn ${activeSection === 'raise' ? 'active' : ''}`}
              onClick={() => setActiveSection('raise')}
            >
              ➕ Raise Request
            </button>
          </li>
          <li>
            <button
              className={`nav-btn ${activeSection === 'review' ? 'active' : ''}`}
              onClick={() => setActiveSection('review')}
            >
              🔍 Review Request
            </button>
          </li>
          <li>
            <button
              className={`nav-btn ${activeSection === 'close' ? 'active' : ''}`}
              onClick={() => setActiveSection('close')}
            >
              ✅ Close Request
            </button>
          </li>
          <li>
            <button
              className={`nav-btn ${activeSection === 'help' ? 'active' : ''}`}
              onClick={() => setActiveSection('help')}
            >
              ℹ️ Help & Support
            </button>
          </li>
          <li>
            <button
              className={`nav-btn ${activeSection === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveSection('profile')}
            >
              👤 Profile
            </button>
          </li>
        </ul>
        <button className="logout-btn" onClick={handleLogout}>
          🚪 Logout
        </button>
      </nav>

      <main className="dashboard-content">
        {activeSection === 'raise' && <RaiseRequest />}
        {activeSection === 'review' && <ReviewRequest />}
        {activeSection === 'close' && <CloseRequest />}
        {activeSection === 'help' && <HelpSection />}
        {activeSection === 'profile' && <UserProfile userData={userData} onUpdate={fetchUserData} />}
      </main>
    </div>
  );
};

export default UserDashboard;

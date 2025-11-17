import React, { useState } from 'react';
import '../styles/LandingPage.css';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleUserClick = () => {
    navigate('/user-auth');
  };

  const handleAdminClick = () => {
    navigate('/admin-auth');
  };

  return (
    <div className="landing-page">
      <div className="landing-container">
        <div className="landing-header">
          <h1>Citizen Request Management System</h1>
          <p>Efficient Service Delivery at Your Fingertips</p>
        </div>

        <div className="landing-content">
          <div className="landing-description">
            <p>
              Welcome to the Citizen Request Management System. Choose your role to proceed with
              registration or login.
            </p>
          </div>

          <div className="role-selection">
            <div className="role-card user-card" onClick={handleUserClick}>
              <div className="role-icon">👤</div>
              <h2>Citizen</h2>
              <p>Raise and track your requests for civic services</p>
              <button className="role-button">Continue as Citizen</button>
            </div>

            <div className="role-card admin-card" onClick={handleAdminClick}>
              <div className="role-icon">⚙️</div>
              <h2>Administrator</h2>
              <p>Manage and process citizen requests</p>
              <button className="role-button">Continue as Admin</button>
            </div>
          </div>
        </div>

        <div className="landing-footer">
          <p>&copy; 2024 Citizen Request Management System. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;

import React, { useState, useEffect } from 'react';
import '../styles/Dashboard.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminRaisedRequests from '../components/AdminRaisedRequests';
import AdminAllocateWork from '../components/AdminAllocateWork';
import AdminUpdateStatus from '../components/AdminUpdateStatus';
import AdminProfile from '../components/AdminProfile';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('raised');
  const [adminData, setAdminData] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/admin-auth');
      return;
    }

    fetchAdminData();
  }, [navigate]);

  const fetchAdminData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/admins/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAdminData(response.data);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    localStorage.removeItem('adminId');
    localStorage.removeItem('department');
    navigate('/');
  };

  if (!adminData) {
    return <div className="dashboard loading">Loading...</div>;
  }

  return (
    <div className="dashboard admin-dashboard">
      <nav className="dashboard-nav admin-nav">
        <div className="nav-brand">
          <h2>⚙️ Administrator Portal</h2>
          <p className="department-info">Department: {adminData.department}</p>
        </div>
        <ul className="nav-links">
          <li>
            <button
              className={`nav-btn ${activeSection === 'raised' ? 'active' : ''}`}
              onClick={() => setActiveSection('raised')}
            >
              📥 Raised Requests
            </button>
          </li>
          <li>
            <button
              className={`nav-btn ${activeSection === 'allocate' ? 'active' : ''}`}
              onClick={() => setActiveSection('allocate')}
            >
              👥 Allocate Work
            </button>
          </li>
          <li>
            <button
              className={`nav-btn ${activeSection === 'update' ? 'active' : ''}`}
              onClick={() => setActiveSection('update')}
            >
              📊 Update Status
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
        {activeSection === 'raised' && <AdminRaisedRequests />}
        {activeSection === 'allocate' && <AdminAllocateWork />}
        {activeSection === 'update' && <AdminUpdateStatus />}
        {activeSection === 'profile' && <AdminProfile adminData={adminData} onUpdate={fetchAdminData} />}
      </main>
    </div>
  );
};

export default AdminDashboard;

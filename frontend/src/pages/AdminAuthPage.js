import React, { useState } from 'react';
import '../styles/AuthPage.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminAuthPage = () => {
  const navigate = useNavigate();
  const [authMode, setAuthMode] = useState('login');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    department: '',
    phone: '',
    designation: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const departments = ['electricity', 'water', 'agriculture', 'law', 'medical', 'services'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('/api/auth/admin/login', {
        email: formData.email,
        password: formData.password,
      });

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userType', 'admin');
      localStorage.setItem('adminId', response.data.admin.id);
      localStorage.setItem('department', response.data.admin.department);
      navigate('/admin-dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('/api/auth/admin/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        department: formData.department,
        phone: formData.phone,
        designation: formData.designation,
      });

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userType', 'admin');
      localStorage.setItem('adminId', response.data.admin.id);
      localStorage.setItem('department', response.data.admin.department);
      navigate('/admin-dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header admin-header">
          <h1>Administrator Portal</h1>
          <p>{authMode === 'login' ? 'Sign In' : 'Create Admin Account'}</p>
        </div>

        <div className="auth-toggle">
          <button
            className={`toggle-btn ${authMode === 'login' ? 'active' : ''}`}
            onClick={() => setAuthMode('login')}
          >
            Sign In
          </button>
          <button
            className={`toggle-btn ${authMode === 'register' ? 'active' : ''}`}
            onClick={() => setAuthMode('register')}
          >
            Register
          </button>
        </div>

        <form onSubmit={authMode === 'login' ? handleLogin : handleRegister} className="auth-form">
          {error && <div className="error-message">{error}</div>}

          {authMode === 'register' && (
            <>
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="form-group">
                <label>Designation *</label>
                <input
                  type="text"
                  name="designation"
                  value={formData.designation}
                  onChange={handleInputChange}
                  placeholder="e.g., Senior Officer"
                  required
                />
              </div>

              <div className="form-group">
                <label>Department *</label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select a Department</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept.charAt(0).toUpperCase() + dept.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Phone *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter your phone number"
                  required
                />
              </div>
            </>
          )}

          <div className="form-group">
            <label>Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label>Password *</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
              required
            />
          </div>

          {authMode === 'register' && (
            <div className="form-group">
              <label>Confirm Password *</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm your password"
                required
              />
            </div>
          )}

          <button type="submit" className="submit-btn admin-btn" disabled={loading}>
            {loading ? 'Processing...' : authMode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="auth-footer">
          <button className="back-btn" onClick={() => navigate('/')}>
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminAuthPage;

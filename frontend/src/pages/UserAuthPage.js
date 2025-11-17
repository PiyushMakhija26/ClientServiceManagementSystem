import React, { useState } from 'react';
import '../styles/AuthPage.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const UserAuthPage = () => {
  const navigate = useNavigate();
  const [authMode, setAuthMode] = useState('login');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    address: '',
    state: '',
    city: '',
    phone: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('/api/auth/user/login', {
        email: formData.email,
        password: formData.password,
      });

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userType', 'user');
      localStorage.setItem('userId', response.data.user.id);
      navigate('/user-dashboard');
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
      const response = await axios.post('/api/auth/user/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        address: formData.address,
        state: formData.state,
        city: formData.city,
        phone: formData.phone,
      });

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userType', 'user');
      localStorage.setItem('userId', response.data.user.id);
      navigate('/user-dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h1>Citizen Portal</h1>
          <p>{authMode === 'login' ? 'Sign In' : 'Create Account'}</p>
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
            <>
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

              <div className="form-row">
                <div className="form-group">
                  <label>Address *</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Enter your address"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>State *</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    placeholder="Enter your state"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>City *</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="Enter your city"
                  required
                />
              </div>
            </>
          )}

          <button type="submit" className="submit-btn" disabled={loading}>
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

export default UserAuthPage;

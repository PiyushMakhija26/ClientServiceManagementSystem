import React, { useState } from 'react';
import axios from 'axios';

const UserProfile = ({ userData, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(userData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      await axios.put('/api/users/profile', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSuccess('Profile updated successfully!');
      setIsEditing(false);
      onUpdate();
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="content-section">
      <h2 className="section-header">👤 Your Profile</h2>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <div style={{ background: '#f9f9f9', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
        <div className="form-group">
          <label>Full Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            disabled={!isEditing}
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input type="email" value={formData.email} disabled />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone || ''}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </div>

          <div className="form-group">
            <label>Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>State</label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </div>

          <div className="form-group">
            <label>City</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </div>
        </div>

        {isEditing && (
          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button className="btn" onClick={handleSave} disabled={loading}>
              {loading ? 'Saving...' : '💾 Save Changes'}
            </button>
            <button className="btn secondary" onClick={() => setIsEditing(false)}>
              ❌ Cancel
            </button>
          </div>
        )}

        {!isEditing && (
          <button className="btn" onClick={() => setIsEditing(true)} style={{ marginTop: '20px' }}>
            ✏️ Edit Profile
          </button>
        )}
      </div>

      <div style={{ padding: '20px', background: '#f0f8ff', borderRadius: '8px', marginTop: '20px' }}>
        <h3>Account Information</h3>
        <p>
          <strong>Account Created:</strong> {new Date(formData.createdAt).toLocaleDateString()}
        </p>
        <p>
          <strong>User Type:</strong> Citizen
        </p>
        <p>
          <strong>Account Status:</strong> <span style={{ color: 'green' }}>● Active</span>
        </p>
      </div>
    </div>
  );
};

export default UserProfile;

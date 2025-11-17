import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminAllocateWork = () => {
  const [requests, setRequests] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedAdmin, setSelectedAdmin] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    fetchRequests();
    fetchAdmins();
  }, []);

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/requests/admin/raised', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRequests(response.data.filter((req) => !req.allocatedTo));
    } catch (err) {
      setError('Error fetching requests');
    } finally {
      setLoading(false);
    }
  };

  const fetchAdmins = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/admins/department', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAdmins(response.data.filter((admin) => admin._id !== localStorage.getItem('adminId')));
    } catch (err) {
      console.error('Error fetching admins:', err);
    }
  };

  const handleAllocate = async (requestId) => {
    if (!selectedAdmin) {
      alert('Please select an admin to allocate this request');
      return;
    }

    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `/api/requests/${requestId}/allocate`,
        { allocatedToAdminId: selectedAdmin },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess('Request allocated successfully!');
      setSelectedAdmin('');
      fetchRequests();
      setExpandedId(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Error allocating request');
    }
  };

  if (loading) return <div className="content-section">Loading...</div>;

  return (
    <div className="content-section">
      <h2 className="section-header">👥 Allocate Work to Admins</h2>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      {admins.length === 0 && (
        <div className="empty-state">
          <p>No other admins in your department to allocate work to.</p>
        </div>
      )}

      {requests.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📋</div>
          <p>All requests have been allocated or no unallocated requests found.</p>
        </div>
      ) : (
        <div className="requests-list">
          {requests.map((req) => (
            <div key={req._id} className="request-card">
              <div className="request-card-header">
                <div>
                  <div className="request-id">ID: {req._id.substring(0, 8)}</div>
                  <div className="request-title">{req.title}</div>
                </div>
                <span className="request-status status-raised">Unallocated</span>
              </div>

              <div className="request-desc">{req.description}</div>

              {expandedId === req._id && (
                <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px solid #e0e0e0' }}>
                  <div className="form-group">
                    <label>Allocate to:</label>
                    <select value={selectedAdmin} onChange={(e) => setSelectedAdmin(e.target.value)}>
                      <option value="">Select an Admin</option>
                      {admins.map((admin) => (
                        <option key={admin._id} value={admin._id}>
                          {admin.name} - {admin.designation}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    className="btn"
                    onClick={() => handleAllocate(req._id)}
                    style={{ marginTop: '10px' }}
                  >
                    ✅ Allocate
                  </button>
                </div>
              )}

              <button
                className="btn secondary"
                onClick={() => setExpandedId(expandedId === req._id ? null : req._id)}
                style={{ marginTop: '10px' }}
              >
                {expandedId === req._id ? '▲ Cancel' : '⬇️ Allocate'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminAllocateWork;

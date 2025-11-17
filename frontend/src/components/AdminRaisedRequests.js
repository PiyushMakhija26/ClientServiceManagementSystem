import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminRaisedRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    fetchRaisedRequests();
  }, []);

  const fetchRaisedRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/requests/admin/raised', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRequests(response.data);
    } catch (err) {
      setError('Error fetching raised requests');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="content-section">Loading...</div>;
  if (error) return <div className="content-section error-message">{error}</div>;

  return (
    <div className="content-section">
      <h2 className="section-header">📥 Raised Requests</h2>

      {requests.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📋</div>
          <p>No raised requests in your department at the moment.</p>
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
                <span className={`request-status status-${req.status.replace(/_/g, '-')}`}>
                  {req.status}
                </span>
              </div>

              <div className="request-desc">{req.description}</div>

              <div className="request-meta">
                <span>📅 {new Date(req.createdAt).toLocaleDateString()}</span>
                <span>👤 {req.userId.name}</span>
                <span>📍 {req.userId.city}, {req.userId.state}</span>
              </div>

              {expandedId === req._id && (
                <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px solid #e0e0e0' }}>
                  <h4>Citizen Details:</h4>
                  <p>
                    <strong>Name:</strong> {req.userId.name}
                  </p>
                  <p>
                    <strong>Email:</strong> {req.userId.email}
                  </p>
                  <p>
                    <strong>Address:</strong> {req.userId.address}
                  </p>
                  <p>
                    <strong>Phone:</strong> {req.userId.phone || 'Not provided'}
                  </p>
                </div>
              )}

              <button
                className="btn secondary"
                onClick={() => setExpandedId(expandedId === req._id ? null : req._id)}
                style={{ marginTop: '10px' }}
              >
                {expandedId === req._id ? '▲ Hide Details' : '▼ View Citizen Info'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminRaisedRequests;

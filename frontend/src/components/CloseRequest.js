import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CloseRequest = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCompletedRequests();
  }, []);

  const fetchCompletedRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/requests/user/completed', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRequests(response.data);
    } catch (err) {
      setError('Error fetching completed requests');
    } finally {
      setLoading(false);
    }
  };

  const closeRequest = async (requestId) => {
    if (window.confirm('Are you sure you want to close this request? This action cannot be undone.')) {
      try {
        const token = localStorage.getItem('token');
        await axios.put(`/api/requests/${requestId}/close`, {}, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert('Request closed successfully!');
        fetchCompletedRequests();
      } catch (err) {
        alert('Error closing request');
      }
    }
  };

  if (loading) return <div className="content-section">Loading...</div>;
  if (error) return <div className="content-section error-message">{error}</div>;

  const completedRequests = requests.filter((req) => req.status !== 'closed');
  const closedRequests = requests.filter((req) => req.status === 'closed');

  return (
    <div className="content-section">
      <h2 className="section-header">✅ Close Completed Requests</h2>

      {completedRequests.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📋</div>
          <p>No completed requests awaiting closure.</p>
        </div>
      ) : (
        <>
          <h3>Ready to Close:</h3>
          <div className="requests-list">
            {completedRequests.map((req) => (
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
                  <span>🏢 {req.department}</span>
                </div>

                <button
                  className="btn"
                  onClick={() => closeRequest(req._id)}
                  style={{ marginTop: '10px' }}
                >
                  ✔️ Close This Request
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {closedRequests.length > 0 && (
        <>
          <h3 style={{ marginTop: '30px' }}>Previously Closed:</h3>
          <div className="requests-list">
            {closedRequests.map((req) => (
              <div key={req._id} className="request-card" style={{ opacity: 0.7 }}>
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
                  <span>🏢 {req.department}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default CloseRequest;

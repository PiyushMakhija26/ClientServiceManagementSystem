import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ReviewRequest = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/requests/user/all', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRequests(response.data);
    } catch (err) {
      setError('Error fetching requests');
    } finally {
      setLoading(false);
    }
  };

  const sendAlarm = async (requestId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `/api/requests/${requestId}/alarm`,
        { message: 'User requesting urgent attention' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Alarm sent to administrator!');
    } catch (err) {
      alert('Error sending alarm');
    }
  };

  if (loading) return <div className="content-section">Loading...</div>;
  if (error) return <div className="content-section error-message">{error}</div>;

  const activeRequests = requests.filter((req) => req.status !== 'closed');

  return (
    <div className="content-section">
      <h2 className="section-header">🔍 Review Your Requests</h2>

      {activeRequests.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📋</div>
          <p>No active requests found. Raise a new request to get started!</p>
        </div>
      ) : (
        <div className="requests-list">
          {activeRequests.map((req) => (
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
                {req.allocatedTo && <span>👤 Assigned to: {req.allocatedTo.name}</span>}
              </div>

              {expandedId === req._id && (
                <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px solid #e0e0e0' }}>
                  <h4>Status Updates:</h4>
                  {req.statusUpdates.length > 0 ? (
                    req.statusUpdates.map((update, idx) => (
                      <div key={idx} style={{ marginBottom: '10px', fontSize: '0.9em', color: '#666' }}>
                        <strong>{update.status}</strong> - {update.message}
                        <br />
                        <small>{new Date(update.timestamp).toLocaleString()}</small>
                      </div>
                    ))
                  ) : (
                    <p>No updates yet</p>
                  )}

                  {req.alarms.length > 0 && (
                    <>
                      <h4>Alarms Sent:</h4>
                      {req.alarms.map((alarm, idx) => (
                        <div key={idx} style={{ fontSize: '0.9em', color: '#d9534f' }}>
                          🚨 {new Date(alarm.sentAt).toLocaleString()}
                        </div>
                      ))}
                    </>
                  )}

                  <button className="btn" onClick={() => sendAlarm(req._id)} style={{ marginTop: '10px' }}>
                    🚨 Send Alarm to Admin
                  </button>
                </div>
              )}

              <button
                className="btn secondary"
                onClick={() => setExpandedId(expandedId === req._id ? null : req._id)}
                style={{ marginTop: '10px' }}
              >
                {expandedId === req._id ? '▲ Collapse' : '▼ Details'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewRequest;

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ReviewRequest = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [ratingModal, setRatingModal] = useState(null);
  const [ratingData, setRatingData] = useState({ score: '', feedback: '' });
  const [reopenModal, setReopenModal] = useState(null);
  const [reopenReason, setReopenReason] = useState('');

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

  const submitRating = async () => {
    if (!ratingData.score) {
      alert('Please select a rating');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `/api/requests/${ratingModal}/rate`,
        { score: ratingData.score, feedback: ratingData.feedback },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Thank you for rating! Your feedback helps us improve.');
      setRatingModal(null);
      setRatingData({ score: '', feedback: '' });
      fetchRequests();
    } catch (err) {
      alert('Error submitting rating: ' + err.response?.data?.message);
    }
  };

  const submitReopen = async () => {
    if (!reopenReason.trim()) {
      alert('Please provide a reason for reopening');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `/api/requests/${reopenModal}/reopen`,
        { reopenReason },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Request reopened successfully!');
      setReopenModal(null);
      setReopenReason('');
      fetchRequests();
    } catch (err) {
      alert('Error reopening request: ' + err.response?.data?.message);
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

              {req.rating?.score && (
                <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#f0f8ff', borderRadius: '5px', borderLeft: '4px solid #2196F3' }}>
                  <strong>Your Rating:</strong> {req.rating.score.toUpperCase()} ⭐
                  {req.rating.feedback && <p style={{ margin: '5px 0 0 0', fontSize: '0.9em' }}>"{req.rating.feedback}"</p>}
                </div>
              )}

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

              <div style={{ marginTop: '10px' }}>
                <button
                  className="btn secondary"
                  onClick={() => setExpandedId(expandedId === req._id ? null : req._id)}
                  style={{ marginRight: '10px' }}
                >
                  {expandedId === req._id ? '▲ Collapse' : '▼ Details'}
                </button>

                {['completed', 'closed'].includes(req.status) && !req.rating?.score && (
                  <button
                    className="btn"
                    onClick={() => setRatingModal(req._id)}
                    style={{ marginRight: '10px', backgroundColor: '#4CAF50' }}
                  >
                    ⭐ Rate Work
                  </button>
                )}

                {['completed', 'closed'].includes(req.status) && !req.reopenReason && (
                  <button
                    className="btn"
                    onClick={() => setReopenModal(req._id)}
                    style={{ backgroundColor: '#ff9800' }}
                  >
                    🔄 Reopen Request
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Rating Modal */}
      {ratingModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '10px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            maxWidth: '400px',
            width: '90%',
          }}>
            <h3>Rate This Work</h3>
            <p>How satisfied are you with the completed work?</p>

            <div style={{ marginBottom: '20px' }}>
              {['excellent', 'good', 'poor'].map((option) => (
                <label key={option} style={{ display: 'block', marginBottom: '10px' }}>
                  <input
                    type="radio"
                    name="rating"
                    value={option}
                    checked={ratingData.score === option}
                    onChange={(e) => setRatingData({ ...ratingData, score: e.target.value })}
                    style={{ marginRight: '10px' }}
                  />
                  <span style={{ textTransform: 'uppercase', fontWeight: 'bold' }}>{option}</span>
                </label>
              ))}
            </div>

            <textarea
              placeholder="Share your feedback (optional)"
              value={ratingData.feedback}
              onChange={(e) => setRatingData({ ...ratingData, feedback: e.target.value })}
              style={{
                width: '100%',
                padding: '10px',
                marginBottom: '15px',
                borderRadius: '5px',
                border: '1px solid #ddd',
                fontFamily: 'Arial',
                minHeight: '80px',
              }}
            />

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                className="btn secondary"
                onClick={() => {
                  setRatingModal(null);
                  setRatingData({ score: '', feedback: '' });
                }}
              >
                Cancel
              </button>
              <button className="btn" onClick={submitRating} style={{ backgroundColor: '#4CAF50' }}>
                Submit Rating
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reopen Modal */}
      {reopenModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '10px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            maxWidth: '400px',
            width: '90%',
          }}>
            <h3>Reopen Request</h3>
            <p>Why would you like to reopen this request? Please provide details so the admin can address your concerns.</p>

            <textarea
              placeholder="Reason for reopening..."
              value={reopenReason}
              onChange={(e) => setReopenReason(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                marginBottom: '15px',
                borderRadius: '5px',
                border: '1px solid #ddd',
                fontFamily: 'Arial',
                minHeight: '100px',
              }}
            />

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                className="btn secondary"
                onClick={() => {
                  setReopenModal(null);
                  setReopenReason('');
                }}
              >
                Cancel
              </button>
              <button className="btn" onClick={submitReopen} style={{ backgroundColor: '#ff9800' }}>
                Reopen Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewRequest;

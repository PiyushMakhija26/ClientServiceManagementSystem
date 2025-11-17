import React, { useState, useEffect } from 'react';
import axios from 'axios';

const HelpSection = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    fetchRecentRequests();
  }, []);

  const fetchRecentRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/requests/help/recent', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRequests(response.data);
    } catch (err) {
      console.error('Error fetching recent requests:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="content-section">Loading...</div>;

  return (
    <div className="content-section">
      <h2 className="section-header">ℹ️ Help & Support</h2>

      <div style={{ marginBottom: '30px', padding: '20px', background: '#f0f8ff', borderRadius: '8px' }}>
        <h3>📞 Contact Information</h3>
        <p>
          <strong>Emergency Helpline:</strong> 1800-XXX-XXXX
        </p>
        <p>
          <strong>Email Support:</strong> support@citizenrequest.gov
        </p>
        <p>
          <strong>Office Hours:</strong> Monday - Friday, 9:00 AM - 5:00 PM
        </p>
      </div>

      <h3>Recent Requests & Updates</h3>
      {requests.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📋</div>
          <p>No requests found. Start by raising a new request!</p>
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
                <span>📅 Last Updated: {new Date(req.updatedAt).toLocaleDateString()}</span>
                <span>🏢 {req.department}</span>
                {req.allocatedTo && <span>👤 Contact: {req.allocatedTo.phone || 'N/A'}</span>}
              </div>

              {expandedId === req._id && (
                <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px solid #e0e0e0' }}>
                  {req.allocatedTo && (
                    <>
                      <h4>Assigned Officer:</h4>
                      <p>
                        <strong>Name:</strong> {req.allocatedTo.name}
                      </p>
                      <p>
                        <strong>Department:</strong> {req.allocatedTo.department}
                      </p>
                      <p>
                        <strong>Phone:</strong> {req.allocatedTo.phone || 'Not available'}
                      </p>
                    </>
                  )}

                  <h4>Latest Updates:</h4>
                  {req.statusUpdates.length > 0 ? (
                    req.statusUpdates.slice(-3).map((update, idx) => (
                      <div key={idx} style={{ marginBottom: '10px', fontSize: '0.9em', color: '#666' }}>
                        <strong>{update.status}</strong> - {update.message}
                        <br />
                        <small>{new Date(update.timestamp).toLocaleString()}</small>
                      </div>
                    ))
                  ) : (
                    <p>No updates yet</p>
                  )}
                </div>
              )}

              <button
                className="btn secondary"
                onClick={() => setExpandedId(expandedId === req._id ? null : req._id)}
                style={{ marginTop: '10px' }}
              >
                {expandedId === req._id ? '▲ Collapse' : '▼ View Details'}
              </button>
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: '30px', padding: '20px', background: '#f0f0f0', borderRadius: '8px' }}>
        <h3>📋 Frequently Asked Questions</h3>
        <ul style={{ lineHeight: '1.8' }}>
          <li><strong>Q: How long does it take to resolve a request?</strong> A: Usually 5-7 business days.</li>
          <li><strong>Q: Can I modify my request after submitting?</strong> A: Contact the support team for modifications.</li>
          <li><strong>Q: How do I track my request?</strong> A: Use the "Review Request" section to check status.</li>
          <li><strong>Q: Is there an emergency option?</strong> A: Yes, use the alarm feature for urgent issues.</li>
        </ul>
      </div>
    </div>
  );
};

export default HelpSection;

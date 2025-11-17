import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminUpdateStatus = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [updateData, setUpdateData] = useState({
    status: '',
    message: '',
    clarificationMessage: '',
  });

  useEffect(() => {
    fetchAssignedRequests();
  }, []);

  const fetchAssignedRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/requests/admin/assigned', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRequests(response.data);
    } catch (err) {
      setError('Error fetching assigned requests');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (requestId) => {
    if (!updateData.status) {
      alert('Please select a status');
      return;
    }

    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `/api/requests/${requestId}/status`,
        updateData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess('Status updated successfully!');
      setUpdateData({ status: '', message: '', clarificationMessage: '' });
      fetchAssignedRequests();
      setExpandedId(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating status');
    }
  };

  if (loading) return <div className="content-section">Loading...</div>;

  const activeRequests = requests.filter((req) => req.status !== 'closed');

  return (
    <div className="content-section">
      <h2 className="section-header">📊 Update Request Status</h2>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      {activeRequests.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📋</div>
          <p>No active requests assigned to you.</p>
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
                <span>👤 {req.userId.name}</span>
              </div>

              {expandedId === req._id && (
                <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px solid #e0e0e0' }}>
                  <div className="form-group">
                    <label>Update Status to:</label>
                    <select
                      value={updateData.status}
                      onChange={(e) => setUpdateData((prev) => ({ ...prev, status: e.target.value }))}
                    >
                      <option value="">Select New Status</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="clarification-needed">Clarification Needed</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Update Message:</label>
                    <textarea
                      value={updateData.message}
                      onChange={(e) => setUpdateData((prev) => ({ ...prev, message: e.target.value }))}
                      placeholder="Brief message about the status update..."
                    />
                  </div>

                  {updateData.status === 'clarification-needed' && (
                    <div className="form-group">
                      <label>Clarification Message for Citizen:</label>
                      <textarea
                        value={updateData.clarificationMessage}
                        onChange={(e) =>
                          setUpdateData((prev) => ({ ...prev, clarificationMessage: e.target.value }))
                        }
                        placeholder="What clarification do you need from the citizen?"
                      />
                    </div>
                  )}

                  <button
                    className="btn"
                    onClick={() => handleStatusUpdate(req._id)}
                    style={{ marginTop: '10px' }}
                  >
                    ✅ Update Status
                  </button>
                </div>
              )}

              <button
                className="btn secondary"
                onClick={() => setExpandedId(expandedId === req._id ? null : req._id)}
                style={{ marginTop: '10px' }}
              >
                {expandedId === req._id ? '▲ Cancel' : '⬇️ Update Status'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminUpdateStatus;

import React, { useState } from 'react';
import axios from 'axios';

const RaiseRequest = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    department: '',
    images: [],
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const departments = ['electricity', 'water', 'agriculture', 'law', 'medical', 'services'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const files = e.target.files;
    const imageArray = [];
    for (let i = 0; i < files.length; i++) {
      const reader = new FileReader();
      reader.onload = (event) => {
        imageArray.push(event.target.result);
        if (imageArray.length === files.length) {
          setFormData((prev) => ({ ...prev, images: imageArray }));
        }
      };
      reader.readAsDataURL(files[i]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.description.length > 150) {
      setError('Description cannot exceed 150 characters');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('/api/requests/create', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSuccess('Request raised successfully! ID: ' + response.data.request._id);
      setFormData({ title: '', description: '', department: '', images: [] });
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="content-section">
      <h2 className="section-header">📝 Raise New Request</h2>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title of Request *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Brief title of your issue"
            required
          />
        </div>

        <div className="form-group">
          <label>Describe Your Problem (Max 150 characters) *</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Describe your problem in detail..."
            maxLength="150"
            required
          />
          <small>
            {formData.description.length}/150 characters
          </small>
        </div>

        <div className="form-group">
          <label>Select Department *</label>
          <select name="department" value={formData.department} onChange={handleInputChange} required>
            <option value="">Choose a Department</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept.charAt(0).toUpperCase() + dept.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Add Images (Optional)</label>
          <input type="file" multiple accept="image/*" onChange={handleImageUpload} />
          {formData.images.length > 0 && <p>{formData.images.length} image(s) selected</p>}
        </div>

        <div className="image-preview">
          {formData.images.map((img, idx) => (
            <img key={idx} src={img} alt={`Preview ${idx}`} style={{ maxWidth: '100px', margin: '10px' }} />
          ))}
        </div>

        <button type="submit" className="btn" disabled={loading}>
          {loading ? 'Submitting...' : '✅ Submit Request'}
        </button>
      </form>
    </div>
  );
};

export default RaiseRequest;

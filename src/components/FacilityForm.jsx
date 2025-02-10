// frontend/src/components/FacilityForm.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const FacilityForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    type: 'hospital', // Default value
    capacity: 0,
  });

  useEffect(() => {
    if (id) {
      axios.get(`http://localhost:8000/api/facilities/${id}/`)
        .then(res => setFormData(res.data))
        .catch(err => console.error('Error fetching facility:', err));
    }
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const method = id ? axios.put : axios.post;
    const url = id ? `http://localhost:8000/api/facilities/${id}/` : 'http://localhost:8000/api/facilities/';
    
    method(url, formData)
      .then(() => navigate('/facilities'))
      .catch(error => console.error('Submission error:', error));
  };

  return (
    <div className="facility-form">
      <h2>{id ? 'Edit Facility' : 'Add New Facility'}</h2>
      <form onSubmit={handleSubmit}>
        <label>Name</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        
        <label>Location</label>
        <input
          type="text"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          required
        />
        
        <label>Type</label>
        <select
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
        >
          <option value="hospital">Hospital</option>
          <option value="clinic">Clinic</option>
          <option value="community-center">Community Center</option>
        </select>
        
        <label>Capacity</label>
        <input
          type="number"
          min="0"
          value={formData.capacity}
          onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 0 })}
          required
        />
        
        <button type="submit">Save</button>
      </form>
    </div>
  );
};

export default FacilityForm;
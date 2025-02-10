import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const AssessmentForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [formData, setFormData] = useState({
    patient: '',
    date: new Date().toISOString().split('T')[0],
    score: '',
    notes: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const patientsRes = await axios.get('http://localhost:8000/api/patients/');
        setPatients(patientsRes.data);
        if (id) {
          const assessmentRes = await axios.get(`http://localhost:8000/api/assessments/${id}/`);
          setFormData(assessmentRes.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const method = id ? axios.put : axios.post;
    const url = id ? `http://localhost:8000/api/assessments/${id}/` : 'http://localhost:8000/api/assessments/';
    
    method(url, formData)
      .then(() => navigate('/assessments'))
      .catch(error => console.error('Submission error:', error));
  };

  return (
    <div className="assessment-form">
      <h2>{id ? 'Edit Assessment' : 'Add Assessment'}</h2>
      <form onSubmit={handleSubmit}>
        <label>Patient</label>
        <select
          value={formData.patient}
          onChange={(e) => setFormData({ ...formData, patient: parseInt(e.target.value) })}
          required
        >
          <option value="">Select Patient</option>
          {patients.map(patient => (
            <option key={patient.id} value={patient.id}>{patient.identifier}</option>
          ))}
        </select>
        
        <label>Date</label>
        <input
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          required
        />
        
        <label>Score</label>
        <input
          type="number"
          min="0"
          value={formData.score}
          onChange={(e) => setFormData({ ...formData, score: parseInt(e.target.value) })}
          required
        />
        
        <label>Notes</label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
        />
        
        <button type="submit">Save</button>
      </form>
    </div>
  );
};

export default AssessmentForm;
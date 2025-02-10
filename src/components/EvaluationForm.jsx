// frontend/src/components/EvaluationForm.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const EvaluationForm = () => {
  const { facilityId } = useParams(); // Get facility ID from URL
  const [criteriaList, setCriteriaList] = useState([]);
  const [scores, setScores] = useState({});
  const [error, setError] = useState('');

  // Fetch criteria from backend
  useEffect(() => {
    axios.get('http://localhost:8000/api/criteria/')
      .then(res => setCriteriaList(res.data))
      .catch(err => setError('Failed to load criteria.'));
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/api/evaluations/', {
        facility: facilityId,
        auditor: 1, // Replace with dynamic user ID later
        criteria_scores: scores,
      });
      alert('Evaluation submitted successfully!');
      setScores({}); // Reset form
    } catch (err) {
      setError('Submission failed. Check scores and try again.');
    }
  };

  return (
    <div className="evaluation-form">
      <h2>Evaluate Facility</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        {criteriaList.map(criterion => (
          <div key={criterion.id} className="criterion">
            <label>{criterion.name}</label>
            <input
              type="number"
              min="0"
              max="100"
              required
              onChange={(e) => setScores({
                ...scores,
                [criterion.id]: parseFloat(e.target.value)
              })}
            />
          </div>
        ))}
        <button type="submit">Submit Evaluation</button>
      </form>
    </div>
  );
};

export default EvaluationForm;
import React, { useState } from 'react';
import axios from 'axios';

const AddAuditForm = () => {
  const [formData, setFormData] = useState({
    facility: '',
    compliance_score: '',
    issues_found: '',
    date: new Date().toISOString().split('T')[0], // Auto-fill today's date
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      facility: parseInt(formData.facility, 10),
      compliance_score: parseInt(formData.compliance_score, 10),


    };
    axios.post('http://localhost:8000/api/audits/', payload)
      .then(() => alert('Audit submitted!'))
      .catch(error => console.error(error));
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Submit New Audit</h3>
      <input
        type="number"
        placeholder="Facility ID"
        value={formData.facility}
        onChange={(e) => setFormData({
          ...formData,
          facility: e.target.value
        })}
      />
      <input
        type="number"
        placeholder="Compliance Score (0-100)"
        value={formData.compliance_score}
        onChange={(e) => setFormData({ ...formData, compliance_score: e.target.value })}
      />
      <input
        type="date"
        value={formData.date}
        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
      />
      <textarea
        placeholder="Issues Found"
        value={formData.issues_found}
        onChange={(e) => setFormData({ ...formData, issues_found: e.target.value })}
      />
      <button type="submit">Submit</button>
    </form>
  );
};
export default AddAuditForm;
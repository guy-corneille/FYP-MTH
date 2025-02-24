import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const AssessmentList = () => {
  const [assessments, setAssessments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch assessments
        const assessmentsRes = await axios.get('http://localhost:8000/api/assessments/', {
          params: { search: searchTerm },
        });

        // Fetch patients
        const patientsRes = await axios.get('http://localhost:8000/api/patients/');

        // Ensure patients is an array
        const patientsData = Array.isArray(patientsRes.data)
          ? patientsRes.data
          : patientsRes.data.results || [];

        // Update state
        setAssessments(assessmentsRes.data);
        setPatients(patientsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [searchTerm]);

  const getPatientIdentifier = (patientId) => {
    const patient = patients.find((p) => p.id === patientId);
    return patient ? patient.identifier : 'Unknown Patient';
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/assessments/${id}/`);
      setAssessments((prevAssessments) => prevAssessments.filter((a) => a.id !== id));
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  return (
    <div className="assessment-list">
      <h2>Patient Assessments</h2>
      <input
        type="text"
        placeholder="Search assessments..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <Link to="/assessments/add" className="add-button">
        New Assessment
      </Link>
      <table>
        <thead>
          <tr>
            <th>Patient</th>
            <th>Date</th>
            <th>Score</th>
            <th>Notes</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {assessments.map((assessment) => (
            <tr key={assessment.id}>
              <td>{getPatientIdentifier(assessment.patient)}</td>
              <td>{new Date(assessment.date).toLocaleDateString()}</td>
              <td>{assessment.score}</td>
              <td>{assessment.notes}</td>
              <td>
                <Link to={`/assessments/edit/${assessment.id}`} className="edit-link">
                  Edit
                </Link>
                <button onClick={() => handleDelete(assessment.id)} className="delete-button">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AssessmentList;
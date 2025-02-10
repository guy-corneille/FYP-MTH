// frontend/src/components/PatientList.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const PatientList = () => {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [facilities, setFacilities] = useState([]);

  // Fetch patients and facilities
  useEffect(() => {
    const fetchData = async () => {
      try {
        const patientsRes = await axios.get('http://localhost:8000/api/patients/', {
          params: { search: searchTerm }
        });
        const facilitiesRes = await axios.get('http://localhost:8000/api/facilities/');
        setPatients(patientsRes.data);
        setFacilities(facilitiesRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [searchTerm]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/patients/${id}/`);
      setPatients(patients.filter(patient => patient.id !== id));
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  // Get facility name by ID
  const getFacilityName = (facilityId) => {
    const facility = facilities.find(f => f.id === facilityId);
    return facility ? facility.name : 'Unknown Facility';
  };

  return (
    <div className="patient-list">
      <h2>Patients</h2>
      <input
        type="text"
        placeholder="Search patients..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <Link to="/patients/add" className="add-button">Add New Patient</Link>
      <table>
        <thead>
          <tr>
            <th>Identifier</th>
            <th>Age</th>
            <th>Diagnosis</th>
            <th>Admission Date</th>
            <th>Facility</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {patients.map(patient => (
            <tr key={patient.id}>
              <td>{patient.identifier}</td>
              <td>{patient.age}</td>
              <td>{patient.diagnosis}</td>
              <td>{new Date(patient.admission_date).toLocaleDateString()}</td>
              <td>{getFacilityName(patient.facility)}</td>
              <td>
                <Link to={`/patients/edit/${patient.id}`} className="edit-link">Edit</Link>
                <button onClick={() => handleDelete(patient.id)} className="delete-button">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PatientList;
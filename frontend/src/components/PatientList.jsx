import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const PatientList = () => {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [facilities, setFacilities] = useState([]);
  const [nextPageUrl, setNextPageUrl] = useState(null); // URL for the next page
  const [prevPageUrl, setPrevPageUrl] = useState(null); // URL for the previous page

  // Fetch patients and facilities
  useEffect(() => {
    const fetchData = async () => {
      try {
        const patientsRes = await axios.get('http://localhost:8000/api/patients/', {
          params: { search: searchTerm },
        });

        // Ensure patients is an array
        const patientsData = Array.isArray(patientsRes.data.results)
          ? patientsRes.data.results
          : [];

        // Update state
        setPatients(patientsData);
        setNextPageUrl(patientsRes.data.next || null);
        setPrevPageUrl(patientsRes.data.previous || null);

        // Fetch facilities
        const facilitiesRes = await axios.get('http://localhost:8000/api/facilities/');
        const facilitiesData = Array.isArray(facilitiesRes.data)
          ? facilitiesRes.data
          : facilitiesRes.data.results || [];
        setFacilities(facilitiesData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [searchTerm]);

  // Handle fetching the next or previous page
  const handlePageChange = async (url) => {
    if (!url) return; // Do nothing if the URL is null

    try {
      const res = await axios.get(url);
      const patientsData = Array.isArray(res.data.results) ? res.data.results : [];
      setPatients(patientsData);
      setNextPageUrl(res.data.next || null);
      setPrevPageUrl(res.data.previous || null);
    } catch (error) {
      console.error('Error fetching paginated data:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/patients/${id}/`);
      setPatients((prevPatients) => prevPatients.filter((patient) => patient.id !== id));
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  // Get facility name by ID
  const getFacilityName = (facilityId) => {
    const facility = facilities.find((f) => f.id === facilityId);
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
      <Link to="/patients/add" className="add-button">
        Add New Patient
      </Link>
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
          {patients.map((patient) => (
            <tr key={patient.id}>
              <td>{patient.identifier}</td>
              <td>{patient.age}</td>
              <td>{patient.diagnosis}</td>
              <td>{new Date(patient.admission_date).toLocaleDateString()}</td>
              <td>{getFacilityName(patient.facility)}</td>
              <td>
                <Link to={`/patients/edit/${patient.id}`} className="edit-link">
                  Edit
                </Link>
                <button onClick={() => handleDelete(patient.id)} className="delete-button">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="pagination">
        <button
          onClick={() => handlePageChange(prevPageUrl)}
          disabled={!prevPageUrl}
        >
          Previous
        </button>
        <button
          onClick={() => handlePageChange(nextPageUrl)}
          disabled={!nextPageUrl}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PatientList;
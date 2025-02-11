// frontend/src/components/PatientForm.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const PatientForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [facilities, setFacilities] = useState([]);
    const [formData, setFormData] = useState({
        identifier: '',
        age: '',
        diagnosis: '',
        admission_date: '',
        facility: '',
    });

    // Fetch facilities and patient data (if editing)
    useEffect(() => {
        const fetchData = async () => {
            try {
                const facilitiesRes = await axios.get('http://localhost:8000/api/facilities/');
                setFacilities(facilitiesRes.data);
                if (id) {
                    const patientRes = await axios.get(`http://localhost:8000/api/patients/${id}/`);
                    setFormData(patientRes.data);
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
        const url = id ? `http://localhost:8000/api/patients/${id}/` : 'http://localhost:8000/api/patients/';

        method(url, formData)
            .then(() => navigate('/patients'))
            .catch(error => console.error('Submission error:', error));
    };

    return (
        <div className="patient-form">
            <h2>{id ? 'Edit Patient' : 'Add New Patient'}</h2>
            <form onSubmit={handleSubmit}>
                <label>Identifier</label>
                <input
                    type="text"
                    value={formData.identifier}
                    onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
                    required
                />

                <label>Age</label>
                <input
                    type="number"
                    min="0"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) })}
                    required
                />

                <label>Diagnosis</label>
                <input
                    type="text"
                    value={formData.diagnosis}
                    onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                    required
                />

                <label>Admission Date</label>
                <input
                    type="date"
                    value={formData.admission_date}
                    onChange={(e) => setFormData({ ...formData, admission_date: e.target.value })}
                    required
                />

                <label>Facility</label>

                Copy
                <select
                    value={formData.facility}
                    onChange={(e) => setFormData({ ...formData, facility: parseInt(e.target.value) })}
                    required
                >
                    <option value="">Select Facility</option>
                    {facilities.map(facility => (
                        <option key={facility.id} value={facility.id}>{facility.name}</option>
                    ))}
                </select>

                <button type="submit">Save</button>
            </form>
        </div>
    );
};

export default PatientForm;
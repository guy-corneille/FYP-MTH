import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const AuditList = () => {
  const [audits, setAudits] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('http://localhost:8000/api/audits/', {
          params: { search: searchTerm },
        });
        setAudits(res.data.results); // Ensure you're using `results` for paginated responses
      } catch (error) {
        console.error('Error fetching audits:', error);
      }
    };
    fetchData();
  }, [searchTerm]);

  return (
    <div>
      <h2>Audits</h2>
      <input
        type="text"
        placeholder="Search audits..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <Link to="/audits/new">Add New Audit</Link>
      <table>
        <thead>
          <tr>
            <th>Facility</th>
            <th>Date</th>
            <th>Compliance Score</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {audits.map((audit) => (
            <tr key={audit.id}>
              <td>{audit.facility?.name || 'Unknown Facility'}</td> {/* Handle null values */}
              <td>{new Date(audit.date).toLocaleDateString()}</td>
              <td>{audit.compliance_score}%</td>
              <td>
                <Link to={`/audits/edit/${audit.id}`}>Edit</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AuditList;
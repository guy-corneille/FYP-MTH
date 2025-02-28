import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const AuditList = () => {
  const [audits, setAudits] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [nextPageUrl, setNextPageUrl] = useState(null); // URL for the next page
  const [prevPageUrl, setPrevPageUrl] = useState(null); // URL for the previous page

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('http://localhost:8000/api/audits/', {
          params: { search: searchTerm },
        });

        // Ensure audits is an array
        const auditsData = Array.isArray(res.data.results) ? res.data.results : [];

        // Update state
        setAudits(auditsData);
        setNextPageUrl(res.data.next || null);
        setPrevPageUrl(res.data.previous || null);
      } catch (error) {
        console.error('Error fetching audits:', error);
      }
    };
    fetchData();
  }, [searchTerm]);

  const handlePageChange = async (url) => {
    if (!url) return; // Do nothing if the URL is null

    try {
      const res = await axios.get(url);
      const auditsData = Array.isArray(res.data.results) ? res.data.results : [];
      setAudits(auditsData);
      setNextPageUrl(res.data.next || null);
      setPrevPageUrl(res.data.previous || null);
    } catch (error) {
      console.error('Error fetching paginated data:', error);
    }
  };

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
              <td>{audit.facility.name}</td>
              <td>{new Date(audit.date).toLocaleDateString()}</td>
              <td>{audit.compliance_score}%</td>
              <td>
                <Link to={`/audits/edit/${audit.id}`}>Edit</Link>
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

export default AuditList;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const CriteriaList = () => {
  const [criteria, setCriteria] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCriteria, setExpandedCriteria] = useState(null);

  // Fetch criteria data from the backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/criteria/', {
          params: { search: searchTerm },
        });
        console.log('API Response:', response.data); // Debugging
        setCriteria(response.data || []); 
      } catch (error) {
        console.error('Error fetching criteria:', error);
        setCriteria([]); 
      }
    };
    fetchData();
  }, [searchTerm]);

  const toggleExpand = (id) => {
    setExpandedCriteria(expandedCriteria === id ? null : id);
  };

  return (
    <div>
      <h2>Evaluation Criteria</h2>
      <input
        type="text"
        placeholder="Search criteria..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <Link to="/criteria/add">Add New Criterion</Link>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Weight</th>
            <th>Standard</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {criteria.length > 0 ? (
            criteria.map((criterion) => (
              <React.Fragment key={criterion.id}>
                <tr onClick={() => toggleExpand(criterion.id)}>
                  <td>{criterion.name || 'N/A'}</td>
                  <td>{(criterion.weight || 0) * 100}%</td>
                  <td>{criterion.standard || 'N/A'}</td>
                  <td>
                    <Link to={`/criteria/edit/${criterion.id}`}>Edit</Link>
                    <button onClick={() => handleDelete(criterion.id)}>Delete</button>
                  </td>
                </tr>

                {expandedCriteria === criterion.id && (
                  <tr>
                    <td colSpan="4">
                      <h4>Indicators</h4>
                      <ul>
                        {(criterion.indicators || []).map((indicator) => (
                          <li key={indicator.id}>
                            {indicator.name || 'Unnamed Indicator'} ({(indicator.weight || 0) * 100}%)
                          </li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))
          ) : (
            <tr>
              <td colSpan="4">No criteria found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CriteriaList;
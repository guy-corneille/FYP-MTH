// frontend/src/components/CriteriaList.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const CriteriaList = () => {
  const [criteria, setCriteria] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  //search
  useEffect(() => {
    const fetchCriteria = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/criteria/', {
            params: { search: searchTerm }
          });
        setCriteria(response.data);
      } catch (err) {
        console.error('Error fetching criteria:', err);
      }
    };
    
    fetchCriteria();
  }, [searchTerm]); 

  useEffect(() => {
    axios.get('http://localhost:8000/api/criteria/')
      .then(res => setCriteria(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleDelete = (id) => {
    axios.delete(`http://localhost:8000/api/criteria/${id}/`)
      .then(() => setCriteria(criteria.filter(c => c.id !== id)));
  };

  return (
    <div className="criteria-list">
      <h2>Evaluation Criteria</h2>
      <input
        type="text"
        placeholder="Search criteria..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      /><br></br>
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
          {criteria.map(criterion => (
            <tr key={criterion.id}>
              <td>{criterion.name}</td>
              <td>{criterion.weight}</td>
              <td>{criterion.standard}</td>
              <td>
                <Link to={`/criteria/edit/${criterion.id}`}>Edit</Link>
                <button onClick={() => handleDelete(criterion.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default CriteriaList;
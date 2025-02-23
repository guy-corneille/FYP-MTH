// frontend/src/components/CriteriaList.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const CriteriaList = () => {
    const [criteria, setCriteria] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedCriteria, setExpandedCriteria] = useState(null);

    // Fetch criteria
    useEffect(() => {
        axios.get('http://localhost:8000/api/criteria/', { params: { search: searchTerm } })
            .then(res => setCriteria(res.data))
            .catch(err => console.error('Error fetching criteria:', err));
    }, [searchTerm]);

    // Toggle expanded state for a criterion
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
                    {criteria.map((criterion) => (
                        <React.Fragment key={criterion.id}>
                            <tr onClick={() => toggleExpand(criterion.id)}>
                                <td>{criterion.name}</td>
                                <td>{criterion.weight * 100}%</td>
                                <td>{criterion.standard}</td>
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
                                            {criterion.indicators?.map((indicator) => (
                                                <li key={indicator.id}>
                                                    {indicator.name} ({indicator.weight * 100}%)
                                                </li>
                                            ))}
                                        </ul>
                                    </td>
                                </tr>
                            )}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default CriteriaList;
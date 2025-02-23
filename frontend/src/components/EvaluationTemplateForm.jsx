// frontend/src/components/EvaluationTemplateForm.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EvaluationTemplateForm = () => {
    const [criteria, setCriteria] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        criteria_weights: {},
    });

    useEffect(() => {
        const fetchCriteria = async () => {
            const res = await axios.get('http://localhost:8000/api/criteria/');
            setCriteria(res.data);
        };
        fetchCriteria();
    }, []);

    const handleWeightChange = (criteriaId, value) => {
        setFormData({
            ...formData,
            criteria_weights: {
                ...formData.criteria_weights,
                [criteriaId]: parseFloat(value),
            },
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8000/api/evaluation-templates/', formData);
            alert('Template saved successfully!');
        } catch (error) {
            console.error('Error saving template:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Create Evaluation Template</h2>

            <label>Name</label>
            <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
            />

            <label>Description</label>
            <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
            />

            <h3>Criteria Weights</h3>
            {criteria.map((criterion) => (
                <div key={criterion.id}>
                    <label>{criterion.name}</label>
                    <input
                        type="number"
                        min="0"
                        max="100"
                        step="0.01"
                        value={formData.criteria_weights[criterion.id] || ''}
                        onChange={(e) => handleWeightChange(criterion.id, e.target.value)}
                        required
                    />
                </div>
            ))}

            <button type="submit">Save Template</button>
        </form>
    );
};

export default EvaluationTemplateForm;
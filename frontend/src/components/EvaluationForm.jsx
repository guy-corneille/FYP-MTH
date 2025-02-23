// frontend/src/components/EvaluationForm.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const EvaluationForm = () => {
    const { id } = useParams(); // For editing an existing evaluation
    const navigate = useNavigate();
    const [facilities, setFacilities] = useState([]);
    const [templates, setTemplates] = useState([]);
    const [criteria, setCriteria] = useState([]);
    const [formData, setFormData] = useState({
        facility: '',
        template: '',
        criteria_scores: {},
    });

    useEffect(() => {
        const fetchData = async () => {
            const facilitiesRes = await axios.get('http://localhost:8000/api/facilities/');
            const templatesRes = await axios.get('http://localhost:8000/api/evaluation-templates/');
            const criteriaRes = await axios.get('http://localhost:8000/api/criteria/');
            setFacilities(facilitiesRes.data);
            setTemplates(templatesRes.data);
            setCriteria(criteriaRes.data);

            if (id) {
                const evaluationRes = await axios.get(`http://localhost:8000/api/evaluations/${id}/`);
                setFormData(evaluationRes.data);
            }
        };
        fetchData();
    }, [id]);

    const handleScoreChange = (criteriaId, value) => {
        setFormData({
            ...formData,
            criteria_scores: {
                ...formData.criteria_scores,
                [criteriaId]: parseFloat(value),
            },
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const method = id ? axios.put : axios.post;
        const url = id ? `http://localhost:8000/api/evaluations/${id}/` : 'http://localhost:8000/api/evaluations/';
        try {
            await method(url, formData);
            navigate('/evaluations');
        } catch (error) {
            console.error('Submission error:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>{id ? 'Edit Evaluation' : 'Add New Evaluation'}</h2>

            {/* Facility Selection */}
            <label>Facility</label>
            <select
                value={formData.facility}
                onChange={(e) => setFormData({ ...formData, facility: parseInt(e.target.value) })}
                required
            >
                <option value="">Select Facility</option>
                {facilities.map((facility) => (
                    <option key={facility.id} value={facility.id}>
                        {facility.name}
                    </option>
                ))}
            </select>

            {/* Template Selection */}
            <label>Template</label>
            <select
                value={formData.template}
                onChange={(e) => setFormData({ ...formData, template: parseInt(e.target.value) })}
                required
            >
                <option value="">Select Template</option>
                {templates.map((template) => (
                    <option key={template.id} value={template.id}>
                        {template.name}
                    </option>
                ))}
            </select>

            {/* Criteria Scores */}
            <h3>Criteria Scores</h3>
            {criteria.map((criterion) => (
                <div key={criterion.id}>
                    <label>{criterion.name} ({criterion.weight * 100}%)</label>
                    <input
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        value={formData.criteria_scores[criterion.id] || ''}
                        onChange={(e) => handleScoreChange(criterion.id, e.target.value)}
                        required
                    />
                </div>
            ))}

            {/* Submit Button */}
            <button type="submit">Save Evaluation</button>
        </form>
    );
};

export default EvaluationForm;
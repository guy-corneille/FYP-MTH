// frontend/src/components/CriteriaForm.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const CriteriaForm = () => {
    const { id } = useParams(); // Get the criteria ID from the URL
    const navigate = useNavigate();
    const [criteria, setCriteria] = useState({
        name: '',
        description: '',
        standard: 'WHO-AIMS 2.0',
        weight: 1.0,
        indicators: [{ name: '', weight: 1.0 }],
    });

    useEffect(() => {
        if (id) {
            // Fetch criteria data for editing
            axios.get(`http://localhost:8000/api/criteria/${id}/`)
                .then(res => {
                    const { name, description, standard, weight, indicators } = res.data;
                    setCriteria({
                        name,
                        description,
                        standard,
                        weight,
                        indicators: indicators || [{ name: '', weight: 1.0 }],
                    });
                })
                .catch(err => console.error('Error fetching criteria:', err));
        }
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCriteria({ ...criteria, [name]: value });
    };

    const handleIndicatorChange = (index, field, value) => {
        const newIndicators = [...criteria.indicators];
        newIndicators[index][field] = value;
        setCriteria({ ...criteria, indicators: newIndicators });
    };

    const handleAddIndicator = () => {
        setCriteria({
            ...criteria,
            indicators: [...criteria.indicators, { name: '', weight: 1.0 }],
        });
    };

    const handleRemoveIndicator = (index) => {
        const newIndicators = criteria.indicators.filter((_, i) => i !== index);
        setCriteria({ ...criteria, indicators: newIndicators });
    };

    const validateForm = () => {
        if (!criteria.name || !criteria.description || criteria.weight <= 0 || criteria.weight > 100) {
            alert("Please fill all fields and ensure the weight is between 0 and 100.");
            return false;
        }
        for (const indicator of criteria.indicators) {
            if (!indicator.name || indicator.weight <= 0 || indicator.weight > 100) {
                alert("All indicators must have a name and a weight between 0 and 100.");
                return false;
            }
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            const method = id ? axios.put : axios.post;
            const url = id ? `http://localhost:8000/api/criteria/${id}/` : 'http://localhost:8000/api/criteria/';
            await method(url, criteria);
            alert("Criteria saved successfully!");
            navigate('/criteria');
        } catch (error) {
            console.error("Error saving criteria:", error);
            alert("Failed to save criteria. Please try again.");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>{id ? 'Edit Criteria' : 'Add New Criteria'}</h2>

            {/* Name */}
            <label>Name</label>
            <input
                type="text"
                name="name"
                value={criteria.name}
                onChange={handleInputChange}
                required
            />

            {/* Description */}
            <label>Description</label>
            <textarea
                name="description"
                value={criteria.description}
                onChange={handleInputChange}
                required
            />

            {/* Standard */}
            <label>Standard</label>
            <select
                name="standard"
                value={criteria.standard}
                onChange={handleInputChange}
            >
                <option value="WHO-AIMS 2.0">WHO-AIMS 2.0</option>
                <option value="ISO 9001">ISO 9001</option>
                <option value="Custom">Custom</option>
            </select>

            {/* Weight */}
            <label>Weight (0-100)</label>
            <input
                type="number"
                name="weight"
                value={criteria.weight}
                onChange={(e) => handleInputChange({ ...e, value: parseFloat(e.target.value) })}
                min="0"
                max="100"
                step="0.1"
                required
            />

            {/* Indicators */}
            <h3>Indicators</h3>
            {criteria.indicators.map((indicator, index) => (
                <div key={index}>
                    <label>Indicator Name</label>
                    <input
                        type="text"
                        value={indicator.name}
                        onChange={(e) => handleIndicatorChange(index, 'name', e.target.value)}
                        required
                    />
                    <label>Weight (0-100)</label>
                    <input
                        type="number"
                        value={indicator.weight}
                        onChange={(e) => handleIndicatorChange(index, 'weight', parseFloat(e.target.value))}
                        min="0"
                        max="100"
                        step="0.1"
                        required
                    />
                    <button
                        type="button"
                        onClick={() => handleRemoveIndicator(index)}
                        style={{ marginLeft: '10px' }}
                    >
                        Remove Indicator
                    </button>
                </div>
            ))}

            {/* Add Indicator Button */}
            <button type="button" onClick={handleAddIndicator}>
                Add Indicator
            </button>

            {/* Submit Button */}
            <button type="submit">{id ? 'Save Changes' : 'Add Criteria'}</button>
        </form>
    );
};

export default CriteriaForm;
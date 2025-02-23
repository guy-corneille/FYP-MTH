// frontend/src/components/Sidebar.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
    return (
        <div className="sidebar">
            <h3>MentalHealthIQ</h3>
            <ul>
                <li><Link to="/dashboard">Dashboard</Link></li>
                <li><Link to="/facilities">Facilities</Link></li>
                <li><Link to="/criteria">Criteria</Link></li>
                <li><Link to="/audits">Audits</Link></li>
                <li><Link to="/assessments">Assessments</Link></li>
                <li><Link to="/evaluations">Evaluations</Link></li>
            </ul>
        </div>
    );
};

export default Sidebar;
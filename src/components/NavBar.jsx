import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav>
  <Link to="/">Dashboard</Link>
  <Link to="/criteria">Criteria</Link>
  <Link to="/facilities">Facilities</Link>
  <Link to="/patients">Patients</Link>
  <Link to="/audits">Audits</Link>
  <Link to="/assessments">Assessments</Link>
    </nav>
  );
};
export default Navbar;
import React from 'react';
import FacilityList from './FacilityList';
import AuditChart from './AuditChart';

const Dashboard = () => {
  return (
    <div className="dashboard">
      <h1>MentalHealthIQ Dashboard</h1>
      <AuditChart />
      <FacilityList />
    </div>
  );
};
export default Dashboard;
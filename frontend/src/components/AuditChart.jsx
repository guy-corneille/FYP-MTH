import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

const AuditChart = () => {
  const [auditData, setAuditData] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    axios.get('http://localhost:8000/api/audits/')
      .then(response => {
        const audits = response.data;
        const data = {
          labels: audits.map(audit => audit.date),
          datasets: [
            {
              label: 'Compliance Score',
              data: audits.map(audit => audit.compliance_score),
              borderColor: '#4CAF50',
              tension: 0.1,
            },
          ],
        };
        setAuditData(data);
      });
  }, []);

  return (
    <div className="audit-chart">
      <h3>Audit Compliance Trends</h3>
      <Line data={auditData} />
    </div>
  );
};

export default AuditChart;
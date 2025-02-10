import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard.jsx';
import AddAuditForm from './components/AddAuditForm.jsx';
import Navbar from './components/NavBar.jsx';
import './App.css'
import CriteriaList from './components/CriteriaList';
import CriteriaForm from './components/CriteriaForm';
import EvaluationForm from './components/EvaluationForm.jsx';
import FacilityList from './components/FacilityList';
import FacilityForm from './components/FacilityForm';
import PatientList from './components/PatientList'; 
import PatientForm from './components/PatientForm'; 
import AssessmentsList from './components/AssessmentList';
import AssessmentForm from './components/AssessmentForm';
// import AuditList from './components/AuditList';
// import AuditForm from './components/AuditForm';
// import EvaluationSummary from './components/EvaluationSummary.jsx';


function App() {
  return (
    <>
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/audits" element={<AddAuditForm />} />
        <Route path="/facilities/:facilityId/evaluate" element={<EvaluationForm />} />
        <Route path="/criteria" element={<CriteriaList />} />
        <Route path="/criteria/add" element={<CriteriaForm />} />
        <Route path="/criteria/edit/:id" element={<CriteriaForm />} />
        <Route path="/facilities" element={<FacilityList />} />
        <Route path="/facilities/add" element={<FacilityForm />} />
        <Route path="/facilities/edit/:id" element={<FacilityForm />} />
        <Route path="/patients" element={<PatientList />} />
        <Route path="/patients/add" element={<PatientForm />} />
        <Route path="/patients/edit/:id" element={<PatientForm />} /> 
        <Route path="/assessments" element={<AssessmentsList />} />
        <Route path="/assessments/add" element={<AssessmentForm />} />
        <Route path="/assessments/edit/:id" element={<AssessmentForm />} />
        {/* <Route path="/audits" element={<AuditList />} />
        <Route path="/audits/add" element={<AuditForm />} />
        <Route path="/audits/edit/:id" element={<AuditForm />} /> */}
      </Routes>
    </Router>
    </>
  )
}

export default App

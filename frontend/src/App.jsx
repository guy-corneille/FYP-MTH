// frontend/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import SideBar from './components/SideBar';
import CriteriaList from './components/CriteriaList';
import CriteriaForm from './components/CriteriaForm';
import EvaluationForm from './components/EvaluationForm';
import FacilityList from './components/FacilityList';
import FacilityForm from './components/FacilityForm';
import PatientList from './components/PatientList';
import PatientForm from './components/PatientForm';
import AssessmentsList from './components/AssessmentList';
import AssessmentForm from './components/AssessmentForm';
import EvaluationTemplateForm from './components/EvaluationTemplateForm';

function App() {
    return (
        <Router>
            <div style={{ display: 'flex' }}>
                <SideBar />
                <div style={{ flex: 1, padding: '20px' }}>
                    <Routes>
                        {/* Dashboard */}
                        <Route path="/dashboard" element={<Dashboard />} />

                        {/* Criteria */}
                        <Route path="/criteria" element={<CriteriaList />} />
                        <Route path="/criteria/add" element={<CriteriaForm />} />
                        <Route path="/criteria/edit/:id" element={<CriteriaForm />} />

                        {/* Facilities */}
                        <Route path="/facilities" element={<FacilityList />} />
                        <Route path="/facilities/add" element={<FacilityForm />} />
                        <Route path="/facilities/edit/:id" element={<FacilityForm />} />

                        {/* Patients */}
                        <Route path="/patients" element={<PatientList />} />
                        <Route path="/patients/add" element={<PatientForm />} />
                        <Route path="/patients/edit/:id" element={<PatientForm />} />

                        {/* Assessments */}
                        <Route path="/assessments" element={<AssessmentsList />} />
                        <Route path="/assessments/add" element={<AssessmentForm />} />
                        <Route path="/assessments/edit/:id" element={<AssessmentForm />} />

                        {/* Evaluations */}
                        <Route path="/evaluations" element={<EvaluationForm />} />
                        <Route path="/evaluations/add" element={<EvaluationForm />} />
                        <Route path="/evaluations/edit/:id" element={<EvaluationForm />} />

                        {/* Evaluation Templates */}
                        <Route path="/evaluation-templates" element={<EvaluationTemplateForm />} />
                        <Route path="/evaluation-templates/add" element={<EvaluationTemplateForm />} />
                        <Route path="/evaluation-templates/edit/:id" element={<EvaluationTemplateForm />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default App;
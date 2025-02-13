# populate_db.py
import os
import django
import random
from datetime import date, timedelta

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'mhq.settings')
django.setup()

from evaluations.models import (
    Facility, Patient, Assessment, Audit, Criteria, Indicator, EvaluationTemplate, Evaluation
)
from django.contrib.auth.models import User

# Clear all existing data
def clear_data():
    Facility.objects.all().delete()
    Patient.objects.all().delete()
    Assessment.objects.all().delete()
    Audit.objects.all().delete()
    Criteria.objects.all().delete()
    Indicator.objects.all().delete()
    EvaluationTemplate.objects.all().delete()
    Evaluation.objects.all().delete()

# Helper Functions
def random_date(start, end):
    """Generate a random date between start and end."""
    return start + timedelta(days=random.randint(0, (end - start).days))

# Populate Facilities
def create_facilities():
    facilities = []
    facility_names = [
        "Kigali Mental Health Center",
        "Butare Community Clinic",
        "Musanze District Hospital",
        "Gisenyi Psychiatric Unit",
        "Huye Mental Wellness Center"
    ]
    for name in facility_names:
        facility = Facility.objects.create(
            name=name,
            location=f"{name.split()[0]}, Rwanda",
            type=random.choice(["Hospital", "Clinic", "Community Center"]),
            capacity=random.randint(50, 500),
            last_audit_date=random_date(date(2023, 1, 1), date(2023, 12, 31))
        )
        facilities.append(facility)
    return facilities

# Populate Criteria and Indicators
def create_criteria_and_indicators():
    criteria_list = []
    indicator_list = []

    criteria_data = [
        {
            "name": "Accessibility",
            "description": "Measures how accessible mental health services are to patients.",
            "standard": "WHO-AIMS 2.0",
            "indicators": [
                {"name": "Average wait time (days)", "weight": 0.5},
                {"name": "Proximity of services (km)", "weight": 0.5}
            ]
        },
        {
            "name": "Workforce Capacity",
            "description": "Assesses staffing levels and qualifications.",
            "standard": "ISO 9001",
            "indicators": [
                {"name": "Staff-to-patient ratio", "weight": 0.6},
                {"name": "Percentage of trained staff", "weight": 0.4}
            ]
        },
        {
            "name": "Treatment Availability",
            "description": "Evaluates the availability of treatment options.",
            "standard": "Custom",
            "indicators": [
                {"name": "Availability of medication", "weight": 0.7},
                {"name": "Access to therapy sessions", "weight": 0.3}
            ]
        }
    ]

    for data in criteria_data:
        criterion = Criteria.objects.create(
            name=data["name"],
            description=data["description"],
            standard=data["standard"],
            weight=1.0  # Default weight
        )
        criteria_list.append(criterion)

        for indicator_data in data["indicators"]:
            indicator = Indicator.objects.create(
                criteria=criterion,
                name=indicator_data["name"],
                weight=indicator_data["weight"]
            )
            indicator_list.append(indicator)

    return criteria_list, indicator_list

# Populate Patients
def create_patients(facilities):
    patients = []
    for facility in facilities:
        for i in range(1, 11):  # Add 10 patients per facility
            patient = Patient.objects.create(
                facility=facility,
                identifier=f"PAT{facility.id}{i:03d}",
                age=random.randint(18, 80),
                diagnosis=random.choice(["Depression", "Anxiety", "Schizophrenia", "Bipolar Disorder"]),
                admission_date=random_date(date(2023, 1, 1), date(2023, 12, 31))
            )
            patients.append(patient)
    return patients

# Populate Assessments
def create_assessments(patients):
    assessments = []
    for patient in patients:
        for i in range(1, 4):  # Add 3 assessments per patient
            assessment = Assessment.objects.create(
                patient=patient,
                date=random_date(patient.admission_date, date(2023, 12, 31)),
                score=random.randint(0, 27),  # PHQ-9 scores range from 0 to 27
                notes=f"Assessment {i} notes for {patient.identifier}"
            )
            assessments.append(assessment)
    return assessments

# Populate Audits
def create_audits(facilities):
    audits = []
    for facility in facilities:
        for i in range(1, 3):  # Add 2 audits per facility
            audit = Audit.objects.create(
                facility=facility,
                date=random_date(date(2023, 1, 1), date(2023, 12, 31)),
                compliance_score=random.randint(50, 100),
                issues_found=f"Audit {i} issues found for {facility.name}"
            )
            audits.append(audit)
    return audits

# Populate Evaluation Templates
def create_evaluation_templates(criteria):
    templates = []
    template_data = [
        {
            "name": "Hospital Template",
            "description": "Evaluation template for hospitals.",
            "criteria_weights": {str(criteria[0].id): 0.4, str(criteria[1].id): 0.3, str(criteria[2].id): 0.3}
        },
        {
            "name": "Clinic Template",
            "description": "Evaluation template for clinics.",
            "criteria_weights": {str(criteria[0].id): 0.5, str(criteria[1].id): 0.25, str(criteria[2].id): 0.25}
        }
    ]
    for data in template_data:
        template = EvaluationTemplate.objects.create(
            name=data["name"],
            description=data["description"],
            criteria_weights=data["criteria_weights"]
        )
        templates.append(template)
    return templates

# Populate Evaluations
def create_evaluations(facilities, templates, criteria):
    evaluations = []
    admin_user = User.objects.get(username='admin')  # Ensure admin user exists
    for facility in facilities:
        for template in templates:
            criteria_scores = {}
            for criterion_id in template.criteria_weights.keys():
                criteria_scores[criterion_id] = random.randint(0, 100)
            evaluation = Evaluation.objects.create(
                facility=facility,
                auditor=admin_user,
                template=template,
                criteria_scores=criteria_scores
            )
            evaluations.append(evaluation)
    return evaluations

# Main Execution
if __name__ == "__main__":
    clear_data()
    facilities = create_facilities()
    criteria, indicators = create_criteria_and_indicators()
    patients = create_patients(facilities)
    assessments = create_assessments(patients)
    audits = create_audits(facilities)
    templates = create_evaluation_templates(criteria)
    evaluations = create_evaluations(facilities, templates, criteria)
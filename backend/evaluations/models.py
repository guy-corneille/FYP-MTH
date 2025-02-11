# evaluations/models.py
from django.db import models
from django.core.exceptions import ValidationError
from django.contrib.auth import get_user_model

User = get_user_model()  # Define this before using it in models

class Facility(models.Model):
    name = models.CharField(max_length=200)
    location = models.CharField(max_length=200)
    type = models.CharField(max_length=50)  # e.g., hospital, clinic
    capacity = models.IntegerField()
    last_audit_date = models.DateField(null=True, blank=True)

    def __str__(self):
        return self.name


class Patient(models.Model):
    facility = models.ForeignKey(Facility, on_delete=models.CASCADE)
    identifier = models.CharField(max_length=50)  # Use anonymized IDs, not real names
    age = models.IntegerField()
    diagnosis = models.CharField(max_length=200)
    admission_date = models.DateField()

    def __str__(self):
        return f"{self.identifier} - {self.diagnosis}"


class Assessment(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    date = models.DateField()
    score = models.IntegerField()  # e.g., PHQ-9 depression score
    notes = models.TextField(blank=True)

    def __str__(self):
        return f"Assessment for {self.patient.identifier} on {self.date}"


class Audit(models.Model):
    facility = models.ForeignKey(Facility, on_delete=models.CASCADE)
    evaluation = models.ForeignKey('Evaluation', on_delete=models.SET_NULL, null=True, blank=True)  # Link to Evaluation
    date = models.DateField()
    compliance_score = models.IntegerField()  # 0-100%
    issues_found = models.TextField(blank=True)

    def __str__(self):
        return f"Audit for {self.facility.name} on {self.date}"


class Criteria(models.Model):
    STANDARD_CHOICES = [
        ('WHO-AIMS 2.0', 'WHO-AIMS 2.0'),
        ('ISO 9001', 'ISO 9001'),
        ('Custom', 'Custom'),
    ]

    name = models.CharField(max_length=200)  # e.g., "Accessibility"
    description = models.TextField()
    weight = models.FloatField(default=1.0)  # Weight for scoring
    standard = models.CharField(max_length=100, choices=STANDARD_CHOICES, default='WHO-AIMS 2.0')

    def clean(self):
        # Ensure the sum of all criteria weights equals 100%
        total_weight = Criteria.objects.aggregate(total=models.Sum('weight'))['total'] or 0
        if total_weight + self.weight > 100:
            raise ValidationError("The sum of all criteria weights cannot exceed 100%.")

    def __str__(self):
        return self.name


class Indicator(models.Model):
    criteria = models.ForeignKey(Criteria, on_delete=models.CASCADE)
    name = models.CharField(max_length=200)  # e.g., "Average wait time (days)"
    weight = models.FloatField(default=1.0)  # For weighted scoring

    def __str__(self):
        return f"{self.name} (Criteria: {self.criteria.name})"


class Evaluation(models.Model):
    facility = models.ForeignKey(Facility, on_delete=models.CASCADE)
    auditor = models.ForeignKey(User, on_delete=models.CASCADE)
    date = models.DateField(auto_now_add=True)
    criteria_scores = models.JSONField(default=dict)  # Store scores as JSON (criteria_id: score)
    total_score = models.FloatField(default=0)

    def save(self, *args, **kwargs):
        total = 0
        for criteria_id, score in self.criteria_scores.items():
            try:
                criteria = Criteria.objects.get(id=int(criteria_id))
                total += score * criteria.weight
            except Criteria.DoesNotExist:
                raise ValidationError(f"Invalid Criteria ID: {criteria_id}")
            if not (0 <= score <= 100):
                raise ValidationError("Scores must be between 0 and 100.")
        self.total_score = total
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Evaluation for {self.facility.name} by {self.auditor.username}"
from django.db import models
from django.core.exceptions import ValidationError
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _


class User(AbstractUser):
    ROLE_CHOICES = [
        ('superuser', _('Superuser')),
        ('admin', _('Admin')),
        ('auditor', _('Auditor')),
        ('clinician', _('Clinician')),
        ('viewer', _('Viewer')),
    ]
    role = models.CharField(max_length=50, choices=ROLE_CHOICES, default='viewer')
    name = models.CharField(max_length=255)
    phone = models.CharField(max_length=15, blank=True, null=True)

    def __str__(self):
        return f"{self.username} ({self.role})"


class Facility(models.Model):
    """
    Represents a healthcare facility (e.g., hospital, clinic).
    """
    FACILITY_TYPE_CHOICES = [
        ('hospital', _('Hospital')),
        ('clinic', _('Clinic')),
        ('community_center', _('Community Center')),
    ]

    name = models.CharField(max_length=200)
    location = models.CharField(max_length=200)
    type = models.CharField(max_length=50, choices=FACILITY_TYPE_CHOICES)
    capacity = models.IntegerField()
    last_audit_date = models.DateField(null=True, blank=True)

    def __str__(self):
        return self.name


class Patient(models.Model):
    """
    Represents a patient associated with a facility.
    """
    facility = models.ForeignKey('Facility', on_delete=models.CASCADE)
    identifier = models.CharField(max_length=50, help_text=_("Use anonymized IDs, not real names"))
    age = models.IntegerField()
    diagnosis = models.CharField(max_length=200)
    admission_date = models.DateField()

    def __str__(self):
        return f"{self.identifier} - {self.diagnosis}"


class Assessment(models.Model):
    """
    Represents an assessment conducted on a patient.
    """
    patient = models.ForeignKey('Patient', on_delete=models.CASCADE)
    date = models.DateField()
    score = models.IntegerField(help_text=_("e.g., PHQ-9 depression score"))
    notes = models.TextField(blank=True)

    def __str__(self):
        return f"Assessment for {self.patient.identifier} on {self.date}"


class Audit(models.Model):
    """
    Represents an audit conducted on a facility.
    """
    facility = models.ForeignKey('Facility', on_delete=models.CASCADE)
    evaluation = models.ForeignKey('Evaluation', on_delete=models.SET_NULL, null=True, blank=True)
    date = models.DateField()
    compliance_score = models.IntegerField(help_text=_("0-100%"))
    issues_found = models.TextField(blank=True)

    def __str__(self):
        return f"Audit for {self.facility.name} on {self.date}"


class Criteria(models.Model):
    """
    Represents a criterion used in evaluations.
    """
    STANDARD_CHOICES = [
        ('WHO-AIMS 2.0', _('WHO-AIMS 2.0')),
        ('ISO 9001', _('ISO 9001')),
        ('Custom', _('Custom')),
    ]
    TYPE_CHOICES = [
        ('core', _('Core')),
        ('optional', _('Optional')),
    ]

    name = models.CharField(max_length=200)
    description = models.TextField()
    weight = models.FloatField(default=1.0)
    standard = models.CharField(max_length=100, choices=STANDARD_CHOICES, default='WHO-AIMS 2.0')
    type = models.CharField(max_length=50, choices=TYPE_CHOICES, default='core')

    def clean(self):
        # Ensure the sum of all criteria weights does not exceed 100%
        total_weight = Criteria.objects.exclude(id=self.id).aggregate(total=models.Sum('weight'))['total'] or 0
        if total_weight + self.weight > 100:
            raise ValidationError(_("The sum of all criteria weights cannot exceed 100%."))

    def __str__(self):
        return self.name


class Indicator(models.Model):
    """
    Represents an indicator associated with a criterion.
    """
    criteria = models.ForeignKey('Criteria', on_delete=models.CASCADE)
    name = models.CharField(max_length=200)
    weight = models.FloatField(default=1.0)

    def __str__(self):
        return f"{self.name} (Criteria: {self.criteria.name})"


def validate_criteria_weights(value):
    total_weight = sum(value.values())
    if round(total_weight, 2) != 100:
        raise ValidationError("The sum of criteria weights must equal 100%.")

class EvaluationTemplate(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField()
    criteria_weights = models.JSONField(validators=[validate_criteria_weights])

    def __str__(self):
        return self.name

def get_default_criteria_scores():
    return {}

class Evaluation(models.Model):
    facility = models.ForeignKey('Facility', on_delete=models.CASCADE)
    auditor = models.ForeignKey('User', on_delete=models.CASCADE)
    date = models.DateField(auto_now_add=True)
    template = models.ForeignKey('EvaluationTemplate', on_delete=models.SET_NULL, null=True, blank=True)
    criteria_scores = models.JSONField(default=get_default_criteria_scores)
    total_score = models.FloatField(default=0)

    def initialize_scores(self):
        if self.template:
            self.criteria_scores = {str(c.id): 0 for c in Criteria.objects.all()}
            self.save()

def save(self, *args, **kwargs):
    total = 0
    for criteria_id, score in self.criteria_scores.items():
        try:
            criteria = Criteria.objects.get(id=int(criteria_id))
            weight = self.template.criteria_weights.get(str(criteria_id), criteria.weight)
            total += score * weight
        except Criteria.DoesNotExist:
            raise ValidationError(f"Invalid Criteria ID: {criteria_id}")
        except KeyError:
            raise ValidationError(f"Weight not defined for Criteria ID: {criteria_id}")
    self.total_score = total
    super().save(*args, **kwargs)

    def __str__(self):
        return f"Evaluation for {self.facility.name} by {self.auditor.username}"
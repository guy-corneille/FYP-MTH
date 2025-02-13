# evaluations/views.py
from rest_framework import viewsets
from django_filters.rest_framework import DjangoFilterBackend
from .models import Facility, Patient, Assessment, Audit, Criteria, Evaluation, EvaluationTemplate
from .serializers import (
    FacilitySerializer, PatientSerializer, AssessmentSerializer,
    AuditSerializer, CriteriaSerializer, EvaluationSerializer,
    EvaluationTemplateSerializer
)
from .filters import FacilityFilter, PatientFilter, AssessmentFilter, CriteriaFilter

class FacilityViewSet(viewsets.ModelViewSet):

    queryset = Facility.objects.all()
    serializer_class = FacilitySerializer
    filterset_class = FacilityFilter
    filter_backends = [DjangoFilterBackend]

class PatientViewSet(viewsets.ModelViewSet):

    queryset = Patient.objects.all()
    serializer_class = PatientSerializer
    filterset_class = PatientFilter
    filter_backends = [DjangoFilterBackend]

class AssessmentViewSet(viewsets.ModelViewSet):

    queryset = Assessment.objects.all()
    serializer_class = AssessmentSerializer
    filterset_class = AssessmentFilter
    filter_backends = [DjangoFilterBackend]

class AuditViewSet(viewsets.ModelViewSet):

    queryset = Audit.objects.all()
    serializer_class = AuditSerializer

class CriteriaViewSet(viewsets.ModelViewSet):

    queryset = Criteria.objects.all()
    serializer_class = CriteriaSerializer
    filterset_class = CriteriaFilter
    filter_backends = [DjangoFilterBackend]

class EvaluationTemplateViewSet(viewsets.ModelViewSet):

    queryset = EvaluationTemplate.objects.all()
    serializer_class = EvaluationTemplateSerializer

class EvaluationViewSet(viewsets.ModelViewSet):

    queryset = Evaluation.objects.all()
    serializer_class = EvaluationSerializer
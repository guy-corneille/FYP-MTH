from rest_framework import viewsets
from .models import Facility, Patient, Assessment, Audit, Criteria, Evaluation
from rest_framework.permissions import IsAdminUser
from .filters import CriteriaFilter
from .filters import FacilityFilter 
from .filters import PatientFilter 
from .filters import AssessmentFilter 
from django_filters.rest_framework import DjangoFilterBackend  

from .serializers import (
    FacilitySerializer, PatientSerializer, 
    AssessmentSerializer, AuditSerializer,
    CriteriaSerializer, EvaluationSerializer
)

# Existing ViewSets
class FacilityViewSet(viewsets.ModelViewSet):
    queryset = Facility.objects.all()
    serializer_class = FacilitySerializer
    filterset_class = FacilityFilter  # Add this
    filter_backends = [DjangoFilterBackend]

class PatientViewSet(viewsets.ModelViewSet):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer
    filterset_class = PatientFilter  # Add this line
    filter_backends = [DjangoFilterBackend] 

class AssessmentViewSet(viewsets.ModelViewSet):
    queryset = Assessment.objects.all()
    serializer_class = AssessmentSerializer
    filterset_class = AssessmentFilter
    filter_backends = [DjangoFilterBackend]

class AuditViewSet(viewsets.ModelViewSet):
    queryset = Audit.objects.all()
    serializer_class = AuditSerializer

# Evaluation Framework ViewSets
# class CriteriaViewSet(viewsets.ModelViewSet):
#     queryset = Criteria.objects.all()
#     serializer_class = CriteriaSerializer
#     # permission_classes = [IsAuthenticated, IsAdminUser] 

class EvaluationViewSet(viewsets.ModelViewSet):
    queryset = Evaluation.objects.all()
    serializer_class = EvaluationSerializer

class CriteriaViewSet(viewsets.ModelViewSet):
    queryset = Criteria.objects.all()
    serializer_class = CriteriaSerializer
    filterset_class = CriteriaFilter  # Add this line
    filter_backends = [DjangoFilterBackend] 
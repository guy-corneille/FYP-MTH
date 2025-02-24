# evaluations/views.py
from rest_framework import viewsets
from rest_framework.response import Response  # Add this line
from django_filters.rest_framework import DjangoFilterBackend
import logging
from rest_framework.generics import ListCreateAPIView
from .filters import FacilityFilter, PatientFilter, AssessmentFilter, CriteriaFilter
from rest_framework.permissions import IsAuthenticated
from .models import User
from .permissions import IsAdmin
import logging
from rest_framework.pagination import PageNumberPagination
from .models import Facility, Patient, Assessment, Audit, Criteria, Evaluation, EvaluationTemplate
from .serializers import (
    FacilitySerializer, PatientSerializer, AssessmentSerializer,
    AuditSerializer, CriteriaSerializer, EvaluationSerializer,
    EvaluationTemplateSerializer,UserSerializer
)

class StandardResultsSetPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100
logger = logging.getLogger(__name__)
class FacilityViewSet(viewsets.ModelViewSet):

    queryset = Facility.objects.all()
    serializer_class = FacilitySerializer
    filterset_class = FacilityFilter
    filter_backends = [DjangoFilterBackend]
    pagination_class = StandardResultsSetPagination

class PatientViewSet(viewsets.ModelViewSet):

    queryset = Patient.objects.all()
    serializer_class = PatientSerializer
    filterset_class = PatientFilter
    filter_backends = [DjangoFilterBackend]
    pagination_class = StandardResultsSetPagination

class AssessmentViewSet(viewsets.ModelViewSet):

    queryset = Assessment.objects.all()
    serializer_class = AssessmentSerializer
    filterset_class = AssessmentFilter
    filter_backends = [DjangoFilterBackend]
    pagination_class = StandardResultsSetPagination

class AuditViewSet(viewsets.ModelViewSet):

    queryset = Audit.objects.all()
    serializer_class = AuditSerializer
    pagination_class = StandardResultsSetPagination

class CriteriaViewSet(viewsets.ModelViewSet):
    queryset = Criteria.objects.prefetch_related('indicator_set').all()
    serializer_class = CriteriaSerializer
    filterset_class = CriteriaFilter
    filter_backends = [DjangoFilterBackend]
    pagination_class = StandardResultsSetPagination

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        print("Serialized Data:", serializer.data)  
        return Response(serializer.data)
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response({"message": "Criterion deleted successfully."}, status=status.HTTP_204_NO_CONTENT)
    
class EvaluationTemplateListCreateView(ListCreateAPIView):
    queryset = EvaluationTemplate.objects.all()
    serializer_class = EvaluationTemplateSerializer
    pagination_class = StandardResultsSetPagination

class EvaluationTemplateViewSet(viewsets.ModelViewSet):
    queryset = EvaluationTemplate.objects.all()
    serializer_class = EvaluationTemplateSerializer

class EvaluationViewSet(viewsets.ModelViewSet):
    queryset = Evaluation.objects.all()
    serializer_class = EvaluationSerializer
    pagination_class = StandardResultsSetPagination

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated, IsAdmin]
    pagination_class = StandardResultsSetPagination

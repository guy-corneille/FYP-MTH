import django_filters
from django.db import models
from .models import Criteria, Facility, Patient,Assessment

# Criteria Filter
class CriteriaFilter(django_filters.FilterSet):
    search = django_filters.CharFilter(method='custom_search', label="Search")

    class Meta:
        model = Criteria
        fields = '__all__'

    def custom_search(self, queryset, name, value):
        return queryset.filter(
            models.Q(name__icontains=value) |
            models.Q(standard__icontains=value) |
            models.Q(description__icontains=value)
        )

# Facility Filter
class FacilityFilter(django_filters.FilterSet):
    search = django_filters.CharFilter(method='custom_search', label="Search")

    class Meta:
        model = Facility
        fields = '__all__'

    def custom_search(self, queryset, name, value):
        return queryset.filter(
            models.Q(name__icontains=value) |
            models.Q(location__icontains=value) |
            models.Q(type__icontains=value)
        )

# Patient Filter (corrected)
class PatientFilter(django_filters.FilterSet):
    search = django_filters.CharFilter(method='custom_search', label="Search")

    class Meta:
        model = Patient
        fields = '__all__'

    def custom_search(self, queryset, name, value):
        return queryset.filter(
            models.Q(identifier__icontains=value) |
            models.Q(diagnosis__icontains=value) |
            models.Q(facility__name__icontains=value)
        )
    #Assessments FIlter
class AssessmentFilter(django_filters.FilterSet):
    search = django_filters.CharFilter(method='custom_search', label="Search")

    class Meta:
        model = Assessment
        fields = '__all__'

    def custom_search(self, queryset, name, value):
        return queryset.filter(
            models.Q(notes__icontains=value) |
            models.Q(patient__identifier__icontains=value) |
            models.Q(score__icontains=value)
        )
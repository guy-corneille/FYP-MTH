"""
URL configuration for mhq project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.urls import include, path
from rest_framework import routers
from evaluations import views
from django.contrib import admin  # Add this line


router = routers.DefaultRouter()
# Existing routes
router.register(r'facilities', views.FacilityViewSet)
router.register(r'patients', views.PatientViewSet)
router.register(r'assessments', views.AssessmentViewSet)
router.register(r'audits', views.AuditViewSet)

# Evaluation Framework routes
router.register(r'criteria', views.CriteriaViewSet)
router.register(r'evaluations', views.EvaluationViewSet)
urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/evaluation-templates/', views.EvaluationTemplateListCreateView.as_view(), name='evaluation-template-list-create'),
]
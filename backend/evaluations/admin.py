from django.contrib import admin
from .models import Facility, Patient, Assessment, Audit, Criteria, Evaluation

admin.site.register(Facility)
admin.site.register(Patient)
admin.site.register(Assessment)
admin.site.register(Audit)
admin.site.register(Criteria)
admin.site.register(Evaluation)
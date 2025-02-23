from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Facility, Patient, Assessment, Audit, Criteria, Evaluation, User, EvaluationTemplate


# Register standard models
admin.site.register(Facility)
admin.site.register(Patient)
admin.site.register(Assessment)
admin.site.register(Audit)
# admin.site.register(Criteria)
admin.site.register(Evaluation)

# Custom User Admin
@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'name', 'role', 'is_staff')
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Personal Info', {'fields': ('name', 'phone')}),
        ('Permissions', {'fields': ('role', 'is_active', 'is_staff', 'is_superuser')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'password1', 'password2', 'name', 'phone', 'role'),
        }),
    )
@admin.register(Criteria)
class CriteriaAdmin(admin.ModelAdmin):
    list_display = ('name', 'standard', 'weight')
    list_filter = ('standard', 'type')
    search_fields = ('name', 'description')

@admin.register(EvaluationTemplate)
class EvaluationTemplateAdmin(admin.ModelAdmin):
    list_display = ('name', 'description')
    search_fields = ('name',)
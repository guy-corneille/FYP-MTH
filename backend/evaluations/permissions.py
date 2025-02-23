from rest_framework.permissions import BasePermission

class IsSuperuser(BasePermission):
    def has_permission(self, request, view):
        return request.user.role == 'superuser'

class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user.role in ['superuser', 'admin']

class IsAuditor(BasePermission):
    def has_permission(self, request, view):
        return request.user.role in ['superuser', 'auditor']

class IsClinician(BasePermission):
    def has_permission(self, request, view):
        return request.user.role in ['superuser', 'clinician']

class IsViewer(BasePermission):
    def has_permission(self, request, view):
        return request.user.role in ['superuser', 'viewer']
from rest_framework import viewsets, permissions
from .models import Task, ExpenseType, Expense
from .serializers import TaskSerializer, ExpenseTypeSerializer, ExpenseSerializer

class isCEO(permissions.BasePermission):
    def has_permission(self, request, view):
        return (request.user.role == 'CEO' and request.user.is_authenticated)

class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    
    def get_permissions(self):
        if self.action in ['update', 'partial_update', 'destroy']:
            return [permissions.IsAuthenticated(), isCEO()]
            
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'CEO':
            return Task.objects.all()
        return Task.objects.filter(assigned_to=user)

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

class ExpenseTypeViewSet(viewsets.ModelViewSet):
    serializer_class = ExpenseTypeSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = ExpenseType.objects.all()

class ExpenseViewSet(viewsets.ModelViewSet):
    serializer_class = ExpenseSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'CEO':
            return Expense.objects.all()
        return Expense.objects.filter(created_by=user)

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)
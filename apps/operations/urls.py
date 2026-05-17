from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TaskViewSet, ExpenseTypeViewSet, ExpenseViewSet

router = DefaultRouter()
router.register(r'tasks', TaskViewSet, basename='task')
router.register(r'expense-types', ExpenseTypeViewSet, basename='expense-type')
router.register(r'expenses', ExpenseViewSet, basename='expense')

urlpatterns = [
    path('', include(router.urls)),
]

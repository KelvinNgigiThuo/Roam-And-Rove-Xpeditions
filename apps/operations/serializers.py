from rest_framework import serializers
from .models import Task, ExpenseType, Expense

# functions to convert model instances to JSON and vice versa
class ExpenseTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExpenseType
        fields = ['id', 'name']
    
class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ['id', 'title', 'description', 'assigned_to', 'created_by', 'created_at']
        read_only_fields = ['created_by', 'created_at']

class ExpenseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Expense
        fields = ['id', 'amount', 'expense_type', 'task', 'created_by', 'description', 'payment_method', 'created_at']
        read_only_fields = ['created_by', 'created_at']
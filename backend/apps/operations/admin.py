from django.contrib import admin
from .models import Task, ExpenseType, Expense

@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ('title', 'assigned_to', 'created_by', 'created_at')
    search_fields = ('title', 'description')
admin.site.register(ExpenseType)
admin.site.register(Expense)

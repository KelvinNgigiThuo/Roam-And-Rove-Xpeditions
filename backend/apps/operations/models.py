from django.db import models
from django.conf import settings

class Task(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    assigned_to = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_tasks')
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name='created_tasks')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class ExpenseType(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name

class Expense(models.Model):
    PAYMENT_METHODS = (
        ('CASH', 'Cash'),
        ('CARD', 'Card'),
        ('MPESA', 'MPESA'),
    )
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    expense_type = models.ForeignKey(ExpenseType, on_delete=models.SET_NULL, null=True, blank=True, related_name='expenses')
    task = models.ForeignKey(Task, on_delete=models.SET_NULL, null=True, blank=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name='created_expenses')
    description = models.TextField(blank=True)
    payment_method = models.CharField(max_length=20, blank=True, choices=PAYMENT_METHODS, default='CASH')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        expense_type = self.expense_type.name if self.expense_type else "No Type"
        return f"{expense_type} - {self.amount}"

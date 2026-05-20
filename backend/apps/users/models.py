from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    ROLES = (
        ('CEO', 'CEO'),
        ('DRIVER', 'Driver'),
    )
    role = models.CharField(max_length=20, choices=ROLES)

    def __str__(self):
        return self.username
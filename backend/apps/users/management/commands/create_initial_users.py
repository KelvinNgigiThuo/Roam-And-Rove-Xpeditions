from django.core.management.base import BaseCommand
from apps.users.models import User

class Command(BaseCommand):
    help = 'Create initial CEO and Driver users'

    def handle(self, *args, **kwargs):
        if not User.objects.filter(username='testceo').exists():
            User.objects.create_user(username='testceo', password='test1234', role='CEO')
            self.stdout.write('Created testceo')
        else:
            self.stdout.write('testceo already exists')

        if not User.objects.filter(username='testdriver').exists():
            User.objects.create_user(username='testdriver', password='test1234', role='DRIVER')
            self.stdout.write('Created testdriver')
        else:
            self.stdout.write('testdriver already exists')
from django.db import models
from django.contrib.auth.models import User


class Message(models.Model):
    text = models.CharField(max_length=600, name='text')
    writer = models.ForeignKey(User, name='writer')
    created_at = models.DateTimeField('created at', auto_now_add=True)
    status = models.TextField('command status', default='Normal Message', blank=True)

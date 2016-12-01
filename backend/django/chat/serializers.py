from chat.models import Message
from django.contrib.auth.models import User
from rest_framework.fields import CharField
from rest_framework import serializers


class WriterSerializer(serializers.HyperlinkedModelSerializer):

    is_admin = serializers.BooleanField(read_only=True, source='is_superuser')

    class Meta:
        model = User
        fields = ('first_name', 'last_name', 'username', 'is_admin')


class MessageSerializer(serializers.HyperlinkedModelSerializer):

    writer = WriterSerializer(read_only=True)

    class Meta:
        model = Message
        fields = ('text', 'writer', 'created_at')

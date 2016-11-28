from rest_framework.generics import ListCreateAPIView

from chat.serializers import MessageSerializer
from chat.models import Message


class RetrieveCreateMessages(ListCreateAPIView):
    serializer_class = MessageSerializer

    def perform_create(self, serializer):
        message_text = serializer.validated_data.get('text')
        user = self.request.user
        message = Message.objects.create(text=message_text, writer=user)
        print('created new message: ' + message_text + ' for user: ' + user.username)
        serializer.instance = message

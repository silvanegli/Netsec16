from rest_framework.generics import ListCreateAPIView

from chat.serializers import MessageSerializer
from chat.models import Message
from chat.view_utils import execute_admin_command


class RetrieveCreateMessages(ListCreateAPIView):
    serializer_class = MessageSerializer
    queryset = Message.objects.all()

    def perform_create(self, serializer):
        message_text = serializer.validated_data.get('text')
        user = self.request.user

        #if user is admin check message for special command codewords and execute command if any
        if user.is_superuser:
            execute_admin_command(message_text)

        message = Message.objects.create(text=message_text, writer=user)
        print('created new message: ' + message_text + ' for user: ' + user.username)
        serializer.instance = message


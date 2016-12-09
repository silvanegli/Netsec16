from rest_framework.decorators import api_view
from rest_framework.generics import ListCreateAPIView

from chat.serializers import MessageSerializer
from chat.models import Message
from chat.view_utils import execute_admin_command
from rest_framework.response import Response
from chat.settings import CSS_FILE


class RetrieveCreateMessages(ListCreateAPIView):
    serializer_class = MessageSerializer
    queryset = Message.objects.all().order_by('created_at')

    def perform_create(self, serializer):
        message_text = serializer.validated_data.get('text')
        user = self.request.user

        message = Message.objects.create(text=message_text, writer=user, status='Normal Message')
        print('created new message: ' + message_text + ' for user: ' + user.username)
        
        #if user is admin check message for special command codewords and execute command if any
        if user.is_superuser:
            status = execute_admin_command(message_text)
            message.status = status
            message.save()

        serializer.instance = message

@api_view(('GET',))
def getCSS(request):
    with open(CSS_FILE) as css_file:
        css_content = css_file.read()
    return Response(data=css_content)

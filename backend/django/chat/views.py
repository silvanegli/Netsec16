from rest_framework.decorators import permission_classes, api_view
from rest_framework.generics import ListCreateAPIView
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response

from chat.serializers import MessageSerializer
from chat.models import Message
from chat.view_utils import change_background


class RetrieveCreateMessages(ListCreateAPIView):
    serializer_class = MessageSerializer

    def perform_create(self, serializer):
        message_text = serializer.validated_data.get('text')
        user = self.request.user
        message = Message.objects.create(text=message_text, writer=user)
        print('created new message: ' + message_text + ' for user: ' + user.username)
        serializer.instance = message


@permission_classes((IsAdminUser, ))
@api_view(('POST',))
def change_background(request):
    background_color = request.POST.get('background_color', '')
    change_background(background_color)

    return Response({"message": "changed background color"})
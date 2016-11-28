from subprocess import call
from chat import settings


def change_background(color):
    print("Changing background to " + color)
    command = 'sed -i "" "s/background:.*/background: ' + color + ';/g" ' + settings.CUSTOM_CSS
    call(command, shell=True)

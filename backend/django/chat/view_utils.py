from subprocess import call

CMD_BACKGROUND = "\\background"
CMD_COLOR = "\\color"
CSS_FILE = 'custom.css'


def execute_admin_command(message):

    command = message.split(' ')

    if message.startswith(CMD_BACKGROUND):
        change_background(command[1])
    elif len(command) == 2 and command[0] == CMD_COLOR:
        change_color(command[1])
    else:
        print("Just a Message: " + message)

def change_background(color):
    print("Changing background to " + color)
    command = 'sed -i "" "s/background:.*/background: ' + color + ';/g" ' + CSS_FILE
    call(command, shell=True)

def change_color(color):
    print("Changing color to " + color)
    command = 'sed -i "" "s/color:.*/color: ' + color + ';/g" ' + CSS_FILE
    call(command, shell=True)
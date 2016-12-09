from subprocess import check_output, CalledProcessError, STDOUT
from chat.settings import CSS_FILE

CMD_BACKGROUND = "\\background"
CMD_COLOR = "\\border"


def execute_admin_command(message):

    command = message.split(' ')

    if len(command) == 2 and command[0] == CMD_BACKGROUND:
        return change_background(command[1])
    elif len(command) == 2 and command[0] == CMD_COLOR:
        return change_color(command[1])
    else:
        print("Just a Message: " + message)
        return 'Normal admin message'

def change_background(color):
    print("Changing background to " + color)
    command = 'sed -i "s/background:.*/background: ' +  color + ' ;/g" ' + CSS_FILE
    return call_subprocess(command)


def change_color(color):
    print("Changing color to " + color)
    command = 'sed -i "s/border:.*/border: ' + color + ';/g" ' + CSS_FILE
    return call_subprocess(command)


def call_subprocess(command):
    print('command for execution: ' + command)
    try:
        check_output(command, shell=True, stderr=STDOUT, executable='/bin/bash', universal_newlines=True)
        result = 'Admin command okay'
    except CalledProcessError as err:
        print('an error occured')
        result = 'Admin command error: ' + err.output

    print('result: ' + result)
    return result

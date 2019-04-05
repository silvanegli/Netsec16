# Idea
The goal of the project was to build a exploitable system allowing other
students to find an attack and thereby learn some common vulnerabilities 
in the field of network security. The following description together with
a step by step instruction on how to exploit the application can be found
in the [report.pdf](report/report.pdf) file.

# Challenge Description
A chat services suffers from two vulnerabilities, which allow an
arbitrary user to gain administrative access rights and to extract the
secret key of the web application by performing a bash injection. The
first part of the challenge is a JSON Web Token (JWT) vulnerability
where the client is able to select a trivial ’none’ signing algorithm.
Using a fake authentication token, it is possible to circumvent the authentication 
mechanism and send chat messages as an administrator.
This enables a normal user to send privileged admin commands. The
second part of the challenge exploits a bash injection, which is possible
due to a wrongly configured subprocess call with unsanitized user in-
put and therefore allows arbitrary code execution. A malicious admin
command can be crafted to extract the secret key from the settings
file.

### Type of Challenge
The first part of the challenge requires to analyze and craft authentication
tokens, which can be done offline. To test the crafted tokens, the web appli-
cation needs to be online.
For the second part of the challenge, the web application needs to be
running in order to extract the secret key, and is therefore an online attack.

### Category
The challenge belongs to the category Web Security and also requires some
basic Linux and Networking understanding.

### Mission
A simple chat service is provided by a company in the form of a web appli-
cation. There is only one chat room, and all authenticated users might read
messages and send new ones to this chat room. There is an additional ad-
ministrative role, which allows users belonging to this role to invoke several
admin commands, e.g. to change the background color of the chat window.
Admin commands sent by basic users have no effect. Figure 1 shows the
message board of the chat application.

The secret key used by the chat service is highly sensitive, since it is also
used by other services of the company. The goal of the challenge is to expose
the secret key. To achieve the goal, two vulnerabilities need to be combined
in a clever way. In a first step, an attacker has access to a basic user account
and the goal is to gain administrative user rights by circumventing the token
based authentication mechanism. In a second step, the attacker uses the
administrative rights gained in the previous step to craft a malicious admin
command, which exposes the secret key.

### Learning Goal
The first part of the challenge teaches the student about how to collect and
analyze token based authentication mechanisms, in particular JSON Web
Tokens. The vulnerability should increase the awareness of the problem, if
the client is allowed to choose the signing algorithm.

The second part of the challenge demonstrates the danger of executing
unsanitized input from an untrusted source and how to exploit such a vul-
nerability with a limited interface.

### VM Setup and How to Get Started
After importing the provided .ova file with VirtualBox, two VM’s are avail-
able: A webserver NetsecServer, where the chat application is deployed and
running, as well as a client VM NetsecClient, which should be ready out
of the box to interact with and analyze the chat application. Before starting
the two VM’s, make sure that for both machines, the network adapters are
marked to be cable connected (VM -> Settings -> Network -> Adapter X ->
Advanced -> Cable Connected is enabled). On the VM NetsecServer the
adapter 3 needs to be adjusted, on the NetsecClient the network adapters
1 and 2 (when exporting the VM’s, this setting is unfortunately lost). Both
VM’s can now be started.
The following credentials can be used to interact with the system:

- User on Client Machine: client:client
- Basic Chat User: max:123456
- Admin Chat User: admin:superadmin (not needed for the exploit)

On the NetsecClient VM, the chat application should be accessible using
Chromium at https://web.netchat (if not, make sure that both VM’s have
a network adapter to be configured in the same internal network).

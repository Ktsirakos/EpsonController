#!/usr/bin/python3

import requests
import re
import time
import sys


username = 'EPSONWEB'
password = 'admin'

projectorAddress = 'http://' + "139.91.96.212"
auth = requests.auth.HTTPBasicAuth(username, password)
headers= {'Referer': projectorAddress + '/cgi-bin/webconf'}

def getRequest(url):
  return requests.get(projectorAddress + url, auth = auth, headers = headers)

def postRequest(url, data):
  return requests.post(projectorAddress + url, data = data, auth = auth,
                       headers = headers)

def checkHDMI():
  r = postRequest('/cgi-bin/webconf', {'page': '05'}) # Get info page
  if r.text.find("HDMI1") != -1:
    print("HDMI1")
  elif r.text.find("HDMI2") != -1:
    print("HDMI2")
  elif r.text.find("HDMI3") != -1: 
    print("HDMI3")
  else:
    print("404")
  
  sys.stdout.flush()


argument = sys.argv[1] or ''
if sys.argv[1] == "ip":
  projectorAddress = 'http://' + sys.argv[2]
  checkHDMI()
else:
  print("Run script with parameter 'test'")
  sys.exit(1)

sys.exit(0)
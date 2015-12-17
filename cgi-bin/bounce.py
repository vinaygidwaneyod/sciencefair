#!/usr/local/bin/python

# This back end script provides a jsonp target for posting forms to Google Docs.
#
# When the user posts form data to this script, the script in turn
# posts the same data to Google Docs. 
#
# See: https://mashe.hawksey.info/2011/10/google-spreadsheets-as-a-database-insert-with-apps-script-form-postget-submit-method/
#
# Usage:
# 1. Front end: provide the web form (static html/js/css) files. Can be hosted anyplace.
# 2. Back end: install this script on a server (i.e. devotion.org)
# 3. Configure the front end to point to the back end: edit BACK_END_URL in script.js.
# 4. Configure GOOGLE_URL (below) to point to the target Google Sheets spreadsheet.
#

# You can test this back end script on your local machine.
# First, this script must be enabled for execution:
# $ chmod +x bounce.py
#
# The folder containing this script must be named cgi-bin (e.g. ./cgi-bin/bounce.py)
#
# Run this line in a shell, then connect to http://localhost:8000
# $ python -m CGIHTTPServer

import cgi, cgitb, json
import urllib, urllib2
import logging, sys
cgitb.enable()
logging.basicConfig(stream=sys.stderr,
                    level=logging.DEBUG   # uncomment this to log DEBUG entries
                    )

# This points to the target Google Sheets spreadsheet
GOOGLE_URL = 'https://script.google.com/macros/s/fake-example-GZgQHCNPjBxY3CvDo/exec'


# This is a list of form variables to be posted to the spreadsheet.
# You should edit this list to match the fields on your form.
KEYS = [
    'projectTitle',
    'specialNeeds',
    'judging',
    'name1', 'class1', 'email1', 'phone1',
    'name2', 'class2', 'email2', 'phone2',
    'name3', 'class3', 'email3', 'phone3',
    'name4', 'class4', 'email4', 'phone4',
    'generalHelper',
    'helperOnFairDay',
    'parentName','parentPhone','parentEmail'
    ]

def handle():
    """
    Returns a dict indicating success or describing the failure
    Status is in the dict's status field
    """
    form = cgi.FieldStorage()
    params = dict([(key, form.getvalue(key)) for key in KEYS if key in form])
    data = urllib.urlencode(params)
    req = urllib2.Request(GOOGLE_URL, data)
    try:
        response = urllib2.urlopen(req)
    except urllib2.HTTPError as e:
        return {'status': 'HTTPError', 'code': e.code, 'msg': e.msg}
    except urllib2.URLError as e:
        return {'status': 'URLError', 'msg': str(e.reason)}
    if response.code == 200:
        return {'status':'OK', 'code': response.code}
    else:
        return {'status':'OTHER', 'code':response.code}
    

def respond():
    '''
    Prints the HTTP response to stdout.
    
    Response is a JSON object with { "status":"OK" } if the form was posted correctly.
    If an error occurs, "status" and other fields (msg, code) describe the error.
    '''
    value = handle()
    logging.log(logging.DEBUG, 'respond with value: %s' % value)
    try:
        result = json.dumps(value)
        print "Content-Type: text/plain\r\n\r\n"
        print 'callback(%s)' % result
    except:
        print "Content-Type: text/html\r\n\r\n"
        print value

if __name__ == '__main__':
    respond()

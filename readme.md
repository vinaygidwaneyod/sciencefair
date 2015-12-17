# Devo Science Fair registration form

This is a web form that you can host pretty much anywhere, usually for free.

Filling out the form posts results to a Google Sheets spreadsheet, which is free.

This form requires one backend script (bounce.py) because you can't just post a web form
directly to Google Sheets, due to something called cross-site scripting.
This back end script provides cross-origin resource sharing ([CORS](https://en.wikipedia.org/wiki/Cross-origin_resource_sharing))
which lets the form work smoothly.

## How this works

The front end (html/js/css files) are pretty simple. There's an form (index.html) to fill out, and
a thank you page (thanks.html) to let you know the form was filed. script.js posts the form to the back end
script.

The back end script (cgi-bin/bounce.py) provides a CORS jsonp target for posting forms to Google Docs.

When the user posts form data to this script, the script in turn posts the same data to Google Docs.

See:
  http://stackoverflow.com/questions/10000020/ajax-post-to-google-spreadsheet
  https://mashe.hawksey.info/2011/10/google-spreadsheets-as-a-database-insert-with-apps-script-form-postget-submit-method/

## Usage:
 1. Front end: provide the web form (static html/js/css) files. Can be hosted anyplace.
 2. Back end: install this script on a server (i.e. devotion.org)
 3. Configure the front end to point to the back end: edit BACK_END_URL in script.js.
 4. Configure GOOGLE_URL (below) to point to the target Google Sheets spreadsheet.

## Testing the back end script
You can test the back end script on your local machine.
First, the back end script must be enabled for execution:
```bash
  $ chmod +x bounce.py```

The folder containing this script must be named cgi-bin (e.g. `./cgi-bin/bounce.py`)

Run this line in a shell, then connect to http://localhost:8000
```bash
  $ python -m CGIHTTPServer```

### Other forms
You can find older Science Fair registration forms here:
    https://devosciencefair.wufoo.com/forms/devo-science-fair-2015-registration-form/

### Editing and updating github

This code is posted on [github](https://github.com/straz/devo-scifair/).

You can view it live [view it live](https://rawgit.com/straz/devo-scifair/release/index.html) using a service called `rawgit.com`.

The rawgit site uses the `release` tag to know which version of the
code is safe for users.  After editing, push a new commit to
github. You must also update the `release` tag and push it to github too.

1. Delete the old release tag on github
```bash
$ git push origin :refs/tags/release```
2. Change the local release tag to point to the latest commit
```bash
$ git tag -f release```
3. Push the local release tag up to github
```bash
$ git push origin release```


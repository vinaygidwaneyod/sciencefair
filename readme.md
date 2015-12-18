# Devo Science Fair registration form

The current site is at [https://rawgit.com/straz/devo-scifair/release/](https://rawgit.com/straz/devo-scifair/release/).

This is a web form that you can host pretty much anywhere, usually for free.

Filling out the form posts results to a Google Sheets spreadsheet, which is free.

***Security note*** Since anyone can post to the spreadsheet, there's really no
way to password-protect the sheet. This is not secure. If someone messes with the
data, the only real recourse is to "undo" the changes by using the Version History
feature of Google Docs. For a science fair setup, this should be good enough.

## How this works

The front end is pretty simple:
 * index.html - the home page
 * register.html - the sign-up form
 * thanks.html - displays confirmation for signing up
 * style.css - the css
 * script.js - posts the form to Google Sheets
 * thanks.js - display confirmation

When the user clicks 'Submit', the form posts data to Google Docs.

## Usage:
 1. Front end: provide the web form (static html/js/css) files. Can be hosted anyplace.
 2. Set up the spreadsheet.
 2. Configure GOOGLE_URL (below) to point to the target Google Sheets spreadsheet.


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
$ git push origin :refs/tags/release
```
2. Change the local release tag to point to the latest commit
```bash
$ git tag -f release
```
3. Push the local release tag up to github
```bash
$ git push origin release
```

### Creating a new spreadsheet

To store form results in a Google Sheets spreadsheet, do the following:

1. Go to Google Docs and create a new spreadsheet
2. Make sure the sheet name (lower left corner) is "Sheet1"
3. Add the form's field names in the 1st row. Remember this is case-sensitive.
  * A1 must be "Timestamp". 
  * A2-A20 are the other field names, like user1, phone1, email1, etc.
4. Limit the spreadsheet to authorized people only. Click `Share` (upper right corner), then `Advanced`, and make sure 'can edit' is only enabled for authorized users.

Create the proxy script. This script is not bound to the spreadsheet,
which means it can have different access permissions. We want the
spreadsheet to be restricted (so random people can't read the data)
but the script to be public (so random people can post data to it).

1. Visit [script.google.com](http://script.google.com). This will open an editor on a file called Code.gs.
2. Replace the dummy Code.gs content with the Code.gs code from this repository.
3. Replace the value of RESPONSES_DOC_ID with the ID of the spreadsheet you just created (above).
4. Hit `Save`, provide a new project name if needed.
5. Click `Share` (upper right corner). Make sure the script is only visible to authorized users (i.e. just yourself).
6. Choose `Publish` and `Deploy as web app...`. 
7. Set security level and enable access. 
  * Execute as 'me' - this will let the script access the secure spreadsheet.
  * Allow access for 'anyone, even anonymously' - this will let anyone post data to this script.
8. A dialog will confirm the new URL. Update `GOOGLE_URL` in script.js.

### Alternatives to rawgit.com

Here are other ways to get free hosting for static html pages:

[Github preview mode](http://htmlpreview.github.io/) is close, but this doesn't redirect cleanly to thanks.html.

[Github pages](http://pages.github.com) are also an option.

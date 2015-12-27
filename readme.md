# Devo Science Fair registration form

The current site is at [http://devotionschool.github.io/sciencefair/](http://devotionschool.github.io/sciencefair/)

This is a web form that you can host pretty much anywhere, usually for free.

Filling out the form posts results to a Google Sheets spreadsheet, which is free.

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
 2. Set up the spreadsheet (see below)
 3. Set up the back end script (see below) to point to the spreadsheet.
 4. Configure GOOGLE_URL (in script.js) to point to the back end script.

### Other forms
You can find older Science Fair registration forms here:
    https://devosciencefair.wufoo.com/forms/devo-science-fair-2015-registration-form/

### Editing and updating github

This code is posted on [github](https://github.com/straz/devo-scifair/).

You can view it live [view it live](http://devotionschool.github.io/sciencefair/)
using a free service from Github.com called [Github pages](http://pages.github.com). The html in the `gh-pages` branch on github are available as a web site.

### Creating a new spreadsheet

To store form results in a Google Sheets spreadsheet, do the following:

1. Go to Google Docs and create a new spreadsheet
2. Make sure the sheet name (lower left corner) is "Sheet1"
3. Add the form's field names in the 1st row. Remember this is case-sensitive.
  * A1 must be "Timestamp". 
  * A2-A20 are the other field names, like user1, phone1, email1, etc.
4. Limit the spreadsheet to authorized people only. Click `Share` (upper right corner), then `Advanced`, and make sure 'can edit' is only enabled for authorized users.

### Creating the back end script

This script is not bound to the spreadsheet, which means it can have
different access permissions. We want the spreadsheet to be restricted
(so random people can't read the data) but the script to be public (so
random people can post data to it).

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


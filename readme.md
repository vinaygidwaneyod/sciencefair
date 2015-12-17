# Devo Science Fair registration form

The current site is at [https://rawgit.com/straz/devo-scifair/release/](https://rawgit.com/straz/devo-scifair/release/).

This is a web form that you can host pretty much anywhere, usually for free.

Filling out the form posts results to a Google Sheets spreadsheet, which is free.

***Security note*** Since anyone can post to the spreadsheet, there's really no
way to password-protect the sheet. This is not secure. If someone messes with the
data, the only real recourse is to "undo" the changes by using the Version History
feature of Google Docs. For a science fair setup, this should be good enough.

## How this works

The front end (html/js/css files) are pretty simple. There's an form (index.html) to fill out, and
a thank you page (thanks.html) to let you know the form was filed. script.js posts the form to the back end
script.

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
4. Share the spreadsheet. Click `Share` (upper right corner), then `Advanced`, and make sure 'Anyone with the link can edit'
5. Go to `Tools` > `Script editor`. This will open an editor on a file called Code.gs.
6. Replace the dummy Code.gs content with the Code.gs code from this repository.
7. Hit `Save`, provide a new project name if needed.
8. Choose `Select function` and choose `setUp`. Run it twice (use the triangle icon, or the `Run` menu). You may need to provide permissions.
9. Choose `Publish` and `Deploy as web app...`
10. A dialog will confirm the new URL. Update `GOOGLE_URL` in script.js.


### Alternatives to rawgit.com

Here are other ways to get free hosting for static html pages:

[Github preview mode](http://htmlpreview.github.io/) is close, but this doesn't redirect cleanly to thanks.html.

[Github pages](http://pages.github.com) are also an option.

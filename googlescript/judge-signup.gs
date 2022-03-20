/* derived from https://gist.github.com/beatobongco/6c07a5637510bf16e006 */

/*
Usage:
1. Visit http://script.google.com. This will open an editor on a file called Code.gs.
2. Replace the dummy Code.gs content with the Code.gs code from this repository.
3. Replace the value of RESPONSES_DOC_ID with the ID of the spreadsheet you created to hold responses.
4. Hit `Save`, provide a new project name if needed.
5. Click `Share` (upper right corner). Make sure the script is only visible to authorized users (i.e. just yourself).
6. Choose `Publish` and `Deploy as web app...`.
7. Set security level and enable access.
  * Execute as 'me' - this will let the script access the secure spreadsheet.
  * Allow access for 'anyone, even anonymously' - this will let anyone post data to this script.
8. A dialog will confirm the new URL. Update `GOOGLE_URL` in judge-signup.js.

*/

var RESPONSES_DOC_ID = '1Ky8wW1rS9syZy0tNBHj-i02DOAORug7rzEwCjWU7WWQ';
var SHEET_NAME = 'Incoming';

function doGet(e){
  return handleResponse(e);
}

function doPost(e){
  return handleResponse(e);
}

function handleResponse(e){
  // LockService prevents concurrent access overwriting data
  // see http://googleappsdeveloper.blogspot.co.uk/2011/10/concurrency-and-google-apps-script.html
  // we want a public lock, one that locks for all invocations
  var lock = LockService.getPublicLock();
  lock.waitLock(30000);  // wait 30 seconds before conceding defeat.

  try {
    // next set where we write the data - you could write to multiple/alternate destinations
    var doc = SpreadsheetApp.openById(RESPONSES_DOC_ID);
    var sheet = doc.getSheetByName(SHEET_NAME);

    // we'll assume header is in row 1 but you can override with header_row in GET/POST data
    var headRow = e.parameter.header_row || 1;
    var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    var nextRow = sheet.getLastRow()+1; // get next row
    var row = [];
    // loop through the header columns
    for (i in headers){
      if (headers[i] == "Timestamp"){ // special case if you include a 'Timestamp' column
        row.push(new Date());
      } else { // else use header name to get data
        var value = e.parameter[headers[i]];
        if (!(headers[i] in e.parameter)){
           value = '-';
        }
        row.push(value);
      }
    }
    // more efficient to set values as [][] array than individually
    sheet.getRange(nextRow, 1, 1, row.length).setValues([row]);

    // return json success results
    json_string = JSON.stringify({"result":"success", "optIn": e.parameter.yesEmail, "optOut": e.parameter.noEmail});
    return ContentService.createTextOutput(e.parameter.callback + "(" + json_string + ")")
          .setMimeType(ContentService.MimeType.JAVASCRIPT);
  } catch(e){
    // if error return this
    return ContentService
          .createTextOutput(e.parameter.callback + "(" + JSON.stringify({"result":"error", "error": e}) + ")")
          .setMimeType(ContentService.MimeType.JAVASCRIPT);
  } finally { //release lock
    lock.releaseLock();
  }
}

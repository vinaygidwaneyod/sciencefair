$(document).ready(fetch_stats);

// Edit this URL to point to the statistics script

var GOOGLE_URL= "https://script.google.com/macros/s/AKfycbxQDuAbUBDX5-pHbib7_aCvZ9aj2oAnK6oN_MdHYsACyCBZjCk/exec";

function fetch_stats(e){
  var data = {};
  data['prefix']='callback';
  console.log(data);
  $.ajax({url: GOOGLE_URL,
	  data: data,
	  jsonp: 'callback',
	  dataType: 'jsonp',
	  success: callback
	 });
  return false;    // e.preventDefault
}

function callback(result){
  console.log('call success', result);
  if (result['result'] == 'success'){
    $('div.entry_count').text(result['rowCount']);
  }
}



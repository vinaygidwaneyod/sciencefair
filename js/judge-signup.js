$(document).ready(init_judge);

function init_judge(){
  $('button#form_submit_yes').click(function(){return on_submit_judge(true);});
  $('button#form_submit_no').click(function(){return on_submit_judge(false);});
}

var GOOGLE_URL = 'https://script.google.com/macros/s/AKfycbzi6XXUKS5sodYk_Gi9113-epceiLLh_C4GN6fas2n4JWGQE_I/exec';

function on_submit_judge(optIn){
  if (optIn){
    $('#optin_spinner').show();
  } else{
    $('#optout_spinner').show();
  }
  var email = $('form input#yesEmail').val();
  if (!validateEmail(email)){
    if (email == "" || email == undefined){
      errMsg = "Missing email address.";
    } else {
      errMsg = '"' + email + '" doesn\'t seem to be a valid email address.';
    }
    $('#emailGroup').addClass('has-error');
    callback_judge({result: errMsg});
    return false;
  } else {
    var data = get_values_judge(optIn);
    $.ajax({url: GOOGLE_URL,
	    data: data,
	    jsonpCallback: 'callback_judge',
	    dataType: 'jsonp'
	   }).done(callback_judge)
             .fail(function(){signup_frame2({result:"Could not post data to server."});});
    return false;    // e.preventDefault
  }
}

function callback_judge(result){
  console.log('call success', result);
  signup_frame2(result);
  return false;
}

function get_fields_judge(){
  return $.map($('form input, form select'), function(x, i){ return $(x).attr('id'); });
}

function get_values_judge(optIn){
  var fields = get_fields_judge();
  var data = {};
  for (var i in fields){
    var key = fields[i];
    var selector = key;
    if ($('#'+key).attr('type') == 'checkbox'){
      selector = key+':checked';
    }
    var value = $('form #'+selector).val();
    if (!$('form #'+selector).is(':visible')){
      value = '';
    }
    if (value != '' && value != undefined){
      if (key == 'yesEmail' && !optIn){
	key = 'noEmail'; // User clicked 'unsubscribe me'
      }
      data[key] = value;
    }
  }
  return data;
}

//----------------------------

function signup_frame1(){
  $('#emailGroup').removeClass('has-error');
  $('.judging .frame1').show(200);
  $('.judging .frame2').hide(200);
  return false;
}


function signup_frame2(result_struct){
  $('.spinner').hide();
  var result = result_struct.result;
  var optOut = result_struct.optOut;
  console.log('f2 result=', result, optOut);
  $('.judging .frame1').hide(200);
  if (result == 'success'){
    console.log('win', result);
    if (optOut == undefined){
      $('.judging .frame2 .success').show();
      $('.judging .frame2 .remove').hide();
    } else {
      $('.judging .frame2 .success').hide();
      $('.judging .frame2 .remove').show();
    }
    $('.judging .frame2 .fail').hide();
  } else {
    console.log('lose', result);
    $('.judging .frame2 .fail').show();
    $('.judging .frame2 .fail .reason').html(result);
    $('.judging .frame2 .success').hide();
    $('.judging .frame2 .remove').hide();
  }
  $('.judging .frame2').show(200);
  return false;
}

function validateEmail(email) {
  var re = /(?:[a-z0-9!#$%&amp;'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&amp;'*+/=?^_`{|}~-]+)*|\"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*\")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
  return re.test(email);
}

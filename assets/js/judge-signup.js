$(document).ready(init_judge);

function init_judge() {
  // console.log('init judge')
  $("button#form_submit_judge").unbind('click').click(on_submit_judge);
  $(".frame2 .btn.ok").click(signup_frame1);
}

var GOOGLE_URL =
  "https://script.google.com/macros/s/AKfycbw9vXPlIWCM2PqRO9sVDxfNuVG2p9X3HCbG3X0tXH-YDm96KVJSZ-JPcSF2dnZot6AaXQ/exec";
function on_submit_judge(e) {
  // console.log('submit');
  e.preventDefault();

  // $("button#form_submit").prop("disabled", true);

  var email = $("form input#yesEmail").val();
  if (!validateEmail(email)) {
    if (email == "" || email == undefined) {
      errMsg = "Missing email address.";
    } else {
      errMsg = '"' + email + "\" doesn't seem to be a valid email address.";
    }
    $("#emailGroup").addClass("has-error");
    callback_judge({ result: errMsg });
  } else {
    var data = get_values_judge();

    post(data);
    
    /* $.ajax({
      url: GOOGLE_URL,
      data: data,
      jsonpCallback: "callback_judge",
      dataType: "jsonp",
    })
      .done(callback_judge)
      .fail(function () {
        signup_frame2({ result: "Could not post data to server." });
      }); */
  }
}

async function post(data) {
  // console.log("post", data);
  const response = await fetch(GOOGLE_URL, {
    method: "POST",
    body: JSON.stringify(data),
  });

  if (response.ok) {
    // console.log(await response.text());
    signup_frame2({
      result: 'success'
    })
  } else {
    // console.log('error', response);
  }
}

function callback_judge(result) {
  // console.log("callback result", result);
  signup_frame2(result);
  return false;
}

function get_fields_judge() {
  return $.map($("form input, form select"), function (x, i) {
    return $(x).attr("id");
  });
}

function get_values_judge() {
  var fields = get_fields_judge();
  var data = {};
  for (var i in fields) {
    var is_checkbox = false;
    var key = fields[i];
    var selector = key;
    if ($("#" + key).attr("type") == "checkbox") {
      selector = key + ":checked";
      is_checkbox = true;
    }
    var value = $("form #" + selector).val();
    if (!$("form #" + selector).is(":visible")) {
      value = "";
    }
    if (is_checkbox && value == "on") {
      value = "yes";
    }
    if (value != "" && value != undefined) {
      data[key] = value;
    }
  }
  return data;
}

//----------------------------

function signup_frame1() {
  $("#emailGroup").removeClass("has-error");
  $(".judging .frame1").show(200);
  $(".judging .frame2").hide(200);
  return false;
}

function signup_frame2(result_struct) {
  $(".spinner").addClass("d-none");
  var result = result_struct.result;
  var optOut = result_struct.optOut;
  $(".judging .frame1").hide(200);
  if (result == "success") {
    if (optOut == undefined) {
      $(".judging .frame2 .success").show();
      $(".judging .frame2 .remove").hide();
    } else {
      $(".judging .frame2 .success").hide();
      $(".judging .frame2 .remove").show();
    }
    $(".judging .frame2 .fail").hide();
  } else {
    $(".judging .frame2 .fail").show();
    $(".judging .frame2 .fail .reason").html(result);
    $(".judging .frame2 .success").hide();
    $(".judging .frame2 .remove").hide();
  }
  $(".judging .frame2").show(200);
  return false;
}

function validateEmail(email) {
  var re = /(?:[a-z0-9!#$%&amp;'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&amp;'*+/=?^_`{|}~-]+)*|\"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*\")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
  return re.test(email);
}

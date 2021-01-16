$(document).ready(initialize);

// Edit this URL to point to the script

var GOOGLE_URL =
  "https://script.google.com/macros/s/AKfycbyZUdJtGIUPaqXtj0NotcFkVYyu-SoAPsIaEgQCC3-gMQvCPH3B2lkA/exec";

function initialize() {
  TableFactory.install();
  $("button#form_submit").click(on_submit);
  $("button#addChild").click(on_addChild);
  $("button#removeChild").click(on_removeChild);
}

// ----------------------------------------
// Click on submit button, post to Google Docs spreadsheet

function on_submit(e) {
  e.preventDefault();

  $("button#form_submit").prop("disabled", true);

  var data = get_values();
  data.prefix = "callback";

  post(data);

  /* $.ajax({
    url: GOOGLE_URL,
	  data: data,
	  jsonp: 'callback',
	  dataType: 'jsonp',
	  success: callback
	 });
  return false;    // e.preventDefault */
}

async function post(data) {
  console.log("post", data);
  const response = await fetch(GOOGLE_URL, {
    method: "POST",
    body: JSON.stringify(data),
  });

  if (response.ok) {
    console.log(await response.text());

    window.location.href = "thanks.html";
  } else {
    console.log("error", response);
    window.location.href = "registration-error.html";
  }
}

function callback(result) {
  console.log("call success", result);
  var encoded = encodeURIComponent(JSON.stringify(result));
  window.location.href = "thanks.html?r=" + encoded;
}

function get_fields() {
  return $.map($("form input, form select, form textarea"), function (x, i) {
    return $(x).attr("id");
  });
}

function get_values() {
  var fields = get_fields();
  var data = {};
  for (var i in fields) {
    var key = fields[i];
    var selector = key;
    if ($("#" + key).attr("type") == "checkbox") {
      selector = key + ":checked";
    }
    var value = $("form #" + selector).val();
    if (!$("form #" + selector).is(":visible")) {
      value = "";
    }
    if (value != "" && value != undefined) {
      data[key] = value;
    }
  }
  return data;
}

// ----------------------------------------
// Click on add/remove child

var MAX_CHILDREN = 4;

function on_addChild(e) {
  var count = $(".form-row.child:visible").length;
  if (count < MAX_CHILDREN) {
    $("#names .form-row.child:nth-child(" + (count + 2) + ")").show(); // ADD
  }
  updateUpDownButtons();
  return false;
}

function on_removeChild(e) {
  var count = $(".form-row.child:visible").length;
  if (count > 1) {
    $("#names .form-row.child:nth-child(" + (count + 1) + ")").hide();
  }
  updateUpDownButtons();
  return false;
}

function updateUpDownButtons() {
  var count = $(".form-row.child:visible").length;
  if (count == 1) {
    $("button#removeChild").prop("disabled", true);
  } else {
    $("button#removeChild").prop("disabled", false);
  }
  if (count == MAX_CHILDREN) {
    $("button#addChild").prop("disabled", true);
  } else {
    $("button#addChild").prop("disabled", false);
  }
}

// ----------------------------------------
// Create the table of form inputs to capture student names

var TableFactory = {
  install: function () {
    $("#project_title").after(this.make_table());
    updateUpDownButtons();
  },

  // returns a complete table of form inputs with one child per row
  // columns are [name, class, phone, email]
  make_table: function () {
    var result = $("<div/>", { class: "form_group participating-students", id: "names" }).append(
      this.make_header(),
      this.make_row(1).show(),
      this.make_row(2),
      this.make_row(3),
      this.make_row(4),
      this.make_updown_buttons()
    );
    return result;
  },

  make_one_header: function (col_class, name) {
    return $("<h2/>", { class: col_class }).append($("<b>").text(name));
  },

  make_header: function () {
    return $("<div/>", { class: "mt-3 row names_header" }).append(
      this.make_one_header("", "Participating students"),
      // this.make_one_header("col-1", "grade"),
      // this.make_one_header("col-2", "phone"),
      // this.make_one_header("col-3", "email (parent or child)"),
      // this.make_one_header("col-2", "school")
    );
  },

  // plus and minus buttons
  make_updown_buttons: function () {
    return $("<div/>", { class: "row form-inline mt-3" }).append(
      $("<div/>", { class: "btn-group updown col-4" }).append(
        $("<button/>", {
          type: "button",
          class: "btn btn-xs btn-dark",
          id: "addChild",
        }).append($("<span/>", { class: "" }).text("Add student")),
        $("<button/>", {
          type: "button",
          class: "btn btn-xs btn-danger",
          id: "removeChild",
        }).append($("<span/>", { class: "" }).html("Remove student"))
      )
    );
  },

  make_row: function (N) {
    return $("<fieldset/>", { class: "form-row child" })
      .hide()
      .append(
        $(`<legend>Student ${N}</legend>`, {
          class: "participating-student-legend"
        }),
        this.make_input(
          "col-4",
          "name" + N,
          "Name",
          "text",
          "Student " + N + "'s first and last name",
          "name"
        ),
        this.make_select("col-1", "grade" + N, "Grade", this.grades),
        this.make_select("col-2", "school" + N, "School", this.schools),
        this.make_input(
          "col-2",
          "phone" + N,
          "Phone",
          "tel",
          "phone",
          "tel"
        ),
        this.make_input(
          "col-3",
          "email" + N,
          "Email",
          "email",
          "email",
          "email"
        ),
      );
  },

  make_input: function (
    col_class,
    for_id,
    label,
    type,
    placeholder,
    autocomplete
  ) {
    return $("<div/>", { class: col_class }).append(
      $("<label/>", { for: for_id }).text(label),
      $("<input/>", {
        class: "form-control",
        type: type,
        id: for_id,
        autocomplete: autocomplete,
      })
    );
  },

  grades: ["", "K", 1, 2, 3, 4, 5, 6, 7, 8, "other"],

  schools: [
    "Ruffin Ridley",
    "Baker",
    "Driscoll",
    "Heath",
    "Lawrence",
    "Lincoln",
    "Pierce",
    "Runkle",
    "Other",
  ],

  make_select: function (col_class, for_id, label, options) {
    var select = $("<select/>", { class: "form-control", id: for_id });
    $.each(options, function (i, v) {
      select.append($("<option/>", { value: v }).text(v));
    });
    return $("<div/>", { class: "form_group " + col_class }).append(
      $("<label/>", { for: for_id }).text(label),
      select
    );
  },
};

$(document).ready(init_devo);

// Edit this URL to point to the script

var GOOGLE_URL= 'https://script.google.com/macros/s/AKfycbyCQCcpJjUZ5RlkoCWfAf69C3OEGTiWJ3k58lnVUee-9wPFkUV8/exec';

function init_devo(){
  TableFactory.install();
  $('button#form_submit').click(on_submit);
  $('button#addChild').click(on_addChild);
  $('button#removeChild').click(on_removeChild);
}

// ----------------------------------------
// Click on submit button, post to Google Docs spreadsheet

function on_submit(e){
  var data = get_values();
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
  var encoded = encodeURIComponent(JSON.stringify(result));
  window.location.href = 'thanks.html?r='+encoded;
}

function get_fields(){
  return $.map($('form input, form select'), function(x, i){ return $(x).attr('id'); });
}

function get_values(){
  var fields = get_fields();
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
      data[key] = value;
    }
  }
  return data;
}

// ----------------------------------------
// Click on add/remove child

var MAX_CHILDREN = 4;

function on_addChild(e){
  var count = $('.row.child:visible').length;
  if (count < MAX_CHILDREN){
    $('#names .row.child:nth-child('+ (count+2) +')').css('display','block');
  }
  updateUpDownButtons();
  return false;
}

function on_removeChild(e){
  var count = $('.row.child:visible').length;
  if (count > 1){
    $('#names .row.child:nth-child('+ (count+1) +')').css('display','none');
  }
  updateUpDownButtons();
  return false;
}

function updateUpDownButtons(){
  var count = $('.row.child:visible').length;
  if (count == 1){
    $('button#removeChild').prop('disabled', true);
  } else {
    $('button#removeChild').prop('disabled', false);
  }
  if (count == MAX_CHILDREN){
    $('button#addChild').prop('disabled', true);
  } else {
    $('button#addChild').prop('disabled', false);
  }
}



// ----------------------------------------
// Create the table of form inputs to capture student names

var TableFactory = {

  install : function(){
    $('#project_title').after(this.make_table());
    updateUpDownButtons();
  },

  // returns a complete table of form inputs with one child per row
  // columns are [name, class, phone, email]
  make_table : function(){
    var result = $('<div/>', {'class': 'form_group', 'id':'names'})
      .append(
	  this.make_header(),
	  this.make_row(1).css('display', 'block'),
	  this.make_row(2),
	  this.make_row(3),
	  this.make_row(4),
	  this.make_updown_buttons()
      );
    return result;
  },

  make_one_header : function(col_class,name){
    return $('<div/>', {'class': col_class})
      .append($('<p/>',{'class':'form-control-static'}).text(name));
    },

  make_header : function(){
    return $('<div/>', {'class': 'row names_header'}).append(
      this.make_one_header('col-md-4', 'Participating students'),
      this.make_one_header('col-md-1', 'grade'),
      this.make_one_header('col-md-2', 'phone'),
      this.make_one_header('col-md-3', 'email (parent or child)'),
      this.make_one_header('col-md-2', 'school')
    );
  },

  // plus and minus buttons
  make_updown_buttons : function(){
    return  $('<div/>', {'class': 'row form-inline'}).append(
      $('<div/>', {'class':'btn-group updown col-md-4'}).append(
	$('<button/>', {'class':'btn btn-xs btn-default', 'aria-label':"Add child", 'id':'addChild'})
	  .append($('<span/>', {'class':''}).text('+')),
	$('<button/>', {'class':'btn btn-xs btn-default', 'aria-label':"Remove child", 'id':'removeChild'})
	  .append($('<span/>', {'class':''}).html('&ndash;')))
    );
  },

  make_row :function(N){
    return $('<div/>', {'class': 'row child'})
      .css('display','none')
      .append(
	this.make_input('col-md-4','name'+N, 'name'+N, 'text', 'Student ' + N + '\'s first and last name'),
	this.make_select('col-md-1','grade'+N, 'grade'+N, this.grades),
	this.make_input('col-md-2','phone'+N, 'phone'+N, 'tel', 'phone'),
	this.make_input('col-md-3','email'+N, 'email'+N, 'email', 'email'),
	this.make_select('col-md-2','school'+N, 'school'+N, this.schools)
      );
  },

  make_input : function(col_class, for_id, label, type, placeholder){
    return $('<div/>', {'class': 'form_group ' + col_class})
          .append(
             $('<label/>', {'class': 'sr-only', 'for': for_id}).text(label),
	     $('<input/>', {'class': 'form-control',
			    'type': type,
			    'id':for_id,
			    'placeholder':placeholder})
	  );
  },

  grades : ['K', 1, 2, 3, 4, 5, 6, 7, 8, 'other'],

  schools : ['Devotion', 'Upper Devotion', 'Baker', 'Driscoll',
	     'Heath', 'Pierce', 'Lawrence', 'Lincoln', 'Runkle', 'Other'],

  make_select : function(col_class, for_id, label, options){
    var select = $('<select/>', {'class': 'form-control',
				 'id': for_id});
    $.each(options, function(i,v) {
	     select.append($('<option/>',{value: v}).text(v));
	   });
    return $('<div/>', {'class': 'form_group ' + col_class})
          .append(
             $('<label/>', {'class': 'sr-only', 'for': for_id}).text(label),
	     select
	  );
   }
};

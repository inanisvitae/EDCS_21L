var Http = new XMLHttpRequest();
var url = window.location.href;
var dict = {
  SET: 'set',
  GET: 'get',
  DELETE: 'delete',
  SHOW_ALL: 'showAll',
  JOIN: 'join',
  INFO: 'info'
};

var set = function() {
  reqUrl = url + dict.SET;

  $.ajax({
    url: reqUrl,
    type: 'post',
    dataType: 'json',
    contentType: 'application/json',
    success: function (data) {
      console.log(data);
    },
    data: JSON.stringify({ key: $('#key').val(), value: $('#value').val() })
  });
};

var get = function() {
  reqUrl = url + dict.GET;
  $.ajax({
    url: reqUrl,
    type: 'post',
    dataType: 'json',
    contentType: 'application/json',
    success: function (data) {
      console.log(data);
    },
    data: JSON.stringify({ key: $('#key').val() })
  });
};

var del = function() {
  reqUrl = url + dict.DELETE;
  $.ajax({
    url: reqUrl,
    type: 'post',
    dataType: 'json',
    contentType: 'application/json',
    success: function (data) {
      console.log(data);
    },
    data: JSON.stringify({ key: $('#key').val() })
  });
};

var showAll = function() {
  reqUrl = url + dict.SHOW_ALL;
  $.ajax({
    url: reqUrl,
    type: 'post',
    dataType: 'json',
    contentType: 'application/json',
    success: function (data) {
      console.log(data);
      $("#log").val(JSON.stringify(data.result));
    },
    data: JSON.stringify({  })
  });
};

var join = function() {
  reqUrl = url + dict.JOIN;
  $.ajax({
    url: reqUrl,
    type: 'post',
    dataType: 'json',
    contentType: 'application/json',
    success: function (data) {
      console.log(data);
    },
    data: JSON.stringify({ host: $('#host').val() })
  });
}

var info = function() {
  reqUrl = url + dict.INFO;
  $.ajax({
    url: reqUrl,
    type: 'post',
    dataType: 'json',
    contentType: 'application/json',
    success: function (data) {
      console.log(data);
    },
    data: JSON.stringify({ host: $('#host').val() })
  });
}


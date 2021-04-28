var Http = new XMLHttpRequest();
var url = window.location.href;
var dict = {
  ADD: 'add',
  GET: 'get',
  DELETE: 'delete',
  SHOW_ALL: 'showAll'
};

var add = function() {
  reqUrl = url + dict.ADD;
  $.post(reqUrl, function(data, status) {
    console.log(data);
    console.log(status);
  });
};

var get = function() {
  reqUrl = url + dict.GET;
  $.post(reqUrl, function(data, status) {
    console.log(data);
    console.log(status);
  });
};

var del = function() {
  reqUrl = url + dict.DELETE;
  $.post(reqUrl, function(data, status) {
    console.log(data);
    console.log(status);
  });
};

var showAll = function() {
  reqUrl = url + dict.SHOW_ALL;
  $.post(reqUrl, function(data, status) {
    console.log(data);
    console.log(status);
  });
};
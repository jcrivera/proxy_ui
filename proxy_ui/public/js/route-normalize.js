$(function() {
  $('#proxy-ui a').each(function(index, elem) {
    var href = $(elem).prop('href');
    var parsed_url = href.split(window.proxy_ui_host)[1].split('/');
    parsed_url.shift();
    $(elem).prop('href', '/' + window.namespace + '/' + parsed_url.join('/'));
  });
});

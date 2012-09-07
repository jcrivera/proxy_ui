window.parseUrl = function(url) {
  var parsed_url = url.split(window.proxy_ui_host)[1].split('/');
  parsed_url.shift();
  return parsed_url
}

$(function() {
  console.log(window.tenants);
  console.log(window.location);

  $(window.tenants).each(function(index, tenant) {
    $('#' + tenant + ' a').each(function(index, elem) {
      var href = $(elem).prop('href');
      $(elem).prop('href', '/' + window.proxy_ui_namespace + '/--' + tenant + '/' + parseUrl(href).join('/'));
    });
  });

});

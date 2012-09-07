window.parseHref = function(url) {
  var parsed_url = url.split(window.proxy_ui_host)[1].split('/');
  parsed_url.shift();
  return parsed_url.join('/')
}

window.parseLocation = function() {
  var paths = window.location.pathname.split('--');
  paths.shift();
  var tenant_paths = {}
  $(paths).each(function(index, path) {
    var parts = path.split('/');
    var tenant = parts.shift();
    tenant_paths[tenant] = parts.join('/');
  });
  return tenant_paths
}

window.needsRewrite = function(elem) {
  console.log($(elem).attr('href').match(/^#/));
  if($(elem).attr('href').match(/^#/)) {
    console.log('yes');
    return false
  }
  return true
}

//http://localhost:9393/tenant_a_and_b/--/tenant_b//--/0/[object%20Object]

$(function() {
  var tenant_paths = window.parseLocation();

  $(window.tenants).each(function(index, tenant) {

    // create a uri fragment representing the state
    // of the rest of tenants on the page
    // ignore the tenant currently being operated on
    sibling_tenant_paths = ''
    $.each(tenant_paths, function(key, path) {
      if(tenant != key) {
        sibling_tenant_paths += ['--' + key, path, ''].join('/');
      }
    });

    // rewrite links for each tenant
    $('#' + tenant + ' a').each(function(index, elem) {
      if(window.needsRewrite(elem)) {
        var href = $(elem).prop('href');
        var parsedHref = parseHref(href);

        // if the link is to the root (/) of the tenant then ommit it
        // from the href
        var new_path = ''
        if(parsedHref != '') {
          new_path = ['--' + tenant, parsedHref].join('/');
        }

        // construct the new href that includes the current path (state) of all other tenants
        var new_href = '/' + [window.proxy_ui_namespace, new_path, sibling_tenant_paths].join('/');
        new_href = new_href.replace('//', '/');
        $(elem).prop('href', new_href);
      }
    });
  });

});

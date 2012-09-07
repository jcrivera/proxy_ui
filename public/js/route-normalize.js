window.parseUrl = function(url) {
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
  if($(elem[0]).attr(elem[1]).match(/^#/)) {
    return false
  }
  return true
}

window.rewriteLinks = function(tenant) {
  var tenant_id = '#' + tenant
  var rewrite_links = []

  $(tenant_id + ' a').each(function(index, elem) {
    rewrite_links.push([elem, 'href']);
  });

  $(tenant_id + ' form').each(function(index, elem) {
    rewrite_links.push([elem, 'action']);
  });

  return rewrite_links
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
    $.each(window.rewriteLinks(tenant), function(index, elem) {
      if(window.needsRewrite(elem)) {
        var _url = $(elem[0]).prop(elem[1]);
        var parsed_url = parseUrl(_url);

        // if the link is to the root (/) of the tenant then ommit it
        // from the url
        var new_path = ''
        if(parsed_url != '') {
          new_path = ['--' + tenant, parsed_url].join('/');
        }

        // construct the new url that includes the current path (state) of all other tenants
        var new_url = '/' + [window.proxy_ui_namespace, new_path, sibling_tenant_paths].join('/');
        new_url = new_url.replace('//', '/');
        $(elem[0]).prop(elem[1], new_url);
      }
    });
  });

});

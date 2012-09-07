require 'rubygems'
require 'sinatra'
require 'haml'
require 'sass'
require 'rest_client'

get '/' do
  redirect '/home'
end

get '/home' do
  haml :home, :format => :html5
end

get /\/tenant_a_and_b\/?(.*)/ do |uri|
  render_index('tenant_a_and_b', ['tenant_a', 'tenant_b'], uri)
end

get /\/tenant_a\/?(.*)/ do |uri|
  render_index('tenant_a', ['tenant_a'], uri)
end

get /\/tenant_b\/?(.*)/ do |uri|
  render_index('tenant_b', ['tenant_b'], uri)
end

get /\/tenant_crud\/?(.*)/ do |uri|
  render_index('tenant_crud', ['tenant_crud'], uri)
end

post /\/tenant_crud\/?(.*)/ do |uri|
  tenant_urls = decode_url(@tenants, uri)
  RestClient.post(tenant_urls['tenant_crud'], params) do |response, request, result, &block|
    if [301, 302, 307].include? response.code
      response.follow_redirection(request, result, &block)
    else
      response.return!(request, result, &block)
    end
  end
end

def render_index(proxy_ui_namespace, tenants, uri)
  begin
    @request_host = request.host
    @proxy_ui_namespace = proxy_ui_namespace
    @tenants = tenants

    @content = {}

    tenant_urls = decode_url(@tenants, uri)

    @tenants.each do |tenant|
      tenant_url = tenant_urls[tenant] || TENANT_HOSTS[tenant]
      @content[tenant] = RestClient.get(tenant_url, params: params).to_s
    end

    haml :tenants, :format => :html5
  rescue Errno::ECONNREFUSED, RestClient::ResourceNotFound
    haml :four_oh_four
  end
end

TENANT_HOSTS = {
  'tenant_a' => 'http://localhost:9494',
  'tenant_b' => 'http://localhost:9595',
  'tenant_crud' => 'http://localhost:9696'
}

def decode_url(tenants, uri)
  res = {}
  tenant_paths = uri.split('--')
  tenant_paths.shift
  tenant_paths.each do |path|
    path_parts = path.split('/')
    tenant_name = path_parts.shift
    res[tenant_name] = tenant_uri(tenant_name, path_parts.join('/'))
  end
  res
end

def tenant_uri(tenant, uri)
  "#{TENANT_HOSTS[tenant]}/#{uri}"
end

def is_active(link)
  request.path.match(link) ? 'active' : ''
end

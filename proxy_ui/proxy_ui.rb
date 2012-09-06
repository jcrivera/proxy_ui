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

def render_index(proxy_ui_namespace, tenants, uri)
  begin
    @request_host = request.host
    @proxy_ui_namespace = proxy_ui_namespace
    @tenants = tenants

    @content = {}

    @tenants.each do |tenant|
      @content[tenant] = RestClient.get(tenant_uri(tenant, uri), params: params).to_s
    end

    haml @proxy_ui_namespace.to_sym, :format => :html5
  rescue Errno::ECONNREFUSED, RestClient::ResourceNotFound
    haml :four_oh_four
  end
end

TENANTS = {
  'tenant_a' => 'http://localhost:9494',
  'tenant_b' => 'http://localhost:9595'
}

def tenant_uri(namespace, uri)
  TENANTS[namespace] + uri
end

def is_active(link)
  request.path.match(link) ? 'active' : ''
end

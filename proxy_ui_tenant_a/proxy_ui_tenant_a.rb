require 'rubygems'
require 'sinatra'
require 'haml'
require 'sass'

get '/' do
  haml :index, :format => :html5, :layout => true
end

get '/awesome/stuff' do
  haml :awesome_stuff, :format => :html5, :layout => true
end

get '/even/better/stuff' do
  haml :even_better_stuff, :format => :html5, :layout => true
end

def is_active(link)
  request.path == link ? 'active' : ''
end

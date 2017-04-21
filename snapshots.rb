require 'percy/capybara/anywhere'
ENV['PERCY_DEBUG'] = '1'  # Enable debugging output.

# Configuration.
server = 'http://localhost:3000'
assets_dir = File.expand_path('public', __FILE__)
assets_base_url = '/'

Percy::Capybara::Anywhere.run(server, assets_dir, assets_base_url) do |page|
  page.visit('/public/patterns/06-template-article-article/06-template-article-article.rendered.html')
  Percy::Capybara.snapshot(page, name: 'homepage')
end

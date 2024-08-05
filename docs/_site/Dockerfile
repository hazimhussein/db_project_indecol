FROM ruby:3.3

# install jekyll
WORKDIR /app
COPY . .
RUN bundle install
RUN bundle exec jekyll build --baseurl "/docs"
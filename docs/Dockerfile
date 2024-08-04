FROM ruby:3.3

# throw errors if Gemfile has been modified since Gemfile.lock
RUN bundle config --global frozen 1

# install jekyll
WORKDIR /app
COPY . .
RUN bundle install
RUN bundle exec jekyll build
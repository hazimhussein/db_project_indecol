FROM ubuntu:latest

RUN apt-get update && apt-get -y upgrade
RUN apt-get install -y git && apt-get install -y software-properties-common
RUN apt-get install -y python-pip python-dev ruby-full build-essential
RUN pip install --upgrade pip
RUN apt-get install -y vim

# build ruby configuration
RUN mkdir gems \
    && echo '# Install Ruby Gems to /gems' >> /gems/.bashrc \
    && echo 'export GEM_HOME=/gems' >> /gems/.bashrc \
    && echo 'export PATH=/gems/bin:$PATH' >> /gems/.bashrc \
    && /bin/bash -c "source /gems/.bashrc"

# install jekyll
WORKDIR /app
COPY . .
RUN gem install jekyll bundler
RUN bundle exec jekyll build
FROM ubuntu

RUN apt-get update  
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
RUN nvm install vv22.2.0


WORKDIR /apps/project/server
COPY ./server/
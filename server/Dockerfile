FROM node:22.4.0


WORKDIR /apps/project/server
COPY package.json package.json
COPY package-lock.json package-lock.json

RUN npm i -g typescript

RUN npm install 

COPY . .

RUN tsc

EXPOSE 25

ENTRYPOINT [ "node" , "dist/index.js"]
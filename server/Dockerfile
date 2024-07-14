FROM node:22.4.0


WORKDIR /apps/project/server
COPY package.json package.json
COPY package-lock.json package-lock.json

RUN npm i -g typescript
RUN npm install pm2 -g

RUN npm install 

COPY . .

RUN tsc

EXPOSE 25

ENTRYPOINT [ "pm2", "start" , "dist/index.js"]
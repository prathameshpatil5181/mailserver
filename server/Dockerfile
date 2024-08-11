FROM node:22.4.0


WORKDIR /apps/project/server
COPY package.json package.json
COPY ../../envs/.env .env
COPY package-lock.json package-lock.json

RUN npm i -g typescript



EXPOSE 8000
EXPOSE 25

RUN npm install 

COPY . .
RUN npx prisma generate

RUN tsc

CMD ["node", "dist/index.js"]


# ENTRYPOINT [ "pm2", "start" , "dist/index.js"]
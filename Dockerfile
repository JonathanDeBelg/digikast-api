FROM node:15.0.0-alpine AS node
FROM keymetrics/pm2:latest-alpine

RUN npm install -g pm2
RUN npm install -g mongoose

RUN mkdir -p /usr/src/node-app && chown -R node:node /usr/src/node-app

WORKDIR /usr/src/node-app

COPY package.json yarn.lock ./

USER node

RUN npm install

COPY --chown=node:node . .

EXPOSE 3000

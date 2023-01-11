FROM node:15.0.0-alpine AS node
FROM keymetrics/pm2:latest-alpine

RUN npm install -g pm2

RUN mkdir -p /usr/src/node-app && chown -R node:node /usr/src/node-app

WORKDIR /usr/src/node-app

COPY package*.json yarn.lock ./

RUN yarn install --pure-lockfile
RUN yarn install mongoose

USER node

COPY --chown=node:node . .

EXPOSE 3000

FROM node:16.13.2-alpine

RUN mkdir -p /home/node/app
WORKDIR /usr/src/app/

ENV PATH /usr/src/app/node_modules/.bin:$PATH

COPY package.json .
COPY yarn.lock .

RUN yarn install
# --frozen-lockfile

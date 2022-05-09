FROM node:alpine

WORKDIR /app

ARG NODE_ENV=production
COPY package.json yarn.lock ./
RUN yarn install
COPY public/ ./public
COPY views/ ./views
COPY dist/ ./dist
RUN tsc -p ./

CMD yarn start

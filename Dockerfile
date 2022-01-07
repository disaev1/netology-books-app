FROM node:alpine

WORKDIR /app

ARG NODE_ENV=production
COPY package.json yarn.lock ./
RUN yarn install
COPY public/ ./public
COPY routes/ ./routes
COPY views/ ./views
COPY books.js errors.js index.js middleware.js multer.js utils.js ./

CMD yarn start

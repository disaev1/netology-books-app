FROM node:alpine

WORKDIR /app

ARG NODE_ENV=production
COPY package.json yarn.lock ./
RUN yarn install
COPY public/ ./public
COPY routes/ ./routes
COPY views/ ./views
COPY book.js BooksRepository.js errors.js index.js middleware.js multer.js utils.js counter.js ./

CMD yarn start

FROM node:lts-alpine

COPY . /app

WORKDIR /app

RUN yarn
EXPOSE 8080

ARG dbhost
ENV DB_HOST=$dbhost

RUN yarn build

CMD yarn start -p 8080

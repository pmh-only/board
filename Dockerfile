FROM node:lts-alpine

COPY . /app

WORKDIR /app

RUN yarn
RUN yarn build

ENV DB_HOST host.docker.internal

CMD yarn start -p 8080

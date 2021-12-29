FROM node:lts-alpine

COPY . .

RUN yarn
RUN yarn build

ENV DB_HOST host.docker.internal

CMD yarn start -p 8080

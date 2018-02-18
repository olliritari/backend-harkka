FROM mhart/alpine-node:latest

COPY . /app/

WORKDIR /app

RUN npm install

EXPOSE 8001

CMD ["node", "server.js"]
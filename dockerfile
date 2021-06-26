FROM node:14.17.1

RUN mkdir -p /app

WORKDIR /app

COPY package*.json /app/

RUN npm install

EXPOSE 3000

COPY . .
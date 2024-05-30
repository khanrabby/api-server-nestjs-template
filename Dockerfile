FROM --platform=linux/amd64 node:16.16
# FROM node:16.16

ENV NODE_ENV=development

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . ./

EXPOSE 80

CMD ["npm", "run", "start"]
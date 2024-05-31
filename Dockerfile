FROM --platform=linux/amd64 node:16.16
# FROM node:16.16

# ENV NODE_ENV=dev
# ENV JKS_FILE=jwks-dev

WORKDIR /usr/src/app

COPY package*.json ./
COPY yarn.lock ./
# COPY .env.development ./

RUN yarn install

COPY . ./

EXPOSE 4002

CMD ["yarn", "start", ":dev"]
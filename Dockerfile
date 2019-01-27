FROM node:alpine
WORKDIR /server
COPY . /server
RUN yarn install
CMD ["yarn", "start"]
FROM node:7.1.0-alpine
MAINTAINER Peter Hoffmann <peter@p-h.im>

EXPOSE 3000

COPY ./ /p4c/

RUN apk add --update python g++ make
RUN mkdir /home/node
RUN chown node:node /home/node
RUN chown -R node:node /p4c/
RUN npm install -g node-gyp

WORKDIR /p4c
USER node

RUN npm i
RUN npm run build

CMD ["npm", "start"]

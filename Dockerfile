FROM node:15.11.0

WORKDIR /usr/streamsforlab/gateway-service


COPY package*.json ./

RUN npm install
RUN npm install -g cross-env


# Bundle app source
COPY . .
EXPOSE 8000
CMD [ "npm", "start" ]
FROM node:16

WORKDIR /

COPY package*.json ./

RUN npm install

COPY . .

ENV DISCORD_BOT_TOKEN=
ENV CLIENT_ID=
ENV GUILD_ID=

CMD [ "npm", "start" ]
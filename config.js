require('dotenv').config();

module.exports = {
  botToken: process.env.DISCORD_BOT_TOKEN,
  clientId: process.env.CLIENT_ID,
  guildId: process.env.GUILD_ID,
  redditBaseURL: 'https://www.reddit.com/r',
};

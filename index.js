const fs = require('fs');
const { Client, Collection, Intents } = require('discord.js');
const { guildId, botToken } = require('./config');

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Intents.FLAGS.GUILD_MEMBERS,
  ],
  partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
});

client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter((file) => file.endsWith('.js'));

commandFiles.forEach((file) => {
  // eslint-disable-next-line import/no-dynamic-require, global-require
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
});

client.once('ready', () => {
  console.log('Ready!');
});

client.on('messageReactionAdd', async (reaction, user) => {
  if (reaction.partial) {
    try {
      await reaction.fetch();
    } catch (error) {
      console.error('Something went wrong when fetching the message:', error);
      return;
    }
  }

  const { message } = reaction;
  if (message.id !== '944212025960185886') return;
  const reactionUserId = user.id;
  const guildMember = await client.guilds.cache.get(guildId).members.fetch(reactionUserId);
  const memberRoles = guildMember.roles?.cache;
  const desiredRole = await client.guilds.cache.get(guildId).roles.fetch('944214687225094165');
  if (memberRoles.keys.length > 1) return;

  guildMember.roles.add(desiredRole);
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
  }
});

client.login(botToken);

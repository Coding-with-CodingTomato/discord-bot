const { SlashCommandBuilder } = require('@discordjs/builders');
const axios = require('axios');
const { redditBaseURL } = require('../config');

const getRandomChildFromArray = (children) => {
  const totalChildrenAmount = children.length;
  const randomChildIndex = Math.floor(Math.random() * totalChildrenAmount);

  return children[randomChildIndex];
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('meme')
    .setDescription('Schickt einen randmon Codememe in den Chat'),
  async execute(interaction) {
    try {
      const response = await axios.get(`${redditBaseURL}/ProgrammerHumor/top/.json?limit=100&t=day`);
      const { children } = response.data.data;
      const choosenChild = getRandomChildFromArray(children);
      if (choosenChild.data.post_hint !== 'image') {
        await interaction.reply('Ich konnte kein Meme finden. Versuche es nochmal.');
      } else {
        await interaction.reply(choosenChild.data.url);
      }
    } catch (e) {
      console.error(e);
    }
  },
};

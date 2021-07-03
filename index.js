const Discord = require('discord.js');
const client = new Discord.Client();
const { Sequelize } = require('sequelize');

const { TOKEN } = require('./config.json');
const { countPogs, createUser, updateUser } = require('./utils/utils.js');
const User = require('./models/User.js');

User.sync();

client.once('ready', () => {
  console.log('Ready!');
});

client.on('message', async (message) => {
  let pogCount = 0;

  if (!message.author.bot) {
    pogCount = countPogs(message.content);
    if (pogCount > 0) {
      const userToUpdate = await User.findByPk(message.author.id);
      if (!userToUpdate) {
        message.channel.send(await createUser(message, pogCount));
      } else {
        message.channel.send(await updateUser(message, message.member.nickname, userToUpdate, pogCount));
      }
      pogCount = 0;
    }
  }
});

//cSpell: ignore poggers, pogs
client.login(TOKEN);

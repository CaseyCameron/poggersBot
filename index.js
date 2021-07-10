const Discord = require('discord.js');
const client = new Discord.Client();
const { Sequelize } = require('sequelize');

const { TOKEN, PREFIX } = require('./config.json');
const { countPogs, createUser, updateUser, findHighestPogCount } = require('./utils/utils.js');
const User = require('./models/User.js');

User.sync();

client.once('ready', () => {
  console.log('Ready!');
});

client.on('message', async (message) => {
  let pogCount = 0;

  if (message.author.bot) return

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
});

client.on(`message`, async (message) => {
  if (message.content === `${PREFIX}pogcount`) {
    const user = (await findHighestPogCount());
    message.channel.send(`${user.username} has the most pogs with ${user.maxPogs}. Perhaps ${user.username} should sophisticate their vernacular.`);
  }
});

//cSpell: ignore poggers, pogs
client.login(TOKEN);

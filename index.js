const Discord = require('discord.js');
const client = new Discord.Client();

const { TOKEN, PREFIX } = require('./config.json');
const { countPogs,
  createUser,
  updateUser,
  findHighestPogCount,
  findUserPogCount } = require('./utils/utils.js');
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

client.on('message', async (message) => {
  if (message.content === `${PREFIX}mostpogs`) {
    const user = (await findHighestPogCount());
    message.channel.send(`${user.username} has the most pogs with ${user.maxPogs}. ${user.username} must really like pogs.`);
  }
});

client.on('message', async (message) => {
  if (message.content === `${PREFIX}mypogs`) {
    message.channel.send(await findUserPogCount(message, message.member.nickname));
  }
});

//cSpell: ignore poggers, pogs, pogcount, mostpogs, mypogs
client.login(TOKEN);

const Discord = require('discord.js');
const client = new Discord.Client();
const { prefix, token } = require('./config.json');
const { countPogs } = require('./utils/countPogs.js');

let poggersLog = 0;
let pogCount = 0;

client.once('ready', () => {
  console.log('Ready!');
});

client.on('message', message => {
  if (!message.author.bot) {
    pogCount = countPogs(message.content);
    if (pogCount > 0) {
      message.channel.send(`Pogs: ${pogCount}. | All-time Pogs: ${poggersLog += pogCount}.`);
      pogCount = 0;
    }
  }
});

client.login(token);

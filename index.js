const Discord = require('discord.js');
const client = new Discord.Client();
const Sequelize = require('sequelize');

const { prefix, TOKEN } = require('./config.json');
const { countPogs } = require('./utils/countPogs.js');
const User = require('./models/User.js');

// const sequelize = new Sequelize('database', 'user', 'password', {
//   host: 'localhost',
//   dialect: 'sqlite',
//   logging: false,
//   // SQLite only
//   storage: 'database.sqlite',
// });

// const User = sequelize.define('user', {
//   username: {
//     type: Sequelize.STRING,
//     allowNull: false,
//   },
//   discordId: {
//     type: Sequelize.INTEGER,
//     primaryKey: true,
//     defaultValue: 0,
//     allowNull: false,
//   },
//   pogs: {
//     type: Sequelize.INTEGER,
//     defaultValue: 0,
//     allowNull: false,
//   }
// })

User.sync();

let pogCount = 0;

client.once('ready', () => {
  console.log('Ready!');
});

client.on('message', async (message) => {
  if (!message.author.bot) {
    pogCount = countPogs(message.content);
    if (pogCount > 0) {

      const userToUpdate = await User.findByPk(message.author.id);
      if (!userToUpdate) {
        const user = await User.create({
          username: message.author.username,
          discordId: message.author.id,
          pogs: pogCount
        })
        console.log(`${message.author.username} first time pogs', ${pogCount}`);
        message.channel.send(`Pogs: ${pogCount}. | ${message.member.nickname}'s all-time Pogs: ${pogCount}.`);
      } else {
        const numOfPogs = await Number(userToUpdate.dataValues.pogs);

        await User.update({ pogs: numOfPogs + pogCount }, {
          where: {
            discordId: message.author.id
          },
        });

        const updatedPogCount = await User.findByPk(message.author.id)
        console.log(updatedPogCount);
        console.log(`${message.member.nickname} all time pogs & pog count', ${numOfPogs}, ${pogCount}`);
        message.channel.send(`Pogs: ${pogCount}. | ${message.member.nickname}'s all-time Pogs: ${updatedPogCount.pogs}.`);
      }
      pogCount = 0;
    }
  }

});
//cSpell: ignore poggers, pogs
client.login(TOKEN);

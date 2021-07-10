const { PREFIX } = require('../config.json');
const { Sequelize } = require('sequelize');
const User = require('../models/User.js');

function countPogs(message) {
  let pogCount = 0;

  const matchingTerms = message.toLowerCase().split(' ');
  matchingTerms.map(word => {
    if (
      word !== `${PREFIX}mypogs`
      && word !== `${PREFIX}mostpogs`
    ) {
      if (word.includes('pog')) pogCount += 1;
      if (word.includes('pawg')) pogCount += 1;
    };
  });
  return pogCount;
}

function checkForNickname(nickname, message) {
  if (!nickname) {
    return `${message.author.username}`;
  }
  return `${message.member.nickname}`;
}

async function createUser(message, pogCount) {
  await User.create({
    username: message.author.username,
    discordId: message.author.id,
    pogs: pogCount
  });
  const nickname = '';
  const username = checkForNickname(nickname, message);
  console.log(`${username} first time pogs', ${pogCount}`);
  return `Pogs: ${pogCount}. | ${username}'s all-time Pogs: ${pogCount}.`;
}

async function updateUser(message, nickname, userToUpdate, pogCount) {
  const numOfPogs = await Number(userToUpdate.dataValues.pogs);
  await User.update({ pogs: numOfPogs + pogCount }, {
    where: {
      discordId: message.author.id
    },
  });
  const updatedPogCount = await User.findByPk(message.author.id);
  const username = checkForNickname(nickname, message);
  console.log(`Pogs: ${pogCount}. | ${username}'s all-time Pogs: ${updatedPogCount.pogs}.`);
  return `Pogs: ${pogCount}. | ${username}'s all-time Pogs: ${updatedPogCount.pogs}.`;
}

async function findHighestPogCount() {
  const highestNumOfPogs = await User.findAll({
    attributes: ['username', 'discordId', [Sequelize.fn('max', Sequelize.col('pogs')), 'maxPogs']],
    raw: true,
  });
  console.log(highestNumOfPogs[0]);
  return highestNumOfPogs[0];
}

async function findUserPogCount(message, nickname) {
  const userPogs = await User.findByPk(message.author.id);
  if (userPogs === null) {
    return message.channel.send('You have no pogs. That\'s great!');
  } else {
    const username = checkForNickname(nickname, message);
    console.log(`${username}'s all-time Pogs: ${userPogs.pogs}.`);
    return `You have ${userPogs.pogs} pogs.`;
  }
}

//cSpell: ignore poggers, pogs, pogcount, mostpogs, mypogs
module.exports = { countPogs, createUser, updateUser, findHighestPogCount, findUserPogCount };

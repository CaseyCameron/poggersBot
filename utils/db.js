const Sequelize = require('sequelize');
const { DATABASE_URL } = require('./config.json');

const sequelize = new Sequelize(DATABASE_URL, {
  logging: false
});


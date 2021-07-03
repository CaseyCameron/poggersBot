const db = require('./utils/db.js');

db.sync();

module.exports = { db };

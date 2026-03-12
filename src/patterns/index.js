const dependencies = require('./dependencies');
const database = require('./database');
const security = require('./security');
const secrets = require('./secrets');
const filesystem = require('./filesystem');
const general = require('./general');

module.exports = [
  ...dependencies,
  ...database,
  ...security,
  ...secrets,
  ...filesystem,
  ...general
];

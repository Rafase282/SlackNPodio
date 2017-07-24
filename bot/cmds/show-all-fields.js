'use strict';

const podio = require('../podio');
const bot = require('../bot');

exports.command = 'show-all-fields <query>'
exports.aliases = ['show']
exports.desc = 'Retrieves all the fields for the given item'
exports.handler = (argv) => {
  if (podio.READ) {
    podio.showAllFields(argv.query).then((res) => {
      bot.cb(res);
    });
  } else {
    bot.cb('Read permission is disabled.')
  }
}

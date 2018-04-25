'use strict';

const podio = require('../api');
const bot = require('../../../bot');

exports.command = 'get-items <query>'
exports.aliases = ['search']
exports.desc = 'Retrieve items list.'
exports.handler = (argv) => {
  if (podio.READ) {
    podio.getItemsList(argv.query).then((res) => {
      bot.cb(res);
    });
  } else {
    bot.cb('Read permission is disabled.')
  }
}

'use strict';

const podio = require('../podio');
const bot = require('../bot');

exports.command = 'get-link <item>'
exports.aliases = ['link', 'url']
exports.desc = 'Get\'s link for the item.'
exports.handler = (argv) => {
  if (podio.READ) {
    podio.getURL(argv.item).then((res) => bot.cb(res));
  } else {
    bot.cb('Read permission is disabled.')
  }
}

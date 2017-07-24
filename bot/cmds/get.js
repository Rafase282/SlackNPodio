'use strict';

const podio = require('../podio');
const bot = require('../bot');

exports.command = 'get-field <item> <field>'
exports.aliases = ['get', 'G', 'retrieve']
exports.desc = 'Retrieve item\'s field value.'
exports.handler = (argv) => {
  if (podio.READ) {
    podio.getValue(argv.item, argv.field).then((res) => bot.cb(res));
  } else {
    bot.cb('Read permission is disabled.')
  }
}

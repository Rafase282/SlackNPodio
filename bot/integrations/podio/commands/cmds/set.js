'use strict';

const podio = require('../../api');
const bot = require('../../../../bot');

exports.command = 'update-value <item> <field> <value>'
exports.aliases = ['set', 'S']
exports.desc = 'Updates field value for said item.'
exports.handler = (argv) => {
  if (podio.WRITE) {
    podio.setValue(argv.item, argv.field, argv.value).then((res) => bot.cb(res));
  } else {
    bot.cb('Write permission is disabled.')
  }
}

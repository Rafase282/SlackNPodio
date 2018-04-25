'use strict';

const podio = require('../api');
const bot = require('../../../bot');

exports.command = 'get-fields-from <query> <fields>'
exports.aliases = ['gff']
exports.desc = 'Retrieves the specified fields for the given item'
exports.handler = (argv) => {
  if (podio.READ) {
    podio.getFieldsForItem(argv.query, argv.fields).then((res) => {
      bot.cb(res);
    });
  } else {
    bot.cb('Read permission is disabled.')
  }
}

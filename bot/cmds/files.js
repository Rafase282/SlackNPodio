'use strict';

const podio = require('../podio');
const bot = require('../bot');

exports.command = 'files-link <types> <limit> <sorts> <offset> <bool>'
exports.aliases = ['files', 'docs', 'F']
exports.desc = 'Get\'s link for the files.'
exports.handler = (argv) => {
  if (podio.READ) {
    podio.getFiles(argv.types, argv.limit, argv.sorts, argv.offset, argv.bool).then((res) => {
      bot.cb(res)
    });
  } else {
    bot.cb('Read permission is disabled.')
  }
}

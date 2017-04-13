'use strict';

const podio = require('../podio');
const bot = require('../bot');
const app = {podio, bot};

exports.command = 'files-link <types> <limit> <sorts> <offset> <bool>'
exports.aliases = ['files', 'docs', 'F']
exports.desc = 'Get\'s link for the files.'
exports.handler = (argv) => {
  app.podio.getFiles(argv.types, argv.limit, argv.sorts, argv.offset, argv.bool).then((res) => {
    app.bot.cb(res)
});
}

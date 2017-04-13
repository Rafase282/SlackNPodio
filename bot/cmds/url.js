const podio = require('../podio');
const bot = require('../bot');
const app = {podio, bot};

exports.command = 'get-link <item>'
exports.aliases = ['link', 'url', 'l']
exports.desc = 'Get\'s link for the item.'
exports.handler = (argv) => {
  app.podio.getURL(argv.item).then((res) => app.bot.cb(res));
}

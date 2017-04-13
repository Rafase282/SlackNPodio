const podio = require('../podio');
const bot = require('../bot');
const app = {podio, bot};

exports.command = 'retrieve <item> <field>'
exports.aliases = ['get', 'g']
exports.desc = 'Retrieve item\'s field value.'
exports.handler = (argv) => {
  app.podio.getValue(argv.item, argv.field).then((res) => app.bot.cb(res));
}

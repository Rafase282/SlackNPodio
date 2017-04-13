const podio = require('../podio');
const bot = require('../bot');
const app = {podio, bot};

exports.command = 'update-value <item> <field> <value>'
exports.aliases = ['set', 's']
exports.desc = 'Updates field value for said item.'
exports.handler = (argv) => {
  app.podio.setValue(argv.item, argv.field).then((res) => app.bot.cb(res));
}

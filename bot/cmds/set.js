'use strict';

const podio = require('../podio');
exports.command = 'update-value <item> <field> <value>'
exports.aliases = ['set', 'S']
exports.desc = 'Updates field value for said item.'
exports.handler = (argv) => {
  podio.permissionCheck(podio.WRITE, podio.setValue, [argv.item, argv.field, argv.value]);
}

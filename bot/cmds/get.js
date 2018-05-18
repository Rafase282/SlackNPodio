'use strict';

const podio = require('../podio');
exports.command = 'get-field <item> <field>'
exports.aliases = ['get', 'G', 'retrieve']
exports.desc = 'Retrieve item\'s field value.'
exports.handler = (argv) => {
  podio.permissionCheck(podio.READ, podio.getValue, [argv.item, argv.field]);
}

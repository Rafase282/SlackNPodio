'use strict';

const podio = require('../podio');
exports.command = 'get-items <query>'
exports.aliases = ['search']
exports.desc = 'Retrieve items list.'
exports.handler = (argv) => {
  podio.permissionCheck(podio.READ, podio.getItemsList, [argv.query]);
}

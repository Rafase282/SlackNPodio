'use strict';

const podio = require('../podio');
exports.command = 'live'
exports.aliases = ['L']
exports.desc = 'Retrieve a list of live tests.'
exports.handler = (argv) => {
  podio.permissionCheck(podio.READ, podio.getPodioItemsByFilters, ["status-2=6. Live"]);
}

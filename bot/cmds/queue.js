'use strict';

const podio = require('../podio');
exports.command = 'queue'
exports.aliases = ['Q']
exports.desc = 'Retrieve a list of tests currently in sprint.'
exports.handler = (argv) => {
  podio.permissionCheck(podio.READ, podio.getPodioItemsByFilters, ["status-2=in sprint"]);
}

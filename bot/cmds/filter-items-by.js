'use strict';

const podio = require('../podio');
exports.command = 'filter-items-by <filters>'
exports.aliases = ['fib']
exports.desc = 'Retrieve a list of items according to the specified filters'
exports.handler = (argv) => {
    podio.permissionCheck(podio.READ, podio.getPodioItemsByFilters, [argv.filters]);
}
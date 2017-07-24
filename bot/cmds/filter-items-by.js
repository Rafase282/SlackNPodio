'use strict';

const podio = require('../podio');
const bot = require('../bot');

exports.command = 'filter-items-by <filters>'
exports.aliases = ['fib']
exports.desc = 'Retrieve a list of items according to the specified filters'
exports.handler = (argv) => {
  if (podio.READ) {
    podio.getPodioItemsByFilters(argv.filters).then((res) => {
      bot.cb(res);
    });
  } else {
    bot.cb('Read permission is disabled.')
  }
}
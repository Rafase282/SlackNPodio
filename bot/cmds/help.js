'use strict';

const bot = require('../bot');
const helper = require('../helper')
exports.command = 'basic-help'
exports.aliases = ['help', 'helpme']
exports.desc = 'Shows help message'
exports.handler = () => {
  return bot.cb(helper.showHelp())
}

'use strict';

const bot = require('../bot');
const helper = require('../helper')
exports.command = 'brief'
exports.aliases = ['b']
exports.desc = 'Shows brief submission instructions'
let brief = `Use this webform to tell us your test idea: https://podio.com/webforms/21369134/1483138

To fill a full test brief, download and complete the following document and email to Joe Sanders (joseph_sanders@cable.comcast.com): https://comcast.box.com/s/1phiim8hoc2zk6d5kgr0zvn9m9whe7db`;
exports.handler = () => {
  return bot.cb(brief)
}

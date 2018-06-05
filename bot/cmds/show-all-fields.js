'use strict';

const podio = require('../podio');
exports.command = 'show-all-fields <query>'
exports.aliases = ['show']
exports.desc = 'Retrieves all the fields for the given item'
exports.handler = (argv) => {
  let arr = argv._;
  arr.shift();
  arr.splice(0, 0, argv.query);
  arr = arr.toString().replace(/,/g, " ").replace(/[\u2018\u2019]/g, "").replace(/[\u201C\u201D]/g, '');
  console.log(arr)
  podio.permissionCheck(podio.READ, podio.showAllFields, [arr]);
}

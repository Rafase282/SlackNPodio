'use strict';

const podio = require('../podio');
exports.command = 'get-fields-from <query> <fields>'
exports.aliases = ['gff']
exports.desc = 'Retrieves the specified fields for the given item'
exports.handler = (argv) => {
    podio.permissionCheck(podio.READ, podio.getFieldsForItem, [argv.query, argv.fields]);
}
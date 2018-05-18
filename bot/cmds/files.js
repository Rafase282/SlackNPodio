'use strict';

const podio = require('../podio');
exports.command = 'files-link <types> <limit> <sorts> <offset> <bool>';
exports.aliases = ['files', 'docs', 'F'];
exports.desc = 'Get\'s link for the files.';
exports.handler = (argv) => {
    podio.permissionCheck(podio.READ, podio.getFiles, [argv.types, argv.limit, argv.sorts, argv.offset, argv.bool]);
};
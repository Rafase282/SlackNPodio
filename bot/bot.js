/* exported logic */

'use strict';

const yargs = require('yargs');
import fs from 'fs';
import path from 'path';

let parser = yargs
  .help('help')
  .alias('help', 'h')
  .describe('h', 'Shows this information.')
  .version()
  .alias('version', 'V')
  .describe('V', 'Shows Bot version.')
  .showHelpOnFail(false, 'Specify --help for available options.');

fs.readdirSync(path.resolve(__dirname, './integrations')).forEach((dir) => {
  parser.commandDir(path.resolve(__dirname, `./integrations/${dir}/commands`));
});

export {parser};

/**
 * Main logic for the bot.
 * It uses "handleInput" to get an object with the actions to take.
 * Next it if the right criteria is met, it calls "runAction"
 * to run the action requested and passes a message to the callback.
 * @param {String} input
 * @param {Function} cb
 * @return {String} cb(res)
 **/
exports.logic = (type, input, cb) => {
  exports.cb = cb;
  parser.parse(`${type} ${input}`, (err, argv, output) => {
    if (output) return cb(output);
    if (err) return cb(err);
  });
};

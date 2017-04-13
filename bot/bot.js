'use strict';

const podio = require('./podio');
const helper = require('./helper');
const yargs = require('yargs');
const app = {podio, helper};

const parser = exports.parser = yargs
  .usage(app.helper.showHelp())
  .help('help').alias('help', 'h').describe('h','Shows this information.')
  .version().alias('version', 'V').describe('V','Shows Bot version.')
  .showHelpOnFail(false, 'Specify --help for available options.')
  .options({
    item: {
      alias: 'i',
      description: 'Specifies the item name',
      requiresArg: true,
      required: false,
      type: 'string'
    },
    field: {
      alias: 'f',
      description: "Specifies the field name.",
      requiresArg: true,
      required: false,
      type: 'string'
    }
  })
  .commandDir('cmds')

/**
 * Main logic for the bot.
 * It uses "handleInput" to get an object with the actions to take.
 * Next it if the right criteria is met, it calls "runAction"
 * to run the action requested and passes a message to the callback.
 * @param {String} input
 * @param {Function} cb
 * @return {String} cb(res)
**/
const logic = exports.logic = (input, cb) => {
  exports.cb = cb;
  const req = app.helper.handleInput(input);
  if (app.podio.podioAuthenticated) {
    parser.parse(input, function(err, argv, output) {
      console.log(argv);
      if (output) cb(output);
    })
  }
  if (!app.podio.podioAuthenticated) {
    //cb('Podio API: Podio is not authenticated yet.');
  }
}

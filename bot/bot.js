'use strict';

const podio = require('./podio');
const helper = require('./helper');
const app = {podio, helper};

 /**
  * Runs the right command depending on the input provided.
  * @param {Object} req
  * @return {String} res
 **/
const runAction = exports.runAction = (req) => {
  switch (true) {
    case req.cmd === 'get':
      return app.podio.getValue(req.item, req.field).catch((err) => {
        console.log(err);
      }).then((msg) => msg);
    case req.cm === 'set':
      return app.podio.setValue(req.item, req.field, req.value).catch((err) => {
        console.log(err);
      }).then((msg) => msg);
    case req.cmd === 'url':
      return app.podio.getURL(req.item).catch((err) => {
        console.log(err);
      }).then((msg) => msg);
    case req.cmd === 'help':
      return new Promise((resolve) => {
        resolve(app.helper.showHelp());
      })
    default:
      return 'Sorry, wrong command, see help with "@podio help"';
  }
}
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
  const req = app.helper.handleInput(input);
  if (app.podio.podioAuthenticated && req.keyword === '@podio') {
    runAction(req).then((res) => cb(res))
  }
  if (!app.podio.podioAuthenticated) {
    console.log('Podio API: Podio is not authenticated yet.');
  }
}

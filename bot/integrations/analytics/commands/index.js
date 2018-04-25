exports.command = 'analytics <command>';
exports.desc = 'Adobe analytics reports commnds';
exports.builder = function(yargs) {
  return yargs.commandDir('cmds');
};
exports.handler = function(argv) {};

exports.command = 'podio <command>';
exports.desc = 'Podio commnds';
exports.builder = function(yargs) {
  return yargs.commandDir('cmds');
};
exports.handler = function(argv) {};

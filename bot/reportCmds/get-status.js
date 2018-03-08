let getReportStatus = require('../reportsApi/index').getReportStatus;
const bot = require('../bot');

exports.command = 'get-status [id]';
exports.aliases = ['gs'];
exports.builder = yargs => {
  yargs.demandOption('id');
};
exports.desc = 'Get Report Status';
exports.handler = async argv => {
  const reportID = argv.id;
  let res = await getReportStatus(reportID);
  bot.cb(`Your report result : \n \`\`\`${JSON.stringify(res, null, 2)}\`\`\``);
};

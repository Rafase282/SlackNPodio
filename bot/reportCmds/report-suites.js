let getReportSuites = require('../reportsApi/index').getReportSuites;
const bot = require('../bot');

exports.command = 'report-suites';
exports.aliases = ['rs'];
exports.desc = 'Get Report Suites';
exports.handler = async argv => {
  let res = await getReportSuites();
  bot.cb(`Report Suites : \n \`\`\`${JSON.stringify(res, null, 2)}\`\`\``);
};

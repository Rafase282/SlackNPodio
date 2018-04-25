let getReportSuites = require('../../api/index').getReportSuites;
const bot = require('../../../../bot');

exports.command = 'report-suites';
exports.aliases = ['rs'];
exports.desc = 'Get Report Suites';
exports.handler = async (argv) => {
  try {
    let res = await getReportSuites();
    bot.cb(`Report Suites : \n \`\`\`${JSON.stringify(res, null, 2)}\`\`\``);
  } catch (err) {
    bot.cb(`Something went wrong ${err.toString()}.`);
  }
};

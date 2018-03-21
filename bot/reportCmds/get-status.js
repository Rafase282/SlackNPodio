let getReportStatus = require('../reportsApi/index').getReportStatus;
const bot = require('../bot');

exports.command = 'get-status [id]';
exports.aliases = ['gs'];
exports.builder = (yargs) => {
  yargs.demandOption('id');
};
exports.desc = 'Get Report Status';
exports.handler = async (argv) => {
  try {
    const reportID = argv.id;
    if (reportID) {
      let res = await getReportStatus(reportID);
      bot.cb(
        `Your report result : \n \`\`\`${JSON.stringify(res, null, 2)}\`\`\``
      );
    } else {
      bot.cb(`Report ID required.`);
    }
  } catch (err) {
    bot.cb(`Something went wrong ${err.toString()}.`);
  }
};

let queueReport = require('../reportsApi/index').queueReport;
const bot = require('../bot');

exports.command = 'retrieve [id] [metric]';
exports.aliases = ['rt'];
exports.builder = (yargs) => {
  yargs.array('metric');
  yargs.demandOption('id');
  yargs.demandOption('metric');
};
exports.desc = 'Retrieve Report';
exports.handler = async (argv) => {
  const reportSuiteID = argv.id;
  const metrics = argv.metric.map((v, i) => ({id: v}));
  bot.cb(`We got your report generation request. We have queued your report.`);
  let res = await queueReport(reportSuiteID, metrics);
  bot.cb(
    `Your report ${
      res.reportID
    } will be generated soon.\n You can get your report status using \`get-status --id ${
      res.reportID
    }\``
  );
};

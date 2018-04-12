let api = require('./apiWrapper').api;
let { BASE_URL } = require('./config');

/**
 * Get List of Report Suites
 * @return {Object}
 **/
const getReportSuites = async () => {
  try {
    let url = BASE_URL + '?method=Company.GetReportSuites';
    let response = await api(url, 'POST', {
      search: '',
      types: ['standard']
    });
    return response;
  } catch (error) {
    throw new Error(error);
  }
};

/**
 * Get Report Data
 * @param {String} Report ID
 * @return {Object}
 **/
const getReport = async reportID => {
  try {
    let url = BASE_URL + '?method=Report.Get';
    let response = await api(url, 'POST', {
      reportID
    });
    return response;
  } catch (error) {
    throw new Error(error);
  }
};

/**
 * Put Report in Queue to generate
 * @param {String} Report Suite ID
 * @param {Array} metrics
 * @return {Object}
 **/
const queueReport = async (reportSuiteID, metrics) => {
  try {
    let url = BASE_URL + '?method=Report.Queue';
    let response = await api(url, 'POST', {
      reportDescription: {
        reportSuiteID: reportSuiteID,
        metrics: metrics
      }
    });
    return response;
  } catch (error) {
    throw new Error(error);
  }
};

/**
 * Get Status of Report
 * @param {String} Report ID
 * @return {Object}
 **/
const getReportStatus = async reportID => {
  try {
    let url = BASE_URL + '?method=Report.Get';
    let response = await api(url, 'POST', {
      reportID
    });
    return response;
  } catch (error) {
    throw new Error(error);
  }
};

export const parseReportSuitesCommand = async () => {
  try {
    const suites = await getReportSuites();
    return {
      response_type: 'in_channel',
      text: '```' + JSON.stringify(suites.report_suites, null, 2) + '```'
    };
  } catch (e) {
    throw e;
  }
};

export const parseGenerateReportCommand = async text => {
  try {
    const args = text.split(' ');
    if (!args[0]) {
      return {
        text: '',
        attachments: [
          {
            color: 'danger',
            text:
              'You need to pass report-suite-id and metrics to proceed further :slightly_frowning_face:'
          }
        ]
      };
    }
    if (args[0] && !args[1]) {
      return {
        text: '',
        attachments: [
          {
            color: 'danger',
            text:
              'You need to pass metrics to proceed further :slightly_frowning_face:'
          }
        ]
      };
    }
    if (args[0] && args[1]) {
      const suites = await getReportSuites();
      const reportSuiteId = args[0];
      const metrics = args[1].split(',').map((v, i) => ({ id: v }));
      const found = suites.report_suites.filter(
        suite => suite.rsid === reportSuiteId
      );
      if (!found || found.length <= 0) {
        return {
          text: '',
          attachments: [
            {
              color: 'danger',
              text:
                'We are enable to find given report-suite. Please select report suite id from below list.'
            },
            {
              color: 'good',
              text:
                '```' + JSON.stringify(suites.report_suites, null, 2) + '```'
            }
          ]
        };
      } else {
        let queueReportRes = await queueReport(reportSuiteId, metrics);
        const reportID = queueReportRes.reportID;
        return {
          response_type: 'in_channel',
          text: '',
          attachments: [
            {
              color: 'good',
              text: `Your report \`${reportID}\` will be generated soon. You can get your report status using \`/report-status ${reportID}\``
            }
          ]
        };
      }
    }
  } catch (e) {
    throw e;
  }
};

export const parseReportStatusCommand = async text => {
  try {
    const args = text.split(' ');
    if (!args[0]) {
      return {
        text: '',
        attachments: [
          {
            color: 'danger',
            text:
              'You need to pass report-id proceed further :slightly_frowning_face:'
          }
        ]
      };
    } else {
      let statusRes = await getReportStatus(args[0]);
      return {
        response_type: 'in_channel',
        text: '',
        attachments: [
          {
            color: 'good',
            text: '```' + JSON.stringify(statusRes, null, 2) + '```'
          }
        ]
      };
    }
  } catch (e) {
    throw e;
  }
};

let api = require('./apiWrapper').api;
let { BASE_URL } = require('./config');

/**
  * Get List of Report Suites
  * @return {Object}
**/
exports.getReportSuites = async () => {
  try {
    let url = BASE_URL + '?method=Company.GetReportSuites';
    let response = await api(url, 'POST', {
      search: '',
      types: ['standard']
    });
    return response;
  } catch (error) {
    console.log('error==', error);
  }
};

/**
  * Get Report Data
  * @param {String} Report ID
  * @return {Object}
**/
exports.getReport = async reportID => {
  try {
    let url = BASE_URL + '?method=Report.Get';
    let response = await api(url, 'POST', {
      reportID
    });
    return response;
  } catch (error) {
    console.log('error==', error);
  }
};

/**
  * Put Report in Queue to generate
  * @param {String} Report Suite ID
  * @param {Array} metrics
  * @return {Object}
**/
exports.queueReport = async (reportSuiteID, metrics) => {
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
    console.log('error==', error);
  }
};

/**
  * Get Status of Report
  * @param {String} Report ID
  * @return {Object}
**/
exports.getReportStatus = async reportID => {
  try {
    let url = BASE_URL + '?method=Report.Get';
    let response = await api(url, 'POST', {
      reportID
    });
    return response;
  } catch (error) {
    console.log('error==', error);
  }
};

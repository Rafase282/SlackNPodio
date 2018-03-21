let wsse = require('wsse');
let request = require('request-promise');

/**
  * Api wrapper
  * @param {String} url
  * @param {String} method
  * @param {Object} data
  * @return {Object}
**/
exports.api = async (url, method = 'GET', data) => {
  let token = wsse({
    username: process.env.ADOBE_USERNAME,
    password: process.env.ADOBE_SECRET
  });

  let options = {
    uri: url,
    method,
    body: method === 'GET' ? undefined : data,
    headers: {
      'X-WSSE': token.getWSSEHeader({ nonceBase64: true })
    },
    json: true
  };

  try {
    let response = await request(options);
    return response;
  } catch (error) {
    console.log('error==', error);
  }
};

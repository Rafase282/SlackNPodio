const fs = require('fs');
const path = require('path');

function get(authType, callback) {
  const fileName = path.join(__dirname, '../tmp/' + authType + '.json');
  const podioOAuth = fs.readFile(fileName, 'utf8', function(err, data) {

    // Throw error, unless it's file-not-found
    if (err && err.errno !== 2) {
        throw new Error('Reading from the sessionStore failed');
    } else if (data.length > 0) {
      return callback(JSON.parse(data));
    } else {
      return callback();
    }
  });
}

function set(podioOAuth, authType, callback) {
  const fileName = path.join(__dirname, '../tmp/' + authType + '.json');

  if (/server|client|password/.test(authType) === false) {
    throw new Error('Invalid authType');
  }

  fs.writeFile(fileName, JSON.stringify(podioOAuth), 'utf8', function(err) {
    if (err) {
      throw new Error('Writing in the sessionStore failed');
    }

    if (typeof callback === 'function') {
      return callback(null);
    }
  });
}

module.exports = {
  get: get,
  set: set
};
